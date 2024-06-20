import { MouseState, Vec2 } from "./types";

import { Camera } from "./camera";
import { Mouse } from "./input";
import { inside, randomStr } from "./utils";

/**
 * All of the objects currently on the canvas.
 * To add an object to the scene, call `CanvasObject.addToScene`
 */
export const objects: CanvasObject[] = [];

/**
 * A representation of an object on the canvas.
 * This class is meant to be extended.
 * The unmodified behavior is an invisible object that will draw it's children.
 */
export class CanvasObject {
    /**
     * The position of the object
     */
    pos: Vec2;
    /**
     * The bounds of the object. This is used for collision detection.
     */
    size: Vec2;
    /**
     * The unique identifier of the object. This should be used to compare two objects, rather than the object itself.
     */
    id: string;

    /**
     * The children of the object.
     * These are drawn and updated whenever super.draw() and super.tick() are called.
     */
    children: CanvasObject[] = [];

    /**
     * The state of the mouse in relation to the object.
     */
    state: MouseState = {
        hovering: false,
        dragging: false,
        draggable: true,
        dragOffset: Vec2.zero(),
        selected: false
    };

    constructor(pos: Vec2, size: Vec2 = new Vec2(50, 50)) {
        this.pos = pos;
        this.size = size;
        this.id = randomStr(8);
    }

    /**
     * Adds this to the `objects` array, thus adding it to the scene.
     */
    addToScene() {
        objects.push(this);
    }

    /**
     * Moves the object to a new position
     */
    moveTo(pos: Vec2) {
        this.pos = pos;
    }

    /**
     * Moves the object by a delta
     */
    move(delta: Vec2) {
        this.pos = this.pos.sum(delta);
    }

    /**
     * Called every frame, after tick
     * Used for rendering the object
     */
    draw() {
        for (const child of this.children) {
            child.draw();
        }

        // ctx.fillStyle = "red";
        // ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }

    /**
     * Called every frame, before draw
     * Used for updating object state.
     */
    tick() {
        for (const child of this.children) {
            child.tick();
        }

        if (this.state.draggable) {
            if (this.state.hovering && !this.state.dragging && !Mouse.dragging && Mouse.leftDown) {
                Camera.lock();
                Mouse.dragging = this;
                this.state.dragging = true;
                this.state.dragOffset = this.pos.diff(Mouse.worldPos);
            }

            if (this.state.dragging) {
                this.moveTo(Mouse.worldPos.sum(this.state.dragOffset));
            }

            if (this.state.dragging && !Mouse.leftDown) {
                Camera.unlock();
                Mouse.dragging = undefined;
                this.state.dragging = false;

                if (Mouse.selected && Mouse.selected.state.selected) {
                    Mouse.selected.state.selected = false;
                }
                Mouse.selected = this;
                this.state.selected = true;
                Mouse.events.emit("select");
            }
        }

        if ((!Mouse.hovering || Mouse.hovering === this) && inside(this.pos, this.size, Mouse.worldPos)) {
            Mouse.hovering = this;
            this.state.hovering = true;
        } else if (Mouse.hovering === this) {
            Mouse.hovering = undefined;
            this.state.hovering = false;
        }
    }
}
