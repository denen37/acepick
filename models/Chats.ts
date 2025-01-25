import { Table, Model, Column, DataType, HasOne, ForeignKey, BelongsTo, HasMany, AllowNull, Default } from 'sequelize-typescript';
import { Users } from './Users';
import { Category } from './Category';
import { TicketMessage } from './TicketMessage';
import { Admin } from './Admin';
import { ChatMessage } from './ChatMessage';


export enum chatStatus{
	READ = 'READ',
	UNREAD = 'UNREAD'
}

@Table({ timestamps: true, tableName: 'chat' })
export class Chats extends Model {
	
   

	@ForeignKey(() => Users)
	@Column(DataType.UUID)
	userId!: string;


	
	@ForeignKey(() => Users)
	@Column(DataType.UUID)
	recieverId!: string;





    @Default(chatStatus.UNREAD)
	@AllowNull(true)
	@Column(DataType.ENUM(chatStatus.UNREAD, chatStatus.READ))
	status!: chatStatus;



    @Default("")
    @AllowNull(false)
	@Column(DataType.STRING)
	lastMessage!: string;



	// Model Associations
	@BelongsTo(() => Users, { onDelete: 'CASCADE' })
	user!: Users;

    @BelongsTo(() => Users, { onDelete: 'CASCADE' })
    reciever!: Users;



	@HasMany(() => ChatMessage)
	message!: ChatMessage[];
}
