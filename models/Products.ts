import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Users } from './Users';
import { Profession } from './Profession';
import { Sector } from './Sector';
import { Profile } from './Profile';
import { Corperate } from './Cooperation';
import { Category } from './Category';
import { MarketPlace } from './Market';


// export enum UserGender {
// 	MALE = 'MALE',
// 	FEMALE = 'FEMALE',
// 	OTHER = 'OTHER',
// }
export enum ProductStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
	SUSPENDED = 'SUSPENDED',
}

@Table({ timestamps: true, tableName: 'product' })
export class Product extends Model {

	

	@AllowNull(false)
	@Column(DataType.STRING)
	name!: string;



	@AllowNull(false)
	@Column(DataType.STRING)
	description!: string;



	@AllowNull(false)
	@Column(DataType.JSON)
	tags!: any;


	@AllowNull(false)
	@Column(DataType.STRING)
	price!: string;



	@AllowNull(false)
	@Column(DataType.JSON)
	file!: any;



	@Default(ProductStatus.ACTIVE)
	@Column(DataType.ENUM(ProductStatus.ACTIVE, ProductStatus.INACTIVE, ProductStatus.SUSPENDED))
	status!: ProductStatus;




	@ForeignKey(() => Users)
	@AllowNull(false)
	@Column(DataType.UUID)
	userId!: string;



	@ForeignKey(() => MarketPlace)
	@AllowNull(false)
	@Column(DataType.INTEGER)
	marketPlaceId!: string;


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


	@BelongsTo(() => MarketPlace, { onDelete: 'CASCADE' })
	marketPlace!: MarketPlace;


	@BelongsTo(() => Category, { onDelete: 'CASCADE' })
	category!: Category;

}
