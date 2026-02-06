import { Model, DataTypes, Sequelize, NonAttribute } from "sequelize";
import { Chat } from "./chat.js";
import { ChatInfo } from "./../../../types/bdType.js";
export class User extends Model {
  declare id: number;
  declare login: string;
  declare username: string;
  declare email: string;
  declare password: string;
  declare avatar: string;
  declare status: string;
  declare emailConfirmed: boolean;
  declare Friends?: NonAttribute<User[]>;
  declare AddedBy?: NonAttribute<User[]>;
  declare myChat?: NonAttribute<ChatInfo[]>;

  static initModel(sequelize: Sequelize) {
    User.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        login: { type: DataTypes.STRING, allowNull: false },
        username: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        avatar: { type: DataTypes.STRING, defaultValue: null },
        status: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
        emailConfirmed: { type: DataTypes.BOOLEAN, defaultValue: false },
      },
      { sequelize: sequelize, tableName: "users" },
    );
  }
}
