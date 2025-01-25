import { Table, Model, Column, DataType, HasOne, ForeignKey, BelongsTo, HasMany, AllowNull } from 'sequelize-typescript';
import { Users } from './Users';
import { Category } from './Category';
import { Ticket } from './Ticket';




@Table({ timestamps: true, tableName: 'ticket_message' })
export class TicketMessage extends Model {



	@ForeignKey(() => Users)
	@AllowNull(true)
	@Column(DataType.UUID)
	userId!: string;


	@ForeignKey(() => Users)
	@AllowNull(true)
	@Column(DataType.UUID)
	adminId!: string;


	@ForeignKey(() => Ticket)
	@AllowNull(false)
	@Column(DataType.INTEGER)
	ticketId!: number;



	@AllowNull(false)
	@Column(DataType.STRING)
	message!: number;



	@AllowNull(false)
	@Column(DataType.BOOLEAN)
	admin!: boolean;



	@AllowNull(true)
	@Column(DataType.STRING)
	image!: string;


	// Model Associations
	@BelongsTo(() => Users, { onDelete: 'CASCADE' })
	user!: Users;





	// @HasMany(() => InvoiceItems)
	// invoiceItems!: InvoiceItems[];
}
