import { createSocket } from "dgram";
import { AddressInfo } from "net";
const server = createSocket('udp4');

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
    const address = server.address() as AddressInfo;
    console.log(`server listening ${address.address}:${address.port}`);
});

export const launch = () => {
    console.log("launched");
};

const main = () => {
    server.bind(41234);
}

main();
