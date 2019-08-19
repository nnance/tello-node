import { flow } from "lodash/fp";
import { isArray } from "util";

export enum FlightState {
    landed = 0,
    moving,
    hovering,
}

export interface FlightStateHandler {
    (state: FlightState): void
}

const queueDepthDefault = 60

const stateHandler = (queue: string[], msg: string) => {
    return queue.concat(msg)
}

const trimQueue = (maxQueueDepth: number) => (queue: string[]) => {
    const start = queue.length - maxQueueDepth
    return ([] as string[]).concat(queue.slice(start))
}

const getMoveState = (event: string) => {
    const filterLeft = (count: number) => (val: string, idx: number) => idx <= count - 1
    const concatArray = (prev: string[], cur: string) => prev.concat([cur])
    const concatString = (prev: string, cur: string) => prev.concat(cur,";")
    return event.split(";").filter(filterLeft(6)).reduce(concatArray, []).reduce(concatString, "")
}

const isMoving = (queue: string[]) => {
    const state = getMoveState(queue[0])
    return queue.filter((val) => val.indexOf(state) >= 0).length < queue.length
}

const isHovering = (queue: string[]) => {
    return queue.filter((val) => val.indexOf(";h:0;") > 0).length < queue.length
}

export const sensorFactory = (cb: FlightStateHandler, maxQueueDepth = queueDepthDefault, initialQueue: string[] = []) => {
    let queue: string[] = initialQueue
    let trimmer = flow(stateHandler, trimQueue(maxQueueDepth))
    
    return (msg: string | Uint16Array) => {
        queue = trimmer(queue, msg + "")
        if (isMoving(queue)) {
            cb(FlightState.moving)
        } else if (isHovering(queue)) {
            cb(FlightState.hovering)
        } else {
            cb(FlightState.landed)
        }
        return queue
    }
}