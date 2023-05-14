import { Product, Customer } from "@medusajs/medusa"
import { BaseEntity, generateEntityId } from "@medusajs/utils"
import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm"
import { BlogCategory } from "./blog-category"
import { BlogTag } from "./blog-tag"

@Entity()
export class BlogPost extends BaseEntity {

	@Index({ unique: true })
	@Column({ type: "text", nullable: true })
	handle: string | null

	@Column()
	title: string

	@Column({ type: "text", nullable: true })
	content: string | null

	@Column({ type: "text", nullable: true })
	author: string | null

	@Column({ type: "text", nullable: true })
	description: string | null

	@Column({ type: "text", nullable: true, array: true })
	keywords: string | null

	@Column({ type: "jsonb", nullable: true })
	tags: string | null
	
	@ManyToOne(() => BlogCategory)
	@JoinColumn({ name: "category_id" })
	category: BlogCategory
	
	@Column({ type: "boolean", nullable: false })
	published: boolean



	@ManyToOne(() => BlogCategory)
	@JoinColumn({ name: "product_id" })
	product: Product

	@Column({ type: "varchar", nullable: false })
	customer_id: string

	@ManyToOne(() => Product)
	@JoinColumn({ name: "customer_id" })
	customer: Customer




	@BeforeInsert()
	private beforeInsert(): void {
		this.id = generateEntityId(this.id, "post")
	}
}