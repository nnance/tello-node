import { factory } from "./drone";
import { logger } from "./adapters/logging";
import { Direction } from "./controller";
import { commandFactory } from "./adapters/networking";

const drone = factory(logger, commandFactory, 8889, "192.168.10.1");

const mission = async () => {
    await drone.controller.wait(1000)
    await drone.controller.takeOff()
    await drone.controller.flip(Direction.left)
    await drone.controller.land()
    await drone.controller.wait(1000)
    drone.disconnect();
}

mission();