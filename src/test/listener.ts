import { equal } from "assert"

import { stateParser, connect } from "../listener"
import { ILogger, ICommandConnection } from "../ports";

const droneStatus = "pitch:0;roll:0;yaw:0;vgx:0;vgy:0;vgz:0;templ:86;temph:88;tof:10;h:0;bat:19;baro:-24.59;time:0;agx:9.00;agy:-6.00;agz:-1000.00;"
const droneStatusObj = {
    pitch: 0,
    roll: 0,
    yaw: 0,
    vgx: 0,
    vgy:0,
    vgz:0,
    templ:86,
    temph:88,
    tof:10,
    h:0,
    bat:19,
    baro:-24.59,
    time:0,
    agx:9.00,
    agy:-6.00,
    agz:-1000.00,
}

const loggerSpy: ILogger = (msg: string) => undefined

let cmdCallStack: string[] = []
const commandSpy: ICommandConnection = {
    port: 8889,
    address: "0.0.0.0",
    send: (cmd: string) => cmdCallStack.push(`send:${cmd}`),
    on: (event: string) => cmdCallStack.push(`on:${event}`),
    close: () => cmdCallStack.push(`close`),
}

describe('Drone Listener', () => {
    beforeEach(() => {
        cmdCallStack = []
    })

    describe('stateParser', () => {
        const parsed = stateParser(droneStatus)
        it('should return the same value', () => {
            equal(Object.keys(parsed).length, Object.keys(droneStatusObj).length)
        })
    })

    describe('when connecting', () => {
        it('should setup 3 listeners', () => {
            connect(loggerSpy, commandSpy)
            equal(cmdCallStack.length, 3)
        })
    })
    
    describe('when connecting with a custom listener', () => {
        it('should setup 4 listeners', () => {
            connect(loggerSpy, commandSpy, () => undefined)
            equal(cmdCallStack.length, 4)
        })
    })
    
})
