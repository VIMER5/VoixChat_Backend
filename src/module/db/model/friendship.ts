import { Model, DataTypes, Sequelize, NonAttribute } from "sequelize";

export class Friendship extends Model {
  declare id: number;
  declare userId: number;
  declare friendId: number;
  declare status: "pending" | "accepted" | "blocked";

  static initModel(sequelize: Sequelize) {
    Friendship.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Users",
            key: "id",
          },
        },
        friendId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Users", // Имя таблицы (tableName)
            key: "id",
          },
        },
        status: {
          type: DataTypes.ENUM("pending", "accepted", "blocked"),
          defaultValue: "pending",
        },
      },
      {
        sequelize: sequelize,
        tableName: "Friendship",
        indexes: [
          {
            unique: true,
            fields: ["userId", "friendId"],
          },
        ],
      },
    );
  }
}
