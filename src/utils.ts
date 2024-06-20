import { Vec2, Viewport } from "./types";
import { ctx } from ".";

/**
 * Draw a circle
 * @param pos The position of the circle
 * @param radius The radius of the circle
 * @param fill Whether to fill the circle
 */
export function circle(pos: Vec2, radius: number, fill: boolean = true) {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
    if (fill) ctx.fill();
    else ctx.stroke();
}

/**
 * Measures the width and height of a text
 * @param text The text to measure
 * @returns The width and height of the text
 */
export function measureText(text: string): Vec2 {
    const measure = ctx.measureText(text);
    return new Vec2(
        measure.width,
        measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent
    );
}

/**
 * If two rects are colliding
 * @param pos The position of the first rect
 * @param size The size of the first rect
 * @param pos2 The position of the second rect
 * @param size2 The size of the second rect
 */
export function colliding(pos: Vec2, size: Vec2, pos2: Vec2, size2: Vec2) {
    return pos.x < pos2.x + size2.x && pos.x + size.x > pos2.x && pos.y < pos2.y + size2.y && pos.y + size.y > pos2.y;
}

/**
 * If a point is inside a rect
 * @param pos The position of the rect
 * @param size The size of the rect
 * @param pos2 The position of the point
 */
export function inside(pos: Vec2, size: Vec2, pos2: Vec2) {
    return pos.x < pos2.x && pos.x + size.x > pos2.x && pos.y < pos2.y && pos.y + size.y > pos2.y;
}

/**
 * Draws a rectangle with rounded corners
 * @param pos The position of the rectangle
 * @param size The size of the rectangle
 * @param radius The radius of the rounded corners
 */
export function roundRect(pos: Vec2, size: Vec2, radius: number = 8) {
    ctx.beginPath();
    ctx.moveTo(pos.x + radius, pos.y);
    ctx.arcTo(pos.x + size.x, pos.y, pos.x + size.x, pos.y + size.y, radius);
    ctx.arcTo(pos.x + size.x, pos.y + size.y, pos.x, pos.y + size.y, radius);
    ctx.arcTo(pos.x, pos.y + size.y, pos.x, pos.y, radius);
    ctx.arcTo(pos.x, pos.y, pos.x + size.x, pos.y, radius);
    ctx.fill();
}

/**
 * Draws a line between two points
 * @param from The starting point
 * @param to The ending point
 */
export function line(from: Vec2, to: Vec2) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
}

/**
 * If a point is on a line
 * @param from The starting point of the line
 * @param to The ending point of the line
 * @param pos The point to check
 */
export function inLine(from: Vec2, to: Vec2, pos: Vec2) {
    const slope = (to.y - from.y) / (to.x - from.x);
    const yIntercept = from.y - slope * from.x;
    const y = slope * pos.x + yIntercept;
    return Math.abs(y - pos.y) < 10 && pos.x > Math.min(from.x, to.x) && pos.x < Math.max(from.x, to.x);
}

/**
 * Draws a bezier curve between two points
 * @param start The starting point
 * @param end The ending point
 * @param control The control point
 */
export function bezier(start: Vec2, end: Vec2, control?: Vec2) {
    const controlPos = control || new Vec2(start.x + (end.x - start.x) / 2, start.y + (end.y - start.y) / 2);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.quadraticCurveTo(controlPos.x, controlPos.y, end.x, end.y);
    ctx.stroke();
}

/**
 * Returns a random string of len
 */
export function randomStr(len: number) {
    return [...Array(len)].map(() => Math.random().toString(36)[2]).join("");
}

/**
 * If an object is visible given the current viewport.
 */
export function isVisible(viewport: Viewport, pos: Vec2, size: Vec2) {
    return pos.x + size.x > viewport.left && pos.x < viewport.right && pos.y + size.y > viewport.top && pos.y < viewport.bottom;
}