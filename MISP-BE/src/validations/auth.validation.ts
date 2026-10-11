import Joi from "joi";

export const loginValidator = Joi.object({
  email: Joi.string().allow('', null).optional(),
  identifier: Joi.string().allow('', null).optional(),
  username: Joi.string().allow('', null).optional(),
  phoneNumber: Joi.string().allow('', null).optional(),
  empCode: Joi.string().allow('', null).optional(),
  password: Joi.string().allow('', null).optional(),
  pin: Joi.string().allow('', null).optional(),
}).options({ stripUnknown: true });
