export interface Logger {
    (msg: string): void;
}

export interface ISendCmd {
    (command: string): void
}
