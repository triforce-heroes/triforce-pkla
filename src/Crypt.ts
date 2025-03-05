/* eslint-disable no-bitwise */
import { BufferConsumer } from "@triforce-heroes/triforce-core/BufferConsumer";

const keyBase = 0x7c89;
const keyAdvance = 0x2983;

export function decrypt(data: Buffer, index: number) {
  const dataConsumer = new BufferConsumer(data);
  const message: number[] = [];

  let key = (keyBase + keyAdvance * index) % 0x10000;

  while (!dataConsumer.isConsumed()) {
    const messageLetter = dataConsumer.readUnsignedInt16() ^ key;

    if (messageLetter === 0) {
      break;
    }

    message.push(messageLetter);

    key = ((key << 3) | (key >> 13)) % 0x10000;
  }

  return Buffer.from(message).toString("utf-8");
}
