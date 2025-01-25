import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Profile } from './Profile';
import { Wallet } from './Wallet';
import { LanLog } from './LanLog';


// export enum UserGender {
// 	MALE = 'MALE',
// 	FEMALE = 'FEMALE',
// 	OTHER = 'OTHER',
// }

export enum UserStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
	SUSPENDED = 'SUSPENDED',
}



export enum AdminRole {
	SUPER = 'SUPER',
	BILLING = 'BILLING',
    SUPPORT = 'SUPPORT',
    ANALYTICS = 'ANALYTICS'
}



@Table({ timestamps: true, tableName: 'admin_transaction' })
export class AdminTransaction extends Model {

   


	@Default(0)
	@AllowNull(true)
	@Column(DataType.STRING)
	totalMoneyEscrow!: number;
    

	@Default(0)
	@AllowNull(true)
	@Column(DataType.STRING)
	totalPendingPayments!: number;


    @Default(0)
	@AllowNull(true)
	@Column(DataType.STRING)
	todayMoneyEarn!: string;


    @Default(0)
	@AllowNull(true)
	@Column(DataType.STRING)
	todayMoneyPaid!: number;


	@Default(0)
	@AllowNull(true)
	@Column(DataType.STRING)
	todayMoneyEscrow!: number;
    

	@Default(0)
	@AllowNull(true)
	@Column(DataType.STRING)
	todayPendingPayments!: number;
}
