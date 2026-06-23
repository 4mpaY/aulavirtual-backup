import type { Server } from 'socket.io'

// Singleton accesible desde los API routes (mismo proceso Node.js que server.js)
declare global {
  // eslint-disable-next-line no-var
  var _socketIO: Server | undefined
}

export function getIO(): Server | undefined {
  return global._socketIO
}

export function setIO(io: Server): void {
  global._socketIO = io
}
