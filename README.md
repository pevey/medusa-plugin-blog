# medusa-plugin-blog

Provides a basic blog backend for Medusa. 

[Documentation](https://pevey.com/medusa-plugin-blog)

If you are not familiar with Medusa, you can learn more on [the project web site](https://www.medusajs.com/).

> Medusa is a set of commerce modules and tools that allow you to build rich, reliable, and performant commerce applications without reinventing core commerce logic. The modules can be customized and used to build advanced ecommerce stores, marketplaces, or any product that needs foundational commerce primitives. All modules are open-source and freely available on npm.

### This plugin is under development and should be considered experimental.

Breaking changes are very likely to occur.

## Features

- Posts can be tagged with products, collections, and/or custom tag values. 
- Posts can be queried by tag, category, product, or collection.  

## Installation

```bash
yarn add medusa-plugin-blog
```

## Configuration

```bash
const plugins = [
  `medusa-plugin-blog`,
  ...
]
```

## API Endpoints

### `GET /store/blog/posts`
return jsons object containing an array of all blog post objects

### `GET /store/blog/posts/:handle`
return json object containing a single blog post object

### `GET /store/blog/categories`
return json object containing an array of all blog category objects

### `GET /store/blog/categories/:handle`
return json object containing a single blog category object

### `GET /store/blog/categories/:handle/posts`
return json object containing an array of all blog post objects for a given category

### `GET /store/blog/tags`
return json object containing an array of all blog tag objects

### `GET /store/blog/tags/posts`
return json object containing an array of all blog post objects for a given tag or array of tags
Example: `/store/blog/tags/posts?tag=tag1&tag=tag2&tag=tag3` etc

### `GET /store/blog/products/:id`
return json object containing an array of all blog post objects for a product with given id

### `GET /store/blog/collections/:id`
return json object containing an array of all blog post objects for a collection with given id

### `POST /admin/blog/categories`
create a new blog category object
Expects body with:
```js
{
   handle: string!,
   title: string!,
   description: string,
   keywords: string[],
   metadata: jsonb
}
```

### `POST /admin/blog/categories/:id`
update an existing blog category object with given id
Expects body with:
```js
{
   handle: string!,
   title: string!,
   description: string,
   keywords: string[],
   metadata: jsonb
}
```

### `DELETE /admin/blog/categories/:id`
delete an existing blog category object with given id

### `POST /admin/blog/posts`
create a new blog post object
Expects body with:
```js
{
   handle: string!,
   title: string!,
   author: string,
   published: boolean,
   content: string,
   description: string,
   keywords: string[],
   category_id: string,
   tag_ids: string[],
   product_ids: string[],
   collection_ids: string[],
   metadata: jsonb
}
```

### `POST /admin/blog/posts/:id`
update an existing blog post object with given id
Expects body with:
```js
{
   handle: string!,
   title: string!,
   author: string,
   published: boolean,
   content: string,
   description: string,
   keywords: string[],
   category_id: string,
   tag_ids: string[],
   product_ids: string[],
   collection_ids: string[],
   metadata: jsonb
}
```

### `DELETE /admin/blog/posts/:id`
delete an existing blog post object with given id

### `POST /admin/blog/tags`
create a new blog tag object
Expects body with:
```js
{
   value: string!
}
```

### `POST /admin/blog/tags/:id`
update an existing blog tag object with given id
Expects body with:
```js
{
   value: string!
}
```

### `DELETE /admin/blog/tags/:id`
delete an existing blog tag object with given id

## Objects

### BlogPost

```js
{
   id: string!,
   handle: string!,
   title: string!,
   author: string,
   published: string!,
   content: string,
   description: string,
   keywords: string[],
   category_id: string,
   category: Category,
   tags: BlogTag[],
   products: Product[],
   collections: Collection[],
   metadata: jsonb,
   created_at: DateTime!,
   updated_at: DateTime!
}
```

### BlogTag

```js
{
   id: string!,
   value: string!
}
```

### BlogCategory

```js
{
   id: string!,
   handle: string!,
   title: string!,
   description: string,
   keywords: string[],
   metadata: jsonb,
   posts: BlogPost[]
}
```

### Product

Default Medusa Product object

### Collection

Default Medusa Collection object
