import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Users } from './Users';
import { Professional } from './Professional';
import { LanLog } from './LanLog';
import { VoiceRecord } from './VoiceRecording';
import { Review } from './Review';
import { ProfessionalSector } from './ProffesionalSector';
import { MarketPlace } from './Market';


// export enum UserGender {
// 	MALE = 'MALE',
// 	FEMALE = 'FEMALE',
// 	OTHER = 'OTHER',
// }

export enum ProfileType {
	CLIENT = 'CLIENT',
	PROFESSIONAL = 'PROFESSIONAL',
	CORPERATE = "CORPERATE"
}

@Table({ timestamps: true, tableName: 'profile' })
export class Profile extends Model {

	// @AllowNull(true)
	// @Column(DataType.STRING)
	// firstName!: string;


	@AllowNull(true)
	@Column(DataType.STRING)
	fullName!: string;


	@AllowNull(true)
	@Column(DataType.STRING)
	fcmToken!: string;


	@AllowNull(false)
	@Column(DataType.STRING)
	avatar!: string;



	@Default(true)
	@AllowNull(false)
	@Column(DataType.BOOLEAN)
	verified!: boolean;


	@Default(false)
	@AllowNull(false)
	@Column(DataType.BOOLEAN)
	notified!: boolean;


	@AllowNull(false)
	@Column(DataType.STRING)
	lga!: string;


	@AllowNull(false)
	@Column(DataType.STRING)
	state!: string;


	@AllowNull(false)
	@Column(DataType.STRING)
	address!: string;



	@Default(0)
	@Column(DataType.INTEGER)
	totalHire!: string;


	@Default(0)
	@Column(DataType.INTEGER)
	totalExpense!: string;




	@Default(0)
	@AllowNull(true)
	@Column(DataType.DECIMAL)
	rate!: any;



	@Default(0)
	@Column(DataType.INTEGER)
	totalPendingHire!: string;


	@Default(0)
	@Column(DataType.INTEGER)
	count!: string;





	@Default(0)
	@Column(DataType.INTEGER)
	totalOngoingHire!: string;


	@Default(0)
	@Column(DataType.INTEGER)
	totalCompletedHire!: string;


	@Default(0)
	@Column(DataType.INTEGER)
	totalReview!: string;



	@Default(0)
	@Column(DataType.INTEGER)
	totalJobRejected!: string;


	@Default(0)
	@Column(DataType.INTEGER)
	totalJobCanceled!: string;





	@Default(0)
	@Column(DataType.INTEGER)
	totalDisputes!: string;


	@AllowNull(false)
	@Column(DataType.STRING)
	bvn!: string;


	@Default(ProfileType.CLIENT)
	@Column(DataType.ENUM(ProfileType.CLIENT, ProfileType.PROFESSIONAL, ProfileType.CORPERATE))
	type!: ProfileType;



	@Default(false)
	@AllowNull(true)
	@Column(DataType.BOOLEAN)
	corperate!: any;


	@Default(false)
	@AllowNull(true)
	@Column(DataType.BOOLEAN)
	switch!: any;



	@Default(false)
	@AllowNull(true)
	@Column(DataType.BOOLEAN)
	store!: any;


	// @ForeignKey(() => LanLog)
	// @AllowNull(true)
	// @Column(DataType.INTEGER)
	// lanlogId!: number;



	// @BelongsTo(() => LanLog, { onDelete: 'CASCADE' })
	// lanlog!: LanLog;




	@ForeignKey(() => Users)
	@AllowNull(false)
	@Column(DataType.UUID)
	userId!: string;


	@BelongsTo(() => Users, { onDelete: 'CASCADE' })
	user!: Users;


	@HasOne(() => Professional)
	professional!: Professional;


	@HasOne(() => MarketPlace)
	market!: MarketPlace;



	@HasMany(() => VoiceRecord, { onDelete: 'CASCADE' })
	recording!: VoiceRecord[];


	@HasMany(() => ProfessionalSector, { onDelete: 'CASCADE' })
	professional_sector!: ProfessionalSector[];




}
