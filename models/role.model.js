import mongoose from "mongoose";

const roleSchema = mongoose.Schema({
  roleName: {
    type: String, required: true, unique: true
  },
  description: {
    type: String, default: null
  }
})

const Role = mongoose.model('role', roleSchema)
export default Role