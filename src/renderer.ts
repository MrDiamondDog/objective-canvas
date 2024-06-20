import { CanvasInitOptions, Vec2 } from "./types";

import { Camera } from "./camera";
import { Keyboard, Mouse } from "./input";
import { objects } from "./object";
import { line } from "./utils";

/**
 * The current canvas instance
 */
export let canvas: HTMLCanvasElement;
/**
 * The current canvas context
 */
export let ctx: CanvasRenderingContext2D;

/**
 * Set the canvas and context
 * This should not be called manually
 */
export function setCanvas(_canvas: HTMLCanvasElement) {
    canvas = _canvas;
    ctx = canvas.getContext("2d");
}

/**
 * Debug mode
 */
export let DEBUG = false;
/**
 * Profiler mode
 */
export let PROFILER = false;

const debugInfo: Array<() => string> = [
    () => `Mouse: ${Mouse.pos.x}, ${Mouse.pos.y}`,
    () => `World: ${Mouse.worldPos.x.toFixed(2)}, ${Mouse.worldPos.y.toFixed(2)}`,
    () => `TPS: ${tps}`,
    () => `Objects: ${objects.length}`
];

const profilerData: Record<string, number[]> = {
    "main thread": [],
    "tick": [],
    "draw": []
};

function addProfilerData(key: keyof typeof profilerData, num: number) {
    profilerData[key].push(num);
    if (profilerData[key].length > 50) {
        profilerData[key].shift();
    }
}

/**
 * Frames per second
 */
export const FPS = 60;
/**
 * The current options for this instance
 */
export let canvasOptions: CanvasInitOptions;

function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
}

let tpsStart = Date.now();
let ticks = 0;
/**
 * Ticks per second
 */
export let tps = 0;

function draw() {
    if (PROFILER) var mainThreadStart = performance.now();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Camera.begin();

    canvasOptions.drawBackground?.();

    const prevSelected = Mouse.selected?.id ?? undefined;

    if (PROFILER) var tickStart = performance.now();
    for (const object of objects) {
        object.tick();
    }

    if (Mouse.leftDown && Mouse.selected && prevSelected === Mouse.selected?.id) {
        Mouse.selected.state.selected = false;
        Mouse.selected = undefined;
        Mouse.events.emit("select");
    }
    if (PROFILER) addProfilerData("tick", performance.now() - tickStart);

    if (PROFILER) var drawStart = performance.now();
    for (const object of objects) {
        object.draw();
    }
    if (PROFILER) addProfilerData("draw", performance.now() - drawStart);

    Camera.end();

    if (DEBUG) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, 300, debugInfo.length * 30 + 5);
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#ffffff";
        ctx.font = "20px monospace";
        for (let i = 0; i < debugInfo.length; i++) {
            ctx.fillText(debugInfo[i](), 10, 10 + i * 30);
        }
    }

    if (PROFILER) {
        let i = 0;
        for (const [key, data] of Object.entries(profilerData)) {
            const avg = data.reduce((a, b) => a + b, 0) / data.length;
            ctx.fillStyle = "#000000";
            ctx.fillRect(i * 500, canvas.height - 150, 500, 150);
            ctx.fillStyle = "#ffffff";
            ctx.fillText(`${key}: ${avg.toFixed(2)}ms`, i * 500 + 5, canvas.height - 145);

            for (let j = 1; j < data.length; j++) {
                ctx.fillStyle = "#ff0000";
                line(Vec2.from(i * 500 + 500 / data.length * (j - 1), canvas.height - data[j - 1]), Vec2.from(i * 500 + 500 / data.length * j, canvas.height - data[j]));
            }

            i++;
        }
    }

    ticks++;

    // get tps
    const elapsed = Date.now() - tpsStart;
    if (elapsed >= 1000) {
        tps = ticks;
        ticks = 0;
        tpsStart = Date.now();
    }
    if (PROFILER) addProfilerData("main thread", performance.now() - mainThreadStart);

    // Using setTimeout allows you to unfocus this tab and still have it run
    // ...but setTimeout ends up being less accurate than requestAnimationFrame, meaning the TPS is all over the place
    requestAnimationFrame(draw);
}

/**
 * Initializes the canvas with the given options
 */
export function initCanvas(options: CanvasInitOptions) {
    canvasOptions = options;
    if (options.debug) DEBUG = true;
    if (options.profiler) {
        PROFILER = true;

        for (const key in profilerData) {
            for (let i = 0; i < 100; i++) {
                profilerData[key][i] = 0;
            }
        }
    }

    setCanvas(options.canvas);
    addListeners();

    Camera.update();
    draw();
}

// Input listeners
function addListeners() {
    resize();
    window.addEventListener("resize", resize);

    if (canvasOptions.cameraControls) {
        if (canvasOptions.cameraControls.panning ?? true)
            Mouse.events.on("move", () => {
                if (Camera.locked) return;
                if (canvasOptions.cameraControls.moveButton?.() ?? Mouse.leftDown) {
                    Camera.moveTo(Vec2.diff(Camera.lookAt, Mouse.delta));
                }
            });
        
        if (canvasOptions.cameraControls.zoom ?? true)
            Mouse.events.on("wheel", (event: WheelEvent) => {
                if (Camera.locked) return;
            
                Camera.zoomTo(Math.min(Math.max(Camera.distance + event.deltaY, 100), 10000));
            });
    }

    canvas.addEventListener("mousemove", (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();

        const oldPos = Mouse.pos.copy();

        Mouse.pos.x = event.clientX - rect.left;
        Mouse.pos.y = event.clientY - rect.top;

        Mouse.worldPos = Camera.screenToWorld(Mouse.pos);

        Mouse.delta.x = (Mouse.pos.x - oldPos.x) / Camera.viewport.scale.x;
        Mouse.delta.y = (Mouse.pos.y - oldPos.y) / Camera.viewport.scale.y;

        Mouse.events.emit("move", event);
    });

    canvas.addEventListener("mousedown", (event: MouseEvent) => {
        if (event.button === 0) {
            Mouse.leftDown = true;
        } else if (event.button === 2) {
            Mouse.rightDown = true;
        }

        Mouse.events.emit("down", event);
    });

    canvas.addEventListener("mouseup", (event: MouseEvent) => {
        if (event.button === 0) {
            Mouse.leftDown = false;
        } else if (event.button === 2) {
            Mouse.rightDown = false;
        }

        Mouse.events.emit("up", event);
    });

    canvas.addEventListener("click", (event: MouseEvent) => {
        Mouse.events.emit("click", event);
    });

    canvas.addEventListener("contextmenu", (event: MouseEvent) => {
        Mouse.events.emit("contextmenu", event);
    });

    canvas.addEventListener("wheel", (event: WheelEvent) => {
        Mouse.events.emit("wheel", event);
    });

    canvas.addEventListener("keydown", (event: KeyboardEvent) => {
        Keyboard.keys[event.key] = true;
        Keyboard.events.emit("down", event);
    });

    canvas.addEventListener("keyup", (event: KeyboardEvent) => {
        Keyboard.keys[event.key] = false;
        Keyboard.events.emit("up", event);
    });

    canvas.addEventListener("keypress", (event: KeyboardEvent) => {
        Keyboard.events.emit("press", event);
    });
}
