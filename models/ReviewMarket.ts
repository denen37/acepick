import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Sector } from './Sector';
import { Jobs } from './Jobs';
import { Users } from './Users';
import { Professional } from './Professional';
import { MarketPlace } from './Market';



@Table({ timestamps: true, tableName: 'reviewMarket' })
export class ReviewMarket extends Model {
	@AllowNull(false)
	@Column(DataType.STRING)
	review!: string;

	@AllowNull(false)
	@Column(DataType.INTEGER)
	rate!: string


	@ForeignKey(() => Users)
	@AllowNull(false)
	@Column(DataType.UUID)
	userId!: string;



	@ForeignKey(() => Users)
	@AllowNull(false)
	@Column(DataType.UUID)
	marketPlaceUserId!: string;


	@ForeignKey(() => MarketPlace)
	@AllowNull(false)
	@Column(DataType.INTEGER)
	marketPlaceId!: number;




	@BelongsTo(() => Users, { onDelete: 'CASCADE' })
	user!: Users;


	@BelongsTo(() => MarketPlace, { onDelete: 'CASCADE' })
	marketPlace!: MarketPlace;
}
