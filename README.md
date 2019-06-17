# gatsby-remark-use-frontmatter-path

If your markdown files have frontmatter `path` param then with this plugin you obtain converted links in your Gatsby pages.

So in GitHub you keep normal links between md files. And in Gatsby you will have `path` links.

## Example

For example, given the following project directory structure:

```text
./docs/
├── article.md
├── notes/
├──── copyright.md
```

./article.md

```text
---
title: 'My article'
path: '/my_article'
---

Some text with [link](./notes/copyright.md)
```

./notes/copyright.md

```text
---
title: 'My article'
path: '/copyright'
---

Read main [article](../article.md)
```

With this plugin all relative links will be transformed to:

```diff
// in ./article.md
- Some text with [link](./notes/copyright.md)
+ Some text with [link](/copyright)

// in ./notes/copyright.md
- Read main [article](../article.md)
+ Read main [article](/my_article)
```

## Install

`npm install --save gatsby-remark-use-frontmatter-path`

## How to use

```js
// In your gatsby-config.js
plugins: [
  {
    resolve: 'gatsby-transformer-remark',
    options: {
      plugins: ['gatsby-remark-use-frontmatter-path'],
    },
  },
];
```
