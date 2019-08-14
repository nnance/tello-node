/**
 * listens for drone events and logs them
 */
import { ILogger, ICommandConnection } from "./ports";
import { throttle } from "lodash";

export const errorHandler = (log: ILogger, drone: ICommandConnection) => (err: Error | null, bytes: number) => {
    if (err) log(`server error:\n${err.stack}`)
    drone.close()
}

const messageHandler = (log: ILogger, drone: ICommandConnection) => (msg: string) => {
    log(`server got: ${msg} from ${drone.address}:${drone.port}`)
}

const listeningHandler = (log: ILogger, drone: ICommandConnection) => () => {
    log(`server listening ${drone.address}:${drone.port}`)
}

export const stateParser = (state: String) => {
    const splitKeyVal = (key: string) => key.split(":")
    const stateObj = (key: string) => ({ [splitKeyVal(key)[0]]: splitKeyVal(key)[1]})
    const isKey = (val: string) => val.length > 0
    const addKey = (acc: {}, key: string) => Object.assign(acc, stateObj(key))

    const parsedObj = state.split(";").filter(isKey).reduce(addKey, {})
    return parsedObj
}

export const connect = (logger: ILogger, drone: ICommandConnection, listener?: (state: {}) => void) => {
    // drone sends hundreds of messages per minute so this handler will throttle them to only send on defined interval
    const msgThrottler = throttle(messageHandler(logger, drone), 2000)

    drone.on('message', msgThrottler)
    drone.on('error', errorHandler(logger, drone))
    drone.on('listening', listeningHandler(logger, drone))

    if (listener) drone.on('message', (msg: string) => listener(stateParser(msg)))
}
