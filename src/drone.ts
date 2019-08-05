import { IController, controller } from "./controller"
import { connect as connectListener } from "./listener"
import { ILogger, ICommandConnectionFactory } from "./ports";

export interface IDrone {
    address: string,
    port: number,
    controller: IController,
    disconnect: () => void,
}

export const factory = (logger: ILogger, factory: ICommandConnectionFactory, port = 8889, address = "0.0.0.0"): IDrone => {

    const drone = factory(logger, port, address)

    // enter SDK mode to send commands to the drone
    // NOTE: This must be done before setting up the listener
    drone.send("command");

    const droneState = factory(logger, 8890)
    connectListener(logger, droneState)

    return {
        address,
        port,
        controller: controller(drone.send, droneState),
        disconnect: () => {
            droneState.close()
            drone.close()
        },
    }
}
