import cors from "cors"
import configLoader from "@medusajs/medusa/dist/loaders/config"
import { json, Router } from "express"
import { authenticate } from "@medusajs/medusa"
import { MedusaError } from "@medusajs/utils"
import { z } from "zod"

export default (rootDirectory: string): Router | Router[] => {

   const config = configLoader(rootDirectory)
   const storeCorsOptions = { origin: config.projectConfig.store_cors.split(","), credentials: true, }
   const adminCorsOptions = { origin: config.projectConfig.admin_cors.split(","), credentials: true, }

   const router = Router()

   // GET ALL BLOG POSTS
   router.get("/store/blog/posts", cors(storeCorsOptions), async (req, res) => {
      const blogService = req.scope.resolve("blogService")
      blogService.getBlogPosts().then((blog_posts) => {
         return res.json(blog_posts)
      })
   })

   // GET ALL BLOG POSTS BY CATEGORY
   router.get("/store/blog/categories/:handle/posts", cors(storeCorsOptions), async (req, res) => {
      const blogService = req.scope.resolve("blogService")
      blogService.getBlogPostsByCategoryHandle(req.params.handle).then((blog_posts) => {
         return res.json(blog_posts)
      })
   })

   // GET A SINGLE BLOG POST BY HANDLE
   router.get("/store/blog/posts/:handle", cors(storeCorsOptions), async (req, res) => {
      const blogService = req.scope.resolve("blogService")
      blogService.getBlogPostByHandle(req.params.handle).then((blog_post) => {
         return res.json(blog_post)
      })
   })

   // GET ALL BLOG CATEGORIES
   router.get("/store/blog/categories", cors(storeCorsOptions), async (req, res) => {
      const blogService = req.scope.resolve("blogService")
      blogService.getBlogCategories().then((blog_categories) => {
         return res.json(blog_categories)
      })
   })

   // GET A BLOG CATEGORY BY HANDLE
   router.get("/store/blog/categories/:handle", cors(storeCorsOptions), async (req, res) => {
      const blogService = req.scope.resolve("blogService")
      blogService.getBlogCategoryByHandle(req.params.handle).then((blog_category) => {
         return res.json(blog_category)
      })
   })

   // GET ALL BLOG TAGS
   router.get("/store/blog/tags", cors(storeCorsOptions), async (req, res) => {
      const blogService = req.scope.resolve("blogService")
      blogService.getBlogTags().then((blog_tags) => {
         return res.json(blog_tags)
      })
   })

   // GET ALL BLOG POSTS TAGGED WITH A TAG OR AN ARRAY OF TAGS
   // Ex: /store/blog/tags/posts?tag=tag1&tag=tag2&tag=tag3
   router.get("/store/blog/tags/posts", cors(storeCorsOptions), async (req, res) => {
      if (!req.query.tag) { return res.json([]) }
      const tag_ids = (typeof req.query.tag === "string")? [req.query.tag] : req.query.tag
      const blogService = req.scope.resolve("blogService")
      blogService.getBlogPostsByTag(tag_ids).then((blog_posts) => {
         return res.json(blog_posts)
      })
   })

   // GET ALL BLOG POSTS TAGGED WITH A PRODUCT
   router.get("/store/blog/products/:id", cors(storeCorsOptions), async (req, res) => {
      const blogService = req.scope.resolve("blogService")
      blogService.getBlogPostsByProduct(req.params.id).then((blog_posts) => {
         return res.json(blog_posts)
      })
   })

   // GET ALL BLOG POSTS TAGGED WITH A COLLECTION
   router.get("/store/blog/collections/:id", cors(storeCorsOptions), async (req, res) => {
      const blogService = req.scope.resolve("blogService")
      blogService.getBlogPostsByCollection(req.params.id).then((blog_posts) => {
         return res.json(blog_posts)
      })
   })

   // ADD A BLOG CATEGORY
   router.use("/admin/blog/categories", json())
   router.post("/admin/blog/categories", cors(adminCorsOptions), authenticate(), async (req, res) => {
      const schema = z.object({
         handle: z.string().min(1),
         title: z.string().min(1),
         description: z.string().optional(),
         keywords: z.string().array().optional(),
         metadata: z.object({}).passthrough() as z.ZodObject<{}>,
      })
      /* @ts-ignore */
      const { success, error, data } = schema.safeParse(req.body)
      if (!success) {
         throw new MedusaError(MedusaError.Types.INVALID_DATA, error)
      }
      const blogService = req.scope.resolve("blogService")
      blogService.addBlogCategory(data).then((blog_category) => {
         return res.json(blog_category)
      })
   })

   // UPDATE A BLOG CATEGORY
   router.use("/admin/blog/categories/:id", json())
   router.post("/admin/blog/categories/:id", cors(adminCorsOptions), authenticate(), async (req, res) => {
      const schema = z.object({
         handle: z.string().min(1),
         title: z.string().min(1),
         description: z.string().optional(),
         keywords: z.string().array().optional(),
         metadata: z.object({}).passthrough() as z.ZodObject<{}>,
      })
      /* @ts-ignore */
      const { success, error, data } = schema.safeParse(req.body)
      if (!success) {
         throw new MedusaError(MedusaError.Types.INVALID_DATA, error)
      }
      const blogService = req.scope.resolve("blogService")
      blogService.updateBlogCategory(req.params.id, data).then((blog_category) => {
         return res.json(blog_category)
      })
   })

   // DELETE A BLOG CATEGORY
   router.delete("/admin/blog/categories/:id", cors(adminCorsOptions), authenticate(), async (req, res) => {
      const blogService = req.scope.resolve("blogService")
      blogService.deleteBlogCategory(req.params.id).then(() => {
         return res.sendStatus(200)
      })
   })

   // ADD A BLOG POST
   router.use("/admin/blog/posts", json())
   router.post("/admin/blog/posts", cors(adminCorsOptions), authenticate(), async (req, res) => {
      const schema = z.object({
         handle: z.string().optional(),
         title: z.string().min(1),
         author: z.string().optional(),
         published: z.boolean().default(false),
         content: z.string().optional(),
         description: z.string().optional(),
         keywords: z.string().array().optional(),
         category_id: z.string().optional(),
         tag_ids: z.string().array().optional(),
         product_ids: z.string().array().optional(),
         collection_ids: z.string().array().optional(),
         metadata: z.object({}).passthrough() as z.ZodObject<{}>
      })
      /* @ts-ignore */
      const { success, error, data } = schema.safeParse(req.body)
      if (!success) {
         throw new MedusaError(MedusaError.Types.INVALID_DATA, error)
      }
      const blogService = req.scope.resolve("blogService")
      blogService.addBlogPost(data).then((blog_post) => {
         return res.json(blog_post)
      })
   })

   // UPDATE A BLOG POST
   router.use("/admin/blog/posts/:id", json())
   router.post("/admin/blog/posts/:id", cors(adminCorsOptions), authenticate(), async (req, res) => {
      const schema = z.object({
         handle: z.string().optional(),
         title: z.string().min(1),
         author: z.string().optional(),
         published: z.boolean().default(false),
         content: z.string().optional(),
         description: z.string().optional(),
         keywords: z.string().array().optional(),
         category_id: z.string().optional(),
         tag_ids: z.string().array().optional(),
         product_ids: z.string().array().optional(),
         collection_ids: z.string().array().optional(),
         metadata: z.object({}).passthrough() as z.ZodObject<{}>
      })
      /* @ts-ignore */
      const { success, error, data } = schema.safeParse(req.body)
      if (!success) {
         throw new MedusaError(MedusaError.Types.INVALID_DATA, error)
      }
      const blogService = req.scope.resolve("blogService")
      blogService.updateBlogPost(req.params.id, data).then((blog_post) => {
         return res.json(blog_post)
      })
   })

   // DELETE A BLOG POST
   router.delete("/admin/blog/posts/:id", cors(adminCorsOptions), authenticate(), async (req, res) => {
      const blogService = req.scope.resolve("blogService")
      blogService.deleteBlogPost(req.params.id).then(() => {
         return res.sendStatus(200)
      })
   })

   // ADD A BLOG TAG
   router.use("/admin/blog/tags", json())
   router.post("/admin/blog/tags", cors(adminCorsOptions), authenticate(), async (req, res) => {
      const schema = z.object({
         value: z.string().min(1)
      })
      /* @ts-ignore */
      const { success, error, data } = schema.safeParse(req.body)
      if (!success) {
         throw new MedusaError(MedusaError.Types.INVALID_DATA, error)
      }
      const blogService = req.scope.resolve("blogService")
      blogService.addBlogTag(data.value).then((blog_tag) => {
         return res.json(blog_tag)
      })
   })

   // UPDATE A BLOG TAG
   router.use("/admin/blog/tags/:id", json())
   router.post("/admin/blog/tags/:id", cors(adminCorsOptions), authenticate(), async (req, res) => {
      const schema = z.object({
         value: z.string().min(1)
      })
      /* @ts-ignore */
      const { success, error, data } = schema.safeParse(req.body)
      if (!success) {
         throw new MedusaError(MedusaError.Types.INVALID_DATA, error)
      }
      const blogService = req.scope.resolve("blogService")
      blogService.updateBlogTag(req.params.id, data.value).then((blog_tag) => {
         return res.json(blog_tag)
      })
   })

   // DELETE A BLOG TAG
   router.delete("/admin/blog/tags/:id", cors(adminCorsOptions), authenticate(), async (req, res) => {
      const blogService = req.scope.resolve("blogService")
      blogService.deleteBlogTag(req.params.id).then(() => {
         return res.sendStatus(200)
      })
   })

   return router
}