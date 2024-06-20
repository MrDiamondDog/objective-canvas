# Objective Canvas

An object-oriented NodeJS HTML5 canvas library.

- [x] Simple
- [x] Tiny (<100kb)
- [x] Built-in camera system
- [x] Typed
- [x] Extendable
- [x] Lightweight
- [x] No dependencies
- [x] Debug tools & profiler

This library allows you to use all the normal Canvas Context API methods, but inside of individual objects.

Included is a camera system that allows you to move the camera around the canvas.

## Getting Started

> [!IMPORTANT]
> Unfortunately, this library is not yet available for web as it uses ES modules. This will be fixed soon.

Install with any package manager:

```bash
npm i objective-canvas
pnpm i objective-canvas
yarn add objective-canvas
```

Set up like so:

```javascript
import { initCanvas } from "objective-canvas";

initCanvas({
    canvas: document.querySelector("canvas")
})
```

Or in react:

```jsx
export default function ObjectiveCanvas() {
    const canvasRef = useRef();

    useEffect(() => {
        if (!canvasRef.current) return;

        initCanvas({
            canvas: canvasRef.current
        });
    }, [canvasRef.current]);

    return <canvas ref={canvasRef} />;
}
```

## Using Objects

This entire library is based off of objects (if you couldn't tell yet), updated and drawn individually to the canvas.

The base `CanvasObject` class will not draw anything to the screen. If it has children, it will update and draw them.

Let's make a simple object that draws a rectangle.

```js
import { ctx, CanvasObject, Vec2 } from "objective-canvas";

export class Rectangle extends CanvasObject {
    constructor() {
        super(Vec2.zero(), new Vec2(100, 50));
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
```

```js
new Rectangle().addToScene();
```

That's all you need to make a simple rectangle!

The default behavior allows you to drag the rectangle around the screen, as well as moving the camera. This can be disabled by adding the following line in the constructor:

```js
this.state.draggable = false;
```

Now let's add some interactivity by making it blue when hovered over.

```js
import { ctx, CanvasObject, Vec2 } from "objective-canvas";

export class Rectangle extends CanvasObject {
    constructor() {
        super(Vec2.zero(), new Vec2(100, 50));
    }

    draw() {
        ctx.fillStyle = this.state.hovering ? "blue" : "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
```

The `state` property is automatically updated by the default behavior of `CanvasObject.tick`.

Now let's make it so the color changes when you click on the rectangle.

```js
import { ctx, CanvasObject, Mouse, Vec2 } from "objective-canvas";

export class Rectangle extends CanvasObject {
    isBlue = false;

    constructor() {
        super(Vec2.zero(), new Vec2(100, 50));

        Mouse.events.on("click", () => {
            if (this.state.hovering) {
                this.isBlue = !this.isBlue;
            }
        });
    }

    draw() {
        ctx.fillStyle = this.isBlue ? "blue" : "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
```

## Contributing

Please do! Any PRs and issues are welcome.

## Documentation

There will be better documentation soon, but for now this will be all of the functions available to you.

### Table of Contents
- [Camera](#camera)
- [Input](#input)
- [Objects](#objects)
- [Renderer](#renderer)
- [Types](#types)
- [Utils](#utils)

### Camera

[Back to top](#documentation)

```ts
/**
 * Represents the Camera in the scene
 */
export const Camera: {
    /**
     * Distance from the camera to the scene
     */
    distance: number;
    /**
     * Position of the camera
     */
    lookAt: Vec2;
    /**
     * Field of view
     */
    fov: number;
    /**
     * Size and position of viewport. Should not be modified directly.
     */
    viewport: Viewport;
    /**
     * Whether the camera is locked, preventing user input from moving it
     */
    locked: boolean;
    /**
     * Locks the camera, preventing user input from moving it
     */
    lock: () => void;
    /**
     * Unlocks the camera, allowing user input to move it
     */
    unlock: () => void;
    /**
     * Applies the camera transformation to the canvas context
     */
    apply: () => void;
    /**
     * Updates the viewport size and position based on the current camera settings
     */
    update: () => void;
    /**
     * Moves the camera to a position
     */
    moveTo: (pos: Vec2) => void;
    /**
     * Zooms the camera to a distance
     */
    zoomTo: (distance: number) => void;
    /**
     * Converts a screen position to a world position
     * @param pos Screen position
     * @returns World position
     */
    screenToWorld: (pos: Vec2) => Vec2;
    /**
     * Converts a world position to a screen position
     * @param pos World position
     * @returns Screen position
     */
    worldToScreen: (pos: Vec2) => Vec2;
    /**
     * Begins the camera transformation
     */
    begin: () => void;
    /**
     * Ends the camera transformation
     */
    end: () => void;
};
```

### Input

[Back to top](#documentation)

```ts
export const Mouse: {
    /**
     * The position of the mouse relative to the screen.
     */
    pos: Vec2;
    /**
     * The position of the mouse in the world.
     */
    worldPos: Vec2;
    /**
     * The movement of the mouse since last tick
     */
    delta: Vec2;
    /**
     * If the left mouse button is currently pressed.
     */
    leftDown: boolean;
    /**
     * If the right mouse button is currently pressed.
     */
    rightDown: boolean;
    /**
     * The EventEmitter that handles all mouse events on the canvas.
     */
    events: EventEmitter;
    /**
     * The current object the mouse is hovering
     */
    hovering: CanvasObject | undefined;
    /**
     * The current object the mouse is dragging
     */
    dragging: CanvasObject | undefined;
    /**
     * The current object the mouse is selecting
     */
    selected: CanvasObject | undefined;
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
```

### Objects

[Back to top](#documentation)

```ts
/**
 * All of the objects currently on the canvas.
 * To add an object to the scene, call `CanvasObject.addToScene`
 */
export const objects: CanvasObject[];
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
    children: CanvasObject[];
    /**
     * The state of the mouse in relation to the object.
     */
    state: MouseState;
    constructor(pos: Vec2, size?: Vec2);
    /**
     * Adds this to the `objects` array, thus adding it to the scene.
     */
    addToScene(): void;
    /**
     * Moves the object to a new position
     */
    moveTo(pos: Vec2): void;
    /**
     * Moves the object by a delta
     */
    move(delta: Vec2): void;
    /**
     * Called every frame, after tick
     * Used for rendering the object
     */
    draw(): void;
    /**
     * Called every frame, before draw
     * Used for updating object state.
     */
    tick(): void;
}
```

### Renderer

[Back to top](#documentation)

```ts
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
export function setCanvas(_canvas: HTMLCanvasElement): void;
/**
 * Debug mode
 */
export let DEBUG: boolean;
/**
 * Profiler mode
 */
export let PROFILER: boolean;
/**
 * Frames per second
 */
export const FPS = 60;
/**
 * The current options for this instance
 */
export let canvasOptions: CanvasInitOptions;
/**
 * Ticks per second
 */
export let tps: number;
/**
 * Initializes the canvas with the given options
 */
export function initCanvas(options: CanvasInitOptions): void;
```

### Types

[Back to top](#documentation)

```ts
/**
 * A representation of a 2D point in space
 */
export class Vec2 {
    x: number;
    y: number;

    constructor(x: number, y: number);
    /**
     * Adds two vectors
     */
    static sum(a: Vec2, b: Vec2): Vec2;
    /**
     * Adds two vectors
     */
    sum(b: Vec2): Vec2;
    /**
     * Adds a scalar to a vector
     */
    static add(a: Vec2, b: number): Vec2;
    /**
     * Adds a scalar to this vector
     */
    add(b: number): Vec2;
    /**
     * Subtracts two vectors/the difference between two vectors
     */
    static diff(a: Vec2, b: Vec2): Vec2;
    /**
     * Subtracts a vector from this vector/the difference between this vector and another vector
     */
    diff(b: Vec2): Vec2;
    /**
     * Subtracts a scalar from a vector
     */
    static sub(a: Vec2, b: number): Vec2;
    /**
     * Subtracts a vector from a scalar
     */
    sub(b: number): Vec2;
    /**
     * Multiplies two vectors
     */
    static mult(a: Vec2, b: Vec2): Vec2;
    /**
     * Multiplies this vector by another vector
     */
    mult(b: Vec2): Vec2;
    /**
     * Multiplies a vector by a scalar
     */
    static scale(a: Vec2, b: number): Vec2;
    /**
     * Multiplies this vector by a scalar
     */
    scale(b: number): Vec2;
    /**
     * Returns the division of two vectors
     */
    static div(a: Vec2, b: Vec2): Vec2;
    /**
     * Returns the division of this vector and another vector
     */
    div(b: Vec2): Vec2;
    /**
     * Returns the division of a vector and a scalar
     */
    static divs(a: Vec2, b: number): Vec2;
    /**
     * Returns the division of this vector and a scalar
     */
    divs(b: number): Vec2;
    /**
     * Returns the dot product of two vectors
     */
    static dot(a: Vec2, b: Vec2): number;
    /**
     * Returns the dot product of this vector and another vector
     */
    dot(b: Vec2): number;
    /**
     * Returns the cross product of two vectors
     */
    static cross(a: Vec2, b: Vec2): number;
    /**
     * Returns the cross product of this vector and another vector
     */
    cross(b: Vec2): number;
    /**
     * Returns the magnitude of a vector
     */
    static mag(a: Vec2): number;
    /**
     * Returns the magnitude of this vector
     */
    mag(): number;
    /**
     * Returns a normalized vector
     */
    static norm(a: Vec2): Vec2;
    /**
     * Returns this vector normalized
     */
    norm(): Vec2;
    /**
     * Returns the distance between two vectors
     */
    static dist(a: Vec2, b: Vec2): number;
    /**
     * Returns the distance this vector is from another vector
     */
    dist(b: Vec2): number;
    /**
     * Returns the negative of the vector
     */
    static neg(a: Vec2): Vec2;
    /**
     * Returns the negative of the vector
     */
    neg(): Vec2;
    /**
     * Returns a copy of the vector
     */
    copy(): Vec2;
    /**
     * { 0, 0 }
     */
    static zero(): Vec2;
    /**
     * { 1, 1 }
     */
    static one(): Vec2;
    /**
     * Returns a vector from x and y, or x for both if y is not provided
     */
    static from(x: number, y?: number): Vec2;
    toString(): string;
}

/**
 * An object's state with respect to the mouse
 */
export type MouseState = {
    selected: boolean;
    hovering: boolean;
    dragging: boolean;
    draggable: boolean;
    dragOffset: Vec2;
};

export type Viewport = {
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
    scale: Vec2;
};

export type CanvasInitOptions = {
    /**
     * The canvas element to use
     */
    canvas: HTMLCanvasElement;
    /**
     * A function to draw the background of the canvas. Called before any objects are updated or drawn.
     */
    drawBackground?: () => void;
    /**
     * Whether to enable debug mode, which will show extra information in the top-left corner
     */
    debug?: boolean;
    /**
     * Whether to enable the profiler, which will show the time taken for each tick and draw
     *
     * This can slow down the draw loop, so it is recommended to only enable this when needed.
     */
    profiler?: boolean;

    /**
     * Camera controls options
     * Leave undefined to disable camera controls
     */
    cameraControls?: {
        /**
         * A function that returns whether or not the camera panning key is being pressed
         * Default: left mouse button
         */
        moveButton?: () => boolean;
        /**
         * Allow zooming in and out with the mouse wheel
         * Default: true
         */
        zoom?: boolean;
        /**
         * Allow panning with the mouse
         * Default: true
         */
        panning?: boolean;
    };
};
```

### Utils

[Back to top](#documentation)

```ts
import { Vec2, Viewport } from "./types";
/**
 * Draw a circle
 * @param pos The position of the circle
 * @param radius The radius of the circle
 * @param fill Whether to fill the circle
 */
export function circle(pos: Vec2, radius: number, fill?: boolean): void;
/**
 * Measures the width and height of a text
 * @param text The text to measure
 * @returns The width and height of the text
 */
export function measureText(text: string): Vec2;
/**
 * If two rects are colliding
 * @param pos The position of the first rect
 * @param size The size of the first rect
 * @param pos2 The position of the second rect
 * @param size2 The size of the second rect
 */
export function colliding(pos: Vec2, size: Vec2, pos2: Vec2, size2: Vec2): boolean;
/**
 * If a point is inside a rect
 * @param pos The position of the rect
 * @param size The size of the rect
 * @param pos2 The position of the point
 */
export function inside(pos: Vec2, size: Vec2, pos2: Vec2): boolean;
/**
 * Draws a rectangle with rounded corners
 * @param pos The position of the rectangle
 * @param size The size of the rectangle
 * @param radius The radius of the rounded corners
 */
export function roundRect(pos: Vec2, size: Vec2, radius?: number): void;
/**
 * Draws a line between two points
 * @param from The starting point
 * @param to The ending point
 */
export function line(from: Vec2, to: Vec2): void;
/**
 * If a point is on a line
 * @param from The starting point of the line
 * @param to The ending point of the line
 * @param pos The point to check
 */
export function inLine(from: Vec2, to: Vec2, pos: Vec2): boolean;
/**
 * Draws a bezier curve between two points
 * @param start The starting point
 * @param end The ending point
 * @param control The control point
 */
export function bezier(start: Vec2, end: Vec2, control?: Vec2): void;
/**
 * Returns a random string of len
 */
export function randomStr(len: number): string;
/**
 * If an object is visible given the current viewport.
 */
export function isVisible(viewport: Viewport, pos: Vec2, size: Vec2): boolean;
```