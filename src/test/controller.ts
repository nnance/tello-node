import { equal } from "assert"

import { controller, Direction } from "../controller"

let calledWith: any
const spy = (arg: any) => calledWith = arg

describe("drone controller", () => {
    const ctrl = controller(spy)

    it("should send takeoff when takeOff is called", () => {
        ctrl.takeOff(1)
        equal(calledWith, "takeoff")
    })

    it("should send emergency when emergency is called", () => {
        ctrl.emergency(1)
        equal(calledWith, "emergency")
    })

    it("should send land when land is called", () => {
        ctrl.land(1)
        equal(calledWith, "land")
    })

    it("should send stop when stop is called", () => {
        ctrl.stop(1)
        equal(calledWith, "stop")
    })

    it("should send up with height", () => {
        ctrl.up(10, 1)
        equal(calledWith, "up 10")
    })

    it("should send down with height", () => {
        ctrl.down(10, 1)
        equal(calledWith, "down 10")
    })

    it("should send flip with direction", () => {
        ctrl.flip(Direction.left, 1)
        equal(calledWith, "flip l")
    })

    it("should send degrees when rotateClockwise is called", () => {
        ctrl.rotateClockwise(10, 1)
        equal(calledWith, "cw 10")
    })

    it("should send degrees when rotateCounterClockwise is called", () => {
        ctrl.rotateCounterClockwise(10, 1)
        equal(calledWith, "ccw 10")
    })

    it("should wait for 20ms", async () => {
        let long = false, short = false

        setTimeout(() => long = true, 40)
        setTimeout(() => short = true, 10)
        return await ctrl.wait(20).then(() => {
            equal(short, true)
            equal(long, false)
        })
    })
})