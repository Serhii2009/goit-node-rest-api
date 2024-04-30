import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import pug from 'pug'
import path from 'path'
import { convert } from 'html-to-text'

dotenv.config()

const { META_PASSWORD } = process.env

const config = {
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: 'serikkravchenko@ukr.net',
    pass: META_PASSWORD,
  },
}

const transporter = nodemailer.createTransport(config)

export const sendEmail = async (data, url) => {
  const html = pug.renderFile(path.join(process.cwd(), 'views', 'emails.pug'), {
    url: url,
  })
  const email = {
    ...data,
    from: 'serikkravchenko@ukr.net',
    html,
    text: convert(html),
  }
  await transporter.sendMail(email)
  return true
}
