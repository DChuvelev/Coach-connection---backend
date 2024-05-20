import { celebrate, Joi } from "celebrate";
import type { NextFunction, Request, Response } from "express";

export const validateCreateUserData = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().required().min(2).max(30).messages({
          "string.min": "Name should be at least 2 characters long",
          "string.max": "Name should be no longer then 30 characters",
          "string.empty": "The 'Name' field is empty",
        }),
        password: Joi.string().required().messages({
          "string.required": "Password field is required",
        }),
        email: Joi.string().required().email().messages({
          "string.email": "Email not valid",
        }),
      })
      .unknown(true),
  })(req, res, next);
};

export const validateModifyUserData = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().required().min(2).max(30).messages({
          "string.min": "Name should be at least 2 characters long",
          "string.max": "Name should be no longer then 30 characters",
          "string.empty": "The 'Name' field is empty",
        }),
      })
      .unknown(true),
  })(req, res, next);
};

export const validateLoginData = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  celebrate({
    body: Joi.object()
      .keys({
        password: Joi.string().required().messages({
          "string.required": "Password field is required",
        }),
        email: Joi.string().required().email().messages({
          "string.email": "Email not valid",
        }),
      })
      .unknown(true),
  })(req, res, next);
};

export const validateId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(req.params);
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required().hex().length(24).messages({
        "string.hex": "Wrong ID format",
        "string.length": "ID should be 24 characters long",
      }),
    }),
  })(req, res, next);
};
