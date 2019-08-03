import { Socket, RemoteInfo } from "dgram";
import { AddressInfo } from "net";
import { Logger } from "./ports";

export const errorHandler = (log: Logger, drone: Socket) => (err: Error | null, bytes: number) => {
    if (err) log(`server error:\n${err.stack}`)
    drone.close()
}

const messageHandler = (log: Logger) => (msg: string, rinfo: RemoteInfo) => {
    log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`)
}

const listeningHandler = (log: Logger, port: number, address: string) => () => {
    log(`server listening ${address}:${port}`)
}

export const stateParser = (state: String) => {
    const splitKeyVal = (key: string) => key.split(":")
    const stateObj = (key: string) => ({ [splitKeyVal(key)[0]]: splitKeyVal(key)[1]})
    const isKey = (val: string) => val.length > 0
    const addKey = (acc: {}, key: string) => Object.assign(acc, stateObj(key))

    const parsedObj = state.split(";").filter(isKey).reduce(addKey, {})
    return parsedObj
}

export const connect = (logger: Logger, drone: Socket) => {
    const addr = drone.address() as AddressInfo

    drone.on('message', messageHandler(logger))
    drone.on('error', errorHandler(logger, drone))
    drone.on('listening', listeningHandler(logger, addr.port, addr.address))
}
