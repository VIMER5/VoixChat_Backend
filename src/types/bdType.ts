interface ChatInfo {
  id: number;
  type: "private" | "group";
  name: string;
  avatar: string | null;
  chatMembers: ChatMember[];
  _ChatParticipant: ChatParticipant;
  _Messages?: messageInfo[];
}

interface ChatMember {
  username: string;
  avatar: string;
  id: number;
}

interface ChatParticipant {
  lastReadMsgId: number;
  updatedAt: Date;
}

// interface BaseMessageInfo<T extends "text" | "image" | "file", C> {
//   id: number;
//   type: T;
//   content: C;
//   createdAt: Date;
//   updatedAt: Date;
//   _User: {
//     username: string;
//     avatar: string | null;
//   };
// }
// type TextMessageInfo = BaseMessageInfo<"text", string>;
// type ImageMessageInfo = BaseMessageInfo<"image", ImageContent>;
// type FileMessageInfo = BaseMessageInfo<"file", FileContent>;
// type MessageInfo = TextMessageInfo | ImageMessageInfo | FileMessageInfo;

// interface ImageContent {
//   url: string[];
//   text?: string;
// }
// interface FileContent {
//   file: string[];
//   text?: string;
// }
type typeMessage = "text" | "image" | "file";
interface messageInfo {
  id: number;
  content: string;
  type: typeMessage;
  createdAt: Date;
  updatedAt: Date;
  _User: {
    username: string;
    avatar: string | null;
  };
}

export { typeMessage, type ChatInfo, type ChatMember, type ChatParticipant, type messageInfo };
