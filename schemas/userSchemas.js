import Joi from 'joi'

import { enumValue, emailRegexp } from '../helpers/schemeSettings.js'

export const registerSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
})

export const EmailVerifySchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
})

export const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
})

export const subscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...enumValue)
    .required(),
})

export const passwordSchema = Joi.object({
  currentPassword: Joi.string(),
  newPassword: Joi.string().min(6).required(),
})
