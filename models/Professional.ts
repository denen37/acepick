import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Users } from './Users';
import { Profession } from './Profession';
import { Sector } from './Sector';
import { Profile } from './Profile';
import { Corperate } from './Cooperation';
import { Review } from './Review';
import { ProfessionalSector } from './ProffesionalSector';


// export enum UserGender {
// 	MALE = 'MALE',
// 	FEMALE = 'FEMALE',
// 	OTHER = 'OTHER',
// }
export enum WorkType {
	BUSY = 'BUSY',
	IDLE = 'IDLE',
}

@Table({ timestamps: true, tableName: 'professional' })
export class Professional extends Model {


	@AllowNull(true)
	@Column(DataType.JSON)
	file!: any;


	@AllowNull(true)
	@Column(DataType.STRING)
	intro!: string;

	@AllowNull(true)
	@Column(DataType.DECIMAL)
	chargeFrom!: any;


	@Default({ "language": ["English"] })
	@AllowNull(true)
	@Column(DataType.JSON)
	language!: any;



	@Default(true)
	@AllowNull(true)
	@Column(DataType.BOOLEAN)
	avaialable!: string;


	@Default(WorkType.IDLE)
	@Column(DataType.ENUM(WorkType.IDLE, WorkType.BUSY))
	workType!: WorkType;


	@Default(0)
	@Column(DataType.INTEGER)
	totalJobCompleted!: string;


	@Default(0)
	@Column(DataType.INTEGER)
	totalJobCanceled!: string;



	@Default(0)
	@Column(DataType.INTEGER)
	totalReview!: string;



	@Default(0)
	@Column(DataType.INTEGER)
	totalJobPending!: string;


	@Default(0)
	@Column(DataType.INTEGER)
	totalJobOngoing!: string;


	@Default(0)
	@Column(DataType.INTEGER)
	totalJobRejected!: string;



	@Default(0)
	@Column(DataType.INTEGER)
	totalEarning!: string;



	@Default(0)
	@Column(DataType.INTEGER)
	totalDispute!: string;




	@Default(0.0)
	@Column(DataType.DECIMAL)
	completedAmount!: number;



	@Default(0.0)
	@Column(DataType.DECIMAL)
	pendingAmount!: number;



	@Default(0.0)
	@Column(DataType.DECIMAL)
	rejectedAmount!: number;



	@Default(0.0)
	@Column(DataType.DECIMAL)
	availableWithdrawalAmount!: number;




	@AllowNull(true)
	@Column(DataType.STRING)
	regNum!: string;


	@AllowNull(false)
	@Column(DataType.STRING)
	yearsOfExp!: number;


	@Default(false)
	@AllowNull(false)
	@Column(DataType.BOOLEAN)
	online!: any;



	@ForeignKey(() => Users)
	@AllowNull(false)
	@Column(DataType.UUID)
	userId!: string;





	@AllowNull(true)
	@ForeignKey(() => Corperate)
	@Column(DataType.INTEGER)
	corperateId!: number;



	@AllowNull(false)
	@ForeignKey(() => Profile)
	@Column(DataType.INTEGER)
	profileId!: number;


	@BelongsTo(() => Profile, { onDelete: 'CASCADE' })
	profile!: Profile;


	@BelongsTo(() => Users, { onDelete: 'CASCADE' })
	user!: Users;


	@BelongsTo(() => Corperate, { onDelete: 'CASCADE' })
	corperate!: Corperate;



	// @HasMany(() => ProfessionalSector, { onDelete: 'CASCADE' })
	// professional_sector!: ProfessionalSector[];


	@HasMany(() => Review, { onDelete: 'CASCADE' })
	review!: Review[];
}
