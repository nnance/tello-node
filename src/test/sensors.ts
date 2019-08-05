import * as assert from "assert"

import { describe } from "mocha"

import { eventProcessorFactory, FlightState } from "../sensors"

const hoverQueue = [
    "pitch:0;roll:0;yaw:0;vgx:0;vgy:0;vgz:0;templ:91;temph:94;tof:10;h:0;bat:89;baro:-26.40;time:17;agx:2.00;agy:-7.00;agz:-999.00;",
    "pitch:0;roll:0;yaw:0;vgx:0;vgy:0;vgz:0;templ:91;temph:94;tof:10;h:0;bat:89;baro:-26.40;time:17;agx:2.00;agy:-7.00;agz:-999.00;",
    "pitch:0;roll:0;yaw:0;vgx:0;vgy:0;vgz:0;templ:91;temph:94;tof:10;h:0;bat:89;baro:-26.40;time:17;agx:2.00;agy:-7.00;agz:-999.00;",
    "pitch:0;roll:0;yaw:0;vgx:0;vgy:0;vgz:0;templ:91;temph:94;tof:10;h:0;bat:89;baro:-26.40;time:17;agx:2.00;agy:-7.00;agz:-999.00;",
    "pitch:0;roll:0;yaw:0;vgx:0;vgy:0;vgz:0;templ:91;temph:94;tof:10;h:0;bat:89;baro:-26.40;time:17;agx:2.00;agy:-7.00;agz:-999.00;",
    "pitch:0;roll:0;yaw:0;vgx:0;vgy:0;vgz:0;templ:91;temph:94;tof:10;h:0;bat:89;baro:-26.40;time:17;agx:2.00;agy:-7.00;agz:-999.00;",
    "pitch:0;roll:0;yaw:0;vgx:0;vgy:0;vgz:0;templ:91;temph:94;tof:10;h:0;bat:89;baro:-26.40;time:17;agx:2.00;agy:-7.00;agz:-999.00;",
    "pitch:0;roll:0;yaw:0;vgx:0;vgy:0;vgz:0;templ:91;temph:94;tof:10;h:0;bat:89;baro:-26.40;time:17;agx:2.00;agy:-7.00;agz:-999.00;",
    "pitch:0;roll:0;yaw:0;vgx:0;vgy:0;vgz:0;templ:91;temph:94;tof:10;h:0;bat:89;baro:-26.40;time:17;agx:2.00;agy:-7.00;agz:-999.00;",
    "pitch:0;roll:0;yaw:0;vgx:0;vgy:0;vgz:0;templ:91;temph:94;tof:10;h:0;bat:89;baro:-26.40;time:17;agx:2.00;agy:-7.00;agz:-999.00;",
]

const voidHandler = (state: FlightState) => undefined

describe("Movement Sensor", () => {
    describe("when receiving an event", () => {
        const initialQueue = [""]
        let queue: string[]
        before(() => {
            const handler = eventProcessorFactory(voidHandler, 10, initialQueue)
            queue = handler("")
        })
        it("should return a new array", () => {
            assert.notEqual(queue.length, initialQueue.length)
        })
        it("should have two elements", () => {
            assert.equal(queue.length, 2)
        })
    })

    describe("when receiving more events than the queue depth", () => {
        let queue: string[]
        before(() => {
            const handler = eventProcessorFactory(voidHandler, 10, hoverQueue)
            queue = handler("")
        })
        it("should return an array with max queue depth size", () => {
            assert.equal(queue.length, 10)
        })
    })

    describe("when receiving events with zero height", () => {
        let state: FlightState
        const stateHandler = (val: FlightState) => state = val
        const handler = eventProcessorFactory(stateHandler, 10, hoverQueue)

        it("should return landed state", () => {
            handler("pitch:0;roll:0;yaw:0;vgx:0;vgy:0;vgz:0;templ:91;temph:94;tof:10;h:0;bat:89;baro:-26.51;time:18;agx:-12.00;agy:-4.00;agz:-1245.00;")
            assert.equal(state, FlightState.landed)
        })
    })

    describe("when receiving events with movement", () => {
        let state: FlightState
        const stateHandler = (val: FlightState) => state = val
        const handler = eventProcessorFactory(stateHandler, 10)

        it("should return moving state", () => {
            handler("pitch:0;roll:0;yaw:0;vgx:0;vgy:0;vgz:-7;templ:91;temph:94;tof:31;h:10;bat:89;baro:-26.14;time:18;agx:4.00;agy:9.00;agz:-1006.00;")
            assert.equal(state, FlightState.moving)
        })

        it("should return hovering state", () => {
            hoverQueue.forEach(() => handler("pitch:0;roll:0;yaw:0;vgx:0;vgy:0;vgz:0;templ:91;temph:94;tof:31;h:10;bat:89;baro:-26.14;time:18;agx:4.00;agy:9.00;agz:-1006.00;"))
            assert.equal(state, FlightState.hovering)
        })
    })
})