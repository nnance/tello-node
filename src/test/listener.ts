import { equal } from "assert"

import { stateParser } from "../listener"

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

describe('Drone Listener', () => {
    describe('stateParser', () => {
        it('should return the same value', () => {
            const parsed = stateParser(droneStatus)
            equal(Object.keys(parsed).length, Object.keys(droneStatusObj).length)
        })
    })
})
