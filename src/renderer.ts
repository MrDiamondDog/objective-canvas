import { CanvasInitOptions, Vec2 } from "./types";

import { Camera } from "./camera";
import { Keyboard, Mouse } from "./input";
import { objects } from "./object";
import EventEmitter from "./eventemitter";
import { Debugging } from './debugging';

export const Renderer = {
    /**
     * The current canvas element
     */
    canvas: undefined as HTMLCanvasElement | undefined,
    /**
     * The current canvas context
     */
    ctx: undefined as CanvasRenderingContext2D | undefined,

    /**
     * Events in the renderer
     * 
     * Order of events:
     * - beforeBackground
     * - (background is drawn, camera transformations start)
     * - beforeTick
     * - (objects are ticked)
     * - beforeDraw
     * - (objects are drawn)
     * - afterDraw
     * - (camera transformations are applied)
     * - afterCamera (can be used to draw UI)
     */
    events: new EventEmitter(),

    /**
     * The current ticks per second
     */
    TPS: 0,

    /**
     * The current options for this instance
     */
    options: {} as CanvasInitOptions,

    init(options: CanvasInitOptions) {
        Renderer.options = options;
        if (options.debug) Debugging.debugEnabled = true;
        if (options.profiler) {
            Debugging.profilerEnabled = true;
    
            for (const key in Debugging.profilerData) {
                for (let i = 0; i < 100; i++) {
                    Debugging.profilerData[key][i] = 0;
                }
            }
        }
    
        Renderer.canvas = options.canvas;
        addListeners();
    
        Camera.update();
        draw();
    },

    resize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.ctx.textBaseline = "top";
        this.ctx.textAlign = "left";
    }
}

let tpsStart = Date.now();
let ticks = 0;


function draw() {
    if (Debugging.profilerEnabled) var mainThreadStart = performance.now();
    Renderer.ctx.clearRect(0, 0, Renderer.canvas.width, Renderer.canvas.height);

    Renderer.events.emit("beforeBackground");

    Camera.begin();
    Renderer.options.drawBackground?.();
    const prevSelected = Mouse.selected?.id ?? undefined;

    // Ticking
    if (Debugging.profilerEnabled) var tickStart = performance.now();

    Renderer.events.emit("beforeTick");

    for (const object of objects) {
        object.tick();
    }

    if (Mouse.leftDown && Mouse.selected && prevSelected === Mouse.selected?.id) {
        Mouse.selected.state.selected = false;
        Mouse.selected = undefined;
        Mouse.events.emit("select");
    }
    if (Debugging.profilerEnabled) Debugging.addProfilerData("tick", performance.now() - tickStart);


    if (Debugging.profilerEnabled) var drawStart = performance.now();

    Renderer.events.emit("beforeDraw");

    for (const object of objects) {
        object.draw();
    }

    Renderer.events.emit("afterDraw");
    
    if (Debugging.profilerEnabled) Debugging.addProfilerData("draw", performance.now() - drawStart);


    Camera.end();

    Renderer.events.emit("afterCamera");

    if (Debugging.debugEnabled) Debugging.drawDebug();
    if (Debugging.profilerEnabled) Debugging.drawProfiler();

    ticks++;

    // get tps
    const elapsed = Date.now() - tpsStart;
    if (elapsed >= 1000) {
        Renderer.TPS = ticks;
        ticks = 0;
        tpsStart = Date.now();
    }
    if (Debugging.profilerEnabled) Debugging.addProfilerData("main thread", performance.now() - mainThreadStart);

    // Using setTimeout allows you to unfocus this tab and still have it run
    // ...but setTimeout ends up being less accurate than requestAnimationFrame, meaning the TPS is all over the place
    requestAnimationFrame(draw);
}

// Input listeners
function addListeners() {
    Renderer.resize();
    window.addEventListener("resize", Renderer.resize);

    if (Renderer.options.cameraControls) {
        if (Renderer.options.cameraControls.panning ?? true)
            Mouse.events.on("move", () => {
                if (Camera.locked) return;
                if (Renderer.options.cameraControls.moveButton?.() ?? Mouse.leftDown) {
                    Camera.moveTo(Vec2.diff(Camera.lookAt, Mouse.delta));
                }
            });
        
        if (Renderer.options.cameraControls.zoom ?? true)
            Mouse.events.on("wheel", (event: WheelEvent) => {
                if (Camera.locked) return;
            
                Camera.zoomTo(Math.min(Math.max(Camera.distance + event.deltaY, 100), 10000));
            });
    }

    Renderer.canvas.addEventListener("mousemove", (event: MouseEvent) => {
        const rect = Renderer.canvas.getBoundingClientRect();

        const oldPos = Mouse.pos.copy();

        Mouse.pos.x = event.clientX - rect.left;
        Mouse.pos.y = event.clientY - rect.top;

        Mouse.worldPos = Camera.screenToWorld(Mouse.pos);

        Mouse.delta.x = (Mouse.pos.x - oldPos.x) / Camera.viewport.scale.x;
        Mouse.delta.y = (Mouse.pos.y - oldPos.y) / Camera.viewport.scale.y;

        Mouse.events.emit("move", event);
    });

    Renderer.canvas.addEventListener("mousedown", (event: MouseEvent) => {
        if (event.button === 0) {
            Mouse.leftDown = true;
        } else if (event.button === 2) {
            Mouse.rightDown = true;
        }

        Mouse.events.emit("down", event);
    });

    Renderer.canvas.addEventListener("mouseup", (event: MouseEvent) => {
        if (event.button === 0) {
            Mouse.leftDown = false;
        } else if (event.button === 2) {
            Mouse.rightDown = false;
        }

        Mouse.events.emit("up", event);
    });

    Renderer.canvas.addEventListener("click", (event: MouseEvent) => {
        Mouse.events.emit("click", event);
    });

    Renderer.canvas.addEventListener("contextmenu", (event: MouseEvent) => {
        Mouse.events.emit("contextmenu", event);
    });

    Renderer.canvas.addEventListener("wheel", (event: WheelEvent) => {
        Mouse.events.emit("wheel", event);
    });

    Renderer.canvas.addEventListener("keydown", (event: KeyboardEvent) => {
        Keyboard.keys[event.key] = true;
        Keyboard.events.emit("down", event);
    });

    Renderer.canvas.addEventListener("keyup", (event: KeyboardEvent) => {
        Keyboard.keys[event.key] = false;
        Keyboard.events.emit("up", event);
    });

    Renderer.canvas.addEventListener("keypress", (event: KeyboardEvent) => {
        Keyboard.events.emit("press", event);
    });
}
