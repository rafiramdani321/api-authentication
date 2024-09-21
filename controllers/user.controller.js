import Users from "../models/users.model.js";

export const getUsers = async (req, res) => {
  try {
    const data = await Users.find({}).select('username email roleId dateCreated').populate('roleId')
    return res.status(200).json({ status: true, data })
  } catch (error) {
    console.log(error)
  }
}

export const getProfile = async (req, res) => {
  try {
    const refresToken = req.cookies.refreshToken
    if (!refresToken) return res.sendStatus(401)

    const data = await Users.findOne({ refresh_token: refresToken }).select('username email dateCreated')
    if (!data) return res.sendStatus(204)

    return res.status(200).json({ status: true, data })
  } catch (error) {
    console.log(error)
  }
}