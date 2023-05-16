import { Product, ProductCollection } from "@medusajs/medusa"
import { BaseEntity, generateEntityId } from "@medusajs/utils"
import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm"
import { BlogCategory } from "./blog-category"
import { BlogTag } from "./blog-tag"

@Entity()
export class BlogPost extends BaseEntity {

	@Index({ unique: true })
	@Column({ type: "varchar", nullable: false })
	handle: string | null

	@Column({ type: "varchar", nullable: false })
	title: string

	@Column({ type: "varchar", nullable: true })
	author: string | null

	@Column({ type: "boolean", nullable: false })
	published: boolean

	@Column({ type: "text", nullable: true })
	content: string | null
	
	@Column({ type: "text", nullable: true })
	description: string | null

	@Column({ type: "text", nullable: true, array: true })
	keywords: string[] | null

	@Column({ type: "varchar", nullable: true })
	category_id: string
	
	@ManyToOne(() => BlogCategory)
	@JoinColumn({ name: "category_id" })
	category: BlogCategory

	@ManyToMany(() => BlogTag)
	@JoinTable({
		name: "blog_tags",
		joinColumn: {
			name: "post_id",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "tag_id",
			referencedColumnName: "id",
		},
	})
	tags: BlogTag[]
	
	@ManyToMany(() => Product)
	@JoinTable({
		name: "blog_product_tags",
		joinColumn: {
			name: "post_id",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "product_id",
			referencedColumnName: "id",
		},
	})
	products: Product[]

	@ManyToMany(() => ProductCollection)
	@JoinTable({
		name: "blog_collection_tags",
		joinColumn: {
			name: "post_id",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "collection_id",
			referencedColumnName: "id",
		},
	})
	collections: ProductCollection[]

	@Column({ type: "jsonb", nullable: true })
	metadata: Record<string, any> | null

	@BeforeInsert()
	private beforeInsert(): void {
		this.id = generateEntityId(this.id, "post")
	}
}