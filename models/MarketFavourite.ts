import {
	Table,
	Model,
	Column,
	DataType,
	HasOne,
	BelongsToMany,
	BelongsTo,
	ForeignKey,
	HasMany,
	AllowNull,
	Default,
} from 'sequelize-typescript';

import { Users } from './Users';
import { Professional } from './Professional';
import { ProfileType } from './Profile';
import { MarketPlace } from './Market';
import { Product } from './Products';


export enum FavouriteType {
	PRODUCT = 'PRODUCT',
	STORE = 'STORE'
}


@Table({ timestamps: true, tableName: 'marketFavourite' })
export class MarketFavourite extends Model {


	@ForeignKey(() => Users)
	@AllowNull(true)
	@Column(DataType.UUID)
	userId!: string;


	@ForeignKey(() => Users)
	@AllowNull(false)
	@Column(DataType.UUID)
	favouriteOwnerId!: string;


	@ForeignKey(() => MarketPlace)
	@AllowNull(true)
	@Column(DataType.INTEGER)
	marketPlaceId!: number;


    @ForeignKey(() => Product)
	@AllowNull(true)
	@Column(DataType.INTEGER)
	productId!: number;


	@Default(FavouriteType.PRODUCT)
	@Column(DataType.ENUM(FavouriteType.PRODUCT, FavouriteType.STORE))
	type!: FavouriteType;


	@BelongsTo(() => MarketPlace, { onDelete: 'CASCADE' })
	marketPlace!: MarketPlace;



    @BelongsTo(() => Product, { onDelete: 'CASCADE' })
	product!: Product;



	@BelongsTo(() => Users, { onDelete: 'CASCADE' })
	user!: Users;
}
