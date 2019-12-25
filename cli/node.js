#!/usr/bin/env node

const anesthetic = require('../index.cjs.js')
const fs = require('fs')

let file = process.argv.slice(2)[0]
let css = file

if (fs.existsSync(file)) {
  css = fs.readFileSync(file).toString()
}

console.log(
  anesthetic(css)
)