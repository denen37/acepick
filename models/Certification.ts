import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Sector } from './Sector';
import { Users } from './Users';



@Table({ timestamps: true, tableName: 'certification' })
export class Certification extends Model {
	@AllowNull(false)
	@Column(DataType.STRING)
	title!: string;


    @AllowNull(false)
	@Column(DataType.STRING)
	companyIssue!: string;


    @AllowNull(false)
	@Column(DataType.STRING)
	date!: string;


	@AllowNull(false)
    @ForeignKey(() => Users)
	@Column(DataType.UUID)
    userId!: string;
}
