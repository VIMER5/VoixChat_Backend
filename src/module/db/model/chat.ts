import { Model, DataTypes, Sequelize, NonAttribute } from "sequelize";

export class Chat extends Model {
  declare id: string;
  declare type: "private" | "group";
  declare name: string | null;
  declare avatar: string | null;

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
