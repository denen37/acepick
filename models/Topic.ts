import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Sector } from './Sector';



@Table({ timestamps: true, tableName: 'topic' })
export class Topic extends Model {
	@AllowNull(false)
	@Column(DataType.STRING)
	title!: string;
}
