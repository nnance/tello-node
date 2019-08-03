/**
 * listens for drone events and logs them
 */

import { Socket, RemoteInfo } from "dgram";
import { AddressInfo } from "net";
import { Logger } from "./ports";
import { throttle } from "lodash";

export const errorHandler = (log: Logger, drone: Socket) => (err: Error | null, bytes: number) => {
    if (err) log(`server error:\n${err.stack}`)
    drone.close()
}

const messageHandler = (log: Logger) => (msg: string, rinfo: RemoteInfo) => {
    log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`)
}

const listeningHandler = (log: Logger, drone: Socket) => () => {
    const addr = drone.address() as AddressInfo
    log(`server listening ${addr.address}:${addr.port}`)
}

export const stateParser = (state: String) => {
    const splitKeyVal = (key: string) => key.split(":")
    const stateObj = (key: string) => ({ [splitKeyVal(key)[0]]: splitKeyVal(key)[1]})
    const isKey = (val: string) => val.length > 0
    const addKey = (acc: {}, key: string) => Object.assign(acc, stateObj(key))

    const parsedObj = state.split(";").filter(isKey).reduce(addKey, {})
    return parsedObj
}

export const connect = (logger: Logger, drone: Socket, listener?: (state: {}) => void, ) => {
    // drone sends hundreds of messages per minute so this handler will throttle them to only send on defined interval
    const msgThrottler = throttle(messageHandler(logger), 2000)

    drone.on('message', msgThrottler)
    drone.on('error', errorHandler(logger, drone))
    drone.on('listening', listeningHandler(logger, drone))

    if (listener) drone.on('message', (msg: string) => listener(stateParser(msg)))
}
