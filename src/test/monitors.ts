import { equal, ok } from "assert"
import { flow, curry } from "lodash/fp";

import { timeMonitor, movementMonitor } from "../monitors";
import { ICommandConnection } from "../ports";
import { FlightState, sensorFactory } from "../sensors";

import { events as takeoff } from "./fixtures/takeoff"
import { events as flipLeft } from "./fixtures/flip-left"
import { events as rotate } from "./fixtures/rotateClockwise"

interface IHandler {
    (event: string, cb: (msg: string) => void): void
}

const eventSender = (commands: string[]): IHandler => (event, cb) => {
    let idx = 0
    const id = setInterval(() => {
        if (idx == commands.length) {
            clearInterval(id)
        } else {
            cb(commands[idx++])
        }
    })
}

const commandFactorySpy = (handler: IHandler): ICommandConnection => ({
    port: 80,
    address: "0.0.0.0",
    send: () => undefined,
    on: handler,
    close: () => undefined,
})

const monitor = curry(movementMonitor)(sensorFactory(20))
const flightMonitor = flow(eventSender, commandFactorySpy, monitor)

describe("Time Monitor", () => {
    it("should wait for 200ms", async () => {
        let long = false, short = false

        setTimeout(() => long = true, 400)
        setTimeout(() => short = true, 100)
        await timeMonitor(200)
        equal(short, true)
        equal(long, false)
    })
})

describe("Movement Monitor", () => {
    describe("When taking off", () => {
        it("should detect hovering", async () => {
            const monitor = flightMonitor(takeoff)
            await monitor(2000, FlightState.hovering)
            ok(true)
        })
    })
    describe("When flipping", () => {
        it("should detect hovering", async () => {
            const monitor = flightMonitor(flipLeft)
            await monitor(2000, FlightState.hovering)
            ok(true)
        })
    })
    describe("When rotating", () => {
        it("should detect hovering", async () => {
            const monitor = flightMonitor(rotate)
            await monitor(2000, FlightState.hovering)
            ok(true)
        })
    })
})