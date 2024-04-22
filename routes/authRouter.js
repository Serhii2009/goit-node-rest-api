import express from "express";

import { validateBody } from "../middlewares/validateBody.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";
import { cntrlWrapper } from "../helpers/cntrlWrapper.js";

import {
  registerSchema,
  loginSchema,
  subscriptionSchema,
} from "../schemas/userSchemas.js";
import {
  register,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
} from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  cntrlWrapper(register)
);

authRouter.post("/login", validateBody(loginSchema), cntrlWrapper(login));

authRouter.get("/current", authenticate, cntrlWrapper(getCurrent));

authRouter.post("/logout", authenticate, cntrlWrapper(logout));

authRouter.patch(
  "/",
  authenticate,
  validateBody(subscriptionSchema),
  cntrlWrapper(updateSubscription)
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  cntrlWrapper(updateAvatar)
);

export default authRouter;
