

import { Request, Response } from 'express';
import { upload_cloud } from '../../helpers/upload';
import { Sector } from '../../models/Sector';
import { errorResponse, successResponse } from '../../helpers/utility';
import { Profession } from '../../models/Profession';
import { UserStatus, Users } from '../../models/Users';
import { Op } from 'sequelize';
import { Profile, ProfileType } from '../../models/Profile';
import { Professional } from '../../models/Professional';
import { Wallet, WalletType } from '../../models/Wallet';
import { Corperate } from '../../models/Cooperation';
import { JobStatus, Jobs } from '../../models/Jobs';
import { VoiceRecord } from '../../models/VoiceRecording';
import { Dispute, DisputeStatus } from '../../models/Dispute';
import { TicketMessage } from '../../models/TicketMessage';
import { Ticket } from '../../models/Ticket';
import { LanLog } from '../../models/LanLog';
import { ProfessionalSector } from '../../models/ProffesionalSector';
import { sendEmailResend } from '../../services/sms';
import { Material } from '../../models/Material';
import { CreditType, TransactionType, Transactions } from '../../models/Transaction';
import { socketio } from '../../app';
import { Redis } from '../../services/redis';
import { MarketPlace } from '../../models/Market';
import { Review } from '../../models/Review';
import { Sequelize } from 'sequelize-typescript';


export const getAllUsers = async (req: Request, res: Response) => {
	const client = await Users.findAll({
		order: [
			['createdAt', 'DESC']
		],
		include: [{
			model: Profile, where: {
				type: ProfileType.CLIENT
			}
		}]
	})
	const Professional = await Users.findAll({
		order: [
			['createdAt', 'DESC']
		],
		include: [{
			model: Profile, where: {
				// type: ProfileType.PROFESSIONAL,
				corperate: false
			}
		}]
	})

	const corperate = await Users.findAll({
		order: [
			['createdAt', 'DESC']
		],
		include: [{
			model: Profile, where: {
				// type: ProfileType.PROFESSIONAL,
				corperate: true
			}
		}]
	})
	return successResponse(res, "Successful", { client, corperate, Professional })
};









