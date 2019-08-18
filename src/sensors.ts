export enum FlightState {
    landed = 0,
    moving,
    hovering,
}

export interface FlightStateHandler {
    (state: FlightState): void
}

const queueDefault = 60

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

export const isMoving = (queue: string[]) => {
    const state = getMoveState(queue[0])
    return queue.filter((val) => val.indexOf(state) >= 0).length < queue.length
}

export const isHovering = (queue: string[]) => {
    return queue.filter((val) => val.indexOf(";h:0;") > 0).length < queue.length
}

export interface SensorHandler {
    (cb: FlightStateHandler): (msg: string) => string[]
}

export interface SensorFactory {
    (maxQueueDepth?: number, initialQueue?: string[]): SensorHandler
}

export const sensorFactory: SensorFactory = (maxQueueDepth = queueDefault, initialQueue = []) => (cb) => {
    let queue = initialQueue
    let trimmer = trimQueue(maxQueueDepth)

    return (msg: string) => {
        queue = trimmer(stateHandler(queue, msg))
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