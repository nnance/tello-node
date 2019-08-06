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

const timeoutDefault = 2000
const detectionInterval = 500

const movementMonitor = (send: ISendCmd, drone?: ICommandConnection) => {
    let flightState = FlightState.landed

    // this sets up the flight state handler to track the current flight state
    if (drone) {
        drone.on("message", eventProcessorFactory((state: FlightState) => flightState = state))
    }

    // send command and wait until flight state is reached or timeout occurs
    return (cmd: string, ms?: number, state = FlightState.hovering): Promise<void> => {
        send(cmd)
        return new Promise((res, rej) => {
            let timerId = setInterval(() => {
                if (flightState == state) {
                    clearInterval(timerId)
                    clearTimeout(timeoutId)
                    res()
                }
            }, detectionInterval)
            let timeoutId = setTimeout(() => {
                clearInterval(timerId)
                res()
            }, ms)
        })
    }
}

const timeMonitor = (send: ISendCmd) => (cmd: string, ms = 1): Promise<void> => {
    send(cmd)
    return new Promise((res, rej) => setTimeout(res, ms))
}

export const controller = (send: ISendCmd, drone?: ICommandConnection): IController => {

    const sendWait = timeMonitor(send)
    const sendUntil = movementMonitor(send, drone)
    
    return {
        takeOff: (ms = 6000) => sendUntil("takeoff", ms),
        land: (ms = 5000) => sendUntil("land", ms, FlightState.landed),
        emergency: (ms = timeoutDefault) => sendWait("emergency", ms),
        up: (cm: number, ms = timeoutDefault) => sendWait(`up ${cm}`, ms),
        down: (cm: number, ms = timeoutDefault) => sendWait(`down ${cm}`, ms),
        left: (cm: number, ms = timeoutDefault) => sendWait(`left ${cm}`, ms),
        right: (cm: number, ms = timeoutDefault) => sendWait(`right ${cm}`, ms),
        forward: (cm: number, ms = timeoutDefault) => sendUntil(`forward ${cm}`, ms),
        back: (cm: number, ms = timeoutDefault) => sendWait(`back ${cm}`, ms),
        rotateClockwise: (degrees: number, ms = timeoutDefault) => sendWait(`cw ${degrees}`, ms),
        rotateCounterClockwise: (degrees: number, ms = timeoutDefault) => sendWait(`ccw ${degrees}`, ms),
        flip: (direction: Direction, ms = timeoutDefault) => sendUntil(`flip ${direction}`, ms),
        stop: (ms = timeoutDefault) => sendWait("stop", ms),
        wait: (ms: number) => new Promise((res, rej) => setTimeout(res, ms)),
    }
}