import { AccessToken } from "livekit-server-sdk";

const apiKey = "devkey";
const apiSecret = "secret_key_123";

const at = new AccessToken(apiKey, apiSecret, {
  identity: "Danil-Dev",
});

at.addGrant({
  roomJoin: true,
  room: "my-test-room",
  canPublish: true,
  canSubscribe: true,
});

console.log(await at.toJwt());
