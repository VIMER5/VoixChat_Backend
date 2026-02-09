import { Model, DataTypes, Sequelize, NonAttribute } from "sequelize";
import { ChatMember } from "./../../../types/bdType.js";

export class Chat extends Model {
  declare id: string;
  declare type: "private" | "group";
  declare name: string | null;
  declare avatar: string | null;
  declare chatMembers?: NonAttribute<ChatMember[]>;
  static initModel(sequelize: Sequelize) {
    Chat.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        type: { type: DataTypes.ENUM("private", "group"), defaultValue: "private" },
        name: { type: DataTypes.STRING, allowNull: true },
        avatar: { type: DataTypes.STRING, allowNull: true },
      },
      { sequelize, tableName: "chats" },
    );
  }
}
