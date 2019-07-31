import { createSocket, RemoteInfo, Socket } from "dgram";
import { AddressInfo } from "net";

export interface Logger {
    (msg: string): void;
};

export const errorHandler = (drone: Socket) => (err: Error | null, bytes: number) => {
    if (err) console.log(`server error:\n${err.stack}`);
    drone.close();
}

const messageHandler = (msg: string, rinfo: RemoteInfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
}

const listeningHandler = (drone: Socket) => () => {
    const address = drone.address() as AddressInfo;
    console.log(`server listening ${address.address}:${address.port}`);
}

export const connect = (logger: Logger) => (port: number) => {

    const drone = createSocket('udp4');
    drone.bind(port);

    drone.on('error', errorHandler(drone));
    drone.on('message', messageHandler);
    drone.on('listening', listeningHandler(drone));

    return drone;    
}
