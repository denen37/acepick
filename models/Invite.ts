import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Profile } from './Profile';
import { Wallet } from './Wallet';
import { LanLog } from './LanLog';


// export enum UserGender {
// 	MALE = 'MALE',
// 	FEMALE = 'FEMALE',
// 	OTHER = 'OTHER',
// }

export enum InviteStatus {
	PENDING = 'PENDING',
	INACTIVE = 'INACTIVE',
	ACTIVE = 'ACTIVE',
}



export enum AdminRole {
	SUPER = 'SUPER',
	BILLING = 'BILLING',
    SUPPORT = 'SUPPORT',
    ANALYTICS = 'ANALYTICS'
}




@Table({ timestamps: true, tableName: 'invite' })
export class Invite extends Model {


	@Index({ name: 'email-index', type: 'UNIQUE', unique: true })
	@AllowNull(false)
	@Column(DataType.STRING)
	email!: string;

    @Default(InviteStatus.PENDING)
	@Column(DataType.ENUM(InviteStatus.ACTIVE, InviteStatus.INACTIVE, InviteStatus.PENDING))
	status!: InviteStatus;



	@AllowNull(true)
	@Column(DataType.STRING)
	phone!: string;



	@Default(AdminRole.SUPPORT)
	@Column(DataType.ENUM(AdminRole.SUPER, AdminRole.SUPPORT, AdminRole.ANALYTICS, AdminRole.BILLING))
	role!: AdminRole;


	

// relationships

}
