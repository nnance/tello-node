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
    takeOff: () => Promise<void>,
    land: () => Promise<void>,
    emergency: () => Promise<void>,
    up: (cm: number) => Promise<void>,
    down: (cm: number) => Promise<void>,
    left: (cm: number) => Promise<void>,
    right: (cm: number) => Promise<void>,
    forward: (cm: number) => Promise<void>,
    back: (cm: number) => Promise<void>,
    rotateClockwise: (degrees: number) => Promise<void>,
    rotateCounterClockwise: (degrees: number) => Promise<void>,
    flip: (direction: Direction) => Promise<void>,
    stop: () => Promise<void>,
    wait: (ms: number) => Promise<void>,
}

const waiterDef = 2000

const wait = (ms: number): Promise<void> => new Promise((res, rej) => {setTimeout(() => res(), ms)})

const sendWithWait = (send: ISendCmd) => (cmd: string, ms = waiterDef) => {
    send(cmd)
    return wait(ms)
}

export const controller = (send: ISendCmd): IController => {
    const waiter = sendWithWait(send)

    return {
        takeOff: () => waiter("takeoff", 6000),
        land: () => waiter("land", 5000),
        emergency: () => waiter("emergency"),
        up: (cm: number) => waiter(`up ${cm}`),
        down: (cm: number) => waiter(`down ${cm}`),
        left: (cm: number) => waiter(`left ${cm}`),
        right: (cm: number) => waiter(`right ${cm}`),
        forward: (cm: number) => waiter(`forward ${cm}`),
        back: (cm: number) => waiter(`back ${cm}`),
        rotateClockwise: (degrees: number) => waiter(`cw ${degrees}`),
        rotateCounterClockwise: (degrees: number) => waiter(`ccw ${degrees}`),
        flip: (direction: Direction) => waiter(`flip ${direction}`, 4000),
        stop: () => waiter("stop"),
        wait,
    }
}