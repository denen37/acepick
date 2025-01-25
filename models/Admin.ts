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



@Table({ timestamps: true, tableName: 'admin' })
export class Admin extends Model {


	@Index({ name: 'email-index', type: 'UNIQUE', unique: true })
	@AllowNull(false)
	@Column(DataType.STRING)
	email!: string;


	@AllowNull(false)
	@Column(DataType.STRING)
	password!: string;




	@AllowNull(true)
	@Column(DataType.STRING)
	firstName!: string;




	@AllowNull(true)
	@Column(DataType.STRING)
	phone!: string;




	@AllowNull(true)
	@Column(DataType.STRING)
	lastName!: string;


	@Default(true)
	@AllowNull(true)
	@Column(DataType.BOOLEAN)
	firstTimer!: string;



	@Default(false)
	@AllowNull(true)
	@Column(DataType.BOOLEAN)
	online!: string;


	@Default(UserStatus.INACTIVE)
	@Column(DataType.ENUM(UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.SUSPENDED))
	status!: UserStatus;



	@Default(AdminRole.SUPPORT)
	@Column(DataType.ENUM(AdminRole.SUPER, AdminRole.SUPPORT, AdminRole.ANALYTICS, AdminRole.BILLING))
	role!: AdminRole;




	// relationships

}
