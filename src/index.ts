import { connect } from "./drone";
import { logger } from "./adapters/logging";
import { Direction } from "./controller";

const drone = connect(logger, 8889, "192.168.10.1");

const mission = async () => {
    await drone.controller.takeOff();
    await drone.controller.flip(Direction.back);
    await drone.controller.land();
    await drone.controller.wait(1000);
    drone.disconnect();
}

mission();