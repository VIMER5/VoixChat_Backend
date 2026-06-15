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

export const createGroupRequest = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    "string.empty": "Название группы не может быть пустым",
    "any.required": "Название группы обязательно",
  }),
  members: Joi.array().items(Joi.number()).min(1).required().messages({
    "array.min": "Нужно выбрать хотя бы одного участника",
    "any.required": "Список участников обязателен",
  }),
  avatar: Joi.string().allow(null, ""),
});
