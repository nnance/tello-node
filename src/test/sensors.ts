import * as assert from "assert"

import { describe } from "mocha"

import { eventProcessorFactory } from "../sensors"

describe("Movement Sensor", () => {
    describe("when receiving an event", () => {
        const initialQueue = [""]
        let queue: string[]
        before(() => {
            const handler = eventProcessorFactory(initialQueue)
            queue = handler("")
        })
        it("should return a new array", () => {
            assert.notEqual(queue.length, initialQueue.length)
        })
        it("should have two elements", () => {
            assert.equal(queue.length, 2)
        })
    })
})