# a{nest}hetic

Nest CSS rules inside custom properties

## About

Anesthetic is a small tool that does one thing - allows CSS authors to nest CSS rules inside other CSS rules in a way that meets the following criteria:

1. 100% valid CSS syntax
2. Works in browsers today
3. No conflict with native CSS nesting syntax
4. Future-proof

## How does it work?

The technique is to put the declaration list for the rule you would like to nest as the value of a custom property, and to name the custom property in a special way. Here's how we'll think about the naming of these properties

```ebnf
"--" <custom-name> <selector> ":" <block> [ ";" ]
```

- every custom property starts with a double dash `--`
- `<custom-name>` is part of a valid CSS property name you choose to namespace your nested rules and keep them easily identifiable amongst all your custom properties
- `selector` is a CSS selector list, with any special characters escaped by a backslash `\`
- `<block>` is a `{`-block containing the declaration list of the nested rule.
- `;` semicolon is the delimiter that is required to separate multiple properties in a declaration list

Here's an example using `-` as the custom name:

```css
/* nested */
a {
  color: red;
  ---\ b: {
    color: blue;
  };
}

/* expanded */
a {
  color: red;
}
a b {
  color: blue;
}
```

Here in this example, the first part of the custom property `---\ b` made up of the first two dashes plus our custom name (`-`) is replaced by the selector of the original rule, so `---\ b` becomes `a b`.

If you work with a different custom name, like `nest-`, you can process the same rules written like this:

```css
a {
  color: red;
  --nest-\ b: {
    color: blue;
  };
}
```

## Usage

This package is available on [npm](http://npmjs.com/package/anesthetic) and is delivered in two formats:

- [index.cjs.js](./index.cjs.js) is a CommonJS module for use with Node and CommonJS bundlers
- [index.js](./index.js) is an ES module for use with Deno, browsers, and ES module bundlers

Below are some of the ways you can consume and use this package.

### Using anesthetic via npx without installing anything

```bash
$ npx anesthetic 'a { color: red; ---\ b: { color: blue; }; }'
```

```bash
$ npx anesthetic path/to/stylesheet.css
```

### Using as an ES module with Deno or a browser

```js
import anesthetic from 'https://unpkg.com/anesthetic'

console.log(
  anesthetic(`
    a {
      color: red;
      ---\\ b: {
        color: blue;
      };
    }
  `)
)
```

## Using as a CommonJS module with Node

```js
const anesthetic = require('anesthetic/index.cjs.js')

console.log(
  anesthetic(`
    a {
      color: red;
      ---\\ b: {
        color: blue;
      };
    }
  `)
)
```

### Command-line usage with Node or Deno

#### Expanding a string

To expand a string, supply a string to the CLI script as the first argument

```bash
$ node cli/node.js 'a { color: red; ---\ b: { color: blue; }; }'
```

```bash
$ deno cli/deno.js 'a { color: red; ---\ b: { color: blue; }; }'
```

#### Expanding a file

To expand a stylesheet, supply a pathname to the CLI script as the first argument:

```bash
$ node cli/node.js path/to/stylesheet.css
```

```bash
$ deno --allow-read cli/deno.js path/to/stylesheet.css
```

> You can run `npm link` if you want to use `cli/node.js` on your system as the command `anesthetic`

## Options

```js
anesthetic(string, propertyName)
```

- `string` is a string containing a CSS stylesheet to expand
- `propertyName` is a part of a custom property name to namespace your nested rules. The default value if omitted is `-`.

## Examples

### Nesting rules

```css
/* nested */
a {
  color: red;
  ---\ b: {
    color: green;
    ---\ c: {
      color: blue;
    };
  };
}

/* expanded */
a {
  color: red;
}
a b {
  color: green;
}
a b c {
  color: blue;
}
```

## Using selector lists

```css
/* nested */
a, b, c {
  ---\ d\,\ e\,\ f: {
    color: lime;
  };
}

/* expanded */
a d,
a e,
a f,
b d,
b e,
b f,
c d,
c e,
c f {
  color: lime;
}
```

To see more demos, check out the tests in [examples/][./examples/]

## More Info

- [Anesthetic REPL](https://tomhodgins.com/demo/nesting/)
- [CSS Nesting Specification [draft]](https://drafts.csswg.org/css-nesting-1/)
- [CSS Syntax Specification](https://drafts.csswg.org/css-syntax-3/)
- [Tab's standards-based CSS parser](https://github.com/tabatkins/parse-css)
