import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Sector } from './Sector';
import { Users } from './Users';



@Table({ timestamps: true, tableName: 'porfolio' })
export class Porfolio extends Model {
	@AllowNull(false)
	@Column(DataType.STRING)
	title!: string;



	@AllowNull(false)
	@Column(DataType.STRING)
	description!: string;


	@AllowNull(false)
	@Column(DataType.INTEGER)
	duration!: string;


	@AllowNull(false)
	@Column(DataType.STRING)
	date!: string;

	@Default({})
	@AllowNull(false)
	@Column(DataType.JSON)
	file!: any;


	@AllowNull(false)
	@ForeignKey(() => Users)
	@Column(DataType.UUID)
	userId!: string;

}
