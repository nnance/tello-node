import { createSocket, Socket } from "dgram"
import { IController, controller } from "./controller"
import { connect as connectListener } from "./listener"
import { AddressInfo } from "net";
import { Logger } from "./ports";
import { disconnect } from "cluster";

export interface IDrone {
    address: string,
    port: number,
    controller: IController,
}

const sender = (logger: Logger, cmd: string, socket: Socket, port: number, address?: string) => {
    // const addr = socket.address() as AddressInfo
    // socket.send(cmd, addr.port, addr.address)
    socket.send(cmd, port, address, (err) => {
        if (err) logger(`error: ${err}`)
    })
    logger(`command sent: ${cmd}`)
}

export const connect = (logger: Logger, port = 8889, address?: string) => {

    const socket = createSocket('udp4')
    socket.bind(port)
    const send = (cmd: string) => sender(logger, cmd, socket, port, address)

    // enter SDK mode to send commands to the drone
    // NOTE: This must be done before setting up the listener
    send("command");

    const droneState = createSocket('udp4')
    droneState.bind(8890)
    connectListener(logger, droneState)

    return {
        address,
        port,
        controller: controller(send),
        disconnect: () => {
            droneState.close()
            socket.close()
        },
    }
}
