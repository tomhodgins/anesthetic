const parseCSS = require('./lib/parse-css/index.cjs.js')

module.exports = function expandNestedStylesheet(string, propertyName = '-') {
  const output = []

  const stringify = (list = [], joiner = '') => list
    .map(token => token.toSource())
    .join(joiner)

  function expandNestedRule(rule) {
    const output = []
    const declarations = parseCSS.parseAListOfDeclarations(
      stringify(rule.value.value)
    )

    if (declarations.length) {
      const filteredDeclarations = declarations.filter(({name}) =>
        name.startsWith(`--${propertyName}`) === false
      )

      if (filteredDeclarations.length) {
        output.push(
          parseCSS.parseARule(`
            ${stringify(rule.prelude)} {
              ${stringify(filteredDeclarations, ';')}
            }
          `)
        )
      }

      // Process nested properties
      declarations.forEach(declaration => {
        if (declaration.name.startsWith(`--${propertyName}`)) {
          output.push(
            ...expandNestedRule(
              parseCSS.parseARule(
                parseCSS.parseACommaSeparatedListOfComponentValues(
                  stringify(rule.prelude).trim()
                ).map(splitSelector =>
                  parseCSS.parseACommaSeparatedListOfComponentValues(
                    declaration.name.slice(2 + propertyName.length)
                  ).map(selector => stringify(splitSelector) + stringify(selector)).join(', ')
                ).join(', ')
                + stringify(declaration.value)
              )
            )
          )
        }
      })
    } else {
      output.push(rule)
    }

    return output
  }

  function expandNestedAtRule(rule) {
    if (
      rule.value
      && rule.value.value
    ) {
      const output = []
      const firstColon = rule.value.value.findIndex(({tokenType}) => tokenType === ':')
      const firstAt = rule.value.value.findIndex(({tokenType}) => tokenType === 'AT-KEYWORD')
      const firstBlock = rule.value.value.findIndex(({type}) => type === 'BLOCK')
      let rules = []

      if (
        [firstAt, firstColon].every(index => index < firstBlock)
      ) {
        rules = parseCSS.parseAListOfRules(
          stringify(rule.value.value)
        )
      }

      if (rules.length) {
        rules.forEach(child => {
          output.push(
            expandNestedStylesheet(child.toSource())
          )
        })

        rule.value.value = parseCSS.parseAListOfComponentValues(
          output.join('\n')
        )
      }
    }

    return rule
  }

  // Process rules in stylesheet
  parseCSS.parseAStylesheet(string).value.forEach(rule => {
    if (rule.type === 'QUALIFIED-RULE') {
      output.push(...expandNestedRule(rule))
    }
    if (rule.type === 'AT-RULE') {
      output.push(expandNestedAtRule(rule))
    }
  })

  return stringify(output, '\n')
}