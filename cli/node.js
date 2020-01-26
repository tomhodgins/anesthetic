#!/usr/bin/env node
const fs = require('fs')
const anesthetic = require('../index.cjs.js')

const file = process.argv.slice(2)[0]
let css

try {
  css = fs.readFileSync(file).toString()
} catch (error) {
  css = file
}

console.log(
  anesthetic(css)
)