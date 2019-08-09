import { equal } from "assert"
import { timeMonitor } from "../monitors";

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