import { Model, DataTypes, Sequelize, NonAttribute } from "sequelize";
import { ChatMember } from "./../../../types/bdType.js";
import { User } from "./user.js";

export class Message extends Model {
  declare id: number;
  declare content: string;
  declare userId: number;
  declare chatId: string;
  declare type: "text" | "image" | "file";
  declare updatedAt?: Date;
  declare createdAt?: Date;
  declare _User?: NonAttribute<User>;
  static initModel(sequelize: Sequelize) {
    Message.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        content: { type: DataTypes.TEXT, allowNull: false },
        chatId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "chats",
            key: "id",
          },
        },
        type: { type: DataTypes.ENUM("text", "image", "file"), defaultValue: "text" },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: "users", key: "id" },
        },
      },
      { sequelize, tableName: "message", indexes: [{ fields: ["chatId"] }] },
    );
  }
}
