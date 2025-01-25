import { errorResponse, handleResponse, randomId, saltRounds, successResponse, successResponseFalse } from "../helpers/utility";
import { Request, Response } from 'express';
import { Sector } from "../models/Sector";
import { Profession } from "../models/Profession";
import { Wallet, WalletType } from "../models/Wallet";
import { CreditType, TransactionDateType, TransactionType, Transactions } from "../models/Transaction";
import { compare, hash } from "bcryptjs";
import { JobStatus, Jobs, modeType } from "../models/Jobs";
import { Users } from "../models/Users";
import { Verify } from "../models/Verify";
import { Banks } from "../models/Bank";
import { Professional, WorkType } from "../models/Professional";
import { Material } from "../models/Material";
import { Profile, ProfileType } from "../models/Profile";
import { ProfessionalSector } from "../models/ProffesionalSector";
import { Dispute } from "../models/Dispute";
import { Op, Sequelize } from "sequelize";
import moment from "moment";
import { Redis } from "../services/redis";
import { socketio } from "../app";
import { sendEmailResend } from "../services/sms";
import { sendExpoNotification } from "../services/expo";
const crypto = require('crypto');
const secret = process.env.PSK;
const Flutterwave = require('flutterwave-node-v3');
const axios = require('axios')
// Require the library
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);


export const getWallet = async (req: Request, res: Response) => {
  const { id } = req.user;
  const profile = await Profile.findOne({ where: { userId: id } })
  if (profile?.type == ProfileType.CLIENT) {
    const wallet = await Wallet.findOne({ where: { userId: id, type: WalletType.CLIENT } });
    successResponse(res, "Successful", wallet)
  } else {
    const wallet = await Wallet.findOne({ where: { userId: id, type: WalletType.PROFESSIONAL } });
    successResponse(res, "Successful", wallet)
  }

}







