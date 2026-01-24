import errorApi from "./errorService.js";
import { User } from "module/db/model/user.js";
class friendService {
  async getFriends(userId: number) {
    const friends = await User.findByPk(userId, {
      include: [
        {
          model: User,
          as: "Friends",
          attributes: ["id", "username", "avatar", "status"],
          through: {
            where: { status: "accepted" },
            attributes: ["status"],
          },
        },
        {
          model: User,
          as: "AddedBy",
          attributes: ["id", "username", "avatar", "status"],
          through: {
            where: { status: "accepted" },
            attributes: ["status"],
          },
        },
      ],
    });
    if (friends) {
      if (friends.AddedBy && friends.Friends) return [...friends.AddedBy, ...friends.Friends];
      if (friends.AddedBy && !friends.Friends) return friends.AddedBy;
      if (!friends.AddedBy && friends.Friends) return friends.Friends;
    }
    return [];
  }
}

export default new friendService();
