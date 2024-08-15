import { Renderer } from "./renderer";
import { Vec2, Viewport } from "./types";

/**
 * Represents the Camera in the scene
 */
export const Camera = {
    /**
     * Distance from the camera to the scene
     */
    distance: 1000,
    /**
     * Position of the camera
     */
    lookAt: Vec2.zero(),
    /**
     * Field of view
     */
    fov: Math.PI / 4.0,
    /**
     * Size and position of viewport. Should not be modified directly.
     */
    viewport: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 0,
        height: 0,
        scale: Vec2.one()
    } as Viewport,
    /**
     * Whether the camera is locked, preventing user input from moving it
     */
    locked: false,
    /**
     * Locks the camera, preventing user input from moving it
     */
    lock: () => {
        Camera.locked = true;
    },
    /**
     * Unlocks the camera, allowing user input to move it
     */
    unlock: () => {
        Camera.locked = false;
    },
    /**
     * Applies the camera transformation to the canvas context
     */
    apply: () => {
        Renderer.ctx.scale(Camera.viewport.scale.x, Camera.viewport.scale.y);
        Renderer.ctx.translate(-Camera.viewport.left, -Camera.viewport.top);
    },
    /**
     * Updates the viewport size and position based on the current camera settings
     */
    update: () => {
        const aspectRatio = Renderer.ctx.canvas.width / Renderer.ctx.canvas.height;
        Camera.viewport.width = Camera.distance * Math.tan(Camera.fov);
        Camera.viewport.height = Camera.viewport.width / aspectRatio;
        Camera.viewport.left = Camera.lookAt.x - (Camera.viewport.width / 2.0);
        Camera.viewport.top = Camera.lookAt.y - (Camera.viewport.height / 2.0);
        Camera.viewport.right = Camera.viewport.left + Camera.viewport.width;
        Camera.viewport.bottom = Camera.viewport.top + Camera.viewport.height;
        Camera.viewport.scale.x = Renderer.ctx.canvas.width / Camera.viewport.width;
        Camera.viewport.scale.y = Renderer.ctx.canvas.height / Camera.viewport.height;
    },
    /**
     * Moves the camera to a position
     */
    moveTo: (pos: Vec2) => {
        Camera.lookAt = pos;
        Camera.update();
    },
    /**
     * Zooms the camera to a distance
     */
    zoomTo: (distance: number) => {
        Camera.distance = distance;
        Camera.update();
    },
    /**
     * Converts a screen position to a world position
     * @param pos Screen position
     * @returns World position
     */
    screenToWorld: (pos: Vec2): Vec2 => {
        return new Vec2(
            (pos.x / Camera.viewport.scale.x) + Camera.viewport.left,
            (pos.y / Camera.viewport.scale.y) + Camera.viewport.top
        );
    },
    /**
     * Converts a world position to a screen position
     * @param pos World position
     * @returns Screen position
     */
    worldToScreen: (pos: Vec2): Vec2 => {
        return new Vec2(
            (pos.x - Camera.viewport.left) * Camera.viewport.scale.x,
            (pos.y - Camera.viewport.top) * Camera.viewport.scale.y
        );
    },
    /**
     * Begins the camera transformation
     */
    begin: () => {
        Renderer.ctx.save();
        Camera.apply();
    },
    /**
     * Ends the camera transformation
     */
    end: () => {
        Renderer.ctx.restore();
    }
};