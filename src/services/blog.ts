import { TransactionBaseService } from '@medusajs/utils'
import { ProductRepository } from '@medusajs/medusa/dist/repositories/product'
import { ProductCollectionRepository } from '@medusajs/medusa/dist/repositories/product-collection'
import { BlogCategoryRepository } from '../repositories/blog-category'
import { BlogPostRepository } from '../repositories/blog-post'
import { BlogTagRepository } from '../repositories/blog-tag'
import { ArrayContains, ArrayOverlap } from 'typeorm'

export default class BlogService extends TransactionBaseService {
	protected readonly productRepository_: typeof ProductRepository
	protected readonly productCollectionRepository_: typeof ProductCollectionRepository
	protected readonly blogCategoryRepository_: typeof BlogCategoryRepository
	protected readonly blogPostRepository_: typeof BlogPostRepository
	protected readonly blogTagRepository_: typeof BlogTagRepository

	constructor({ productRepository, productCollectionRepository, blogCategoryRepository, blogPostRepository, blogTagRepository }) {
		super(arguments[0])
		this.productRepository_ = productRepository
		this.productCollectionRepository_ = productCollectionRepository
		this.blogCategoryRepository_ = blogCategoryRepository
		this.blogPostRepository_ = blogPostRepository
		this.blogTagRepository_ = blogTagRepository
	}

	async getBlogCategories() {
		/* @ts-ignore */
		const blogCategoryRepository = this.activeManager_.withRepository(this.blogCategoryRepository_)
		return await blogCategoryRepository.find()
	}

	async getBlogCategory(id) {
		/* @ts-ignore */
		const blogCategoryRepository = this.activeManager_.withRepository(this.blogCategoryRepository_)
		return await blogCategoryRepository.findOne({
			where: { id }
		})
	}

	async getBlogCategoryByHandle(handle) {
		/* @ts-ignore */
		const blogCategoryRepository = this.activeManager_.withRepository(this.blogCategoryRepository_)
		return await blogCategoryRepository.findOne({
			where: { handle }
		})
	}

	async addBlogCategory (category) {
		const { handle, title, description, keywords, metadata } = category
		if (!handle || !title) throw new Error("Adding a blog category requires a unique handle and a title")
		/* @ts-ignore */
		const blogCategoryRepository = this.activeManager_.withRepository(this.blogCategoryRepository_)
		const createdCategory = blogCategoryRepository.create({
			handle,
			title,
			description,
			keywords,
			metadata
		})
		const blogCategory = await blogCategoryRepository.save(createdCategory)
		return blogCategory
	}

	async updateBlogCategory (id, category) {
		const { handle, title, description, keywords, metadata } = category
		if (!id || !title || !title) throw new Error("Updating a blog category requires an id, a unique handle, and a title")
		/* @ts-ignore */
		const blogCategoryRepository = this.activeManager_.withRepository(this.blogCategoryRepository_)
		const blogCategory = blogCategoryRepository.update(id, {
			handle,
			title,
			description,
			keywords,
			metadata
		})
		return blogCategory
	}

	async deleteBlogCategory(id) {
		if (!id) throw new Error("Deleting a blog category requires an id")
		/* @ts-ignore */
		const blogCategoryRepository = this.activeManager_.withRepository(this.blogCategoryRepository_)
		return await blogCategoryRepository.delete(id)
	}

	async getBlogPosts() {
		/* @ts-ignore */
		const blogPostRepository = this.activeManager_.withRepository(this.blogPostRepository_)
		return await blogPostRepository.find({
			relations: {
				category: true,
				tags: true,
				products: true,
				collections: true
			}
		})
	}

	async getBlogPostsByCategory(category_id) {
		/* @ts-ignore */
		const blogPostRepository = this.activeManager_.withRepository(this.blogPostRepository_)
		return await blogPostRepository.find({
			relations: {
				category: true,
				tags: true,
				products: true,
				collections: true
			},
			where: { category_id }
		})
	}

	async getBlogPostsByCategoryHandle(handle) {
		/* @ts-ignore */
		const blogPostRepository = this.activeManager_.withRepository(this.blogPostRepository_)
		return await blogPostRepository.find({
			relations: {
				category: true,
				tags: true,
				products: true,
				collections: true
			},
			where: { category: { handle } }
		})
	}
	
	async getBlogPostsByTag(tag_id) {
		/* @ts-ignore */
		const blogPostRepository = this.activeManager_.withRepository(this.blogPostRepository_)
		return await blogPostRepository.find({
			relations: {
				category: true,
				tags: true,
				products: true,
				collections: true
			},
			where: {
				tags: ArrayContains(tag_id)
			}
		})
	}

	async getBlogPostsAllTags(tag_ids) {
		/* @ts-ignore */
		const blogPostRepository = this.activeManager_.withRepository(this.blogPostRepository_)
		return await blogPostRepository.find({
			relations: {
				category: true,
				tags: true,
				products: true,
				collections: true
			},
			where: {
				tags: ArrayOverlap(tag_ids)
			}
		})
	}
	
	async getBlogPostsByProduct(product_id) {
		/* @ts-ignore */
		const blogPostRepository = this.activeManager_.withRepository(this.blogPostRepository_)
		return await blogPostRepository.find({
			relations: {
				category: true,
				tags: true,
				products: true,
				collections: true
			},
			where: { 
				products: ArrayContains(product_id) 
			}
		})
	}

	async getBlogPostsByCollection(collection_id) {
		/* @ts-ignore */
		const blogPostRepository = this.activeManager_.withRepository(this.blogPostRepository_)
		return await blogPostRepository.find({
			relations: {
				category: true,
				tags: true,
				products: true,
				collections: true
			},
			where: {
				collections: ArrayContains(collection_id)
			}
		})
	}
	

