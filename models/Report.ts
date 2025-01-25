import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Profile } from './Profile';
import { Wallet } from './Wallet';
import { LanLog } from './LanLog';
import { Users } from './Users';
import { Jobs } from './Jobs';




@Table({ timestamps: true, tableName: 'report' })
export class Report extends Model {

 

    @AllowNull(false)
    @Column(DataType.STRING)
    cause!: string;


    @ForeignKey(() => Users)
    @AllowNull(true)
    @Column(DataType.UUID)
    userId!: number;


    @AllowNull(true)
	@Column(DataType.STRING)
	fullName!: string;


    @AllowNull(true)
	@Column(DataType.STRING)
	avatar!: string;



    @ForeignKey(() => Users)
    @AllowNull(true)
    @Column(DataType.UUID)
    reporterId!: string;


    @BelongsTo(() => Users, { onDelete: 'CASCADE', foreignKey: 'reporterId', as: 'reporter', })
    reporter!: Users;


    @BelongsTo(() => Users, { onDelete: 'CASCADE', foreignKey: 'userId', as: 'user', })
    user!: Users;

}
