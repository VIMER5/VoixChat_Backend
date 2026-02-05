import errorApi from "./errorService.js";
import { User } from "module/db/model/user.js";
import { Friendship } from "module/db/model/friendship.js";
import { Op } from "sequelize";
import { getIO } from "socket/index.js";
const { cdn_url } = process.env;
type AssociationKeys = "Friends" | "AddedBy";
class friendService {
  async getFriends(userId: number) {
    return await this.GetFriendsC(userId, "accepted", ["AddedBy", "Friends"]);
  }
  async addFriend(login: string, userId: number, friendId: number) {
    const friend = await User.findOne({
      where: {
        id: friendId,
      },
    });
    if (!friend || friend.login != login) throw errorApi.badRequest("Пользователя не существует");
    if (userId == friendId) throw errorApi.badRequest("Вы не можете добавить себя в друзья");
    const existingFriendship = await Friendship.findOne({
      where: {
        [Op.or]: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });
    if (existingFriendship) {
      if (existingFriendship.status === "accepted") throw errorApi.badRequest("Вы уже дружите с данным пользователем");
      if (existingFriendship.status === "pending")
        throw errorApi.badRequest("Вы уже отправили запрос данному пользователю");
      if (existingFriendship.status === "blocked") throw errorApi.badRequest("blocked");
    }
    const newRequest = await Friendship.create({
      userId,
      friendId,
      status: "pending",
    });
    const io = getIO();
    io.to(`user:${friendId}`).emit("friendRequest", {
      body: newRequest,
    });
    return newRequest;
  }

  async getFriendRequest(userId: number) {
    return await this.GetFriendsC(userId, "pending", "AddedBy");
  }
  async normolizeUrlAvatar(data: any[]): Promise<any[]> {
    let res = data.map((item: any) => {
      let temp = item;
      temp.avatar = `${cdn_url}/image/${item.avatar}/thumb`;
      return temp;
    });
    return res;
  }

  private async GetFriendsC(
    userId: number,
    status: "accepted" | "pending",
    include: AssociationKeys | AssociationKeys[],
  ) {
    const Associations = {
      Friends: {
        model: User,
        as: "Friends",
        attributes: ["id", "username", "login", "avatar", "status"],
        through: {
          where: { status },
          attributes: ["status"],
        },
      },
      AddedBy: {
        model: User,
        as: "AddedBy",
        attributes: ["id", "username", "login", "avatar", "status"],
        through: {
          where: { status },
          attributes: ["status"],
        },
      },
    };
    const includeArray = Array.isArray(include) ? include.map((item) => Associations[item]) : [Associations[include]];
    const friends = await User.findByPk(userId, {
      include: includeArray,
    });
    if (friends) {
      if (friends.AddedBy && friends.Friends && friends.AddedBy.length > 0 && friends.Friends.length > 0) {
        return [
          ...(await this.normolizeUrlAvatar(friends.AddedBy)),
          ...(await this.normolizeUrlAvatar(friends.Friends)),
        ];
      }

      if (friends.AddedBy && friends.AddedBy.length > 0) return await this.normolizeUrlAvatar(friends.AddedBy);
      if (friends.Friends && friends.Friends.length > 0) return await this.normolizeUrlAvatar(friends.Friends);
    }
    return [];
  }
}

export default new friendService();
