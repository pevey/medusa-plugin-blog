import { BaseEntity, generateEntityId } from "@medusajs/utils"
import { BeforeInsert, Column, Entity } from "typeorm"

@Entity()
export class BlogTag extends BaseEntity {

	@Column({ type: "varchar", nullable: false })
	title: string

	@BeforeInsert()
	private beforeInsert(): void {
		this.id = generateEntityId(this.id, "post")
	}
}