export const fundWallet = async (req: Request, res: Response) => {
  const { transactionId } = req.body;
  const { id } = req.user
  const profile = await Profile.findOne({ where: { userId: id } })

  if (profile?.type == ProfileType.CLIENT) {
    const wallet = await Wallet.findOne({ where: { userId: id, type: WalletType.CLIENT } })
    try {
      var response = await axios({
        method: "get",
        headers: {
          Authorization: `Bearer ${process.env.PSK}`
        },
        url: `https://api.paystack.co/transaction/verify/${transactionId}`,
      })

      const reference = await Transactions.findOne({ where: { ref: transactionId } })
      if (reference) return errorResponse(res, "Wallet Already Funded")
      let amount = response.data.data.amount
      let modifiedAmount = Math.floor(amount / 100)
      const newWallet = await wallet?.update({ amount: Number(wallet.amount) + modifiedAmount, type: WalletType.CLIENT })
      const transaction = await Transactions.create({
        type: TransactionType.CREDIT, amount: modifiedAmount,
        description: "Funding Acepick wallet",
        creditType: CreditType.FUNDING,
        ref: response.data.data.reference,
        status: "SUCCESSFUL", userId: id, walletId: wallet?.id
      });
      const redis = new Redis();
      const cachedUserSocket: any = await redis.getData(`notification-${id}`)
      const socket = socketio.sockets.sockets.get(cachedUserSocket);
      if (socket) {
        const notifications = await Transactions.findAll({
          order: [
            ['id', 'DESC']
          ],
          where: { userId: id, read: false },
          include: [
            {
              model: Jobs,
              include: [{
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
        socket.emit("notification", notifications)

      }
      return successResponse(res, "Successful", response.data)
    }

    catch (error: any) {
      if (error.response) {
        // console.log(error)
        return errorResponse(res, "Funding Failed", error.response.data)
      }

      else if (error.request) {

        return errorResponse(res, "Funding Failed", error.request)
      }
      else {
        return errorResponse(res, "Funding Failed")
      }
    };

  } else {
    const wallet = await Wallet.findOne({ where: { userId: id, type: WalletType.PROFESSIONAL } })
    try {
      var response = await axios({
        method: "get",
        headers: {
          Authorization: `Bearer ${process.env.PSK}`
        },
        url: `https://api.paystack.co/transaction/verify/${transactionId}`,
      })

      const reference = await Transactions.findOne({ where: { ref: transactionId } })
      if (reference) return errorResponse(res, "Wallet Already Funded")
      let amount = response.data.data.amount
      let modifiedAmount = Math.floor(amount / 100)
      const newWallet = await wallet?.update({ amount: Number(wallet.amount) + modifiedAmount, type: WalletType.PROFESSIONAL })
      const transaction = await Transactions.create({
        type: TransactionType.CREDIT, amount: modifiedAmount,
        description: "Funding Acepick wallet",
        creditType: CreditType.FUNDING,
        ref: response.data.data.reference,
        status: "SUCCESSFUL", userId: id, walletId: wallet?.id
      });
      const redis = new Redis();
      const cachedUserSocket: any = await redis.getData(`notification-${id}`)
      const socket = socketio.sockets.sockets.get(cachedUserSocket);
      if (socket) {
        const notifications = await Transactions.findAll({
          order: [
            ['id', 'DESC']
          ],
          where: { userId: id, read: false },
          include: [
            {
              model: Jobs,
              include: [{
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
        socket.emit("notification", notifications)

      }
      return successResponse(res, "Successful", response.data)
    }

    catch (error: any) {
      if (error.response) {
        // console.log(error)
        return errorResponse(res, "Funding Failed", error.response.data)
      }

      else if (error.request) {

        return errorResponse(res, "Funding Failed", error.request)
      }
      else {
        return errorResponse(res, "Funding Failed")
      }
    };

  }

}


export const getLatestTransaction = async (req: Request, res: Response) => {
  try {
    axios({
      method: "get",
      headers: {
        Authorization: `Bearer ${process.env.PSK}`
      },
      url: `https://api.paystack.co/transaction`,
    }).then(async function (response: any) {


      return successResponse(res, "Success", response.data)
    }).catch(function (error: any) {
      if (error.response) {
        return errorResponse(res, "Funding Failed", error.response.data)
      } else if (error.request) {
        return errorResponse(res, "Funding Failed")
      } else {
        return errorResponse(res, "Funding Failed")
      }

    });
  } catch (e: any) {
    console.log(e);
  };
}



export const updateInvoiceStatus = async (req: Request, res: Response) => {
  const { id } = req.user
  const { status, jobId, reason } = req.body
  const invoice = await Jobs.findOne({ where: { id: jobId } })
  if (!invoice) return successResponseFalse(res, "No Job found")
  const walletUser = await Wallet.findOne({ where: { userId: id, type: WalletType.CLIENT } })
  const walletProvider = await Wallet.findOne({ where: { userId: invoice?.ownerId, type: WalletType.PROFESSIONAL } })
  if (status == JobStatus.COMPLETED) {
    // if (!invoice.isLocationMatch) return successResponse(res, "Departure location has not been updated")
    await walletUser?.update({
      transitAmount: (Number(walletUser?.transitAmount) - Number(invoice?.total)),
    })
    await walletProvider?.update({
      amount: (Number(walletProvider?.amount) + Number(invoice?.total)),
    })

    const newjob = await invoice?.update({ status: JobStatus.COMPLETED })
    const owner = await Professional.findOne({ where: { userId: invoice?.ownerId } })
    const profile = await Profile.findOne({ where: { userId: newjob?.userId } })
    const ongoingJobUser = await Jobs.findAll({
      where: {
        status: JobStatus.ONGOING,
        userId: [newjob.userId],
      }
    })
    const pendingJobUser = await Jobs.findAll({
      where: {
        status: JobStatus.PENDING, userId: [newjob.userId],
      }
    })
    const completedJobUser = await Jobs.findAll({
      where: {
        status: JobStatus.COMPLETED, userId: [newjob.userId],
      }
    })
    const ongoingJobOwner = await Jobs.findAll({
      where: {
        status: JobStatus.ONGOING,
        ownerId: [newjob.ownerId],
      }
    })
    const pendingJobOwner = await Jobs.findAll({
      where: {
        status: JobStatus.PENDING, ownerId: [newjob.ownerId],
      }
    })
    const completedJobOwner = await Jobs.findAll({
      where: {
        status: JobStatus.COMPLETED, ownerId: [newjob.ownerId],
      }
    })
    await owner?.update({
      workType: WorkType.IDLE, totalJobCompleted: completedJobOwner.length,
      totalJobOngoing: ongoingJobOwner.length, totalJobPending: pendingJobOwner.length
    })
    await profile?.update({ totalOngoingHire: ongoingJobUser.length, totalPendingHire: pendingJobUser.length, totalCompletedHire: completedJobUser.length })

    await Transactions.create({
      title: "Deposit successful",
      description: `Deposit of NGN${invoice.total} into your Acepick wallet on job completed was successful`,
      type: TransactionType.CREDIT, amount: invoice?.total,
      creditType: CreditType.EARNING,
      status: "SUCCESSFUL", userId: invoice?.ownerId, walletId: walletProvider?.id
    });

    await Transactions.create({
      title: "Job Approved",
      description: `“${invoice.title}” has been approved. You wallet is now credited.`,
      type: TransactionType.JOB,
      creditType: CreditType.NONE,
      status: "SUCCESSFUL", userId: invoice?.ownerId,
      walletId: walletProvider?.id, jobId: newjob.id
    });

    await Transactions.create({
      title: "Job Approved",
      description: `“${invoice.title}” has now been approved. The professional has been paid for the job.`,
      type: TransactionType.JOB,
      creditType: CreditType.NONE,
      status: "SUCCESSFUL", userId: invoice?.userId,
      jobId: newjob.id
    });
    const redis = new Redis();

    const cachedUserSocket: any = await redis.getData(`notification-${invoice.ownerId}`)
    const socketUser = socketio.sockets.sockets.get(cachedUserSocket);

    if (socketUser) {
      const notificationsUser = await Transactions.findAll({
        order: [
          ['id', 'DESC']
        ],
        where: { userId: invoice.ownerId, read: false },
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


    const cachedOwnerSocket: any = await redis.getData(`notification-${invoice.userId}`)
    const socketOwner = socketio.sockets.sockets.get(cachedOwnerSocket);

    if (socketOwner) {
      const notificationsOnwer = await Transactions.findAll({
        order: [
          ['id', 'DESC']
        ],
        where: { userId: invoice.userId, read: false },
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



    return successResponse(res, "Successful", newjob)
  } else if (status == JobStatus.CANCEL) {
    if (invoice?.state == JobStatus.ONGOING) {
      successResponseFalse(res, "Job cannot be canceled. already ongoing")
    } else {
      const profile = await Profile.findOne({ where: { userId: invoice?.userId } })
      const ongoingJobUser = await Jobs.findAll({
        where: {
          status: JobStatus.ONGOING,
          userId: [invoice.userId],
        }
      })
      const pendingJobUser = await Jobs.findAll({
        where: {
          status: JobStatus.PENDING, userId: [invoice.userId],
        }
      })
      const completedJobUser = await Jobs.findAll({
        where: {
          status: JobStatus.COMPLETED, userId: [invoice.userId],
        }
      })
      const rejectedJobUser = await Jobs.findAll({
        where: {
          status: JobStatus.REJECTED, userId: [invoice.userId],
        }
      })
      const ongoingJobOwner = await Jobs.findAll({
        where: {
          status: JobStatus.ONGOING,
          ownerId: [invoice.ownerId],
        }
      })
      const pendingJobOwner = await Jobs.findAll({
        where: {
          status: JobStatus.PENDING, ownerId: [invoice.ownerId],
        }
      })
      const completedJobOwner = await Jobs.findAll({
        where: {
          status: JobStatus.COMPLETED, ownerId: [invoice.ownerId],
        }
      })
      const rejectedJobOwner = await Jobs.findAll({
        where: {
          status: JobStatus.REJECTED, ownerId: [invoice.ownerId],
        }
      })

      const newjob = await invoice?.update({ status: JobStatus.CANCEL, reason })
      await Transactions.create({
        title: "Job Cancelled",
        description: `“${invoice.title}” was cancelled`,
        type: TransactionType.JOB,
        creditType: CreditType.NONE,
        status: "SUCCESSFUL", userId: invoice?.ownerId,
        walletId: walletProvider?.id, jobId: newjob.id
      });

      await Transactions.create({
        title: "Job Cancelled",
        description: `“${invoice.title}” was cancelled successfully. Your wallet has been credited`,
        type: TransactionType.JOB,
        creditType: CreditType.NONE,
        status: "SUCCESSFUL", userId: invoice?.userId,
        jobId: newjob.id
      });

      const owner = await Professional.findOne({ where: { userId: invoice?.ownerId } })
      const cancelJobOwner = await Jobs.findAll({
        where: {
          status: JobStatus.CANCEL, ownerId: [invoice.ownerId],
        }
      })
      const cancelJobUser = await Jobs.findAll({
        where: {
          status: JobStatus.CANCEL, userId: [invoice.userId],
        }
      })
      await owner?.update({
        workType: WorkType.IDLE, totalJobCompleted: completedJobOwner.length,
        totalJobOngoing: ongoingJobOwner.length, totalJobPending: pendingJobOwner.length,
        totalJobCanceled: cancelJobOwner.length,
        totalJobRejected: rejectedJobOwner.length
      })
      await profile?.update({
        totalOngoingHire: ongoingJobUser.length,
        totalJobCanceled: cancelJobUser.length,
        totalPendingHire: pendingJobUser.length, totalCompletedHire: completedJobUser.length,
        totalJobRejected: rejectedJobUser.length
      })

      return successResponse(res, "Job canceled", newjob)

    }
  }
  else {

    const newjob = await invoice?.update({ status: JobStatus.REJECTED, reason })
    const owner = await Professional.findOne({ where: { userId: invoice?.ownerId } })
    const profile = await Profile.findOne({ where: { userId: invoice?.userId } })

    await Transactions.create({
      title: "Job Rejected",
      description: `“${invoice.title}” was rejected. You have 48hrs to file a dispute until the client is credited`,
      type: TransactionType.JOB,
      creditType: CreditType.NONE,
      status: "SUCCESSFUL", userId: invoice?.ownerId,
      walletId: walletProvider?.id, jobId: newjob.id
    });

    await Transactions.create({
      title: "Job Rejected",
      description: `“${invoice.title}” was rejected successfully. Your wallet will be credited after 48hrs if no dispute is filled by the professional`,
      type: TransactionType.JOB,
      creditType: CreditType.NONE,
      status: "SUCCESSFUL", userId: invoice?.userId,
      jobId: newjob.id
    });

    const ongoingJobUser = await Jobs.findAll({
      where: {
        status: JobStatus.ONGOING,
        userId: [invoice.userId],
      }
    })
    const pendingJobUser = await Jobs.findAll({
      where: {
        status: JobStatus.PENDING, userId: [invoice.userId],
      }
    })
    const completedJobUser = await Jobs.findAll({
      where: {
        status: JobStatus.COMPLETED, userId: [invoice.userId],
      }
    })
    const rejectedJobUser = await Jobs.findAll({
      where: {
        status: JobStatus.REJECTED, userId: [invoice.userId],
      }
    })
    const ongoingJobOwner = await Jobs.findAll({
      where: {
        status: JobStatus.ONGOING,
        ownerId: [invoice.ownerId],
      }
    })
    const pendingJobOwner = await Jobs.findAll({
      where: {
        status: JobStatus.PENDING, ownerId: [invoice.ownerId],
      }
    })
    const completedJobOwner = await Jobs.findAll({
      where: {
        status: JobStatus.COMPLETED, ownerId: [invoice.ownerId],
      }
    })
    const rejectedJobOwner = await Jobs.findAll({
      where: {
        status: JobStatus.REJECTED, ownerId: [invoice.ownerId],
      }
    })
    await owner?.update({
      workType: WorkType.IDLE, totalJobRejected: rejectedJobOwner.length,
      totalJobOngoing: ongoingJobOwner.length
    })
    await profile?.update({
      totalOngoingHire: ongoingJobUser.length, totalPendingHire: pendingJobUser.length, totalCompletedHire: completedJobUser.length,
      totalJobRejected: rejectedJobUser.length
    })
    return successResponse(res, "Successful", newjob)
  }


}


export const bankNameQuery = async (req: Request, res: Response) => {
  const { bankCode, accountNumber } = req.body;
  const response = await axios({
    method: 'get',
    url: `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: `Bearer ${process.env.PSK}`
    }
  })

  return successResponse(res, "Successful", response.data.data);
}


export const getBank = async (req: Request, res: Response) => {
  const response = await axios({
    method: 'get',
    url: 'https://api.paystack.co/bank?country=Nigeria',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Authorization: `Bearer ${process.env.PSK}`
    }
  })

  return successResponse(res, "Successful", response.data.data);
}


export const withdraw = async (req: Request, res: Response) => {
  const { id } = req.user
  const { amount, pin } = req.body

  const profile = await Profile.findOne({ where: { userId: id } })

  if (profile?.type == ProfileType.CLIENT) {
    const walletUser = await Wallet.findOne({ where: { userId: id, type: WalletType.CLIENT }, })


    const user = await Users.findOne({ where: { id } })
    const bankUser = await Banks.findOne({ where: { userId: id } })
    if (user?.setPin.toString() == "false") return errorResponse(res, "Please set transaction pin")
    const match = await compare(pin.toString(), walletUser!.pin.toString())
    if (!match) return errorResponse(res, "Invalid transaction pin")
    if (Number(amount) < 1000) return errorResponse(res, "Minimum withdrawal amount is NGN 1000")
    if (Number(walletUser!.amount) < Number(amount)) return errorResponse(res, "Insufficient Funds")
    const response = await axios({
      method: 'post',
      url: 'https://api.paystack.co/transferrecipient',
      data: {
        "type": "nuban",
        "name": bankUser?.accountName,
        "account_number": bankUser?.accountNumber,
        "bank_code": bankUser?.bankCode,
        "currency": "NGN"
      },
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${process.env.PSK}`
      }
    })

    console.log(response.data.data)
    const response2 = await axios({
      method: 'post',
      url: 'https://api.paystack.co/transfer',
      data: {
        "source": "balance",
        "reason": "acepick wallet withdrawal",
        "amount": amount,
        "recipient": response.data.data.recipient_code
      },
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${process.env.PSK}`
      }
    })

    await walletUser?.update({ amount: Number(walletUser.amount) - Number(amount) })
    const transaction = await Transactions.create({
      title: "Withdrawal successful",
      description: `The sum of NGN${walletUser?.amount} has been sent to your bank account successfully`,
      type: TransactionType.DEBIT, amount,
      creditType: CreditType.WITHDRAWAL,
      ref: "",
      status: "SUCCESSFUL", userId: id, walletId: walletUser?.id
    });
    const redis = new Redis();
    const cachedUserSocket: any = await redis.getData(`notification-${id}`)
    const socketUser = socketio.sockets.sockets.get(cachedUserSocket);
    if (socketUser) {
      const notificationsUser = await Transactions.findAll({
        order: [
          ['id', 'DESC']
        ],
        where: { userId: id, read: false },
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

      const walletUser = await Wallet.findOne({ where: { userId: id, type: WalletType.CLIENT } })


      socketUser.emit("wallet", walletUser)
    }

    return successResponse(res, "Successful", response2.data.data);
  } else {
    const walletUser = await Wallet.findOne({ where: { userId: id, type: WalletType.PROFESSIONAL }, })


    const user = await Users.findOne({ where: { id } })
    const bankUser = await Banks.findOne({ where: { userId: id } })
    if (user?.setPin.toString() == "false") return errorResponse(res, "Please set transaction pin")
    const match = await compare(pin.toString(), walletUser!.pin.toString())
    if (!match) return errorResponse(res, "Invalid transaction pin")
    if (Number(amount) < 1000) return errorResponse(res, "Minimum withdrawal amount is NGN 1000")
    if (Number(walletUser!.amount) < Number(amount)) return errorResponse(res, "Insufficient Funds")
    const response = await axios({
      method: 'post',
      url: 'https://api.paystack.co/transferrecipient',
      data: {
        "type": "nuban",
        "name": bankUser?.accountName,
        "account_number": bankUser?.accountNumber,
        "bank_code": bankUser?.bankCode,
        "currency": "NGN"
      },
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${process.env.PSK}`
      }
    })

    console.log(response.data.data)
    const response2 = await axios({
      method: 'post',
      url: 'https://api.paystack.co/transfer',
      data: {
        "source": "balance",
        "reason": "acepick wallet withdrawal",
        "amount": amount,
        "recipient": response.data.data.recipient_code
      },
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${process.env.PSK}`
      }
    })

    await walletUser?.update({ amount: Number(walletUser.amount) - Number(amount) })
    const transaction = await Transactions.create({
      title: "Withdrawal successful",
      description: `The sum of NGN${walletUser?.amount} has been sent to your bank account successfully`,
      type: TransactionType.DEBIT, amount,
      creditType: CreditType.WITHDRAWAL,
      ref: "",
      status: "SUCCESSFUL", userId: id, walletId: walletUser?.id
    });
    const redis = new Redis();
    const cachedUserSocket: any = await redis.getData(`notification-${id}`)
    const socketUser = socketio.sockets.sockets.get(cachedUserSocket);
    if (socketUser) {
      const notificationsUser = await Transactions.findAll({
        order: [
          ['id', 'DESC']
        ],
        where: { userId: id, read: false },
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

      const walletUser = await Wallet.findOne({ where: { userId: id, type: WalletType.PROFESSIONAL }, })


      socketUser.emit("wallet", walletUser)
    }

    return successResponse(res, "Successful", response2.data.data);
  }

}



export const payInvoiceCard = async (req: Request, res: Response) => {
  const { amount, jobId, reference } = req.body
  const invoice = await Jobs.findOne({ where: { id: jobId } })
  if (!invoice) return errorResponse(res, "Job  does not exist")
  if (invoice?.status == JobStatus.ONGOING) return errorResponse(res, "Failed", { status: false, message: "Job is already ongoing" })
  if (invoice?.paid) return errorResponse(res, "Failed", { status: false, message: "Job already paid for" })
  const owner = await Professional.findOne({ where: { userId: invoice?.ownerId } })
  const redis = new Redis()
  await redis.setData(`${reference}`, JSON.stringify({ reference, jobId, amount }))

  // new code

  const profileOwner = await Profile.findOne({ where: { userId: invoice?.ownerId } })
  const newjob = await invoice?.update({ status: invoice.mode === modeType.VIRTUAL ? JobStatus.ONGOING : JobStatus.PENDING, paid: true })
  const wallet = await Wallet.findOne({ where: { userId: newjob.userId, type: WalletType.CLIENT } })
  const fetchJob = await Jobs.findOne(
    {
      where: {
        id: invoice?.id
      },
      include: [{
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
  )
  await Transactions.create({
    title: "Invoice Paid",
    description: `Payment for “${invoice.title}” was successful. ${invoice.mode === modeType.VIRTUAL ? "Job will now be executed by the professional" : "Job remains pending until location is checked"}`,
    type: TransactionType.DEBIT, amount: amount,
    creditType: CreditType.EARNING,
    status: "SUCCESSFUL", userId: invoice.userId, walletId: wallet?.id
  });

  await Transactions.create({
    title: "Invoice Paid",
    description: `“${invoice.title}” has been paid and remains locked until approval. ${invoice.mode === modeType.VIRTUAL ? "Job is now in progress" : "Job remains pending until location is checked"}`,
    type: TransactionType.NOTIFICATION, amount: amount,
    creditType: CreditType.EARNING,
    status: "SUCCESSFUL", userId: invoice.ownerId, walletId: wallet?.id
  });


  const cachedUserSocket: any = await redis.getData(`notification - ${invoice.ownerId} `)
  const socketUser = socketio.sockets.sockets.get(cachedUserSocket);
  if (socketUser) {
    const notificationsUser = await Transactions.findAll({
      order: [
        ['id', 'DESC']
      ],
      where: { userId: invoice.ownerId, read: false },
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


  const cachedOwnerSocket: any = await redis.getData(`notification - ${invoice.userId} `)
  const socketOwner = socketio.sockets.sockets.get(cachedOwnerSocket);
  if (socketOwner) {
    const notificationsOnwer = await Transactions.findAll({
      order: [
        ['id', 'DESC']
      ],
      where: { userId: invoice.userId, read: false },
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

  const profile = await Profile.findOne({ where: { userId: invoice?.userId } })
  const ongoingJobUser = await Jobs.findAll({
    where: {
      status: JobStatus.ONGOING,
      userId: [fetchJob!.userId],
    }
  })
  const pendingJobUser = await Jobs.findAll({
    where: {
      status: JobStatus.PENDING, userId: [fetchJob!.userId],
    }
  })
  const completedJobUser = await Jobs.findAll({
    where: {
      status: JobStatus.COMPLETED, userId: [fetchJob!.userId],
    }
  })
  const rejectedJobUser = await Jobs.findAll({
    where: {
      status: JobStatus.REJECTED, userId: [fetchJob!.userId],
    }
  })
  const ongoingJobOwner = await Jobs.findAll({
    where: {
      status: JobStatus.ONGOING,
      ownerId: [fetchJob!.ownerId],
    }
  })
  const pendingJobOwner = await Jobs.findAll({
    where: {
      status: JobStatus.PENDING, ownerId: [fetchJob!.ownerId],
    }
  })
  const completedJobOwner = await Jobs.findAll({
    where: {
      status: JobStatus.COMPLETED, ownerId: [fetchJob!.ownerId],
    }
  })
  const rejectedJobOwner = await Jobs.findAll({
    where: {
      status: JobStatus.REJECTED, ownerId: [fetchJob!.ownerId],
    }
  })
  await owner?.update({
    workType: WorkType.BUSY, totalJobOngoing: ongoingJobOwner.length, totalJobPending: pendingJobOwner.length
  })
  await profile?.update({
    totalOngoingHire: ongoingJobUser.length, totalPendingHire: pendingJobUser.length, totalCompletedHire: completedJobUser.length,
    totalJobRejected: rejectedJobUser.length
  })

  return successResponse(res, "Fetched Successfully")
}




export const payInvoice = async (req: Request, res: Response) => {
  const { id } = req.user
  const { amount, jobId, pin } = req.body
  const invoice = await Jobs.findOne({ where: { id: jobId } })
  if (!invoice) return errorResponse(res, "Job  does not exist")
  if (invoice?.paid) return errorResponse(res, "Failed", { status: false, message: "Job already paid for" })
  if (invoice?.status == JobStatus.ONGOING) return errorResponse(res, "Failed", { status: false, message: "Job is already ongoing" })
  const owner = await Professional.findOne({ where: { userId: invoice?.ownerId } })
  const wallet = await Wallet.findOne({ where: { userId: id, type: WalletType.CLIENT } })
  if (!wallet!.pin) return errorResponse(res, "Failed", { status: false, message: "Set transaction pin" })
  const match = await compare(pin, wallet!.pin)
  if (!match) return errorResponse(res, "Failed", { status: false, message: "Invalid pin" })
  if (Number(wallet?.amount) < Number(amount)) return errorResponse(res, "Insufficient funds in wallet", wallet)
  await wallet?.update({
    amount: (Number(wallet?.amount) - Number(amount)),
    transitAmount: (Number(wallet?.transitAmount) + Number(amount)),
  })
  if (invoice?.mode == modeType.VIRTUAL) {
    const profileOwner = await Profile.findOne({ where: { userId: invoice?.ownerId } })
    const newjob = await invoice?.update({ status: JobStatus.ONGOING, paid: true })
    const wallet = await Wallet.findOne({ where: { userId: newjob.userId, type: WalletType.CLIENT } })
    const fetchJob = await Jobs.findOne(
      {
        where: {
          id: invoice?.id
        },
        include: [{
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
    )
    await Transactions.create({
      title: "Invoice Paid",
      description: `Payment for “${invoice.title}” was successful. ${invoice.mode === modeType.VIRTUAL ? "Job will now be executed by the professional" : "Job remains pending until location is checked"}`,
      type: TransactionType.DEBIT, amount: amount,
      creditType: CreditType.EARNING,
      status: "SUCCESSFUL", userId: invoice.userId, walletId: wallet?.id
    });

    await Transactions.create({
      title: "Invoice Paid",
      description: `“${invoice.title}” has been paid and remains locked until approval. ${invoice.mode === modeType.VIRTUAL ? "Job is now in progress" : "Job remains pending until location is checked"}`,
      type: TransactionType.NOTIFICATION, amount: amount,
      creditType: CreditType.EARNING,
      status: "SUCCESSFUL", userId: invoice.ownerId, walletId: wallet?.id
    });
    const redis = new Redis();
    const cachedUserSocket: any = await redis.getData(`notification - ${invoice.ownerId} `)
    const socketUser = socketio.sockets.sockets.get(cachedUserSocket);
    if (socketUser) {
      const notificationsUser = await Transactions.findAll({
        order: [
          ['id', 'DESC']
        ],
        where: { userId: invoice.ownerId, read: false },
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


    const cachedOwnerSocket: any = await redis.getData(`notification - ${invoice.userId} `)
    const socketOwner = socketio.sockets.sockets.get(cachedOwnerSocket);
    if (socketOwner) {
      const notificationsOnwer = await Transactions.findAll({
        order: [
          ['id', 'DESC']
        ],
        where: { userId: invoice.userId, read: false },
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

    const profile = await Profile.findOne({ where: { userId: invoice?.userId } })
    const ongoingJobUser = await Jobs.findAll({
      where: {
        status: JobStatus.ONGOING,
        userId: [fetchJob!.userId],
      }
    })
    const pendingJobUser = await Jobs.findAll({
      where: {
        status: JobStatus.PENDING, userId: [fetchJob!.userId],
      }
    })
    const completedJobUser = await Jobs.findAll({
      where: {
        status: JobStatus.COMPLETED, userId: [fetchJob!.userId],
      }
    })
    const rejectedJobUser = await Jobs.findAll({
      where: {
        status: JobStatus.REJECTED, userId: [fetchJob!.userId],
      }
    })
    const ongoingJobOwner = await Jobs.findAll({
      where: {
        status: JobStatus.ONGOING,
        ownerId: [fetchJob!.ownerId],
      }
    })
    const pendingJobOwner = await Jobs.findAll({
      where: {
        status: JobStatus.PENDING, ownerId: [fetchJob!.ownerId],
      }
    })
    const completedJobOwner = await Jobs.findAll({
      where: {
        status: JobStatus.COMPLETED, ownerId: [fetchJob!.ownerId],
      }
    })
    const rejectedJobOwner = await Jobs.findAll({
      where: {
        status: JobStatus.REJECTED, ownerId: [fetchJob!.ownerId],
      }
    })
    await owner?.update({
      workType: WorkType.BUSY, totalJobOngoing: ongoingJobOwner.length, totalJobPending: pendingJobOwner.length
    })
    await profile?.update({
      totalOngoingHire: ongoingJobUser.length, totalPendingHire: pendingJobUser.length, totalCompletedHire: completedJobUser.length,
      totalJobRejected: rejectedJobUser.length
    })

    successResponse(res, "Fetched Successfully", fetchJob)
  }
  else {
    const newjob = await invoice?.update({ paid: true, status: JobStatus.PENDING })
    const wallet = await Wallet.findOne({ where: { userId: newjob?.userId, type: WalletType.CLIENT } })
    const fetchJob = await Jobs.findOne(
      {
        where: {
          id: invoice?.id
        },
        include: [{
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
    )
    const transaction = await Transactions.create({
      title: "Invoice Payment",
      description: `Invoice Payment: ${invoice!.description} `,
      type: TransactionType.DEBIT, amount: amount,
      creditType: CreditType.EARNING,
      status: "SUCCESSFUL", userId: id, walletId: wallet?.id
    });
    const redis = new Redis();
    const cachedUserSocket: any = await redis.getData(`notification - ${newjob?.ownerId} `)
    const socketUser = socketio.sockets.sockets.get(cachedUserSocket);
    if (socketUser) {
      const notificationsUser = await Transactions.findAll({
        order: [
          ['id', 'DESC']
        ],
        where: { userId: newjob?.ownerId, read: false },
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


    const cachedOwnerSocket: any = await redis.getData(`notification - ${newjob?.userId} `)
    const socketOwner = socketio.sockets.sockets.get(cachedOwnerSocket);
    if (socketOwner) {
      const notificationsOnwer = await Transactions.findAll({
        order: [
          ['id', 'DESC']
        ],
        where: { userId: newjob?.userId, read: false },
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

    const profile = await Profile.findOne({ where: { userId: invoice?.userId } })
    const ongoingJobUser = await Jobs.findAll({
      where: {
        status: JobStatus.ONGOING,
        userId: [fetchJob!.userId],
      }
    })
    const pendingJobUser = await Jobs.findAll({
      where: {
        status: JobStatus.PENDING, userId: [fetchJob!.userId],
      }
    })
    const completedJobUser = await Jobs.findAll({
      where: {
        status: JobStatus.COMPLETED, userId: [fetchJob!.userId],
      }
    })
    const rejectedJobUser = await Jobs.findAll({
      where: {
        status: JobStatus.REJECTED, userId: [fetchJob!.userId],
      }
    })
    const ongoingJobOwner = await Jobs.findAll({
      where: {
        status: JobStatus.ONGOING,
        ownerId: [fetchJob!.ownerId],
      }
    })
    const pendingJobOwner = await Jobs.findAll({
      where: {
        status: JobStatus.PENDING, ownerId: [fetchJob!.ownerId],
      }
    })
    const completedJobOwner = await Jobs.findAll({
      where: {
        status: JobStatus.COMPLETED, ownerId: [fetchJob!.ownerId],
      }
    })
    const rejectedJobOwner = await Jobs.findAll({
      where: {
        status: JobStatus.REJECTED, ownerId: [fetchJob!.ownerId],
      }
    })
    await owner?.update({
      workType: WorkType.BUSY, totalJobOngoing: ongoingJobOwner.length, totalJobPending: pendingJobOwner.length
    })
    await profile?.update({
      totalOngoingHire: ongoingJobUser.length, totalPendingHire: pendingJobUser.length, totalCompletedHire: completedJobUser.length,
      totalJobRejected: rejectedJobUser.length
    })

    successResponse(res, "Fetched Successfully", fetchJob)
  }

}



export const setPin = async (req: Request, res: Response) => {
  const { id } = req.user
  const { pin } = req.body
  const user = await Users.findOne({ where: { id } })
  const wallet = await Wallet.findOne({ where: { userId: id, type: WalletType.PROFESSIONAL } })
  const wallet2 = await Wallet.findOne({ where: { userId: id, type: WalletType.CLIENT } })
  hash(pin, saltRounds, async function (err, hashedPin) {

    if (wallet) {
      await wallet?.update({ pin: hashedPin })
    }
    if (wallet2) {
      await wallet2?.update({ pin: hashedPin })
    }
    await user?.update({ setPin: true })
    successResponse(res, "Successful")
  })
}



export const resetPin = async (req: Request, res: Response) => {
  const { id } = req.user
  const { newPin, oldPin } = req.body
  const user = await Users.findOne({ where: { id } })
  const wallet = await Wallet.findOne({ where: { userId: id, type: WalletType.CLIENT } })
  const wallet2 = await Wallet.findOne({ where: { userId: id, type: WalletType.PROFESSIONAL } })
  const match = await compare(oldPin, wallet!.pin)
  if (!match) return errorResponse(res, "Failed", { status: false, message: "Invalid Pin" })
  hash(newPin, saltRounds, async function (err, hashedPin) {

    if (wallet) {
      await wallet?.update({ pin: hashedPin })
    }
    if (wallet2) {
      await wallet2?.update({ pin: hashedPin })
    }
    await user?.update({ setPin: true })
    successResponse(res, "Successful")
  })
}



export const emailToken = async (req: Request, res: Response) => {
  const { id } = req.user
  const user = await Users.findOne({ where: { id } })
  const serviceId = randomId(12);
  const codeEmail = String(Math.floor(1000 + Math.random() * 9000));
  await Verify.create({
    serviceId,
    code: codeEmail
  })
  const emailResult = await sendEmailResend(user!.email, "Email Verification",
    `Dear User, <br><br>

    Thank you for choosing our service.To complete your registration and ensure the security of your account, please use the verification code below < br > <br>

      Verification Code: ${codeEmail} <br><br>

        Please enter this code on our website / app to proceed with your registration process.If you did not initiate this action, please ignore this email.< br > <br>

          If you have any questions or concerns, feel free to contact our support team.< br > <br>

            Thank you, <br>
              AcepickTeam`
  );
  if (emailResult?.status) return successResponse(res, "Successful", { ...emailResult, serviceId })
  return errorResponse(res, "Failed", emailResult)
}


export const webhookPost = async (req: Request, res: Response) => {
  const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
  console.log(hash == req.headers['x-paystack-signature']);
  if (hash == req.headers['x-paystack-signature']) {
    // Retrieve the request's body
    const event = req.body;
    console.log(event)
    if (event.data.status == "success") {
      const redis = new Redis()
      const jobData = await redis.getData(`${event.data.reference}`)
      const cachedjobData = JSON.parse(jobData!);
      console.log("testng 22222")
      console.log(event.data.reference)
      console.log(cachedjobData)
      if (jobData) {
        const invoice = await Jobs.findOne({ where: { id: cachedjobData?.jobId } })
        const owner = await Users.findOne({ where: { id: invoice?.ownerId } })
        if (invoice?.mode == modeType.VIRTUAL) {
          const profileOwner = await Profile.findOne({ where: { userId: invoice?.ownerId } })
          const newjob = await invoice?.update({ status: JobStatus.ONGOING, paid: true })
          const wallet = await Wallet.findOne({ where: { userId: newjob.userId, type: WalletType.CLIENT } })
          const fetchJob = await Jobs.findOne(
            {
              where: {
                id: invoice?.id
              },
              include: [{
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
          )
          await Transactions.create({
            title: "Job payment sent",
            description: `NGN${cachedjobData.amount} has been sent to ${profileOwner?.fullName} for "${invoice.title}"`,
            type: TransactionType.DEBIT, amount: cachedjobData.amount,
            creditType: CreditType.EARNING,
            status: "SUCCESSFUL", userId: invoice.userId, walletId: wallet?.id
          });
          await Transactions.create({
            title: "Job payment recieved but on escrow",
            description: `NGN${cachedjobData.amount} has been deposited on acepick escrow account.`,
            type: TransactionType.NOTIFICATION, amount: cachedjobData.amount,
            creditType: CreditType.EARNING,
            status: "SUCCESSFUL", userId: invoice.ownerId, walletId: wallet?.id
          });
          // const jobProfileUser = await Profile.findOne({ where: { userId: invoice.userId } })
          // const jobProfileOwner = await Profile.findOne({ where: { userId: invoice.ownerId } })
          // jobProfileOwner?.fcmToken == null ? null : sendExpoNotification(jobProfileOwner!.fcmToken, body);
          // sendEmailResend(user!.email, "Dispute: Admin", `< p > ${ body } </p>`)
          // jobProfileUser?.fcmToken == null ? null : sendExpoNotification(jobProfileUser!.fcmToken, body);
          // sendEmailResend(user!.email, "Dispute: Admin", `<p>${body}</p>`)
          const redis = new Redis();
          const cachedUserSocket: any = await redis.getData(`notification-${invoice.ownerId}`)
          const socketUser = socketio.sockets.sockets.get(cachedUserSocket);
          if (socketUser) {
            const notificationsUser = await Transactions.findAll({
              order: [
                ['id', 'DESC']
              ],
              where: { userId: invoice.ownerId, read: false },
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


          const cachedOwnerSocket: any = await redis.getData(`notification-${invoice.userId}`)
          const socketOwner = socketio.sockets.sockets.get(cachedOwnerSocket);
          if (socketOwner) {
            const notificationsOnwer = await Transactions.findAll({
              order: [
                ['id', 'DESC']
              ],
              where: { userId: invoice.userId, read: false },
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

          const profile = await Profile.findOne({ where: { userId: invoice?.userId } })
          const ongoingJobUser = await Jobs.findAll({
            where: {
              status: JobStatus.ONGOING,
              userId: [fetchJob!.userId],
            }
          })
          const pendingJobUser = await Jobs.findAll({
            where: {
              status: JobStatus.PENDING, userId: [fetchJob!.userId],
            }
          })
          const completedJobUser = await Jobs.findAll({
            where: {
              status: JobStatus.COMPLETED, userId: [fetchJob!.userId],
            }
          })
          const rejectedJobUser = await Jobs.findAll({
            where: {
              status: JobStatus.REJECTED, userId: [fetchJob!.userId],
            }
          })
          const ongoingJobOwner = await Jobs.findAll({
            where: {
              status: JobStatus.ONGOING,
              ownerId: [fetchJob!.ownerId],
            }
          })
          const pendingJobOwner = await Jobs.findAll({
            where: {
              status: JobStatus.PENDING, ownerId: [fetchJob!.ownerId],
            }
          })
          const completedJobOwner = await Jobs.findAll({
            where: {
              status: JobStatus.COMPLETED, ownerId: [fetchJob!.ownerId],
            }
          })
          const rejectedJobOwner = await Jobs.findAll({
            where: {
              status: JobStatus.REJECTED, ownerId: [fetchJob!.ownerId],
            }
          })
          await owner?.update({
            workType: WorkType.BUSY, totalJobOngoing: ongoingJobOwner.length, totalJobPending: pendingJobOwner.length
          })
          await profile?.update({
            totalOngoingHire: ongoingJobUser.length, totalPendingHire: pendingJobUser.length, totalCompletedHire: completedJobUser.length,
            totalJobRejected: rejectedJobUser.length
          })


        }
        else {
          const newjob = await invoice?.update({ paid: true, status: JobStatus.PENDING })
          const wallet = await Wallet.findOne({ where: { userId: newjob?.userId, type: WalletType.CLIENT } })
          const fetchJob = await Jobs.findOne(
            {
              where: {
                id: invoice?.id
              },
              include: [{
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
          )
          const transaction = await Transactions.create({
            title: "Invoice Payment",
            description: `Invoice Payment: ${invoice!.description}`,
            type: TransactionType.DEBIT, amount: cachedjobData.amount,
            creditType: CreditType.EARNING,
            status: "SUCCESSFUL", userId: invoice?.userId, walletId: wallet?.id
          });
          const redis = new Redis();
          const cachedUserSocket: any = await redis.getData(`notification-${newjob?.ownerId}`)
          const socketUser = socketio.sockets.sockets.get(cachedUserSocket);
          if (socketUser) {
            const notificationsUser = await Transactions.findAll({
              order: [
                ['id', 'DESC']
              ],
              where: { userId: newjob?.ownerId, read: false },
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


          const cachedOwnerSocket: any = await redis.getData(`notification-${newjob?.userId}`)
          const socketOwner = socketio.sockets.sockets.get(cachedOwnerSocket);
          if (socketOwner) {
            const notificationsOnwer = await Transactions.findAll({
              order: [
                ['id', 'DESC']
              ],
              where: { userId: newjob?.userId, read: false },
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

          const profile = await Profile.findOne({ where: { userId: invoice?.userId } })
          const ongoingJobUser = await Jobs.findAll({
            where: {
              status: JobStatus.ONGOING,
              userId: [fetchJob!.userId],
            }
          })
          const pendingJobUser = await Jobs.findAll({
            where: {
              status: JobStatus.PENDING, userId: [fetchJob!.userId],
            }
          })
          const completedJobUser = await Jobs.findAll({
            where: {
              status: JobStatus.COMPLETED, userId: [fetchJob!.userId],
            }
          })
          const rejectedJobUser = await Jobs.findAll({
            where: {
              status: JobStatus.REJECTED, userId: [fetchJob!.userId],
            }
          })
          const ongoingJobOwner = await Jobs.findAll({
            where: {
              status: JobStatus.ONGOING,
              ownerId: [fetchJob!.ownerId],
            }
          })
          const pendingJobOwner = await Jobs.findAll({
            where: {
              status: JobStatus.PENDING, ownerId: [fetchJob!.ownerId],
            }
          })
          const completedJobOwner = await Jobs.findAll({
            where: {
              status: JobStatus.COMPLETED, ownerId: [fetchJob!.ownerId],
            }
          })
          const rejectedJobOwner = await Jobs.findAll({
            where: {
              status: JobStatus.REJECTED, ownerId: [fetchJob!.ownerId],
            }
          })
          await owner?.update({
            workType: WorkType.BUSY, totalJobOngoing: ongoingJobOwner.length, totalJobPending: pendingJobOwner.length
          })
          await profile?.update({
            totalOngoingHire: ongoingJobUser.length, totalPendingHire: pendingJobUser.length, totalCompletedHire: completedJobUser.length,
            totalJobRejected: rejectedJobUser.length
          })


        }
      }




      else {

        const user = await Users.findOne({ where: { email: event.data.customer.email } })
        if (!user) return res.send(200);
        const profile = await Profile.findOne({ where: { userId: user.id } })

        if (profile?.type == ProfileType.CLIENT) {
          const wallet = await Wallet.findOne({ where: { userId: user!.id, type: WalletType.CLIENT } })
          if (!wallet) return res.send(200);
          const reference = await Transactions.findOne({ where: { ref: event.data.reference } })
          if (!reference) {
            let amount = event.data.amount
            let modifiedAmount = Math.floor(amount / 100)
            const newWallet = await wallet?.update({ amount: Number(wallet.amount) + modifiedAmount, type: WalletType.CLIENT })
            const transaction = await Transactions.create({
              title: "Deposit",
              type: TransactionType.CREDIT, amount: modifiedAmount,
              description: "Funding Acepick wallet",
              creditType: CreditType.FUNDING,
              ref: event.data.reference,
              status: "SUCCESSFUL", userId: user.id, walletId: wallet?.id
            });
            const redis = new Redis();
            const cachedUserSocket: any = await redis.getData(`notification-${user.id}`)
            const socketUser = socketio.sockets.sockets.get(cachedUserSocket);
            if (socketUser) {
              const notificationsUser = await Transactions.findAll({
                order: [
                  ['id', 'DESC']
                ],
                where: { userId: user.id, read: false },
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
              const walletUser = await Wallet.findOne({ where: { userId: user!.id, type: WalletType.CLIENT } })

              socketUser.emit("notification", notificationsUser)
              socketUser.emit("wallet", walletUser)
            }



          }
        } else {
          const wallet = await Wallet.findOne({ where: { userId: user!.id, type: WalletType.PROFESSIONAL } })
          if (!wallet) return res.send(200);
          const reference = await Transactions.findOne({ where: { ref: event.data.reference } })
          if (!reference) {
            let amount = event.data.amount
            let modifiedAmount = Math.floor(amount / 100)
            const newWallet = await wallet?.update({ amount: Number(wallet.amount) + modifiedAmount, type: WalletType.PROFESSIONAL })
            const transaction = await Transactions.create({
              title: "Deposit",
              type: TransactionType.CREDIT, amount: modifiedAmount,
              description: "Funding Acepick wallet",
              creditType: CreditType.FUNDING,
              ref: event.data.reference,
              status: "SUCCESSFUL", userId: user.id, walletId: wallet?.id
            });
            const redis = new Redis();
            const cachedUserSocket: any = await redis.getData(`notification-${user.id}`)
            const socketUser = socketio.sockets.sockets.get(cachedUserSocket);
            if (socketUser) {
              const notificationsUser = await Transactions.findAll({
                order: [
                  ['id', 'DESC']
                ],
                where: { userId: user.id, read: false },
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
              const walletUser = await Wallet.findOne({ where: { userId: user!.id, type: WalletType.PROFESSIONAL } })

              socketUser.emit("notification", notificationsUser)
              socketUser.emit("wallet", walletUser)
            }



          }
        }
      }



    }
    // Do something with event  
  }
  res.send(200);

}


export const getTransactions = async (req: Request, res: Response) => {
  const { id } = req.user
  const transactions = await Transactions.findAll({
    where: { userId: id, read: false },
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
    order: [
      ['id', 'DESC']
    ],
  })
  successResponse(res, "Successful", transactions)
}




export const addBank = async (req: Request, res: Response) => {
  const { id } = req.user
  const bankExist = await Banks.findAll({
    where: { userId: id }, order: [
      ['id', 'DESC']
    ],
  })
  const { accountNumber, bankCode, accountName, bankName } = req.body;
  if (bankExist.length >= 1) {
    let index = 0
    for (let value of bankExist) {
      await value.destroy()
      index++
    }
    if (index == bankExist.length) {
      const insertData = {
        accountNumber, bankCode, accountName, bankName, userId: id
      }
      const banks = await Banks.create(insertData)
      successResponse(res, "Successful", banks)
    }
  } else {
    const insertData = {
      accountNumber, bankCode, accountName, bankName, userId: id
    }
    const banks = await Banks.create(insertData)
    successResponse(res, "Successful", banks)
  }

}



export const getBanks = async (req: Request, res: Response) => {
  const { id } = req.user
  const banks = await Banks.findAll({
    where: { userId: id }, order: [
      ['id', 'DESC']
    ],
  })
  successResponse(res, "Successful", banks)
}



export const deleteBank = async (req: Request, res: Response) => {
  let { id } = req.query;
  try {
    const banks = await Banks.findOne({ where: { id } })
    if (!banks) return errorResponse(res, "Bank does not exist");
    await banks?.destroy()
    return successResponse(res, "Bank Deleted");
  } catch (error) {
    console.log(error);
    return errorResponse(res, `An error occurred - ${error}`);
  }
}



export const getUserTransaction = async (req: Request, res: Response) => {
  let { id } = req.user;
  const notifications = await Transactions.findAll({
    order: [
      ['id', 'DESC']
    ],
    where: {
      userId: id,
      //  read: false
    },
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
    limit: 50
  });
  return successResponse(res, 'Sucessful', notifications);
};



export const updateTransaction = async (req: Request, res: Response) => {
  let { id } = req.user;
  const { notificationId } = req.body;
  const notification = await Transactions.findOne({ where: { id: notificationId } })
  await notification?.update({ read: true })
  return successResponse(res, 'Sucessful');
}





