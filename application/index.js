const express = require('express')
const fs = require('fs')
const path = require('path')

const application = express()
let dot = require('../data/index.json')
let raw = fs.readFileSync(path.join(__dirname, '../data/index.json'))
setInterval(() => {
  dot = require('../data/index.json')
  raw = fs.readFileSync(path.join(__dirname, '../data/index.json'))
}, 2500)

application.use('/', express.static(path.join(__dirname, '../documentations')))
application.listen(80, () => {
  console.log('Application is listening at 80')
})
application.get('/', (request, response) => {
  response.sendfile('index.html')
})

application.get('/read', (request, response) => {
  response.json(dot)
})
application.get('/get/:name', (request, response) => {
  let toGet = dot[request.params.name]
  response.send('{ "' + request.params.name + '": "' + toGet + '" }')
})
application.get('/set/:name/:value', (request, response) => {
  dot[request.params.name] = { value: request.params.value }
  fs.writeFile(path.join(__dirname, '../data/index.json'), JSON.stringify(dot), (error) => {
    if (error) { console.error(error); return }
    response.send('Writted to endpoint')
  })
})
application.get('/delete/:name', (request, response) => {
  dot[request.params.name] = undefined
  fs.writeFile(path.join(__dirname, '../data/index.json'), JSON.stringify(dot), (error) => {
    if (error) { console.log(error); return }
    response.send('Writted to endpoint')
  })
})
