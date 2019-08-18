import { FlightState, SensorHandler } from "./sensors";
import { ICommandConnection } from "./ports";

const detectionInterval = 500
const timeoutDefault = 30000

export interface IMovementMonitor {
    (ms?: number, state?: FlightState): Promise<void>
}

export interface MovementMonitor {
    (sensorHandler: SensorHandler, drone?: ICommandConnection): IMovementMonitor
}

export const movementMonitor: MovementMonitor = (sensorHandler, conn?) => {
    let flightState = FlightState.landed

    // this sets up the flight state handler to track the current flight state
    if (conn) {
        conn.on("message", sensorHandler((state: FlightState) => flightState = state))
    }

    // send command and wait until flight state is reached or timeout occurs
    return (ms = timeoutDefault, state = FlightState.hovering): Promise<void> => {
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

export const timeMonitor = (ms = 1): Promise<void> => new Promise((res, rej) => setTimeout(res, ms))
