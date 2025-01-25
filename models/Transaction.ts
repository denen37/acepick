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
import { Wallet } from './Wallet';
import { Jobs } from './Jobs';


export enum TransactionType {
	DEBIT = 'DEBIT',
	CREDIT = 'CREDIT',
	NOTIFICATION = "NOTIFICATION",
	JOB = "JOB"
}


export enum CreditType {
	FUNDING = "FUNDING",
	EARNING = "EARNING",
	WITHDRAWAL = "WITHDRAWAL",
	PERCENT = "PERCENT",
	NONE = "NONE"
}

export enum TransactionDateType {
	SINGLE_DATE = 'SINGLE_DATE',
	THIS_MONTH = 'THIS_MONTH',
	DATE_RANGE = 'DATE_RANGE',
	MONTH = 'MONTH',
	ALL = 'ALL',

}


export enum PaymentType {
	COMPLETE = "COMPLETE",
	PENDING = "PENDING",
	NONE = "NONE"
}



@Table({ timestamps: true, tableName: 'transactions' })
export class Transactions extends Model {


	// @AllowNull(false)
	// @Column(DataType.STRING)
	// date!: string;


	@AllowNull(true)
	@Column(DataType.STRING)
	ref!: string;


	@AllowNull(true)
	@Column(DataType.STRING)
	description!: string;


	@AllowNull(true)
	@Column(DataType.STRING)
	title!: string;

	@AllowNull(true)
	@Column(DataType.ENUM(TransactionType.CREDIT, TransactionType.DEBIT, TransactionType.NOTIFICATION, TransactionType.JOB))
	type!: TransactionType;


	@AllowNull(true)
	@Default(null)
	@Column(DataType.ENUM(CreditType.FUNDING, CreditType.EARNING, CreditType.WITHDRAWAL, CreditType.PERCENT, CreditType.NONE))
	creditType!: CreditType;


	@AllowNull(true)
	@Default(PaymentType.NONE)
	@Column(DataType.ENUM(PaymentType.COMPLETE, PaymentType.PENDING, PaymentType.NONE))
	paid!: PaymentType;



	@AllowNull(true)
	@Column(DataType.STRING)
	amount!: number;


	@Default(false)
	@AllowNull(true)
	@Column(DataType.BOOLEAN)
	read!: boolean;






	@AllowNull(true)
	@Column(DataType.STRING)
	status!: string;


	@AllowNull(true)
	@ForeignKey(() => Jobs)
	@Column(DataType.INTEGER)
	jobId!: string;

	@AllowNull(true)
	@ForeignKey(() => Users)
	@Column(DataType.UUID)
	userId!: string;


	@AllowNull(true)
	@ForeignKey(() => Wallet)
	@Column(DataType.INTEGER)
	walletId!: number;

	@BelongsTo(() => Jobs, { onDelete: 'CASCADE' })
	job!: Jobs;
}
