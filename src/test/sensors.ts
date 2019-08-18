import * as assert from "assert"

import { describe } from "mocha"

import { sensorFactory, FlightState } from "../sensors"

const queueDepth = 10
const hoverQueue = new Array(queueDepth).fill("pitch:0;roll:0;yaw:0;vgx:0;vgy:0;vgz:0;templ:91;temph:94;tof:10;h:0;bat:89;baro:-26.40;time:17;agx:2.00;agy:-7.00;agz:-999.00;")


describe("Movement Sensor", () => {
    describe("queue", () => {
        const voidHandler = (state: FlightState) => undefined

        describe("when receiving an event", () => {
            const initialQueue = [""]
            let queue: string[]
            before(() => {
                const handler = sensorFactory(queueDepth, initialQueue)(voidHandler)
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
                const handler = sensorFactory(queueDepth, hoverQueue)(voidHandler)
                queue = handler("")
            })
            it("should return an array with max queue depth size", () => {
                assert.equal(queue.length, 10)
            })
        })    
    })

    describe("movement detection", () => {
        let state: FlightState
        const stateHandler = (val: FlightState) => state = val

        beforeEach("reset state", () => state = FlightState.landed)

        describe("when receiving events with zero height", () => {
            const handler = sensorFactory(queueDepth, hoverQueue)(stateHandler)
    
            it("should return landed state", () => {
                handler("pitch:0;roll:0;yaw:0;vgx:0;vgy:0;vgz:0;templ:91;temph:94;tof:10;h:0;bat:89;baro:-26.51;time:18;agx:-12.00;agy:-4.00;agz:-1245.00;")
                assert.equal(state, FlightState.landed)
            })
        })
    
        describe("when receiving events with ascending movement", () => {
            const handler = sensorFactory(queueDepth, hoverQueue)(stateHandler)
    
            it("should return moving state", () => {
                handler("pitch:0;roll:0;yaw:0;vgx:0;vgy:0;vgz:-7;templ:91;temph:94;tof:31;h:10;bat:89;baro:-26.14;time:18;agx:4.00;agy:9.00;agz:-1006.00;")
                assert.equal(state, FlightState.moving)
            })
    
            it("should return hovering state", () => {
                hoverQueue.forEach(() => handler("pitch:0;roll:0;yaw:0;vgx:0;vgy:0;vgz:0;templ:91;temph:94;tof:31;h:10;bat:89;baro:-26.14;time:18;agx:4.00;agy:9.00;agz:-1006.00;"))
                assert.equal(state, FlightState.hovering)
            })
        })

        describe("when receiving events with rotating movement", () => {
            const handler = sensorFactory(queueDepth, hoverQueue)(stateHandler)
    
            it("should return moving state", () => {
                handler("pitch:0;roll:0;yaw:-8;vgx:0;vgy:0;vgz:0;templ:91;temph:94;tof:31;h:10;bat:89;baro:-26.14;time:18;agx:4.00;agy:9.00;agz:-1006.00;")
                assert.equal(state, FlightState.moving)
            })
    
            it("should return hovering state", () => {
                hoverQueue.forEach(() => handler("pitch:0;roll:0;yaw:-8;vgx:0;vgy:0;vgz:0;templ:91;temph:94;tof:31;h:10;bat:89;baro:-26.14;time:18;agx:4.00;agy:9.00;agz:-1006.00;"))
                assert.equal(state, FlightState.hovering)
            })
        })
    })

})