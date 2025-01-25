import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Users } from './Users';



@Table({ timestamps: true, tableName: 'lanlog' })
export class LanLog extends Model {
	@AllowNull(true)
	@Column(DataType.STRING)
	address!: string;

	@AllowNull(true)
	@Column(DataType.INTEGER)
	lantitude!: number


	@AllowNull(true)
	@Column(DataType.INTEGER)
	longitude!: number



	@AllowNull(true)
	@Column(DataType.GEOMETRY("POINT"))
	coordinates!: any




	@ForeignKey(() => Users)
	@AllowNull(false)
	@Column(DataType.UUID)
	userId!: string;


	@BelongsTo(() => Users, { onDelete: 'CASCADE' })
	user!: Users;


}
