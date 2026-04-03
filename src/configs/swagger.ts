import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import path from "path";
const port = process.env.server_port || 3030;
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API",
      version: "1.0.0",
      description: "Документация VoixChat API",
      contact: {
        name: "Поддержка",
        url: "https://t.me/The_crazy_fun",
      },
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Dev server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Введите токен без слова 'Bearer'",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "refreshToken",
        },
      },
      schemas: {
        newMessageRequest: {
          type: "object",
          required: ["type", "text", "chatId"],
          properties: {
            type: {
              type: "string",
              example: "text",
            },
            content: {
              type: "string",
              example: "test1",
            },
            chatId: {
              type: "string",
              example: "095172b8-0265-11f1-9289-bc24110cce17",
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["login", "username", "email", "password"],
          properties: {
            login: {
              type: "string",
              minLength: 4,
              maxLength: 12,
              example: "UserTest",
            },
            username: {
              type: "string",
              minLength: 4,
              maxLength: 20,
              example: "test1",
            },
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: {
              type: "string",
              minLength: 8,
              maxLength: 40,
              example: "password123R",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["login", "password"],
          properties: {
            login: {
              type: "string",
              minLength: 4,
              maxLength: 12,
              example: "UserTest",
            },
            password: {
              type: "string",
              minLength: 8,
              maxLength: 40,
              example: "password123R",
            },
          },
        },
        RegisterResponse: {
          type: "object",
          properties: {
            email: {
              type: "string",
              example: "user@example.com",
            },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            access: {
              type: "string",
              description: "Access token",
            },
          },
        },
        ValidateResponse: {
          type: "object",
          properties: {
            exp: {
              type: "number",
              description: "Время истечения токена (timestamp)",
            },
            iat: {
              type: "number",
              description: "Время выдачи токена (timestamp)",
            },
            login: {
              type: "string",
              description: "Логин пользователя",
            },
            userId: {
              type: "number",
              description: "ID пользователя",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email пользователя",
            },
          },
          example: {
            exp: 1672531200,
            iat: 1672444800,
            login: "john_doe",
            userId: 123,
            email: "john@example.com",
          },
        },
        CurrentUserInfoResponse: {
          type: "object",
          properties: {
            avatar: {
              type: "string",
              description: "сылка на аватар в CDN",
            },
            email: {
              type: "string",
              description: "email",
            },
            emailConfirmed: {
              type: "boolean",
            },
            login: {
              type: "string",
            },
            status: {
              type: "string",
              description: "Текстовый статус пользователя",
            },
            userName: {
              type: "string",
            },
          },
        },
        GetMyChatsResponse: {
          type: "object",
          properties: {
            login: {
              type: "string",
            },
            myChat: {
              type: "array",
              description: "Список чатов пользователя",
              items: {
                $ref: "#/components/schemas/ChatInfo",
              },
            },
          },
        },
        ChatInfo: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID чата",
            },
            type: {
              type: "string",
              description: "Тип чата",
              enum: ["private", "group"],
            },
            name: {
              type: "string",
              description: "Название чата",
            },
            avatar: {
              type: "string",
              description: "Ссылка на аватар чата",
            },
            chatMembers: {
              type: "array",
              description: "Другие участники чата",
              items: {
                $ref: "#/components/schemas/ChatMember",
              },
            },
            _ChatParticipant: {
              $ref: "#/components/schemas/ChatParticipant",
            },
          },
        },
        ChatMember: {
          type: "object",
          properties: {
            username: {
              type: "string",
              description: "Имя пользователя",
            },
            avatar: {
              type: "string",
              description: "Аватар пользователя",
            },
            id: {
              type: "number",
              description: "ID пользователя",
            },
          },
        },
        ChatParticipant: {
          type: "object",
          properties: {
            lastReadMsgId: {
              type: "number",
              description: "ID последнего прочитанного сообщения",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Токен отсутствует или недействителен",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        BadRequestError: {
          description: "Некорректные данные",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Auth",
        description: "Операции аутентификации и авторизации",
      },
      {
        name: "User",
        description: "Операции с пользователями",
      },
      {
        name: "Friends",
        description: "Операции с друзьями",
      },
      {
        name: "Chat",
        description: "Операции с чатами",
      },
      {
        name: "Voice",
        description: "Операции с голосовыми каналами",
      },
    ],
  },
  apis: [path.join(process.cwd(), "index.js"), path.join(process.cwd(), "dist/index.js")],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    }),
  );

  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`📚 Swagger документация доступна по адресу: http://localhost:${port}/api-docs`);
};
