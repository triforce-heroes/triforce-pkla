import { BufferBuilder } from "@triforce-heroes/triforce-core/BufferBuilder";

import { messageEncrypt } from "./services/Message.js";

import type { extract } from "./Extract.js";

export function rebuild(
  entries: ReturnType<typeof extract>,
  replacements: Map<string, string>,
) {
  const offsetBuffer = new BufferBuilder();

  const messageBuffer = new BufferBuilder();
  const messageOffset = 4 + entries.length * 8;

  for (let entryIndex = 0; entryIndex < entries.length; entryIndex++) {
    const entry = entries[entryIndex]!;
    const entryMessage = replacements.get(entry.name) ?? entry.message;

    offsetBuffer.writeUnsignedInt32(messageOffset + messageBuffer.length);
    offsetBuffer.writeUnsignedInt16(entryMessage.length + 1); // Message length.
    offsetBuffer.writeUnsignedInt16(entry.flags);

    messageBuffer.push(messageEncrypt(entryMessage, entryIndex));
    messageBuffer.pad(4);
  }

  const buffer = new BufferBuilder();
  const dataLength = messageOffset + messageBuffer.length;

  buffer.writeUnsignedInt16(1); // Version?
  buffer.writeUnsignedInt16(entries.length);
  buffer.writeUnsignedInt32(dataLength);
  buffer.writeUnsignedInt32(0); // Unknown.
  buffer.writeUnsignedInt32(16); // Unknown.

  buffer.writeUnsignedInt32(dataLength);

  buffer.push(offsetBuffer.build());
  buffer.push(messageBuffer.build());

  return buffer.build();
}
