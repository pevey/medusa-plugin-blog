import { BaseEntity } from "@medusajs/medusa"
import { generateEntityId } from "@medusajs/utils"
import { BeforeInsert, Column, Entity } from "typeorm"

@Entity()
export class BlogTag extends BaseEntity {

	@Column({ type: "varchar", nullable: false })
	value: string

	@BeforeInsert()
	private beforeInsert(): void {
		this.id = generateEntityId(this.id, "btag")
	}
}