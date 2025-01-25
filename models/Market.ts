import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Users } from './Users';
import { Profession } from './Profession';
import { Sector } from './Sector';
import { Profile } from './Profile';
import { Corperate } from './Cooperation';
import { Category } from './Category';
import { Allow } from 'stream-chat';
import { ReviewMarket } from './ReviewMarket';


// export enum UserGender {
// 	MALE = 'MALE',
// 	FEMALE = 'FEMALE',
// 	OTHER = 'OTHER',
// }
export enum StoreStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
	SUSPENDED = 'SUSPENDED',
}

@Table({ timestamps: true, tableName: 'market' })
export class MarketPlace extends Model {

	@AllowNull(true)
	@Column(DataType.STRING)
	photo!: string;


	@AllowNull(false)
	@Column(DataType.STRING)
	name!: string;



	@AllowNull(false)
	@Column(DataType.STRING)
	description!: string;


	@Default([])
	@AllowNull(true)
	@Column(DataType.JSON)
	tags!: any;


	@AllowNull(false)
	@Column(DataType.STRING)
	state!: string;


	@AllowNull(false)
	@Column(DataType.STRING)
	lga!: string;



	@AllowNull(false)
	@Column(DataType.STRING)
	address!: string;



	@AllowNull(true)
	@Column(DataType.STRING)
	phone!: string;



	@AllowNull(true)
	@Column(DataType.STRING)
	facebook!: string;



	@AllowNull(true)
	@Column(DataType.STRING)
	instagram!: string;


	@Default(0.0)
	@AllowNull(true)
	@Column(DataType.DECIMAL)
	rate!: number;


	@AllowNull(false)
	@Column(DataType.JSON)
	file!: any;



	@Default(StoreStatus.ACTIVE)
	@Column(DataType.ENUM(StoreStatus.ACTIVE, StoreStatus.INACTIVE, StoreStatus.SUSPENDED))
	status!: StoreStatus;




	@ForeignKey(() => Users)
	@AllowNull(false)
	@Column(DataType.UUID)
	userId!: string;




	@AllowNull(false)
	@ForeignKey(() => Profile)
	@Column(DataType.INTEGER)
	profileId!: number;



	@AllowNull(false)
	@ForeignKey(() => Category)
	@Column(DataType.INTEGER)
	categoryId!: number;



	@BelongsTo(() => Profile, { onDelete: 'CASCADE' })
	profile!: Profile;


	@BelongsTo(() => Users, { onDelete: 'CASCADE' })
	user!: Users;


	@BelongsTo(() => Category, { onDelete: 'CASCADE' })
	category!: Category;


	@HasMany(() => ReviewMarket, { onDelete: 'CASCADE' })
	review!: ReviewMarket[];

}
