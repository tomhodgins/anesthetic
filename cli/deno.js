import anesthetic from '../index.js'

let file = Deno.args.slice(1)[0]
let css

try {
  css = new TextDecoder('utf-8').decode(
    Deno.readFileSync(file)
  )
} catch (error) {
  css = file
}

console.log(
  anesthetic(css)
)