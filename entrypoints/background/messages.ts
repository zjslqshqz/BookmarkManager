import type { ExtensionMessage } from '../manager/types';

export type MessageType = ExtensionMessage['type'];
export type MessageHandler<T extends ExtensionMessage> = (
  message: T,
) => Promise<unknown> | void;
