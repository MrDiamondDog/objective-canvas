import { Vec2 } from "./types";
import EventEmitter from "./eventemitter";

import { CanvasObject } from "./object";

/**
 * A representation of the current state of the mouse
 */
export const Mouse = {
    /**
     * The position of the mouse relative to the screen.
     */
    pos: Vec2.zero(),
    /**
     * The position of the mouse in the world.
     */
    worldPos: Vec2.zero(),
    /**
     * The movement of the mouse since last tick
     */
    delta: Vec2.zero(),
    /**
     * If the left mouse button is currently pressed.
     */
    leftDown: false,
    /**
     * If the right mouse button is currently pressed.
     */
    rightDown: false,
    /**
     * The EventEmitter that handles all mouse events on the canvas.
     */
    events: new EventEmitter(),
    /**
     * The current object the mouse is hovering
     */
    hovering: undefined as CanvasObject | undefined,
    /**
     * The current object the mouse is dragging
     */
    dragging: undefined as CanvasObject | undefined,
    /**
     * The current object the mouse is selecting
     */
    selected: undefined as CanvasObject | undefined
};

/**
 * A representation of the current state of the keyboard
 */
export const Keyboard = {
    /**
     * The keys that are currently pressed
     */
    keys: {} as Record<string, boolean>,
    /**
     * The EventEmitter that handles all keyboard events on the canvas.
     */
    events: new EventEmitter()
};