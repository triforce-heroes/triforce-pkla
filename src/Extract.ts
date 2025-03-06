import { BufferConsumer } from "@triforce-heroes/triforce-core/BufferConsumer";

import { messageDecrypt } from "./services/Message.js";

type TableEntry = [hash: bigint, name: string];

function extractTable(table: Buffer) {
  const tableConsumer = new BufferConsumer(table, 4);

  const entries: TableEntry[] = [];
  const entriesCount = tableConsumer.readUnsignedInt32();

  for (let entryIndex = 0; entryIndex < entriesCount; entryIndex++) {
    const hash = tableConsumer.readUnsignedInt64();
    const nameLength = tableConsumer.readUnsignedInt16();
    const name = tableConsumer.readString(nameLength - 1);

    tableConsumer.skip(1); // Null terminator.

    entries.push([hash, name]);
  }

  return entries;
}

interface MessageEntry {
  hash: bigint;
  name: string;
  flags: number;
  message: string;
}

export function extract(data: Buffer, table: Buffer) {
  const dataConsumer = new BufferConsumer(data);

  const tableEntries = extractTable(table);
  const entries: MessageEntry[] = [];

  dataConsumer.skip(2); // Version?
  const entriesCount = dataConsumer.readUnsignedInt16();
  dataConsumer.skip(4); // Data length.
  dataConsumer.skip(4); // Unknown (0).
  dataConsumer.skip(4); // Unknown (16).

  // Data
  dataConsumer.skip(4); // Data length (again).

  const messageConsumer = new BufferConsumer(data, 20 + entriesCount * 8);

  for (let entryIndex = 0; entryIndex < entriesCount; entryIndex++) {
    const [hash, name] = tableEntries[entryIndex]!;

    dataConsumer.skip(4); // Offset.

    const entryLength = dataConsumer.readUnsignedInt16();
    const entryFlags = dataConsumer.readUnsignedInt16();

    entries.push({
      hash,
      name,
      flags: entryFlags,
      message: messageDecrypt(
        messageConsumer.read(entryLength * 2),
        entryIndex,
      ),
    });

    messageConsumer.skipPadding(4);
  }

  return entries;
}
