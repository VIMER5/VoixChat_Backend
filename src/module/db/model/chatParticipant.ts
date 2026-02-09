import { Model, DataTypes, Sequelize, NonAttribute } from "sequelize";

export class ChatParticipant extends Model {
  declare id: number;
  declare userId: number;
  declare chatId: string;
  declare lastReadMsgId: number;
  declare updatedAt?: Date;
  static initModel(sequelize: Sequelize) {
    ChatParticipant.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
        },
        chatId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "chats",
            key: "id",
          },
        },

        lastReadMsgId: { type: DataTypes.INTEGER, defaultValue: 0 },
      },
      {
        sequelize,
        tableName: "chat_participants",
        indexes: [
          {
            unique: true,
            fields: ["userId", "chatId"],
          },
        ],
      },
    );
  }
}
