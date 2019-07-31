import { connect, errorHandler } from "./listener";

const logger = console.log;

const droneAddr = "192.168.10.1";
const dronePort = 8889;

const drone = connect(logger)(dronePort);    
const droneState = connect(logger)(8890);

drone.send("command", dronePort, droneAddr);
