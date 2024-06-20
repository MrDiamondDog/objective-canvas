/**
 * A representation of a 2D point in space
 */
export class Vec2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Adds two vectors
     */
    static sum(a: Vec2, b: Vec2) {
        return new Vec2(a.x + b.x, a.y + b.y);
    }

    /**
     * Adds two vectors
     */
    sum(b: Vec2) {
        return Vec2.sum(this, b);
    }

    /**
     * Adds a scalar to a vector
     */
    static add(a: Vec2, b: number) {
        return new Vec2(a.x + b, a.y + b);
    }

    /**
     * Adds a scalar to this vector
     */
    add(b: number) {
        return Vec2.add(this, b);
    }

    /**
     * Subtracts two vectors/the difference between two vectors
     */
    static diff(a: Vec2, b: Vec2) {
        return new Vec2(a.x - b.x, a.y - b.y);
    }

    /**
     * Subtracts a vector from this vector/the difference between this vector and another vector
     */
    diff(b: Vec2) {
        return Vec2.diff(this, b);
    }

    /**
     * Subtracts a scalar from a vector
     */
    static sub(a: Vec2, b: number) {
        return new Vec2(a.x - b, a.y - b);
    }

    /**
     * Subtracts a vector from a scalar
     */
    sub(b: number) {
        return Vec2.sub(this, b);
    }

    /**
     * Multiplies two vectors
     */
    static mult(a: Vec2, b: Vec2) {
        return new Vec2(a.x * b.x, a.y * b.y);
    }

    /**
     * Multiplies this vector by another vector
     */
    mult(b: Vec2) {
        return Vec2.mult(this, b);
    }

    /**
     * Multiplies a vector by a scalar
     */
    static scale(a: Vec2, b: number) {
        return new Vec2(a.x * b, a.y * b);
    }

    /**
     * Multiplies this vector by a scalar
     */
    scale(b: number) {
        return Vec2.scale(this, b);
    }

    /**
     * Returns the division of two vectors
     */
    static div(a: Vec2, b: Vec2) {
        return new Vec2(a.x / b.x, a.y / b.y);
    }

    /**
     * Returns the division of this vector and another vector
     */
    div(b: Vec2) {
        return Vec2.div(this, b);
    }

    /**
     * Returns the division of a vector and a scalar
     */
    static divs(a: Vec2, b: number) {
        return new Vec2(a.x / b, a.y / b);
    }

    /**
     * Returns the division of this vector and a scalar
     */
    divs(b: number) {
        return Vec2.divs(this, b);
    }

    /**
     * Returns the dot product of two vectors
     */
    static dot(a: Vec2, b: Vec2) {
        return a.x * b.x + a.y * b.y;
    }

    /**
     * Returns the dot product of this vector and another vector
     */
    dot(b: Vec2) {
        return Vec2.dot(this, b);
    }

    /**
     * Returns the cross product of two vectors
     */
    static cross(a: Vec2, b: Vec2) {
        return a.x * b.y - a.y * b.x;
    }

    /**
     * Returns the cross product of this vector and another vector
     */
    cross(b: Vec2) {
        return Vec2.cross(this, b);
    }

    /**
     * Returns the magnitude of a vector
     */
    static mag(a: Vec2) {
        return Math.sqrt(a.x ** 2 + a.y ** 2);
    }

    /**
     * Returns the magnitude of this vector
     */
    mag() {
        return Vec2.mag(this);
    }

    /**
     * Returns a normalized vector
     */
    static norm(a: Vec2) {
        return Vec2.scale(a, 1 / Vec2.mag(a));
    }

    /**
     * Returns this vector normalized
     */
    norm() {
        return Vec2.norm(this);
    }

    /**
     * Returns the distance between two vectors
     */
    static dist(a: Vec2, b: Vec2) {
        return Vec2.mag(Vec2.diff(a, b));
    }

    /**
     * Returns the distance this vector is from another vector
     */
    dist(b: Vec2) {
        return Vec2.dist(this, b);
    }

    /**
     * Returns the negative of the vector
     */
    static neg(a: Vec2) {
        return Vec2.scale(a, -1);
    }

    /**
     * Returns the negative of the vector
     */
    neg() {
        return Vec2.neg(this);
    }

    /**
     * Returns a copy of the vector
     */
    copy() {
        return new Vec2(this.x, this.y);
    }

    /**
     * { 0, 0 }
     */
    static zero() {
        return new Vec2(0, 0);
    }

    /**
     * { 1, 1 }
     */
    static one() {
        return new Vec2(1, 1);
    }

    /**
     * Returns a vector from x and y, or x for both if y is not provided
     */
    static from(x: number, y?: number) {
        return new Vec2(x, y === undefined ? x : y);
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
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
}

export type Viewport = {
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
    scale: Vec2;
}

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
}
