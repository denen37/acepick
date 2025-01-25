import { Table, Model, Column, DataType, HasOne, BelongsToMany, HasMany, AllowNull, Unique, Default, Index, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Profile } from './Profile';
import { Wallet } from './Wallet';
import { LanLog } from './LanLog';
import { Users } from './Users';
import { Jobs } from './Jobs';




export enum DisputeStatus {
	RESOLVED = 'RESOLVED',
	PENDING = 'PENDING',
	SUPERADMIN = "SUPERADMIN"
}





@Table({ timestamps: true, tableName: 'dispute' })
export class Dispute extends Model {

	

	@AllowNull(false)
	@Column(DataType.STRING)
	cause!: string;

	@Default(DisputeStatus.PENDING)
	@Column(DataType.ENUM(DisputeStatus.RESOLVED, DisputeStatus.PENDING, DisputeStatus.SUPERADMIN))
	status!: DisputeStatus;


	@AllowNull(true)
	@Column(DataType.STRING)
	url!: any;


	@ForeignKey(() => Jobs)
	@AllowNull(true)
	@Column(DataType.INTEGER)
	jobId!: number;



	@ForeignKey(() => Users)
	@AllowNull(true)
	@Column(DataType.UUID)
	reporterId!: string;



	@ForeignKey(() => Users)
	@AllowNull(true)
	@Column(DataType.UUID)
	partnerId!: string;


	// relationships
	@BelongsTo(() => Jobs, { onDelete: 'CASCADE' })
	job!: Jobs;



	@BelongsTo(() => Users, { onDelete: 'CASCADE', foreignKey: 'reporterId', as: 'reporter', })
	reporter!: Users;


	@BelongsTo(() => Users, { onDelete: 'CASCADE', foreignKey: 'partnerId', as: 'partner', })
	partner!: Users;





}
