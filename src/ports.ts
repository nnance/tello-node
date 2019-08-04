export interface ILogger {
    (msg: string): void;
}

export interface ISendCmd {
    (command: string): void
}

export interface ICommandConnection {
    port: number,
    address?: string,
    send: ISendCmd
    on: (event: string, cb: (...args: any[]) => void) => void
    close: () => void
}

export interface ICommandConnectionFactory {
    (logger: ILogger, port: number, address?: string): ICommandConnection
}