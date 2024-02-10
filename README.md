# Zooper

Zooper is a beautiful personal portfolio template for developers, programmers, freelancers and designers.

![Zooper template home preview](https://zooper.pages.dev/preview.jpg)


## Features

Full features blog 📝.
CMS ready 🚀.
Super fast ⚡.
SEO friendly 📈.
Fully responsive 📱.
Dark mode 🌗.
Syntax highlighting 🌈.
Social media links 🔗.
Code preview playground 🎮.
Uses page 🧑‍💻
Bookmarks 📑.

## Roadmap

Comments
Tags
Categories
Pagination
Sitemap
RSS feeds
Search
Likes

## Tech Stack

1. Nuxt JS
2. Tailwind CSS
3. Vue
4. Nuxt Content Module
5. Shiki JS ES

## Installation

1. `git clone` this repo or click on `Use this template` button.
2. `cd` into the project directory.
3. Run `yarn install` to install the dependencies.
4. Run `yarn dev` to start the development server.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


handleDragEnd() {
  
   const futureItem = pictures.value[futureIndex.value]
      const movingItem =
pictures.value[movingIndex.value]
      const _items = Object.assign([], pictures.value)
      _items[futureIndex.value] = movingItem
      _items[movingIndex.value] = futureItem

      pictures.value= _items
    },

const movingIndex = ref(0)
const futureIndex = ref(0)

 const  handleMove = e => {
      const { index, futureIndex } = e.draggedContext
      movingIndex.value= index
      futureIndex.value = futureIndex
      return false // disable sort
    }
