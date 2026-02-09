import Joi from "joi";

export const newMessageRequest = Joi.object({
  type: Joi.string().valid("text", "image", "file").required().messages({
    "any.only": "Тип должен быть одним из: text, image, file",
    "any.required": "Тип обязателен для заполнения",
  }),
  content: Joi.string().required().messages({
    "any.required": "текст обязателен для заполнения",
  }),
  chatId: Joi.string().required().messages({
    "any.required": "chatId обязателен для заполнения",
  }),
});
