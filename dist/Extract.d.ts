interface MessageEntry {
    hash: bigint;
    name: string;
    flags: number;
    message: string;
}
export declare function extract(data: Buffer, table: Buffer): MessageEntry[];
export {};
