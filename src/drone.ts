import { controller, Direction } from "./controller"
import { connect as connectListener } from "./listener"
import { ILogger, ICommandConnectionFactory, ICommandConnection } from "./ports";
import { movementMonitor } from "./monitors";
import { FlightState } from "./sensors";

export interface IDrone {
    address: string,
    port: number,
    takeOff: (ms?: number) => void,
    land: (ms?: number) => void,
    emergency: (ms?: number) => void,
    up: (cm: number, ms?: number) => void,
    down: (cm: number, ms?: number) => void,
    left: (cm: number, ms?: number) => void,
    right: (cm: number, ms?: number) => void,
    forward: (cm: number, ms?: number) => void,
    back: (cm: number, ms?: number) => void,
    rotateClockwise: (degrees: number, ms?: number) => void,
    rotateCounterClockwise: (degrees: number, ms?: number) => void,
    flip: (direction: Direction, ms?: number) => void,
    stop: (ms?: number) => void,
    disconnect: () => void,
}

export const factory = (logger: ILogger, connectFactory: ICommandConnectionFactory, port = 8889, address = "0.0.0.0"): IDrone => {

    const drone = connectFactory(logger, port, address)

    // enter SDK mode to send commands to the drone
    // NOTE: This must be done before setting up the listener
    drone.send("command");
    const ctrl = controller(drone.send)

    const droneState = connectFactory(logger, 8890)
    connectListener(logger, droneState)

    const monitor = movementMonitor(droneState)

    return {
        address,
        port,
        takeOff: (ms = 6000) => {
            ctrl.takeOff()
            return monitor(ms)
        },
        land: (ms?: number) => {
            ctrl.land()
            return monitor(ms, FlightState.landed)
        },
        emergency: (ms?: number) => {
            ctrl.emergency()
            return monitor(ms, FlightState.landed)
        },
        up: (cm: number, ms?: number) => {
            ctrl.up(cm)
            return monitor(ms)
        },
        down: (cm: number, ms?: number) => {
            ctrl.up(cm)
            return monitor(ms)
        },
        left: (cm: number, ms?: number) => {
            ctrl.left(cm)
            return monitor(ms)
        },
        right: (cm: number, ms?: number) => {
            ctrl.right(cm)
            return monitor(ms)
        },
        forward: (cm: number, ms?: number) => {
            ctrl.forward(cm)
            return monitor(ms)
        },
        back: (cm: number, ms?: number) => {
            ctrl.back(cm)
            return monitor(ms)
        },
        rotateClockwise: (degrees: number, ms?: number) => {
            ctrl.rotateClockwise(degrees)
            return monitor(ms)
        },
        rotateCounterClockwise: (degrees: number, ms?: number) => {
            ctrl.rotateCounterClockwise(degrees)
            return monitor(ms)
        },
        flip: (direction: Direction, ms?: number) => {
            ctrl.flip(direction)
            return monitor(ms)
        },
        stop: (ms?: number) => {
            ctrl.stop()
            return monitor(ms)
        },
        disconnect: () => {
            droneState.close()
            drone.close()
        },
    }
}
