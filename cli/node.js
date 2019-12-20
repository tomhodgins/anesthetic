// node cli/node.js 'a { color: red; ---\ b: { color: green }; }'
// node cli/node.js path/to/stylesheet.css
const expandNestedStylesheet = require('../index.cjs.js')
const fs = require('fs')

let file = process.argv.slice(2)[0]
let css = file

if (fs.existsSync(file)) {
  css = fs.readFileSync(file).toString()
}

console.log(
  expandNestedStylesheet(css)
)