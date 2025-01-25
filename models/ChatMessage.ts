import { Table, Model, Column, DataType, HasOne, ForeignKey, BelongsTo, HasMany, AllowNull } from 'sequelize-typescript';
import { Users } from './Users';
import { Category } from './Category';
import { Ticket } from './Ticket';
import { Chats } from './Chats';




@Table({ timestamps: true, tableName: 'chat_message' })
export class ChatMessage extends Model {



    @ForeignKey(() => Users)
	@AllowNull(true)
	@Column(DataType.UUID)
	userId!: string;


	@ForeignKey(() => Users)
	@Column(DataType.UUID)
	recieverId!: string;


	@ForeignKey(() => Chats)
	@AllowNull(false)
	@Column(DataType.INTEGER)
	chatId!: number;


	@AllowNull(false)
	@Column(DataType.STRING)
	message!: string;

	
	@AllowNull(true)
	@Column(DataType.STRING)
	image!: string;


	// Model Associations
	@BelongsTo(() => Users, { onDelete: 'CASCADE' })
	user!: Users;



    @BelongsTo(() => Users, { onDelete: 'CASCADE' })
	reciever!: Users;
}
