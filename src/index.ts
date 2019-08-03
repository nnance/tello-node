import { connect } from "./drone";

const drone = connect(console.log, 8889, "192.168.10.1");

const mission = () => {
    drone.controller.takeOff();
    drone.controller.wait(2000);
    drone.controller.land();
}

mission();