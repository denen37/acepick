import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Profile } from './Profile';
import { Wallet } from './Wallet';
import { LanLog } from './LanLog';
import { Users } from './Users';
import { Dispute } from './Dispute';
import { Jobs } from './Jobs';


// export enum UserGender {
// 	MALE = 'MALE',
// 	FEMALE = 'FEMALE',
// 	OTHER = 'OTHER',
// }

// export enum JobStatus {
// 	COMPLETED = 'COMPLETED',
// 	DISPUTED = 'DISPUTED',
// 	PENDING = 'PENDING',
// 	REJECTED = 'REJECTED',
// }





@Table({ timestamps: true, tableName: 'voicerecord' })
export class VoiceRecord extends Model {


	@AllowNull(true)
	@Column(DataType.STRING)
	url!: string;



	@AllowNull(true)
	@Column(DataType.STRING)
	duration!: string;

	@ForeignKey(() => Users)
	@AllowNull(true)
	@Column(DataType.UUID)
	userId!: string;



	@ForeignKey(() => Users)
	@AllowNull(true)
	@Column(DataType.UUID)
	recieverId!: string;




	@ForeignKey(() => Profile)
	@AllowNull(true)
	@Column(DataType.INTEGER)
	profileId!: number;



	// relationships
	@BelongsTo(() => Users, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE', })
	@ForeignKey(() => Users)
	user!: Users;

	@BelongsTo(() => Users, { foreignKey: 'recieverId', as: 'reciever', onDelete: 'CASCADE', })
	@ForeignKey(() => Users)
	reciever!: Users;


	@BelongsTo(() => Profile, { onDelete: 'CASCADE' })
	profile!: Profile;


}
