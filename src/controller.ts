/**
 * the drone flight controller that provides an api on top of the Tello sdk
 */

import { ISendCmd } from "./ports";

export enum Direction {
    left = "l",
    right = "r",
    forward = "f",
    back = "b",
}

export interface IController {
    takeOff: (ms?: number) => Promise<void>,
    land: (ms?: number) => Promise<void>,
    emergency: (ms?: number) => Promise<void>,
    up: (cm: number, ms?: number) => Promise<void>,
    down: (cm: number, ms?: number) => Promise<void>,
    left: (cm: number, ms?: number) => Promise<void>,
    right: (cm: number, ms?: number) => Promise<void>,
    forward: (cm: number, ms?: number) => Promise<void>,
    back: (cm: number, ms?: number) => Promise<void>,
    rotateClockwise: (degrees: number, ms?: number) => Promise<void>,
    rotateCounterClockwise: (degrees: number, ms?: number) => Promise<void>,
    flip: (direction: Direction, ms?: number) => Promise<void>,
    stop: (ms?: number) => Promise<void>,
    wait: (ms: number) => Promise<void>,
}

const waiterDef = 2000

const wait = (ms: number): Promise<void> => new Promise((res, rej) => {setTimeout(() => res(), ms)})

const sendWithWait = (send: ISendCmd) => (cmd: string, ms = 1) => {
    send(cmd)
    return wait(ms)
}

export const controller = (send: ISendCmd): IController => {
    const waiter = sendWithWait(send)

    return {
        takeOff: (ms = 6000) => waiter("takeoff", ms),
        land: (ms = 5000) => waiter("land", ms),
        emergency: (ms = waiterDef) => waiter("emergency", ms),
        up: (cm: number, ms = waiterDef) => waiter(`up ${cm}`, ms),
        down: (cm: number, ms = waiterDef) => waiter(`down ${cm}`, ms),
        left: (cm: number, ms = waiterDef) => waiter(`left ${cm}`, ms),
        right: (cm: number, ms = waiterDef) => waiter(`right ${cm}`, ms),
        forward: (cm: number, ms = waiterDef) => waiter(`forward ${cm}`, ms),
        back: (cm: number, ms = waiterDef) => waiter(`back ${cm}`, ms),
        rotateClockwise: (degrees: number, ms = waiterDef) => waiter(`cw ${degrees}`, ms),
        rotateCounterClockwise: (degrees: number, ms = waiterDef) => waiter(`ccw ${degrees}`, ms),
        flip: (direction: Direction, ms = 4000) => waiter(`flip ${direction}`, ms),
        stop: (ms = waiterDef) => waiter("stop", ms),
        wait,
    }
}