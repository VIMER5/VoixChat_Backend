import { User } from "./user.js";
import { Friendship } from "./friendship.js";
import { Chat } from "./chat.js";
import { ChatParticipant } from "./chatParticipant.js";
export function setupAssociations() {
  User.belongsToMany(User, {
    through: Friendship,
    as: "Friends",
    foreignKey: "userId",
    otherKey: "friendId",
  });
  User.belongsToMany(User, {
    through: Friendship,
    as: "AddedBy",
    foreignKey: "friendId",
    otherKey: "userId",
  });
  User.belongsToMany(Chat, {
    through: ChatParticipant,
    as: "myChat",
    foreignKey: "userId",
    otherKey: "chatId",
  });
  Chat.belongsToMany(User, {
    through: ChatParticipant,
    as: "chatMembers",
    foreignKey: "chatId",
    otherKey: "userId",
  });
}

export const models = [User, Friendship, Chat, ChatParticipant];
