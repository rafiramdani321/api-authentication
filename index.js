import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDb from './config/Database.js'
import cookieParser from 'cookie-parser'
import routerAuth from './routes/routes.auth.js'
import routerUser from './routes/routes.user.js'

const app = express()
dotenv.config()

connectDb().then(() => {
  console.log('Connected to database')
}).catch((error) => {
  console.log(`Error connecting to database : ${error}`)
})

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }))
app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser())

app.use('/api/auth', routerAuth)
app.use('/api/users', routerUser)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))