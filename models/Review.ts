import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Sector } from './Sector';
import { Jobs } from './Jobs';
import { Users } from './Users';
import { Professional } from './Professional';



@Table({ timestamps: true, tableName: 'review' })
export class Review extends Model {
	@AllowNull(false)
	@Column(DataType.STRING)
	review!: string;

	@AllowNull(false)
	@Column(DataType.INTEGER)
	rate!: string


	@ForeignKey(() => Users)
	@AllowNull(false)
	@Column(DataType.UUID)
	userId!: string;


	@ForeignKey(() => Users)
	@AllowNull(true)
	@Column(DataType.UUID)
	proffesionalUserId!: string;



	@ForeignKey(() => Users)
	@AllowNull(true)
	@Column(DataType.UUID)
	clientUserId!: string;


	
	@AllowNull(true)
	@ForeignKey(() => Professional)
	@Column(DataType.INTEGER)
	proffesionalId!: number;



	@ForeignKey(() => Jobs)
	@AllowNull(false)
	@Column(DataType.INTEGER)
	jobId!: number;



	@BelongsTo(() => Users, { onDelete: 'CASCADE', foreignKey: "userId", as: "user" })
	user!: Users;


	@BelongsTo(() => Users, { onDelete: 'CASCADE', foreignKey: "proffesionalUserId", as: "proffesionalUser" })
	proffesionalUser!: Users;


	@BelongsTo(() => Users, { onDelete: 'CASCADE', foreignKey: "clientUserId", as: "clientUser" })
	clientUser!: Users;


	@BelongsTo(() => Professional, { onDelete: 'CASCADE' })
	proffesional!: Professional;



	@BelongsTo(() => Jobs, { onDelete: 'CASCADE' })
	job!: Users;
}
