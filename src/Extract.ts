import { BufferConsumer } from "@triforce-heroes/triforce-core/BufferConsumer";

import { decrypt } from "./Crypt.js";

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

  for (let entryIndex = 0; entryIndex < entriesCount; entryIndex++) {
    const [hash, name] = tableEntries[entryIndex]!;

    const entryOffset = dataConsumer.readUnsignedInt32();
    const entryLength = dataConsumer.readUnsignedInt32();

    entries.push({
      hash,
      name,
      message: decrypt(
        data.subarray(entryOffset + 16, entryOffset + 16 + entryLength * 2),
        entryIndex,
      ),
    });
  }

  return entries;
}
