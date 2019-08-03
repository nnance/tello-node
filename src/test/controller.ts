import { equal } from "assert"

import { controller, Direction } from "../controller"

let calledWith: any
const spy = (arg: any) => calledWith = arg

describe("drone controller", () => {
    it("should send takeoff when takeOff is called", () => {
        controller(spy).takeOff()
        equal(calledWith, "takeoff")
    })

    it("should send up with height", () => {
        controller(spy).up(10)
        equal(calledWith, "up 10")
    })

    it("should send flip with direction", () => {
        controller(spy).flip(Direction.left)
        equal(calledWith, "flip l")
    })

    it("should wait for 20ms", async () => {
        let long = false, short = false

        setTimeout(() => long = true, 40)
        setTimeout(() => short = true, 10)
        return await controller(spy).wait(20).then(() => {
            equal(short, true)
            equal(long, false)
        })
    })
})