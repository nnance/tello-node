import { factory } from "./drone"
import { logger } from "./adapters/logging"
import { Direction } from "./controller"
import { commandFactory } from "./adapters/networking"
import { timeMonitor } from "./monitors"

const drone = factory(logger, commandFactory, 8889, "192.168.10.1")

const flipMission = async () => {
    await timeMonitor(1000)
    await drone.takeOff()
    await drone.flip(Direction.left)
    await drone.land()
    drone.disconnect()
}

const moveMission = async () => {
    await timeMonitor(1000)
    await drone.takeOff()
    await drone.flip(Direction.forward)
    await drone.forward(120)
    await drone.land()
    drone.disconnect()
}

moveMission();