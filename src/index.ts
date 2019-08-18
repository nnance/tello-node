import { droneFactory, droneControllerFactory } from "./drone"
import { logger } from "./adapters/logging"
import { Direction } from "./controller"
import { commandFactory } from "./adapters/networking"
import { timeMonitor } from "./monitors"
import { flow } from "lodash/fp";

const droneBuilder = flow(droneFactory, droneControllerFactory)

const controller = droneBuilder(logger, commandFactory, 8889, "192.168.10.1")

const flipMission = async () => {
    await timeMonitor(1000)
    await controller.takeOff()
    await controller.flip(Direction.left)
    await controller.land()
    controller.disconnect()
}

const moveMission = async () => {
    await timeMonitor(1000)
    await controller.takeOff()
    await controller.flip(Direction.forward)
    await controller.forward(120)
    await controller.land()
    controller.disconnect()
}

const returnMisson = async () => {
    await controller.takeOff()
    await controller.rotateClockwise(180)
    await controller.forward(120)
    await controller.land()
    controller.disconnect()
}

const rotateTest = async () => {
    await controller.takeOff()
    await controller.rotateClockwise(180)
    await controller.land()
    controller.disconnect()
}

rotateTest()