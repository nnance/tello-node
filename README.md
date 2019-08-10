# tello-node

This project provides a typed API for programmatically flying the DJI Tello educational drone.  It provides 
capabilities that makes creating and flying missions easy with consistent behavior.

## Architecture

The project utilizes the hexagonal architecture, aka ports and adaptors.  All external I/O is modeled as an interface via ports with specific implementations via adaptors.   This allows the core of the software to be fully tested without engaging the drone.  The real adaptors like the network and the console are mocked out for testing.

## Getting Started

This is a pure TypeScript project that requires an initial build step before running.

```
npm install && npm run build
```

To run the application:

```
npm start
```

To run with debug logs:

```
DEBUG="google" npm start
```