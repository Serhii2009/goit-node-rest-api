import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import gravatar from 'gravatar'
import Jimp from 'jimp'
import path from 'path'
import { promises as fs } from 'fs'
import { nanoid } from 'nanoid'

import HttpError from '../helpers/HttpError.js'
import { sendEmail } from '../helpers/sendEmail.js'
import { User } from '../models/userModel.js'
import { log } from 'console'

const avatarsDir = path.resolve('public', 'avatars')

export const register = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user) {
    throw HttpError(409, 'Email in use')
  }

  const hashPassword = await bcrypt.hash(password, 10)
  const avatarURL = gravatar.url(email)
  const verificationToken = nanoid()

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  })

  const { BASE_URL } = process.env
  const url = `${BASE_URL}/users/verify/${verificationToken}`
  const verifyEmail = {
    to: email,
    subject: 'Verify email',
  }
  await sendEmail(verifyEmail, url)

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  })
}

export const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params
  const user = await User.findOne({ verificationToken })
  if (!user) {
    throw HttpError(404, 'User not found')
  }
  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  })
  res.status(200).json({
    message: 'Verification successful',
  })
}

export const resendVerifyEmail = async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    throw HttpError(401, 'Email not found')
  }
  if (user.verify) {
    throw HttpError(400, 'Verification has already been passed')
  }
  const { BASE_URL } = process.env
  const url = `${BASE_URL}/users/verify/${user.verificationToken}`
  const verifyEmail = {
    to: email,
    subject: 'Verify email',
  }
  await sendEmail(verifyEmail, url)

  res.status(200).json({
    message: 'Verification email sent',
  })
}

export const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    throw HttpError(401, 'Email or password is wrong')
  }

  if (!user.verify) {
    throw HttpError(401, 'Email not verified')
  }

  const passwordCompare = await bcrypt.compare(password, user.password)
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong')
  }

  const payload = {
    id: user._id,
  }
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '23h' })
  await User.findByIdAndUpdate(user._id, { token })

  res.status(200).json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  })
}

export const getCurrent = async (req, res) => {
  const { email, subscription } = req.user
  res.status(200).json({
    email,
    subscription,
  })
}

export const logout = async (req, res) => {
  const { _id } = req.user
  await User.findByIdAndUpdate(_id, { token: '' })
  res.status(204).json()
}

export const updateSubscription = async (req, res) => {
  const { _id } = req.user

  const result = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
    select: 'email subscription',
  })
  if (!result) {
    throw HttpError(404, 'Not found')
  }
  res.status(200).json(result)
}

export const updateAvatar = async (req, res) => {
  const { _id } = req.user
  const { path: tempUpload, originalname } = req.file
  const fileName = `${_id}_${originalname}`
  const resultUpload = path.join(avatarsDir, fileName)

  Jimp.read(tempUpload, (error, image) => {
    if (error) throw HttpError(404, error.message)
    image.resize(250, 250).writeAsync(resultUpload)
  })

  await fs.rename(tempUpload, resultUpload)

  const avatarURL = path.join('avatars', fileName)
  await User.findByIdAndUpdate(_id, { avatarURL })

  res.status(200).json({
    avatarURL,
  })
}

export const checkAndUpdatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const { _id } = req.user

  const currentUser = await User.findById(_id)
  const passwordIsValid = await bcrypt.compare(
    currentPassword,
    currentUser.password
  )
  if (!passwordIsValid) {
    throw HttpError(401, 'Current password invalid')
  }

  const hashNewPassword = await bcrypt.hash(newPassword, 10)
  const password = (currentUser.password = hashNewPassword)
  await User.findByIdAndUpdate(_id, { password })

  res.status(200).json({
    message: 'Password updated successfully',
    user: {
      email: currentUser.email,
      subscription: currentUser.subscription,
    },
  })
}
