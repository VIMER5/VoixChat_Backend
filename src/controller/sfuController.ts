import { CustomRequest } from "types/customRequestType.js";

import { Response, Request, NextFunction } from "express";
import { getLiveTokenRequest } from "validators/stan.validator.js";
import errorApi from "service/errorService.js";
import { LiveTokenRequest } from "types/stanType.js";
import Joi from "joi";
import sfuService from "service/sfuService.js";

class sfuController {
  async getLiveToken(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      if (!req.body) throw errorApi.badRequest("нет данных");
      if (!req.userId) throw errorApi.notFound("что-то пошло не так");
      const { value, error } = getLiveTokenRequest.validate(req.body) as {
        value: LiveTokenRequest;
        error?: Joi.ValidationError;
      };
      if (error) throw errorApi.badRequest(error.message);
      const { token } = (await sfuService.genTokenLive(value, req.userId)) as { token: string };
      console.log(token);
      res.status(200).json({ token });
    } catch (e) {
      next(e);
    }
  }
}

export default new sfuController();
