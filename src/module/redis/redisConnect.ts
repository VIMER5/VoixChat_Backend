import { createClient } from "redis";
class redisConnect {
  redis;
  constructor(dbName: string, dbId: number) {
    this.redis = createClient({
      url: `redis://${process.env.redis_login}:${process.env.redis_pass}@${process.env.redis_host}:${process.env.redis_port}/${dbId}`,
    });
    this.redis.on("error", (err) => console.log("Redis Error", err));
    this.redis.on("ready", () => console.log(`Redis ${dbName} готов к работе`));
  }
  async connect() {
    await this.redis.connect();
  }
}

export async function connectionAllRedis(redis: any) {
  for (const item in redis) await redis[item].connect();
}

export default redisConnect;
