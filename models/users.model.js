import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String, required: true, unique: true
  },
  email: {
    type: String, required: true
  },
  password: {
    type: String, required: true
  },
  verified: {
    type: Boolean, default: false
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'role',
    required: true
  },
  refresh_token: {
    type: String,
    default: null
  },
  dateCreated: {
    type: Date, default: Date.now()
  }
})

const Users = mongoose.model('user', userSchema)
export default Users