import Users from "../models/users.model.js";
import jwt from 'jsonwebtoken'

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) return res.sendStatus(204)
  const user = await Users.findOne({ refresh_token: refreshToken })
  if (!user) return res.sendStatus(401)
  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err) return res.sendStatus(403)
      const data = { userId: decoded.userId, username: decoded.username, email: decoded.email, role: decoded.roleId.roleName, }
      const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN, { expiresIn: '15s' })
      res.json({ accessToken })
    })
  } catch (error) { console.log(error) }
}