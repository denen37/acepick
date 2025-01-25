import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Sector } from './Sector';



@Table({ timestamps: true, tableName: 'category' })
export class Category extends Model {
	@AllowNull(false)
	@Column(DataType.STRING)
	title!: string;

	@AllowNull(true)
	@Column(DataType.STRING)
	image!: string
}
