import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import authRoute from './routes/auth.js'
import citiesRoute from './routes/cities.js'
import countriesRoute from './routes/countries.js'
import toursRoute from './routes/tours.js'
import usersRoute from './routes/users.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO)
    console.log('connected to mongodb')
  } catch (err) {
    throw err
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('mongo disconnected!')
})

// Middleware
app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use('/api/auth', authRoute)
app.use('/api/countries', countriesRoute)
app.use('/api/cities', citiesRoute)
app.use('/api/tours', toursRoute)
app.use('/api/users', usersRoute)

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500
  const errorMessage = err.message || 'Something went wrong'
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  })
})

const PORT = 8080 || process.env.PORT

app.listen(PORT, () => {
  connect()
  console.log(`Listening to app on port http://localhost:${PORT}`)
})
