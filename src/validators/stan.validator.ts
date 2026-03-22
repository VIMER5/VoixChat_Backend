import Joi from "joi";
import { LiveTokenRequest } from "types/stanType.js";
export const getLiveTokenRequest = Joi.object<LiveTokenRequest>({
  roomName: Joi.string().uuid().required().messages({
    "string.empty": "roomName обязателен",
    "any.required": "roomName обязателен",
  }),
});
