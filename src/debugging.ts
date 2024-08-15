import { Mouse } from "./input";
import { objects } from "./object";
import { Renderer } from "./renderer";
import { Vec2 } from "./types";
import { line } from "./utils";

export const Debugging = {
    /**
     * Whether or not to enable the debug information
     */
    debugEnabled: false,

    /**
     * The debug information to display
     */
    debugInfo: [
        () => `Mouse: ${Mouse.pos.x}, ${Mouse.pos.y}`,
        () => `World: ${Mouse.worldPos.x.toFixed(2)}, ${Mouse.worldPos.y.toFixed(2)}`,
        () => `TPS: ${Renderer.TPS}`,
        () => `Objects: ${objects.length}`
    ],

    /**
     * Draws the debug information to the screen
     */
    drawDebug: () => {
        Renderer.ctx.fillStyle = "#000000";
        Renderer.ctx.fillRect(0, 0, 300, Debugging.debugInfo.length * 30 + 5);
        Renderer.ctx.fillStyle = "#ffffff";
        Renderer.ctx.strokeStyle = "#ffffff";
        Renderer.ctx.font = "20px monospace";
        for (let i = 0; i < Debugging.debugInfo.length; i++) {
            Renderer.ctx.fillText(Debugging.debugInfo[i](), 10, 10 + i * 30);
        }
    },


    /**
     * Whether or not to enable the profiler
     */
    profilerEnabled: false,

    /**
     * The profiler data
     * 
     * You can add your own data to this object by adding a key and an empty array BEFORE initCanvas is called
     * 
     * ```js
     * profilerData["my key"] = []; // must be before initCanvas
     * initCanvas({ ... });
     * 
     * ...
     * 
     * addProfilerData("my key", 10);
     * ```
     */
    profilerData: {
        "main thread": [],
        "tick": [],
        "draw": []
    } as Record<string, number[]>,

    /**
     * Adds a data point to the profiler
     * @param key The key to add the data to
     * @param num The number to add
     */
    addProfilerData: (key: string, num: number) => {
        Debugging.profilerData[key].push(num);
        if (Debugging.profilerData[key].length > 50) {
            Debugging.profilerData[key].shift();
        }
    },

    /**
     * Draws the profiler data to the screen
     */
    drawProfiler: () => {
        let i = 0;
        for (const [key, data] of Object.entries(Debugging.profilerData)) {
            const avg = data.reduce((a, b) => a + b, 0) / data.length;
            Renderer.ctx.fillStyle = "#000000";
            Renderer.ctx.fillRect(i * 500, Renderer.canvas.height - 150, 500, 150);
            Renderer.ctx.fillStyle = "#ffffff";
            Renderer.ctx.fillText(`${key}: ${avg.toFixed(2)}ms`, i * 500 + 5, Renderer.canvas.height - 145);

            for (let j = 1; j < data.length; j++) {
                Renderer.ctx.fillStyle = "#ff0000";
                line(
                    Vec2.from(
                        i * 500 + 500 / data.length * (j - 1), 
                        Renderer.canvas.height - data[j - 1]
                    ), 
                    Vec2.from(
                        i * 500 + 500 / data.length * j, 
                        Renderer.canvas.height - data[j]
                    )
                );
            }

            i++;
        }
    }
};