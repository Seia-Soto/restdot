const express = require('express')
const fs = require('fs')
const path = require('path')

const application = express()
const port = 3001
let dot = require('../data/index.json')
let raw = fs.readFileSync(path.join(__dirname, '../data/index.json'))

setInterval(() => {
  dot = require('../data/index.json')
  raw = fs.readFileSync(path.join(__dirname, '../data/index.json'))
}, 2500)

application.use('/', express.static(path.join(__dirname, '../documentations')))
application.listen(port, () => {
  console.log('Application is listening at 3001')
})
application.get((request, response) => {
  response.redirect('/')
})
application.get('/', (request, response) => {
  response.sendfile('index.html')
})

application.get('/read', (request, response) => {
  response.json(dot)
})
application.get('/get/:name', (request, response) => {
  const toGet = dot[request.params.name].value
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
application.get('/search/:name', (request, response) => {
  const keyword = request.params.name
  const sets = Object.values(dot)

  response.send(`{"matched": "${sets[sets.indexOf(keyword)]}"}`)
})
