import { typeMessage } from "./bdType.js";

interface newMessageRequest {
  type: typeMessage;
  content: string;
  chatId: string;
  userId: number;
}

export { type newMessageRequest };
