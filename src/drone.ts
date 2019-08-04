import { IController, controller } from "./controller"
import { connect as connectListener } from "./listener"
import { ILogger } from "./ports";
import { commandFactory } from "./adapters/networking";

export interface IDrone {
    address: string,
    port: number,
    controller: IController,
}

export const connect = (logger: ILogger, port = 8889, address?: string) => {

    const drone = commandFactory(logger, port, address)

    // enter SDK mode to send commands to the drone
    // NOTE: This must be done before setting up the listener
    drone.send("command");

    const droneState = commandFactory(logger, 8890)
    connectListener(logger, droneState)

    return {
        address,
        port,
        controller: controller(drone.send),
        disconnect: () => {
            droneState.close()
            drone.close()
        },
    }
}
