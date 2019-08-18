import { equal, ok } from "assert"
import { flow } from "lodash/fp";

import { timeMonitor, movementMonitor } from "../monitors";
import { ICommandConnection } from "../ports";
import { FlightState } from "../sensors";

import { events as takeoff } from "./fixtures/takeoff"
import { events as flipLeft } from "./fixtures/flip-left"

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

const flightMonitor = flow(eventSender, commandFactorySpy, movementMonitor)

describe("Time Monitor", () => {
    it("should wait for 20ms", async () => {
        let long = false, short = false

        setTimeout(() => long = true, 40)
        setTimeout(() => short = true, 10)
        return await timeMonitor(20).then(() => {
            equal(short, true)
            equal(long, false)
        })
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
})