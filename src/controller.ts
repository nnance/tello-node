/**
 * the drone flight controller that provides an api on top of the Tello sdk
 */

import { ISendCmd, ICommandConnection } from "./ports";
import { FlightState, eventProcessorFactory } from "./sensors";

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

export const controller = (send: ISendCmd, drone?: ICommandConnection): IController => {
    let flightState = FlightState.landed

    const sendWait = (cmd: string, ms = 1): Promise<void> => {
        send(cmd)
        return new Promise((res, rej) => setTimeout(res, ms))
    }
    
    // this sets up the flight state handler to track the current flight state
    if (drone) {
        drone.on("message", eventProcessorFactory((state: FlightState) => flightState = state))
    }

    // send command and wait until flight state is reached or timeout occurs
    const sendUntil = (cmd: string, ms?: number, state = FlightState.hovering): Promise<void> => {
        send(cmd)
        return new Promise((res, rej) => {
            let timerId = setInterval(() => {
                if (flightState == state) {
                    console.log("isHovering")
                    clearInterval(timerId)
                    clearTimeout(timeoutId)
                    res()
                }
            }, 500)
            let timeoutId = setTimeout(() => {
                clearInterval(timerId)
                console.error("timed out")
                res()
            }, ms)
        })
    }
    
    return {
        takeOff: (ms = 6000) => sendUntil("takeoff", ms),
        land: (ms = 5000) => sendWait("land", ms),
        emergency: (ms = waiterDef) => sendWait("emergency", ms),
        up: (cm: number, ms = waiterDef) => sendWait(`up ${cm}`, ms),
        down: (cm: number, ms = waiterDef) => sendWait(`down ${cm}`, ms),
        left: (cm: number, ms = waiterDef) => sendWait(`left ${cm}`, ms),
        right: (cm: number, ms = waiterDef) => sendWait(`right ${cm}`, ms),
        forward: (cm: number, ms = waiterDef) => sendWait(`forward ${cm}`, ms),
        back: (cm: number, ms = waiterDef) => sendWait(`back ${cm}`, ms),
        rotateClockwise: (degrees: number, ms = waiterDef) => sendWait(`cw ${degrees}`, ms),
        rotateCounterClockwise: (degrees: number, ms = waiterDef) => sendWait(`ccw ${degrees}`, ms),
        flip: (direction: Direction, ms = 4000) => sendUntil(`flip ${direction}`, ms),
        stop: (ms = waiterDef) => sendWait("stop", ms),
        wait: (ms: number) => new Promise((res, rej) => setTimeout(res, ms)),
    }
}