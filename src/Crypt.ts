/* eslint-disable no-bitwise */
import { BufferConsumer } from "@triforce-heroes/triforce-core/BufferConsumer";

const keyBase = 0x7c89;
const keyAdvance = 0x2983;

export function decrypt(data: Buffer, index: number) {
  const dataConsumer = new BufferConsumer(data);

  let key = (keyBase + keyAdvance * index) % 0x10000;

  const message = Buffer.allocUnsafe(data.length);

  for (let dataIndex = 0; dataIndex < data.length; dataIndex += 2) {
    const letter = dataConsumer.readUnsignedInt16() ^ key;

    message[dataIndex] = letter & 0xff;
    message[dataIndex + 1] = letter >> 8;

    key = ((key << 3) | (key >> 13)) % 0x10000;
  }

  return message.subarray(0, -2).toString("ucs2");
}
