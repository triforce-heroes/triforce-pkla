/* eslint-disable no-bitwise */
import { BufferConsumer } from "@triforce-heroes/triforce-core/BufferConsumer";

const keyBase = 0x7c89;
const keyAdvance = 0x2983;

export function messageDecrypt(data: Buffer, index: number) {
  const dataConsumer = new BufferConsumer(data);

  let key = (keyBase + keyAdvance * index) % 0x10000;

  const message = Buffer.allocUnsafe(data.length);

  for (let dataIndex = 0; dataIndex < data.length; dataIndex += 2) {
    const letter = dataConsumer.readUnsignedInt16() ^ key;

    message[dataIndex] = letter & 0xff;
    message[dataIndex + 1] = letter >> 8;

    key = ((key << 3) | (key >> 13)) % 0x10000;
  }

  const messageString = message.toString("ucs-2");

  return messageString.slice(0, messageString.length - 1);
}

export function messageEncrypt(message: string, index: number) {
  const messageBuffer = Buffer.from(`${message}\0`, "ucs-2");
  const messageBuilder = Buffer.allocUnsafe(messageBuffer.length);

  let key = (keyBase + keyAdvance * index) % 0x10000;

  for (
    let messageIndex = 0;
    messageIndex < messageBuffer.length;
    messageIndex += 2
  ) {
    messageBuilder[messageIndex] = messageBuffer[messageIndex]! ^ (key & 0xff);
    messageBuilder[messageIndex + 1] =
      messageBuffer[messageIndex + 1]! ^ (key >> 8);

    key = ((key << 3) | (key >> 13)) % 0x10000;
  }

  return messageBuilder;
}
