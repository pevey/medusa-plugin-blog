import { TransactionBaseService } from '@medusajs/utils'
import { BlogCategoryRepository } from '../repositories/blog-category'
import { BlogPostRepository } from '../repositories/blog-post'
import { BlogTagRepository } from '../repositories/blog-tag'

export default class BlogService extends TransactionBaseService {
	protected readonly blogCategoryRepository_: typeof BlogCategoryRepository
	protected readonly blogPostRepository_: typeof BlogPostRepository
	protected readonly blogTagRepository_: typeof BlogTagRepository

	constructor({ blogCategoryRepository, blogPostRepository, blogTagRepository }) {
		super(arguments[0])
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

	async addBlogCategory (category) {
		const { handle, title, description, keywords, metadata } = category
		if (!title) throw new Error("Adding a blog category requires a title")
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
		if (!id || !title) throw new Error("Updating a blog category requires an id and a title")
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
		return await blogPostRepository.find()
	}

	async getBlogCategoryPosts(category_id) {
		/* @ts-ignore */
		const blogPostRepository = this.activeManager_.withRepository(this.blogPostRepository_)
		return await blogPostRepository.find({
			where: { category_id }
		})
	}

	async getBlogPost(id) {
		/* @ts-ignore */
		const blogPostRepository = this.activeManager_.withRepository(this.blogPostRepository_)
		return await blogPostRepository.findOne({
			where: { id }
		})
	}

	async addBlogPost(post) {
		const { handle, title, author, published, content, description, keywords, category_id, tags, products, collections, metadata } = post
		if (!title) throw new Error("Adding a blog post requires a title")
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
		const { handle, title, author, published, content, description, keywords, category_id, tags, products, collections, metadata } = post
		if (!id || !title) throw new Error("Updating a blog post requires an id and a title")
		/* @ts-ignore */
		const blogPostRepository = this.activeManager_.withRepository(this.blogPostRepository_)
		const blogPost = blogPostRepository.update(id, {
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

	async addBlogTag(title) {
		if (!title) throw new Error("Adding a blog tag requires a title")
		/* @ts-ignore */
		const blogTagRepository = this.activeManager_.withRepository(this.blogTagRepository_)
		const createdTag = blogTagRepository.create({
			title
		})
		const blogTag = await blogTagRepository.save(createdTag)
		return blogTag
	}

	async updateBlogTag(id, title) {
		if (!id || !title) throw new Error("Updating a blog tag requires an id and a title")
		/* @ts-ignore */
		const blogTagRepository = this.activeManager_.withRepository(this.blogTagRepository_)
		const blogTag = blogTagRepository.update(id, {
			title
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