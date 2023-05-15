import { BlogPost } from "../models/blog-post"
import { dataSource } from '@medusajs/medusa/dist/loaders/database'

export const BlogPostRepository = dataSource.getRepository(BlogPost)