import { ILogger, ICommandConnection } from "../ports";
import { createSocket, Socket } from "dgram";

const sender = (logger: ILogger, cmd: string, socket: Socket, port: number, address?: string) => {
    socket.send(cmd, port, address, (err) => {
        if (err) logger(`error: ${err}`)
    })
    logger(`command sent: ${cmd}`)
}

export const commandFactory = (logger: ILogger, port = 8889, address = "0.0.0.0"): ICommandConnection => {
    const socket = createSocket('udp4')
    socket.bind(port)
    return {
        port,
        address,
        send: (cmd: string) => sender(logger, cmd, socket, port, address),
        on: socket.on.bind(socket),
        close: () => socket.close(),
    }
}