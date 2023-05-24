// const http = require('http')
// const hostname = '127.0.0.1'
// const PORT = 3001

// const app = http.createServer((req, res) => {
//   res.statusCode = 200
//   res.setHeader('Content-Type', 'text/plain')
//   res.end('Hello World')
// })

// app.listen(PORT, hostname, () => {
//   console.log(`Server running at http://${hostname}:${PORT}/`)
// })

const express = require('express')
const app = express()

let users = [
  {
    id: 1,
    name: 'Daniel',
    career: 'Engineer',
  },
  {
    id: 2,
    name: 'Lizzie',
    career: 'Designer',
  },
]

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/users', (request, response) => {
  response.json(users)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

//1. Get all
app.get('/users', (req, res) => {
  res.json(users)
})

//2. Get one (by id)
app.get('/users/:id', (req, res, next) => {
  const { params = {} } = req
  const { id = '' } = params
  const user = users.find(function (element) {
    return parseInt(id, 0) === element.id
  })

  if (user) {
    res.json(user)
  } else {
    next({
      statusCode: 404,
      message: `User with id #${id}, Not Found`,
    })
  }
})

//3. Post (Se envía el body)
app.post('/users', (req, res) => {
  const { body } = req
  users.push(body)
  res.status(201).json(body)
})

//4. Put (Se envía el body)
app.put('/users/:id', (req, res) => {
  const { id } = req.params
  const { career } = req.body
  const user = users.find((user) => user.id === parseInt(id, 0))

  if (!user) {
    return res.status(404).json({ message: 'user not found' })
  }

  user.career = career
  res.json(user)
})

//5. Delete
app.delete('/users/:id', (req, res) => {
  const { id } = req.params
  const index = users.findIndex((user) => user.id === parseInt(id, 0))

  if (index === -1) {
    return res.status(404).json({ message: 'user not found' })
  } else {
    users.splice(index, 1)
    res.json({
      statusCode: 204,
      message: 'user succesfuly deleted',
    })
    // res.sendStatus(204)
  }
})

app.use((req, res, next) => {
  next({
    statusCode: 404,
    message: 'Route Not Found',
  })
})

app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Error' } = err
  res.status(statusCode)
  res.json({
    message,
  })
})
