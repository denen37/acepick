import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Sector } from './Sector';
import { Users } from './Users';



@Table({ timestamps: true, tableName: 'education' })
export class Education extends Model {
	@AllowNull(false)
	@Column(DataType.STRING)
	school!: string;


	@AllowNull(false)
	@Column(DataType.STRING)
	degreeType!: string;


	@AllowNull(false)
	@Column(DataType.STRING)
	course!: string;


	@AllowNull(false)
	@Column(DataType.STRING)
	gradDate!: string;


	// @AllowNull(false)
	// @Column(DataType.STRING)
	// endDate!: string;

	@AllowNull(false)
	@ForeignKey(() => Users)
	@Column(DataType.UUID)
	userId!: string;

}
