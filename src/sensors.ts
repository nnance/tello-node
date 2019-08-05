export enum FlightState {
    landed = 0,
    moving,
    hovering,
}

export interface FlightStateHandler {
    (state: FlightState): void
}

const stateHandler = (queue: string[], msg: string) => {
    return queue.concat(msg)
}

const trimQueue = (maxQueueDepth: number) => (queue: string[]) => {
    const start = queue.length - maxQueueDepth
    return ([] as string[]).concat(queue.slice(start))
}

const isMoving = (queue: string[]) => {
    return queue.filter((val) => val.indexOf(";vgx:0;vgy:0;vgz:0;") > 0).length < queue.length
}

const isHovering = (queue: string[]) => {
    return queue.filter((val) => val.indexOf(";h:0;") > 0).length < queue.length
}

export const eventProcessorFactory = (cb: FlightStateHandler, maxQueueDepth = 10, initialQueue = [] as string[]) => {
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