	async getBlogPost(id) {
		/* @ts-ignore */
		const blogPostRepository = this.activeManager_.withRepository(this.blogPostRepository_)
		return await blogPostRepository.findOne({
			relations: {
				category: true,
				tags: true,
				products: true,
				collections: true
			},
			where: { id }
		})
	}

	async getBlogPostByHandle(handle) {
		/* @ts-ignore */
		const blogPostRepository = this.activeManager_.withRepository(this.blogPostRepository_)
		return await blogPostRepository.findOne({
			relations: {
				category: true,
				tags: true,
				products: true,
				collections: true
			},
			where: { handle }
		})
	}

	async addBlogPost(post) {
		const { handle, title, author, published, content, description, keywords, category_id, tag_ids, product_ids, collection_ids, metadata } = post
		if (!handle || !title) throw new Error("Adding a blog post requires a unique handle and a title")
		let tags = []
		if (tag_ids) {
			/* @ts-ignore */
			const blogTagRepository = this.activeManager_.withRepository(this.blogTagRepository_)
			for (const tag_id of tag_ids) {
				const tag = await blogTagRepository.findOne({ where: { id: tag_id } })
				if (tag) {
					tags.push(tag)
				}
			}
		}
		let products = []
		if (product_ids) {
			/* @ts-ignore */
			const productRepository = this.activeManager_.withRepository(this.productRepository_)
			for (const product_id of product_ids) {
				const product = await productRepository.findOne({ where: { id: product_id } })
				if (product) {
					products.push(product)
				}
			}
		}
		let collections = []
		if (collection_ids) {
			/* @ts-ignore */
			const productCollectionRepository = this.activeManager_.withRepository(this.productCollectionRepository_)
			for (const collection_id of collection_ids) {
				const collection = await productCollectionRepository.findOne({ where: { id: collection_id } })
				if (collection) {
					collections.push(collection)
				}
			}
		}
		/* @ts-ignore */
		const blogPostRepository = this.activeManager_.withRepository(this.blogPostRepository_)
		const createdPost = blogPostRepository.create({
			handle,
			title,
			author,
			published,
			content,
			description,
			keywords,
			category_id,
			tags,
			products,
			collections,
			metadata
		})
		const blogPost = await blogPostRepository.save(createdPost)
		return blogPost
	}
	
	async updateBlogPost(id, post) {
		const { handle, title, author, published, content, description, keywords, category_id, tag_ids, product_ids, collection_ids, metadata } = post
		if (!id || !handle || !title) throw new Error("Updating a blog post requires an id, a unique handle, and a title")
		/* @ts-ignore */
		const blogPostRepository = this.activeManager_.withRepository(this.blogPostRepository_)
		const existingPost = await blogPostRepository.findOne({ 
			relations: {
				category: true,
				tags: true,
				products: true,
				collections: true
			},
			where: { id } 
		})
		if (!existingPost) throw new Error("No blog post found with that id")
		existingPost.handle = handle
		existingPost.title = title
		existingPost.author = author
		existingPost.published = published
		existingPost.content = content
		existingPost.description = description
		existingPost.keywords = keywords
		existingPost.category_id = category_id
		existingPost.metadata = metadata
		existingPost.tags = []
		if (tag_ids) {
			/* @ts-ignore */
			const blogTagRepository = this.activeManager_.withRepository(this.blogTagRepository_)
			for (const tag_id of tag_ids) {
				const tag = await blogTagRepository.findOne({ where: { id: tag_id } })
				if (tag) {
					existingPost.tags.push(tag)
				}
			}
		}
		existingPost.products = []
		if (product_ids) {
			/* @ts-ignore */
			const productRepository = this.activeManager_.withRepository(this.productRepository_)
			for (const product_id of product_ids) {
				const product = await productRepository.findOne({ where: { id: product_id } })
				if (product) {
					existingPost.products.push(product)
				}
			}
		}
		existingPost.collections = []
		if (collection_ids) {
			/* @ts-ignore */
			const productCollectionRepository = this.activeManager_.withRepository(this.productCollectionRepository_)
			for (const collection_id of collection_ids) {
				const collection = await productCollectionRepository.findOne({ where: { id: collection_id } })
				if (collection) {
					existingPost.collections.push(collection)
				}
			}
		}		
		const blogPost = await blogPostRepository.save(existingPost)
		return blogPost
	}

	async deleteBlogPost(id) {
		if (!id) throw new Error("Deleting a blog post requires an id")
		/* @ts-ignore */
		const blogPostRepository = this.activeManager_.withRepository(this.blogPostRepository_)
		return await blogPostRepository.delete(id)
	}

	async getBlogTags() {
		/* @ts-ignore */
		const blogTagRepository = this.activeManager_.withRepository(this.blogTagRepository_)
		return await blogTagRepository.find()
	}

	async addBlogTag(value) {
		if (!value) throw new Error("Adding a blog tag requires a value")
		/* @ts-ignore */
		const blogTagRepository = this.activeManager_.withRepository(this.blogTagRepository_)
		const createdTag = blogTagRepository.create({
			value
		})
		const blogTag = await blogTagRepository.save(createdTag)
		return blogTag
	}

	async updateBlogTag(id, value) {
		if (!id || !value) throw new Error("Updating a blog tag requires an id and a value")
		/* @ts-ignore */
		const blogTagRepository = this.activeManager_.withRepository(this.blogTagRepository_)
		const blogTag = blogTagRepository.update(id, {
			value
		})
		return blogTag
	}

	async deleteBlogTag(id) {
		if (!id) throw new Error("Deleting a blog tag requires an id")
		/* @ts-ignore */
		const blogTagRepository = this.activeManager_.withRepository(this.blogTagRepository_)
		return await blogTagRepository.delete(id)
	}
}