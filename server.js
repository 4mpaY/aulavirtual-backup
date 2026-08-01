const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error handling', req.url, err)
      res.statusCode = 500
      res.end('Internal Server Error')
    }
  })

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL || '*',
      methods: ['GET', 'POST']
    }
  })

  // Exponer io para que los API routes lo usen (mismo proceso Node.js)
  global._socketIO = io

  io.on('connection', socket => {
    // El cliente se une a su sala personal para recibir notificaciones
    socket.on('join_user', userId => {
      socket.join(`usuario:${userId}`)
    })

    // El cliente se une a una sala de conversación para recibir mensajes
    socket.on('join_conversation', conversacionId => {
      socket.join(`conversacion:${conversacionId}`)
    })

    // El cliente sale de la sala al cerrar la conversación
    socket.on('leave_conversation', conversacionId => {
      socket.leave(`conversacion:${conversacionId}`)
    })
  })

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
