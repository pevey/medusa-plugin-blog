import { BaseEntity, generateEntityId } from "@medusajs/utils"
import { BeforeInsert, Column, Entity, Index, OneToMany } from "typeorm"
import { BlogPost } from "./blog-post"

@Entity()
export class BlogCategory extends BaseEntity {

	@Index({ unique: true })
	@Column({ type: "varchar", nullable: true })
	handle: string | null

	@Column({ type: "varchar", nullable: false })
	title: string

	@Column({ type: "text", nullable: true })
	description: string | null

	@Column({ type: "text", nullable: true, array: true })
	keywords: string | null

	@Column({ type: "jsonb", nullable: true })
	metadata: Record<string, any> | null

	@OneToMany(() => BlogPost, post => post.category)
	posts: BlogPost[]

	@BeforeInsert()
	private beforeInsert(): void {
		this.id = generateEntityId(this.id, "bcat")
	}
}