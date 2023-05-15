import { BlogCategory } from "../models/blog-category"
import { dataSource } from '@medusajs/medusa/dist/loaders/database'

export const BlogCategoryRepository = dataSource.getRepository(BlogCategory)