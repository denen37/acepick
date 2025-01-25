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




@Table({ timestamps: true, tableName: 'favourite' })
export class Favourite extends Model {


	@ForeignKey(() => Users)
	@AllowNull(false)
	@Column(DataType.UUID)
	userId!: string;


	@ForeignKey(() => Users)
	@AllowNull(false)
	@Column(DataType.UUID)
	favouriteOwnerId!: string;


	@ForeignKey(() => Professional)
	@AllowNull(false)
	@Column(DataType.INTEGER)
	professionalId!: number;


	@Default(ProfileType.CLIENT)
	@Column(DataType.ENUM(ProfileType.CLIENT, ProfileType.PROFESSIONAL, ProfileType.CORPERATE))
	type!: ProfileType;


	@BelongsTo(() => Professional, { onDelete: 'CASCADE' })
	professional!: Professional;





	@BelongsTo(() => Users, { onDelete: 'CASCADE' })
	user!: Users;
}
