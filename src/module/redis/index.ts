import redisConnect from "./redisConnect.js";

export const poolRedis = {
  сonfirmationСodes: new redisConnect("сonfirmationСodes", 0),
  session: new redisConnect("session", 1),
};
