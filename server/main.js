const express = require('express')
const http = require('http')
const cors = require('cors')
const helmet = require('helmet')
const { Server } = require('socket.io')

// Init express app
const app = express()
const port = 5000
const httpServer = http.createServer(app)

// Middlewares
app.use(cors())
app.use(helmet())

// New IO Server
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

// Socket IO Connection
io.on('connection', socket => {
  console.log(`User Connected: ${socket.id}`)

  socket.on('join_room', data => {
    socket.join(data)
    console.log(`User with ID: ${socket.id} joined room: ${data}`)
  })

  socket.on('send_message', data => {
    socket.to(data.room).emit('receive_message', data)
  })

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id)
  })
})

// Server Listening
httpServer.listen(port, err => {
  if (err) console.log(err)
  console.log(`server started at port ${port}`)
  console.log(`app running here -> http://localhost:${port}`)
})
