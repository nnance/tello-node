import { equal } from "assert"
import { controller, Direction } from "../controller"

let calledWith: any
const spy = (arg: any) => calledWith = arg

describe("drone controller", () => {
    const ctrl = controller(spy)

    it("should send takeoff when takeOff is called", () => {
        ctrl.takeOff()
        equal(calledWith, "takeoff")
    })

    it("should send emergency when emergency is called", () => {
        ctrl.emergency()
        equal(calledWith, "emergency")
    })

    it("should send land when land is called", () => {
        ctrl.land()
        equal(calledWith, "land")
    })

    it("should send stop when stop is called", () => {
        ctrl.stop()
        equal(calledWith, "stop")
    })

    it("should send up with height", () => {
        ctrl.up(10)
        equal(calledWith, "up 10")
    })

    it("should send down with height", () => {
        ctrl.down(10)
        equal(calledWith, "down 10")
    })

    it("should send flip with direction", () => {
        ctrl.flip(Direction.left)
        equal(calledWith, "flip l")
    })

    it("should send degrees when rotateClockwise is called", () => {
        ctrl.rotateClockwise(10)
        equal(calledWith, "cw 10")
    })

    it("should send degrees when rotateCounterClockwise is called", () => {
        ctrl.rotateCounterClockwise(10)
        equal(calledWith, "ccw 10")
    })
})