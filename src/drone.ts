import { controller, Direction, IController } from "./controller"
import { connect as connectListener } from "./listener"
import { ILogger, ICommandConnectionFactory, ICommandConnection } from "./ports";
import { movementMonitor, IMovementMonitor } from "./monitors";
import { FlightState } from "./sensors";

export const takeOff = (ctrl: IController, monitor: IMovementMonitor) => (ms = 6000) => {
    ctrl.takeOff()
    return monitor(ms)
}

export const land = (ctrl: IController, monitor: IMovementMonitor) => (ms?: number) => {
    ctrl.land()
    return monitor(ms, FlightState.landed)
}

export const forward = (ctrl: IController, monitor: IMovementMonitor) => (cm: number, ms?: number) => {
    ctrl.forward(cm)
    return monitor(ms)
}

export const emergency = (ctrl: IController, monitor: IMovementMonitor) => (ms?: number) => {
    ctrl.emergency()
    return monitor(ms, FlightState.landed)
}

export const up = (ctrl: IController, monitor: IMovementMonitor) => (cm: number, ms?: number) => {
    ctrl.up(cm)
    return monitor(ms)
}

export const down = (ctrl: IController, monitor: IMovementMonitor) => (cm: number, ms?: number) => {
    ctrl.up(cm)
    return monitor(ms)
}

export const left = (ctrl: IController, monitor: IMovementMonitor) => (cm: number, ms?: number) => {
    ctrl.left(cm)
    return monitor(ms)
}
export const right = (ctrl: IController, monitor: IMovementMonitor) => (cm: number, ms?: number) => {
    ctrl.right(cm)
    return monitor(ms)
}

export const back = (ctrl: IController, monitor: IMovementMonitor) => (cm: number, ms?: number) => {
    ctrl.back(cm)
    return monitor(ms)
}

export const rotateClockwise = (ctrl: IController, monitor: IMovementMonitor) => (degrees: number, ms?: number) => {
    ctrl.rotateClockwise(degrees)
    return monitor(ms)
}

export const rotateCounterClockwise = (ctrl: IController, monitor: IMovementMonitor) => (degrees: number, ms?: number) => {
    ctrl.rotateCounterClockwise(degrees)
    return monitor(ms)
}

export const flip = (ctrl: IController, monitor: IMovementMonitor) => (direction: Direction, ms?: number) => {
    ctrl.flip(direction)
    return monitor(ms)
}

export const stop = (ctrl: IController, monitor: IMovementMonitor) => (ms?: number) => {
    ctrl.stop()
    return monitor(ms)
}

export const disconnect = (sendConnection: ICommandConnection, receiveConnection: ICommandConnection) => () => {
    receiveConnection.close()
    sendConnection.close()
}


interface ISender {
    sendConnection: ICommandConnection
    controller: IController
}

export const sender = (logger: ILogger, connectFactory: ICommandConnectionFactory, port = 8889, address = "0.0.0.0"): ISender => {
    const connection = connectFactory(logger, port, address)
    const ctrl = controller(connection.send)

    // enter SDK mode to send commands to the drone
    // NOTE: This must be done before setting up the listener
    connection.send("command")

    return { 
        sendConnection: connection,
        controller: ctrl,
    }
}

interface IReceiver {
    receiveConnection: ICommandConnection
    movementMonitor: IMovementMonitor
}

export const receiver = (logger: ILogger, connectFactory: ICommandConnectionFactory, port = 8890, address = "0.0.0.0"): IReceiver => {
    const connection = connectFactory(logger, port, address)
    connectListener(logger, connection)
    return {
        receiveConnection: connection,
        movementMonitor: movementMonitor(connection),
    }
}

export interface IDrone {
    address: string
    port: number
    sendConnection: ICommandConnection
    controller: IController
    receiveConnection: ICommandConnection
    movementMonitor: IMovementMonitor
}

export const droneFactory = (logger: ILogger, connectFactory: ICommandConnectionFactory, port = 8889, address = "0.0.0.0"): IDrone => {
    return Object.assign(
        { address, port }, 
        sender(logger, connectFactory, port, address),
        receiver(logger, connectFactory)
    )
}

export interface IDroneController {
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

export const droneControllerFactory = ({controller, movementMonitor, sendConnection, receiveConnection}: IDrone): IDroneController => {
    return {
        takeOff: takeOff(controller, movementMonitor),
        land: land(controller, movementMonitor),
        emergency: emergency(controller, movementMonitor),
        up: up(controller, movementMonitor),
        down: down(controller, movementMonitor),
        left: left(controller, movementMonitor),
        right: right(controller, movementMonitor),
        forward: forward(controller, movementMonitor),
        back: back(controller, movementMonitor),
        rotateClockwise: rotateClockwise(controller, movementMonitor),
        rotateCounterClockwise: rotateCounterClockwise(controller, movementMonitor),
        flip: flip(controller, movementMonitor),
        stop: stop(controller, movementMonitor),
        disconnect: disconnect(sendConnection, receiveConnection),    
    }
}
