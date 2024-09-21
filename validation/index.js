import { validationResult, check, body } from 'express-validator'

// Errors validator
export const validation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) { return res.status(400).json({ status: false, msg: errors.array()[0].msg }) }
  next()
}

// Register Validation
export const RegisterValidation = [
  check('username', 'Username tidak boleh kosong!').notEmpty()
    .isLength({ min: 4 }).withMessage('panjang username minimal harus 4 karakter'),
  check('email', 'Email tidak boleh kosong!').notEmpty()
    .isEmail().withMessage('Email tidak valid!'),
  check('password', 'Password tidak boleh kosong!').notEmpty()
    .isLength({ min: 6 }).withMessage('panjang password minimal harus 6 karakter')
    .matches(/\d/).withMessage('gunakan kombinasi angka untuk password')
]

export const LoginValidation = [
  check('email', 'Email tidak boleh kosong!').notEmpty(), check('password', 'Password tidak boleh kosong!').notEmpty()
]