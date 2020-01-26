import anesthetic from '../index.js'

let file = Deno.args.slice(1)[0]
let css = file

try {
  css = new TextDecoder('utf-8').decode(
    Deno.readFileSync(file)
  )
} catch (error) {}

console.log(
  anesthetic(css)
)