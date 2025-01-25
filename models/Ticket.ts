import { Table, Model, Column, DataType, HasOne, ForeignKey, BelongsTo, HasMany, AllowNull, Default } from 'sequelize-typescript';
import { Users } from './Users';
import { Category } from './Category';
import { TicketMessage } from './TicketMessage';
import { Admin } from './Admin';


export enum ticketStatus {
	WAITING = 'WAITING',
	ACTIVE = 'ACTIVE',
	CLOSED = 'CLOSED'
}

@Table({ timestamps: true, tableName: 'ticket' })
export class Ticket extends Model {



	@ForeignKey(() => Users)
	@Column(DataType.UUID)
	userId!: string;



	@Default(1)
	@ForeignKey(() => Admin)
	@Column(DataType.INTEGER)
	adminId!: number;

	@AllowNull(false)
	@Column(DataType.STRING)
	name!: string;




	@AllowNull(false)
	@Column(DataType.STRING)
	description!: string;





	@Default(ticketStatus.WAITING)
	@AllowNull(true)
	@Column(DataType.ENUM(ticketStatus.ACTIVE, ticketStatus.CLOSED, ticketStatus.WAITING))
	status!: ticketStatus;



	@Default("")
	@AllowNull(false)
	@Column(DataType.STRING)
	lastMessage!: string;


	@AllowNull(true)
	@Column(DataType.JSON)
	image!: any;



	// Model Associations
	@BelongsTo(() => Users, { onDelete: 'CASCADE' })
	user!: Users;


	@BelongsTo(() => Admin, { onDelete: 'CASCADE' })
	admin!: Admin;


	@HasMany(() => TicketMessage)
	message!: TicketMessage[];
}
