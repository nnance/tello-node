import { createSocket, Socket } from "dgram"
import { IController, controller } from "./controller"
import { connect as connectListener } from "./listener"
import { AddressInfo } from "net";
import { Logger } from "./ports";

export interface IDrone {
    address: string,
    port: number,
    controller: IController,
}

const sender = (logger: Logger, cmd: string, socket: Socket) => {
    const addr = socket.address() as AddressInfo
    socket.send(cmd, addr.port, addr.address)
    logger(`command sent: ${cmd}`)
}

export const connect = (logger: Logger, port: number, address?: string) => {

    const socket = createSocket('udp4')
    socket.bind(port, address)
    const send = (cmd: string) => sender(logger, cmd, socket)

    const droneState = createSocket('udp4')
    droneState.bind(8890)
    connectListener(logger, droneState)

    // enter SDK mode to send commands to thendrone
    send("command");

    return {
        address,
        port,
        controller: controller(send)
    }
}
