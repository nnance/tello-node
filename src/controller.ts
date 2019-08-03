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
    land: () => void,
    emergency: () => void,
    up: (cm: number) => void,
    down: (cm: number) => void,
    left: (cm: number) => void,
    right: (cm: number) => void,
    forward: (cm: number) => void,
    back: (cm: number) => void,
    rotateClockwise: (degrees: number) => void,
    rotateCounterClockwise: (degrees: number) => void,
    flip: (direction: Direction) => Promise<void>,
    stop: () => void,
    wait: (ms: number) => Promise<void>,
}

const wait = (ms: number): Promise<void> => new Promise((res, rej) => {setTimeout(() => res(), ms)})

const sendWithWait = (send: ISendCmd) => (cmd: string, ms: number) => {
    send(cmd)
    return wait(ms)
}

export const controller = (send: ISendCmd): IController => {
    const waiter = sendWithWait(send)
    return {
        takeOff: () => waiter("takeoff", 6000),
        land: () => send("land"),
        emergency: () => send("emergency"),
        up: (cm: number) => send(`up ${cm}`),
        down: (cm: number) => send(`down ${cm}`),
        left: (cm: number) => send(`left ${cm}`),
        right: (cm: number) => send(`right ${cm}`),
        forward: (cm: number) => send(`forward ${cm}`),
        back: (cm: number) => send(`back ${cm}`),
        rotateClockwise: (degrees: number) => send(`cw ${degrees}`),
        rotateCounterClockwise: (degrees: number) => send(`ccw ${degrees}`),
        flip: (direction: Direction) => waiter(`flip ${direction}`, 4000),
        stop: () => send("stop"),
        wait,
    }
}