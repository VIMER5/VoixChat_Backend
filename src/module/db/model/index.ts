import { User } from "./user.js";
import { Friendship } from "./friendship.js";
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
}

export const models = [User, Friendship];
