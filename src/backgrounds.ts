import { Vec2 } from "./types";
import { ctx } from ".";
import { Camera } from "./camera";
import { line } from "./utils";

/**
 * Styles for the background of the canvas
 */
export const BackgroundStyles = {
    /**
     * A blank slate with a specified background color
     */
    empty: (backgroundColor = "#000000") => {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(Camera.viewport.left, Camera.viewport.top, Camera.viewport.width, Camera.viewport.height);
    },

    /**
     * A grid with a specified background color and line color
     */
    grid: (gridSize = 100, backgroundColor = "#000000", lineColor = "#1d1d1d") => {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(Camera.viewport.left, Camera.viewport.top, Camera.viewport.width, Camera.viewport.height);

        ctx.fillStyle = lineColor;
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 0.5;

        // grid
        const gridOffset = {
            x: Camera.viewport.left % gridSize,
            y: Camera.viewport.top % gridSize
        };

        if (Camera.viewport.scale.x > 0.15) {
            for (let x = Camera.viewport.left - gridOffset.x; x < Camera.viewport.right; x += gridSize) {
                line(new Vec2(x, Camera.viewport.top), new Vec2(x, Camera.viewport.bottom));
            }
            for (let y = Camera.viewport.top - gridOffset.y; y < Camera.viewport.bottom; y += gridSize) {
                line(new Vec2(Camera.viewport.left, y), new Vec2(Camera.viewport.right, y));
            }
        } else {
            ctx.lineWidth = 5;
        }
    }
}