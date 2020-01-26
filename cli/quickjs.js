import {open} from 'std'
import anesthetic from '../index.js'

const file = scriptArgs[1]
let css

try {
  css = open(file, ['r']).readAsString()
} catch (error) {
  css = file
}

if (css.length) {
  console.log(
    anesthetic(css)
  )
}