export const sortUsers = async (req: Request, res: Response) => {

	const { role, status, type, search } = req.query;
	// const { id } = req.user;
	console.log(role == ProfileType.CORPERATE)

	try {

		const queryParams: any = {

		};
		const queryParams2: any = {

		};
		const queryParams3: any = {

		};



		if (role) {
			queryParams.type = role;
		}

		if (status) {
			queryParams2.status = status;
		}


		if (type) {
			queryParams3.workType = type;
		}

		if (role == ProfileType.PROFESSIONAL) {
			if (search) {
				const getProfile = await Professional.findAll({
					where: queryParams3,
					order: [
						['id', 'DESC']
					],
					include: [{
						model: Users,
						where: queryParams2,
						attributes: ["email", "phone", "status"],
						include: [{
							model: Wallet,
							where: {
								type: WalletType.PROFESSIONAL
							},
							attributes: ["amount"]
						}, { model: LanLog }

						]
					},

					{
						model: Profile,
						where: {
							...queryParams,
							corperate: 0,
							[Op.or]: [
								{ fullName: { [Op.like]: `%${search}%` } },


							],
						},
						attributes: ["fullName", "avatar", "lga", "state", "address", "bvn", "type", "corperate"],
						include: [{
							model: ProfessionalSector, include: [
								{ model: Sector },
								{ model: Profession },
							]
						}]
					},
					{
						model: Corperate,
					}
					],
				});
				if (getProfile) return successResponse(res, "Fetched Successfully", getProfile);
				return errorResponse(res, "Failed fetching Users");
			} else {
				const getProfile = await Professional.findAll({
					where: queryParams3,
					order: [
						['id', 'DESC']
					],
					include: [{
						model: Users,
						where: queryParams2,
						attributes: ["email", "phone", "status"],
						include: [{
							model: Wallet,
							where: {
								type: WalletType.PROFESSIONAL
							},
							attributes: ["amount"]
						}, { model: LanLog }
						]
					},

					{
						model: Profile,
						where: {
							...queryParams,
							corperate: 0
						},
						attributes: ["fullName", "avatar", "lga", "state", "address", "bvn", "type", "corperate"],
						include: [{
							model: ProfessionalSector, include: [
								{ model: Sector },
								{ model: Profession },
							]
						}]
					},
					{
						model: Corperate,
						attributes: ["nameOfOrg", "phone", "address", "state", "lga", "regNum", "noOfEmployees"]
					}
					],
				});
				if (getProfile) return successResponse(res, "Fetched Successfully", getProfile);
				return errorResponse(res, "Failed fetching Users");
			}

		} else if (role == ProfileType.CORPERATE) {
			if (search) {
				console.log("ppppp")
				const getProfile = await Professional.findAll({
					where: queryParams3,
					order: [
						['id', 'DESC']
					],
					include: [{
						model: Users,
						where: queryParams2,
						attributes: ["email", "phone", "status"],
						include: [{
							model: Wallet,

							where: {
								type: WalletType.PROFESSIONAL
							}, attributes: ["amount"]
						}, { model: LanLog }

						]
					},

					{
						model: Profile,
						where: {

							corperate: 1,
							[Op.or]: [
								{ fullName: { [Op.like]: `%${search}%` } },


							],
						},
						attributes: ["fullName", "avatar", "lga", "state", "address", "bvn", "type", "corperate"],
						include: [{
							model: ProfessionalSector, include: [
								{ model: Sector },
								{ model: Profession },
							]
						}]
					},
					{
						model: Corperate,
					}
					],
				});
				if (getProfile) return successResponse(res, "Fetched Successfully", getProfile);
				return errorResponse(res, "Failed fetching Users");
			} else {

				const getProfile = await Professional.findAll({
					where: queryParams3,
					order: [
						['id', 'DESC']
					],
					include: [{
						model: Users,
						where: queryParams2,
						attributes: ["email", "phone", "status"],
						include: [{
							model: Wallet,
							where: {
								type: WalletType.PROFESSIONAL
							},
							attributes: ["amount"]
						}, { model: LanLog }
						]
					},

					{
						model: Profile,
						where: {

							corperate: 1
						},
						attributes: ["fullName", "avatar", "lga", "state", "address", "bvn", "type", "corperate"],
						include: [{
							model: ProfessionalSector, include: [
								{ model: Sector },
								{ model: Profession },
							]
						}]
					},
					{
						model: Corperate,
						attributes: ["nameOfOrg", "phone", "address", "state", "lga", "regNum", "noOfEmployees"]
					}
					],
				});
				if (getProfile) return successResponse(res, "Fetched Successfully", getProfile);
				return errorResponse(res, "Failed fetching Users");
			}

		}



		else if (role == ProfileType.CLIENT) {
			if (search) {
				const getProfile = await Profile.findAll({
					where: {
						...queryParams, [Op.or]: [
							{ fullName: { [Op.like]: `%${search}%` } },


						]
					},
					order: [
						['id', 'DESC']
					],
					include: [{
						model: Users,
						where: queryParams2,
						attributes: ["email", "phone", "status"],
						include: [{
							model: Wallet,
							where: {
								type: WalletType.CLIENT
							},
							attributes: ["amount"]
						}, { model: LanLog }]
					}],
				});

				if (getProfile) return successResponse(res, "Fetched Successfully", getProfile);
				return errorResponse(res, "Failed fetching Users");
			} else {
				const getProfile = await Profile.findAll({
					where: queryParams,
					order: [
						['id', 'DESC']
					],
					include: [{
						model: Users,
						where: queryParams2,
						attributes: ["email", "phone", "status"],
						include: [{
							model: Wallet,
							where: {
								type: WalletType.CLIENT
							},
							attributes: ["amount"]
						}, { model: LanLog }]
					}],
				});

				if (getProfile) return successResponse(res, "Fetched Successfully", getProfile);
				return errorResponse(res, "Failed fetching Users");
			}

		} else {
			if (search) {
				const getProfile = await Profile.findAll({
					where: {
						...queryParams, [Op.or]: [
							{ fullName: { [Op.like]: `%${search}%` } },


						]
					},
					order: [
						['id', 'DESC']
					],
					include: [{
						model: Users,
						where: queryParams2,
						attributes: ["email", "phone", "status"],
						include: [{
							model: Wallet,
							where: {
								type: WalletType.PROFESSIONAL
							},
							attributes: ["amount"]
						}, { model: LanLog }]
					}],
				});

				if (getProfile) return successResponse(res, "Fetched Successfully", getProfile);
				return errorResponse(res, "Failed fetching Users");
			} else {
				const getProfile = await Profile.findAll({
					where: queryParams,
					order: [
						['id', 'DESC']
					],
					include: [{
						model: Users,
						where: queryParams2,
						attributes: ["email", "phone", "status"],
						include: [{
							model: Wallet,
							where: {
								type: WalletType.PROFESSIONAL
							},
							attributes: ["amount"]
						}, { model: LanLog }]
					}],
				});

				if (getProfile) return successResponse(res, "Fetched Successfully", getProfile);
				return errorResponse(res, "Failed fetching Users");
			}
		}



	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occurred - ${error}`);
	}
}




export const userProfile = async (req: Request, res: Response) => {
	const { id, type } = req.query;

	if (type == ProfileType.PROFESSIONAL || type == ProfileType.CORPERATE) {
		const profile = await Professional.findOne({
			where: { userId: id },
			include: [{
				model: Users,
				attributes: ["email", "phone", "status"],
				include: [
					{
						model: Wallet,

						where: {
							type: WalletType.PROFESSIONAL
						}, attributes: ["amount"]
					},
					{ model: LanLog },
					{ model: Jobs, attributes: ["status", "id"] }]
			},
			//   {model: Profession},
			//   {model: Sector},
			{
				model: Profile,
				attributes: ["fullName", "avatar", "lga", "state", "address", "bvn", "type"],
				include: [{
					model: VoiceRecord,
					attributes: ["id", "url", "createdAt"],

				},
				{ model: MarketPlace },


				{
					model: ProfessionalSector, include: [
						{ model: Sector },
						{ model: Profession },
					]
				}]
			},
			{
				model: Corperate,
				attributes: ["nameOfOrg", "phone", "address", "state", "lga", "regNum", "noOfEmployees"]
			}
			],
		});

		const review = await Review.findAll({
			where: {
				proffesionalUserId: id,
			},
			include: [{
				model: Users, as: "user",
				attributes: ["id"], include: [{ model: Profile, attributes: ["fullName", "avatar"] }]
			}]
		})

		const all_transactions_spend = await Transactions.findAll({
			order: [
				['id', 'DESC']
			],
			where: {
				userId: id,
				type: TransactionType.DEBIT,
			},
			attributes: [[Sequelize.literal('SUM(amount)'), 'result']],
		});


		const all_transactions_earn = await Transactions.findAll({
			order: [
				['id', 'DESC']
			],
			where: {
				userId: id,
				type: TransactionType.CREDIT,
				creditType: CreditType.EARNING
			},
			attributes: [[Sequelize.literal('SUM(amount)'), 'result']],
		});

		if (profile) return successResponse(res, "Fetched Successfully", {
			profile, review,
			totalSpending: all_transactions_spend[0].dataValues.result ?? 0,
			totalEarning: all_transactions_earn[0].dataValues.result ?? 0,

		});
		return errorResponse(res, "Failed fetching Users");
	} else {
		const profile = await Profile.findOne({
			where: { userId: id },
			include: [{
				model: Users,
				attributes: ["email", "phone", "status"],
				include: [{
					model: Wallet,

					where: {
						type: WalletType.CLIENT
					}, attributes: ["amount"]
				},
				{ model: LanLog },
				{ model: Jobs, attributes: ["status", "id"] }]
			},
			{ model: MarketPlace },
			{
				model: VoiceRecord,
				attributes: ["id", "url", "createdAt"]
			}
			],
		});

		const all_transactions_spend = await Transactions.findAll({
			order: [
				['id', 'DESC']
			],
			where: {
				userId: id,
				type: TransactionType.DEBIT,
			},
			attributes: [[Sequelize.literal('SUM(amount)'), 'result']],
		});


		const review = await Review.findAll({
			where: {
				clientUserId: id
			},
			include: [{
				model: Users, as: "user",
				attributes: ["id"], include: [{ model: Profile, attributes: ["fullName", "avatar"] }]
			}]
		})

		if (profile) return successResponse(res, "Fetched Successfully", {
			profile, review,
			totalSpending: all_transactions_spend[0].dataValues.result ?? 0,
		});
		return errorResponse(res, "Failed fetching Users");
	}


}



export const updateUserStatus = async (req: Request, res: Response) => {
	const { status, id } = req.body;
	const user = await Users.findOne(
		{
			where: {
				id
			}
		}
	)
	if (!user) return errorResponse(res, "Failed", { status: false, message: "User Not Found" })
	const profile = await Profile.findOne({ where: { userId: id } })
	const update = await user?.update({ status })
	if (status == UserStatus.SUSPENDED) {
		await sendEmailResend(user!.email, "Acepick Account Status", `<p>Hello ${profile?.fullName},<br><br> Your account is ${status} for violating a rule, please contact support to resolve this issue. Best Regards.</p>`);
		return successResponse(res, "Successful", update)
	} else {
		await sendEmailResend(user!.email, "Acepick Account Status", `Hello ${profile?.fullName},<br> You can now use acepick features without restriction. Best Regards.`);
		return successResponse(res, "Successful", update)
	}

};




export const deleteUser = async (req: Request, res: Response) => {
	const { id } = req.body;
	const user = await Users.findOne(
		{
			where: {
				id
			}
		}
	)
	if (!user) return errorResponse(res, "Failed", { status: false, message: "user not Found" })

	const update = await user?.destroy()
	return successResponse(res, "Deleted Successfully", update)
};



export const deleteRecording = async (req: Request, res: Response) => {
	const { id } = req.body;
	const record = await VoiceRecord.findOne(
		{
			where: {
				id
			}
		}
	)
	if (!record) return errorResponse(res, "Failed", { status: false, message: "record not Found" })

	const update = await record?.destroy()
	return successResponse(res, "Deleted Successfully", update)
};




export const updateDisputeStatus = async (req: Request, res: Response) => {
	const { id, infavourof } = req.body;
	const dispute = await Dispute.findOne(
		{
			where: {
				id
			}
		}
	)
	if (!dispute) return errorResponse(res, "Failed", { status: false, message: "Dispute Not Found" })
	if (dispute.status == DisputeStatus.RESOLVED) return errorResponse(res, "Dispute already Resolved", { status: true, message: "Dispute already Resolved" })

	const update = await dispute?.update({ status: DisputeStatus.RESOLVED })
	const job = await Jobs.findOne({ where: { id: dispute.jobId } })
	await job?.update({
		status: JobStatus.COMPLETED
	})

	if (infavourof == ProfileType.PROFESSIONAL) {
		const invoice = await Jobs.findOne({
			where: {
				id: dispute.jobId
			}
		})

		const walletUser = await Wallet.findOne({ where: { userId: invoice!.userId, type: WalletType.CLIENT } })
		const walletProvider = await Wallet.findOne({ where: { userId: invoice!.ownerId, type: WalletType.PROFESSIONAL } })

		await walletUser?.update({
			transitAmount: (Number(walletUser?.transitAmount) - Number(invoice?.total)),
			amount: (Number(walletUser?.amount) + Number(invoice?.total)),
		})
		await Transactions.create({
			title: "Deposit successful",
			description: `Your deposit of NGN${invoice!.total} into your Acepick wallet on job cencelation was successful`,
			type: TransactionType.CREDIT, amount: invoice?.total,
			creditType: CreditType.FUNDING,
			status: "SUCCESSFUL", userId: invoice?.userId, walletId: walletUser?.id
		});
		await Transactions.create({
			title: "Job Canceled",
			description: `The Job "${invoice!.title}" has been canceled`,
			type: TransactionType.JOB,
			creditType: CreditType.NONE,
			status: "CANCELED", userId: invoice?.ownerId,
			walletId: walletProvider?.id, jobId: invoice!.id
		});

		await Transactions.create({
			title: "Job Canceled",
			description: `The Job "${invoice!.title}" has been canceled`,
			type: TransactionType.JOB,
			creditType: CreditType.NONE,
			status: "CANCELED", userId: invoice?.userId,
			jobId: invoice!.id
		});

		await invoice!.update({ processed: true })

		const redis = new Redis();
		const cachedUserSocket: any = await redis.getData(`notification-${invoice!.ownerId}`)
		const socketUser = socketio.sockets.sockets.get(cachedUserSocket);
		if (socketUser) {
			const notificationsUser = await Transactions.findAll({
				order: [
					['id', 'DESC']
				],
				where: { userId: invoice!.ownerId, read: false },
				include: [
					{
						model: Jobs, include: [{
							model: Material
						},
						{
							model: Users,
							as: "client",
							attributes: ["id"],
							include: [
								{
									model: Profile,
									attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
									],
								}
							]
						},
						{
							model: Users,
							as: "owner",
							attributes: ["id"],
							include: [{
								model: Professional,
								include: [
									{
										model: Profile,
										attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
										],
										include: [
											{
												model: ProfessionalSector,
												include: [
													{ model: Sector },
													{ model: Profession },
												],

											}
										]
									}
								]

							}]
						},
						{ model: Dispute }]
					}
				],
				limit: 1

			});
			socketUser.emit("notification", notificationsUser)

			const walletUser = await Wallet.findOne({ where: { userId: invoice!.ownerId, type: WalletType.PROFESSIONAL } })


			socketUser.emit("wallet", walletUser)
		}


		const cachedOwnerSocket: any = await redis.getData(`notification-${invoice!.userId}`)
		const socketOwner = socketio.sockets.sockets.get(cachedOwnerSocket);
		if (socketOwner) {
			const notificationsOnwer = await Transactions.findAll({
				order: [
					['id', 'DESC']
				],
				where: { userId: invoice!.userId, read: false },
				include: [
					{
						model: Jobs, include: [{
							model: Material
						},
						{
							model: Users,
							as: "client",
							attributes: ["id"],
							include: [
								{
									model: Profile,
									attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
									],
								}
							]
						},
						{
							model: Users,
							as: "owner",
							attributes: ["id"],
							include: [{
								model: Professional,
								include: [
									{
										model: Profile,
										attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
										],
										include: [
											{
												model: ProfessionalSector,
												include: [
													{ model: Sector },
													{ model: Profession },
												],

											}
										]
									}
								]

							}]
						},
						{ model: Dispute }]
					}
				],
				limit: 1

			});
			socketOwner.emit("notification", notificationsOnwer)

			const walletUser = await Wallet.findOne({ where: { userId: invoice!.userId, type: WalletType.CLIENT } })


			socketOwner.emit("wallet", walletUser)
		}
		return successResponse(res, "Successful", update)
	} else {
		const invoice = await Jobs.findOne({
			where: {
				id: dispute.jobId
			}
		})

		const walletUser = await Wallet.findOne({ where: { userId: invoice!.userId, type: WalletType.CLIENT } })
		const walletProvider = await Wallet.findOne({ where: { userId: invoice!.ownerId, type: WalletType.PROFESSIONAL } })

		await walletProvider?.update({
			transitAmount: (Number(walletProvider?.transitAmount) - Number(invoice?.total)),
			amount: (Number(walletProvider?.amount) + Number(invoice?.total)),
		})
		await Transactions.create({
			title: "Deposit successful",
			description: `Your deposit of NGN${invoice!.total} into your Acepick wallet on job cencelation was successful`,
			type: TransactionType.CREDIT, amount: invoice?.total,
			creditType: CreditType.FUNDING,
			status: "SUCCESSFUL", userId: invoice?.ownerId, walletId: walletProvider?.id
		});
		await Transactions.create({
			title: "Job Approved",
			description: `The Job "${invoice!.title}" has been approved`,
			type: TransactionType.JOB,
			creditType: CreditType.NONE,
			status: "SUCCESSFUL", userId: invoice?.ownerId,
			walletId: walletProvider?.id, jobId: invoice!.id
		});

		await Transactions.create({
			title: "Job Approved",
			description: `The Job "${invoice!.title}" has been approved`,
			type: TransactionType.JOB,
			creditType: CreditType.NONE,
			status: "SUCCESSFUL", userId: invoice?.userId,
			jobId: invoice!.id
		});

		await invoice!.update({ processed: true })

		const redis = new Redis();
		const cachedUserSocket: any = await redis.getData(`notification-${invoice!.ownerId}`)
		const socketUser = socketio.sockets.sockets.get(cachedUserSocket);
		if (socketUser) {
			const notificationsUser = await Transactions.findAll({
				order: [
					['id', 'DESC']
				],
				where: { userId: invoice!.ownerId, read: false },
				include: [
					{
						model: Jobs, include: [{
							model: Material
						},
						{
							model: Users,
							as: "client",
							attributes: ["id"],
							include: [
								{
									model: Profile,
									attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
									],
								}
							]
						},
						{
							model: Users,
							as: "owner",
							attributes: ["id"],
							include: [{
								model: Professional,
								include: [
									{
										model: Profile,
										attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
										],
										include: [
											{
												model: ProfessionalSector,
												include: [
													{ model: Sector },
													{ model: Profession },
												],

											}
										]
									}
								]

							}]
						},
						{ model: Dispute }]
					}
				],
				limit: 1

			});
			socketUser.emit("notification", notificationsUser)

			const walletUser = await Wallet.findOne({ where: { userId: invoice!.ownerId, type: WalletType.PROFESSIONAL } })


			socketUser.emit("wallet", walletUser)
		}


		const cachedOwnerSocket: any = await redis.getData(`notification-${invoice!.userId}`)
		const socketOwner = socketio.sockets.sockets.get(cachedOwnerSocket);
		if (socketOwner) {
			const notificationsOnwer = await Transactions.findAll({
				order: [
					['id', 'DESC']
				],
				where: { userId: invoice!.userId, read: false },
				include: [
					{
						model: Jobs, include: [{
							model: Material
						},
						{
							model: Users,
							as: "client",
							attributes: ["id"],
							include: [
								{
									model: Profile,
									attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
									],
								}
							]
						},
						{
							model: Users,
							as: "owner",
							attributes: ["id"],
							include: [{
								model: Professional,
								include: [
									{
										model: Profile,
										attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
										],
										include: [
											{
												model: ProfessionalSector,
												include: [
													{ model: Sector },
													{ model: Profession },
												],

											}
										]
									}
								]

							}]
						},
						{ model: Dispute }]
					}
				],
				limit: 1

			});
			socketOwner.emit("notification", notificationsOnwer)

			const walletUser = await Wallet.findOne({ where: { userId: invoice!.userId, type: WalletType.CLIENT } })


			socketOwner.emit("wallet", walletUser)
		}
		return successResponse(res, "Successful", update)
	}







};


export const getSingleDisputes = async (req: Request, res: Response) => {
	const { id } = req.query;
	const dispute = await Dispute.findOne({
		where: { id },
		include: [
			{ model: Users, attributes: ["email", "id"], as: 'reporter', include: [Profile] },
			{ model: Users, attributes: ["email", "id"], as: 'partner', include: [Profile] },
			{ model: Jobs }
		],
		order: [
			['id', 'DESC']
		],
	})

	const voicerecord = await VoiceRecord.findAll({
		where: {
			userId: [dispute?.reporterId, dispute?.partnerId],
			recieverId: [dispute?.reporterId, dispute?.partnerId]
		},
		include: [
			{ model: Users, attributes: ["email", "id"], as: 'reciever', include: [Profile] },
			{ model: Users, attributes: ["email", "id"], as: 'user', include: [Profile] },
		]
	})
	return successResponse(res, "Successful", { dispute, voicerecord })
};



export const getAllDisputes = async (req: Request, res: Response) => {
	const users = await Dispute.findAll({
		include: [
			{ model: Users, attributes: ["email", "id"], as: 'reporter' },
			{ model: Users, attributes: ["email", "id"], as: 'partner' },
			{ model: Jobs }
		],
		order: [
			['id', 'DESC']
		],
	})
	return successResponse(res, "Successful", users)
};



export const deleteDisputes = async (req: Request, res: Response) => {
	const { id } = req.body;
	const dispute = await Dispute.findOne(
		{
			where: {
				id
			}
		}
	)
	if (!dispute) return errorResponse(res, "Failed", { status: false, message: "dispute not Found" })

	const update = await dispute?.destroy()
	return successResponse(res, "Deleted Successfully", update)
};



export const deleteTicketMesaage = async (req: Request, res: Response) => {
	const { id } = req.body;
	const ticketMessage = await TicketMessage.findOne(
		{
			where: {
				id
			}
		}
	)
	if (!ticketMessage) return errorResponse(res, "Failed", { status: false, message: "ticket message not Found" })

	const update = await ticketMessage?.destroy()
	return successResponse(res, "Deleted Successfully", update)
};











export const getJobs = async (req: Request, res: Response) => {
	const { status, userId } = req.query;
	const jobs = await Jobs.findAll({
		where: { status, providerId: userId },
		order: [
			['id', 'DESC']
		],
		include: [
			{ model: Users, attributes: ["email", "id"], as: 'user' },
			{ model: Users, attributes: ["email", "id"], as: 'provider' },
			{ model: Dispute }
		]
	})
	return successResponse(res, "Successful", jobs)
};



export const postTicketMessage = async (req: Request, res: Response) => {

	let { admin, ticketId, message, image } = req.body;
	// const {id} = req.user;
	// userId =  id;
	const getTicket = await Ticket.findOne({ where: { id: ticketId } });
	if (!getTicket) return successResponse(res, "Ticket Not Found");

	if (req.files) {
		//     // Read content from the file
		let uploadedImageurl = []
		for (var file of req.files as any) {
			// upload image here
			const result = await upload_cloud(file.path.replace(/ /g, "_"));
			uploadedImageurl.push(result.secure_url)
			image = uploadedImageurl
			console.log(image)
		}
		try {
			const insertData = {
				image: uploadedImageurl[0],
				message, admin, ticketId: Number(ticketId),
				userId: getTicket.userId,
				adminId: getTicket.adminId,
			}
			const createTicketMessage = await TicketMessage.create(insertData);
			if (createTicketMessage) return successResponse(res, "Created Successfully", createTicketMessage);
			return errorResponse(res, "Failed Creating Ticket Message");

		} catch (error) {
			console.log(error);
			return errorResponse(res, `An error occurred - ${error}`);
		}


	}
	else {
		try {
			const insertData = {

				message, admin, ticketId: Number(ticketId),
				adminId: getTicket.adminId,
				userId: getTicket.userId,

			}
			const createTicketMessage = await TicketMessage.create(insertData);
			if (createTicketMessage) return successResponse(res, "Created Successfully", createTicketMessage);
			return errorResponse(res, "Failed Creating Ticket Message");

		} catch (error) {
			console.log(error);
			return errorResponse(res, `An error occurred - ${error}`);
		}
	}


}




export const postTicket = async (req: Request, res: Response) => {

	let { userId, name, lastMessage, image, description } = req.body;
	const { id } = req.admin

	console.log(id)
	console.log(id)
	console.log(id)

	if (req.files) {

		//     // Read content from the file
		let uploadedImageurl = []
		for (var file of req.files as any) {
			// upload image here
			const result = await upload_cloud(file.path.replace(/ /g, "_"));

			uploadedImageurl.push(result.secure_url)

			image = uploadedImageurl
			console.log(image)
		}

		try {
			const insertData = {
				userId,
				adminId: id,
				name, description, lastMessage, image: {
					images: uploadedImageurl
				}
			}
			console.log(insertData)
			const createTicket = await Ticket.create(insertData);
			if (createTicket) return successResponse(res, "Created Successfully", createTicket);
			return errorResponse(res, "Failed Creating Ticket");

		} catch (error) {
			console.log(error);
			return errorResponse(res, `An error occurred - ${error}`);
		}


	} else {
		try {
			const insertData = {
				userId,
				adminId: id,
				name, description, lastMessage
			}
			console.log(insertData)
			const createTicket = await Ticket.create(insertData);
			if (createTicket) return successResponse(res, "Created Successfully", createTicket);
			return errorResponse(res, "Failed Creating Ticket");

		} catch (error) {
			console.log(error);
			return errorResponse(res, `An error occurred - ${error}`);
		}
	}
}




export const getTicketMessage = async (req: Request, res: Response) => {
	let { ticketId } = req.query;
	try {
		const getTicketMessages = await TicketMessage.findAll({
			where: {
				ticketId
			},
			order: [
				['id', 'DESC']
			],
		});
		if (getTicketMessages) return successResponse(res, "Fetched Successfully", getTicketMessages);
		return errorResponse(res, "Ticket Messages Does not exist");

	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occurred - ${error}`);
	}
}



