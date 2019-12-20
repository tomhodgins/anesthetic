// deno cli/deno.js 'a { color: red; ---\ b: { color: green }; }'
// deno --allow-read cli/deno.js path/to/stylesheet.css

import expandNestedStylesheet from '../index.js'

let file = Deno.args.slice(1)[0]
let css = file

try {
  Deno.statSync(file)
  css = new TextDecoder('utf-8').decode(
    Deno.readFileSync(file)
  )
} catch (error) {}

console.log(
  expandNestedStylesheet(css)
)