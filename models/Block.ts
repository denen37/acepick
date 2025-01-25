import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Users } from './Users';
import { ProfileType } from './Profile';



@Table({ timestamps: true, tableName: 'block' })
export class Blocked extends Model {

    @ForeignKey(() => Users)
    @AllowNull(false)
    @Column(DataType.UUID)
    blockedUserid!: string;


    @ForeignKey(() => Users)
    @AllowNull(false)
    @Column(DataType.UUID)
    userId!: string;
    

    @AllowNull(true)
	@Column(DataType.STRING)
	fullName!: string;


    @AllowNull(true)
	@Column(DataType.STRING)
	avatar!: string;



    @BelongsTo(() => Users, { onDelete: 'CASCADE', foreignKey: 'blockedUserid', as: 'blockedUser', })
    blockedUser!: Users;

    // @Default(ProfileType.PROFESSIONAL)
	// @Column(DataType.ENUM(ProfileType.CLIENT, ProfileType.PROFESSIONAL, ProfileType.CORPERATE))
	// type!: ProfileType;


    @BelongsTo(() => Users, { onDelete: 'CASCADE', foreignKey: 'userId', as: 'user', })
    user!: Users;

}