export const deleteTicket = async (req: Request, res: Response) => {

	let { ticketId } = req.query;

	try {
		const getTicket = await Ticket.findOne({ where: { id: ticketId } })
		if (!getTicket) return errorResponse(res, "Ticket does not exist");
		await getTicket?.destroy()
		return successResponse(res, "Ticket Deleted");
		// return errorResponse(res, "Failed Creating Product/Service");

	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occurred - ${error}`);
	}
}





export const getUserTicket = async (req: Request, res: Response) => {

	const { id } = req.user;
	const { status } = req.query;

	try {
		if (status) {
			const getTickets = await Ticket.findAll({
				where: {
					userId: id,
					status
				},
				order: [
					['id', 'DESC']
				],
			});
			if (getTickets) return successResponse(res, "Fetched Successfully", getTickets);
			return errorResponse(res, "Ticket Does not exist");
		} else {
			const getTickets = await Ticket.findAll({
				order: [
					['id', 'DESC']
				],
			});
			if (getTickets) return successResponse(res, "Fetched Successfully", getTickets);
			return errorResponse(res, "Ticket Does not exist");
		}

	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occurred - ${error}`);
	}
}





export const getAllTicket = async (req: Request, res: Response) => {

	const { status } = req.query;

	try {
		if (status) {

			const getTickets = await Ticket.findAll({
				where: {
					status
				},
				order: [
					['id', 'DESC']
				],
			});
			if (getTickets) return successResponse(res, "Fetched Successfully", getTickets);
			return errorResponse(res, "Ticket Does not exist");

		} else {

			const getTickets = await Ticket.findAll({
				order: [
					['id', 'DESC']
				],

			});
			if (getTickets) return successResponse(res, "Fetched Successfully", getTickets);
			return errorResponse(res, "Ticket Does not exist");

		}


	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occurred - ${error}`);
	}
}




export const updateTicket = async (req: Request, res: Response) => {

	let { name, status, lastMessage, image, ticketId, description } = req.body;
	// const { id } = req.user;
	const ticket = await Ticket.findOne({ where: { id: ticketId } })

	if (!ticket) return successResponse(res, "No Ticket Found");


	if (req.files) {

		//     // Read content from the file
		let uploadedImageurl = []
		for (var file of req.files as any) {
			// upload image here
			const result = await upload_cloud(file.path.replace(/ /g, "_"));

			uploadedImageurl.push(result.secure_url)

			image = uploadedImageurl
			console.log(image)
		}

		try {
			const insertData = {
				name: name ?? ticket?.name, status: status ?? ticket?.status,
				lastMessage: lastMessage ?? ticket?.lastMessage, description: description ?? ticket?.description,
				image: {
					images: uploadedImageurl
				}
			}
			const updateTicket = await ticket.update(insertData);
			// wallet?.update({balance: })
			if (updateTicket) return successResponse(res, "Updated Successfully", updateTicket);
			return errorResponse(res, "Failed Updating Ticket");

		} catch (error) {
			console.log(error);
			return errorResponse(res, `An error occurred - ${error}`);
		}


	} else {
		try {
			const insertData = {
				name: name ?? ticket?.name, status: status ?? ticket?.status,
				image: ticket?.image,
				lastMessage: lastMessage ?? ticket?.lastMessage, description: description ?? ticket?.description,
			}
			const updateTicket = await ticket.update(insertData);
			// wallet?.update({balance: })
			if (updateTicket) return successResponse(res, "Updated Successfully", updateTicket);
			return errorResponse(res, "Failed Updating Ticket");

		} catch (error) {
			console.log(error);
			return errorResponse(res, `An error occurred - ${error}`);
		}
	}
}
