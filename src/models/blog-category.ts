import { Product, Customer } from "@medusajs/medusa"
import { BaseEntity, generateEntityId } from "@medusajs/utils"
import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm"

@Entity()
export class BlogCategory extends BaseEntity {






	@BeforeInsert()
	private beforeInsert(): void {
		this.id = generateEntityId(this.id, "post")
	}
}