const serverHandle = require('../app')
const http = require('http')

const PORT = process.env.PORT || 3000

const server = http.createServer(serverHandle)
server.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`)
})
