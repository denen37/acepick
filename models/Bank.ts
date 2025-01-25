import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Sector } from './Sector';
import { Users } from './Users';



@Table({ timestamps: true, tableName: 'bank' })
export class Banks extends Model {
	@AllowNull(false)
	@Column(DataType.STRING)
	accountNumber!: string;


    @AllowNull(false)
	@Column(DataType.STRING)
	bankCode!: string;

	@AllowNull(true)
	@Column(DataType.STRING)
	bankName!: string;


	@AllowNull(false)
	@Column(DataType.STRING)
	accountName!: string;



	@AllowNull(false)
    @ForeignKey(() => Users)
	@Column(DataType.UUID)
    userId!: string;
}
