/**
 * the drone flight controller that provides an api on top of the Tello sdk
 */

import { ISendCmd, ICommandConnection } from "./ports";

export enum Direction {
    left = "l",
    right = "r",
    forward = "f",
    back = "b",
}

export interface IController {
    takeOff: () => void,
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
    flip: (direction: Direction) => void,
    stop: () => void,
}

export const controller = (send: ISendCmd): IController => {

    return {
        takeOff: () => send("takeoff"),
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
        flip: (direction: Direction) => send(`flip ${direction}`),
        stop: () => send("stop"),
    }
}