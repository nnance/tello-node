import { equal } from "assert"
import { describe } from "mocha"

import { droneFactory, droneControllerFactory } from "../drone"
import { ICommandConnection, ILogger } from "../ports"
import { flow } from "lodash/fp";

const loggerSpy: ILogger = (msg: string) => undefined

let cmdCallStack: string[] = []
const commandFactorySpy = (logger: ILogger, port: number, address?: string): ICommandConnection => {
    cmdCallStack.push(`factory:${port}`)
    return {
        port,
        address,
        send: (cmd: string) => cmdCallStack.push(`send:${cmd}`),
        on: (event: string) => cmdCallStack.push(`on:${event}`),
        close: () => cmdCallStack.push(`close`),
    }
}

describe("drone", () => {
    describe("when initializing", () => {
        const droneBuilder = flow(droneFactory, droneControllerFactory)
        const drone = droneBuilder(loggerSpy, commandFactorySpy )
        it("should setup the network in the correct order", () => {
            equal(cmdCallStack[0], "factory:8889")
            equal(cmdCallStack[1], "send:command")
            equal(cmdCallStack[2], "factory:8890")
        })

        describe("when disconnecting", () => {
            it("should close both network connections", () => {
                drone.disconnect()
                equal(cmdCallStack.filter((val) => val == "close").length, 2)
            })
        })
    })

})