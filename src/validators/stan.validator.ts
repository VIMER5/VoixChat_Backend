import Joi from "joi";
import { LiveTokenRequest } from "types/stanType.js";
export const getLiveTokenRequest = Joi.object<LiveTokenRequest>({
  roomName: Joi.string().uuid().required().messages({
    "string.empty": "roomName обязателен",
    "any.required": "roomName обязателен",
  }),
  participantName: Joi.string()
    .min(4)
    .max(12)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      "string.empty": "participantName обязателен",
      "string.min": "participantName должен быть не менее 4 символов",
      "string.max": "participantName должен быть не более 12 символов",
      "string.pattern.base": "participantName может содержать только буквы, цифры и подчеркивания",
      "any.required": "participantName обязателен",
    }),
});
