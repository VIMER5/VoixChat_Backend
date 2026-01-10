import { Model, DataTypes, Sequelize } from "sequelize";

export class User extends Model {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password: string;
  declare avatar: string;
  declare status: string;

  static initModel(sequelize: Sequelize) {
    User.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        username: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        avatar: { type: DataTypes.STRING, defaultValue: null },
        status: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
      },
      { sequelize: sequelize, tableName: "users" }
    );
  }
}
