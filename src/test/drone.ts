import { equal } from "assert"
import { describe } from "mocha"

import { factory } from "../drone"
import { ICommandConnection, ILogger } from "../ports"

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
        const drone = factory(loggerSpy, commandFactorySpy, 8889, "192.168.10.1")
        it("should setup the network in the correct order", () => {
            equal(cmdCallStack[0], "factory:8889")
            equal(cmdCallStack[1], "send:command")
            equal(cmdCallStack[2], "factory:8890")
        })
    })
})