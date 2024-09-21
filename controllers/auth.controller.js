import Users from "../models/users.model.js";
import Role from "../models/role.model.js";
import Tokens from "../models/token.model.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { sendMail } from '../config/VerifyEmail.js'
dotenv.config()

export const Register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body

    const duplicateUsername = await Users.findOne({ username: { $regex: new RegExp('^' + username + '$', 'i') } })
    if (duplicateUsername) return res.status(400).json({ status: false, msg: 'Username sudah digunakan!', error: 'username' })

    const duplicateEmail = await Users.findOne({ email })
    if (duplicateEmail) return res.status(400).json({ status: false, msg: 'Email sudah terdaftar!', error: 'email' })

    if (password !== confirmPassword) return res.status(400).json({ status: false, msg: 'Konfirmasi password tidak sama', error: 'confirmPassword' })

    const hashPassword = await bcrypt.hash(password, 10)

    const role = await Role.findOne({ roleName: 'user' })
    if (!role) return res.status(401).json({ status: false, msg: 'Internal Server Error' })

    const user = await new Users({ username, email, password: hashPassword, roleId: role._id }).save()

    const tokenExp = Date.now() + 3600000
    const userToken = await new Tokens({ userId: user._id, token: crypto.randomBytes(32).toString('hex'), verifyExp: tokenExp }).save()

    const message = `Verifikasi akun anda : ${process.env.BASE_URL}/api/auth/user/verify/${user._id}/${userToken.token}`
    await sendMail(user.email, 'Verifikasi account : ', message)

    return res.status(200).json({ status: true, msg: 'Registrasi berhasil, cek email untuk verifikasi!' })
  } catch (error) {
    console.log(error)
  }
}

export const verifyEmail = async (req, res) => {
  try {
    const users = await Users.findOne({ _id: req.params.id })
    const tokens = await Tokens.findOne({ userId: req.params.id, token: req.params.token })

    if (!users) return res.status(400).json({ msg: 'invalid link', status: false })
    if (!tokens) return res.status(400).json({ msg: 'invalid link', status: false })

    if (tokens.verifyExp < Date.now()) {
      await Tokens.findOneAndRemove({ userId: req.params.id, token: req.params.token })
      await Users.findOneAndRemove({ _id: req.params.id })
      return res.status(400).json({ msg: 'Token expired, silahkan registrasi ulang!', status: false })
    }

    await Users.updateOne({ _id: req.params.id }, { $set: { verified: true } })
    await Tokens.findOneAndRemove({ userId: req.params.id, token: req.params.token })

    return res.status(200).json({ msg: 'Akun telah terverifikasi, silahkan login', status: true })
  } catch (error) { return res.status(400).json({ msg: 'invalid link', status: false }) }
}

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await Users.findOne({ email }).populate('roleId')
    if (!user) return res.status(400).json({ status: false, msg: 'email / password salah!' })

    const matchPassword = await bcrypt.compare(password, user.password)
    if (!matchPassword) return res.status(400).json({ status: false, msg: 'email / password salah!' })

    const verify = await Users.findOne({ _id: user._id, verified: true })
    if (!verify) return res.status(400).json({ status: false, msg: 'Akun anda belum terverifikasi, cek email anda!' })

    const data = {
      userId: user._id,
      username: user.username,
      email: user.email,
      roleId: user.roleId
    }

    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN, { expiresIn: '15s' })
    const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN, { expiresIn: '1d' })

    await Users.updateMany({ _id: data.userId }, { $set: { refresh_token: refreshToken } })

    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    res.status(200).json({ status: true, accessToken })
  } catch (error) {
    console.log(error)
  }
}

export const Logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(401)

    const user = await Users.findOne({ refresh_token: refreshToken })
    if (!user) return res.sendStatus(204)

    await Users.updateMany({ _id: user._id }, { $set: { refresh_token: null } })
    res.clearCookie('refreshToken')
    return res.status(200).json({ status: true, msg: 'Logout berhasil!' })
  } catch (error) {
    console.log(error)
  }
}