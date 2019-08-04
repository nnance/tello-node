const stateHandler = (queue: string[], msg: string) => {
    return queue.concat(msg)
}

export const eventProcessorFactory = (initialQueue = [] as string[]) => {
    let queue = initialQueue
    return (msg: string) => queue = stateHandler(queue, msg)
}