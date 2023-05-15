import { BlogTag } from "../models/blog-tag"
import { dataSource } from '@medusajs/medusa/dist/loaders/database'

export const BlogTagRepository = dataSource.getRepository(BlogTag)