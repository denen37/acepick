"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransaction = exports.getUserTransaction = exports.deleteBank = exports.getBanks = exports.addBank = exports.getTransactions = exports.webhookPost = exports.emailToken = exports.resetPin = exports.setPin = exports.payInvoice = exports.payInvoiceCard = exports.withdraw = exports.getBank = exports.bankNameQuery = exports.updateInvoiceStatus = exports.getLatestTransaction = exports.fundWallet = exports.getWallet = void 0;
const utility_1 = require("../helpers/utility");
const Sector_1 = require("../models/Sector");
const Profession_1 = require("../models/Profession");
const Wallet_1 = require("../models/Wallet");
const Transaction_1 = require("../models/Transaction");
const bcryptjs_1 = require("bcryptjs");
const Jobs_1 = require("../models/Jobs");
const Users_1 = require("../models/Users");
const Verify_1 = require("../models/Verify");
const Bank_1 = require("../models/Bank");
const Professional_1 = require("../models/Professional");
const Material_1 = require("../models/Material");
const Profile_1 = require("../models/Profile");
const ProffesionalSector_1 = require("../models/ProffesionalSector");
const Dispute_1 = require("../models/Dispute");
const redis_1 = require("../services/redis");
const app_1 = require("../app");
const sms_1 = require("../services/sms");
const crypto = require('crypto');
const secret = process.env.PSK;
const Flutterwave = require('flutterwave-node-v3');
const axios = require('axios');
// Require the library
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
const getWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const profile = yield Profile_1.Profile.findOne({ where: { userId: id } });
    if ((profile === null || profile === void 0 ? void 0 : profile.type) == Profile_1.ProfileType.CLIENT) {
        const wallet = yield Wallet_1.Wallet.findOne({ where: { userId: id, type: Wallet_1.WalletType.CLIENT } });
        (0, utility_1.successResponse)(res, "Successful", wallet);
    }
    else {
        const wallet = yield Wallet_1.Wallet.findOne({ where: { userId: id, type: Wallet_1.WalletType.PROFESSIONAL } });
        (0, utility_1.successResponse)(res, "Successful", wallet);
    }
});
exports.getWallet = getWallet;
const fundWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId } = req.body;
    const { id } = req.user;
    const profile = yield Profile_1.Profile.findOne({ where: { userId: id } });
    if ((profile === null || profile === void 0 ? void 0 : profile.type) == Profile_1.ProfileType.CLIENT) {
        const wallet = yield Wallet_1.Wallet.findOne({ where: { userId: id, type: Wallet_1.WalletType.CLIENT } });
        try {
            var response = yield axios({
                method: "get",
                headers: {
                    Authorization: `Bearer ${process.env.PSK}`
                },
                url: `https://api.paystack.co/transaction/verify/${transactionId}`,
            });
            const reference = yield Transaction_1.Transactions.findOne({ where: { ref: transactionId } });
            if (reference)
                return (0, utility_1.errorResponse)(res, "Wallet Already Funded");
            let amount = response.data.data.amount;
            let modifiedAmount = Math.floor(amount / 100);
            const newWallet = yield (wallet === null || wallet === void 0 ? void 0 : wallet.update({ amount: Number(wallet.amount) + modifiedAmount, type: Wallet_1.WalletType.CLIENT }));
            const transaction = yield Transaction_1.Transactions.create({
                type: Transaction_1.TransactionType.CREDIT, amount: modifiedAmount,
                description: "Funding Acepick wallet",
                creditType: Transaction_1.CreditType.FUNDING,
                ref: response.data.data.reference,
                status: "SUCCESSFUL", userId: id, walletId: wallet === null || wallet === void 0 ? void 0 : wallet.id
            });
            const redis = new redis_1.Redis();
            const cachedUserSocket = yield redis.getData(`notification-${id}`);
            const socket = app_1.socketio.sockets.sockets.get(cachedUserSocket);
            if (socket) {
                const notifications = yield Transaction_1.Transactions.findAll({
                    order: [
                        ['id', 'DESC']
                    ],
                    where: { userId: id, read: false },
                    include: [
                        {
                            model: Jobs_1.Jobs,
                            include: [{
                                    model: Material_1.Material
                                },
                                {
                                    model: Users_1.Users,
                                    as: "client",
                                    attributes: ["id"],
                                    include: [
                                        {
                                            model: Profile_1.Profile,
                                            attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                            ],
                                        }
                                    ]
                                },
                                {
                                    model: Users_1.Users,
                                    as: "owner",
                                    attributes: ["id"],
                                    include: [{
                                            model: Professional_1.Professional,
                                            include: [
                                                {
                                                    model: Profile_1.Profile,
                                                    attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                    ],
                                                    include: [
                                                        {
                                                            model: ProffesionalSector_1.ProfessionalSector,
                                                            include: [
                                                                { model: Sector_1.Sector },
                                                                { model: Profession_1.Profession },
                                                            ],
                                                        }
                                                    ]
                                                }
                                            ]
                                        }]
                                },
                                { model: Dispute_1.Dispute }]
                        }
                    ],
                    limit: 1
                });
                socket.emit("notification", notifications);
            }
            return (0, utility_1.successResponse)(res, "Successful", response.data);
        }
        catch (error) {
            if (error.response) {
                // console.log(error)
                return (0, utility_1.errorResponse)(res, "Funding Failed", error.response.data);
            }
            else if (error.request) {
                return (0, utility_1.errorResponse)(res, "Funding Failed", error.request);
            }
            else {
                return (0, utility_1.errorResponse)(res, "Funding Failed");
            }
        }
        ;
    }
    else {
        const wallet = yield Wallet_1.Wallet.findOne({ where: { userId: id, type: Wallet_1.WalletType.PROFESSIONAL } });
        try {
            var response = yield axios({
                method: "get",
                headers: {
                    Authorization: `Bearer ${process.env.PSK}`
                },
                url: `https://api.paystack.co/transaction/verify/${transactionId}`,
            });
            const reference = yield Transaction_1.Transactions.findOne({ where: { ref: transactionId } });
            if (reference)
                return (0, utility_1.errorResponse)(res, "Wallet Already Funded");
            let amount = response.data.data.amount;
            let modifiedAmount = Math.floor(amount / 100);
            const newWallet = yield (wallet === null || wallet === void 0 ? void 0 : wallet.update({ amount: Number(wallet.amount) + modifiedAmount, type: Wallet_1.WalletType.PROFESSIONAL }));
            const transaction = yield Transaction_1.Transactions.create({
                type: Transaction_1.TransactionType.CREDIT, amount: modifiedAmount,
                description: "Funding Acepick wallet",
                creditType: Transaction_1.CreditType.FUNDING,
                ref: response.data.data.reference,
                status: "SUCCESSFUL", userId: id, walletId: wallet === null || wallet === void 0 ? void 0 : wallet.id
            });
            const redis = new redis_1.Redis();
            const cachedUserSocket = yield redis.getData(`notification-${id}`);
            const socket = app_1.socketio.sockets.sockets.get(cachedUserSocket);
            if (socket) {
                const notifications = yield Transaction_1.Transactions.findAll({
                    order: [
                        ['id', 'DESC']
                    ],
                    where: { userId: id, read: false },
                    include: [
                        {
                            model: Jobs_1.Jobs,
                            include: [{
                                    model: Material_1.Material
                                },
                                {
                                    model: Users_1.Users,
                                    as: "client",
                                    attributes: ["id"],
                                    include: [
                                        {
                                            model: Profile_1.Profile,
                                            attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                            ],
                                        }
                                    ]
                                },
                                {
                                    model: Users_1.Users,
                                    as: "owner",
                                    attributes: ["id"],
                                    include: [{
                                            model: Professional_1.Professional,
                                            include: [
                                                {
                                                    model: Profile_1.Profile,
                                                    attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                    ],
                                                    include: [
                                                        {
                                                            model: ProffesionalSector_1.ProfessionalSector,
                                                            include: [
                                                                { model: Sector_1.Sector },
                                                                { model: Profession_1.Profession },
                                                            ],
                                                        }
                                                    ]
                                                }
                                            ]
                                        }]
                                },
                                { model: Dispute_1.Dispute }]
                        }
                    ],
                    limit: 1
                });
                socket.emit("notification", notifications);
            }
            return (0, utility_1.successResponse)(res, "Successful", response.data);
        }
        catch (error) {
            if (error.response) {
                // console.log(error)
                return (0, utility_1.errorResponse)(res, "Funding Failed", error.response.data);
            }
            else if (error.request) {
                return (0, utility_1.errorResponse)(res, "Funding Failed", error.request);
            }
            else {
                return (0, utility_1.errorResponse)(res, "Funding Failed");
            }
        }
        ;
    }
});
exports.fundWallet = fundWallet;
const getLatestTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        axios({
            method: "get",
            headers: {
                Authorization: `Bearer ${process.env.PSK}`
            },
            url: `https://api.paystack.co/transaction`,
        }).then(function (response) {
            return __awaiter(this, void 0, void 0, function* () {
                return (0, utility_1.successResponse)(res, "Success", response.data);
            });
        }).catch(function (error) {
            if (error.response) {
                return (0, utility_1.errorResponse)(res, "Funding Failed", error.response.data);
            }
            else if (error.request) {
                return (0, utility_1.errorResponse)(res, "Funding Failed");
            }
            else {
                return (0, utility_1.errorResponse)(res, "Funding Failed");
            }
        });
    }
    catch (e) {
        console.log(e);
    }
    ;
});
exports.getLatestTransaction = getLatestTransaction;
const updateInvoiceStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { status, jobId, reason } = req.body;
    const invoice = yield Jobs_1.Jobs.findOne({ where: { id: jobId } });
    if (!invoice)
        return (0, utility_1.successResponseFalse)(res, "No Job found");
    const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: id, type: Wallet_1.WalletType.CLIENT } });
    const walletProvider = yield Wallet_1.Wallet.findOne({ where: { userId: invoice === null || invoice === void 0 ? void 0 : invoice.ownerId, type: Wallet_1.WalletType.PROFESSIONAL } });
    if (status == Jobs_1.JobStatus.COMPLETED) {
        // if (!invoice.isLocationMatch) return successResponse(res, "Departure location has not been updated")
        yield (walletUser === null || walletUser === void 0 ? void 0 : walletUser.update({
            transitAmount: (Number(walletUser === null || walletUser === void 0 ? void 0 : walletUser.transitAmount) - Number(invoice === null || invoice === void 0 ? void 0 : invoice.total)),
        }));
        yield (walletProvider === null || walletProvider === void 0 ? void 0 : walletProvider.update({
            amount: (Number(walletProvider === null || walletProvider === void 0 ? void 0 : walletProvider.amount) + Number(invoice === null || invoice === void 0 ? void 0 : invoice.total)),
        }));
        const newjob = yield (invoice === null || invoice === void 0 ? void 0 : invoice.update({ status: Jobs_1.JobStatus.COMPLETED }));
        const owner = yield Professional_1.Professional.findOne({ where: { userId: invoice === null || invoice === void 0 ? void 0 : invoice.ownerId } });
        const profile = yield Profile_1.Profile.findOne({ where: { userId: newjob === null || newjob === void 0 ? void 0 : newjob.userId } });
        const ongoingJobUser = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.ONGOING,
                userId: [newjob.userId],
            }
        });
        const pendingJobUser = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.PENDING, userId: [newjob.userId],
            }
        });
        const completedJobUser = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.COMPLETED, userId: [newjob.userId],
            }
        });
        const ongoingJobOwner = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.ONGOING,
                ownerId: [newjob.ownerId],
            }
        });
        const pendingJobOwner = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.PENDING, ownerId: [newjob.ownerId],
            }
        });
        const completedJobOwner = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.COMPLETED, ownerId: [newjob.ownerId],
            }
        });
        yield (owner === null || owner === void 0 ? void 0 : owner.update({
            workType: Professional_1.WorkType.IDLE, totalJobCompleted: completedJobOwner.length,
            totalJobOngoing: ongoingJobOwner.length, totalJobPending: pendingJobOwner.length
        }));
        yield (profile === null || profile === void 0 ? void 0 : profile.update({ totalOngoingHire: ongoingJobUser.length, totalPendingHire: pendingJobUser.length, totalCompletedHire: completedJobUser.length }));
        yield Transaction_1.Transactions.create({
            title: "Deposit successful",
            description: `Deposit of NGN${invoice.total} into your Acepick wallet on job completed was successful`,
            type: Transaction_1.TransactionType.CREDIT, amount: invoice === null || invoice === void 0 ? void 0 : invoice.total,
            creditType: Transaction_1.CreditType.EARNING,
            status: "SUCCESSFUL", userId: invoice === null || invoice === void 0 ? void 0 : invoice.ownerId, walletId: walletProvider === null || walletProvider === void 0 ? void 0 : walletProvider.id
        });
        yield Transaction_1.Transactions.create({
            title: "Job Approved",
            description: `“${invoice.title}” has been approved. You wallet is now credited.`,
            type: Transaction_1.TransactionType.JOB,
            creditType: Transaction_1.CreditType.NONE,
            status: "SUCCESSFUL", userId: invoice === null || invoice === void 0 ? void 0 : invoice.ownerId,
            walletId: walletProvider === null || walletProvider === void 0 ? void 0 : walletProvider.id, jobId: newjob.id
        });
        yield Transaction_1.Transactions.create({
            title: "Job Approved",
            description: `“${invoice.title}” has now been approved. The professional has been paid for the job.`,
            type: Transaction_1.TransactionType.JOB,
            creditType: Transaction_1.CreditType.NONE,
            status: "SUCCESSFUL", userId: invoice === null || invoice === void 0 ? void 0 : invoice.userId,
            jobId: newjob.id
        });
        const redis = new redis_1.Redis();
        const cachedUserSocket = yield redis.getData(`notification-${invoice.ownerId}`);
        const socketUser = app_1.socketio.sockets.sockets.get(cachedUserSocket);
        if (socketUser) {
            const notificationsUser = yield Transaction_1.Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: { userId: invoice.ownerId, read: false },
                include: [
                    {
                        model: Jobs_1.Jobs, include: [{
                                model: Material_1.Material
                            },
                            {
                                model: Users_1.Users,
                                as: "client",
                                attributes: ["id"],
                                include: [
                                    {
                                        model: Profile_1.Profile,
                                        attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                        ],
                                    }
                                ]
                            },
                            {
                                model: Users_1.Users,
                                as: "owner",
                                attributes: ["id"],
                                include: [{
                                        model: Professional_1.Professional,
                                        include: [
                                            {
                                                model: Profile_1.Profile,
                                                attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                ],
                                                include: [
                                                    {
                                                        model: ProffesionalSector_1.ProfessionalSector,
                                                        include: [
                                                            { model: Sector_1.Sector },
                                                            { model: Profession_1.Profession },
                                                        ],
                                                    }
                                                ]
                                            }
                                        ]
                                    }]
                            },
                            { model: Dispute_1.Dispute }]
                    }
                ],
                limit: 1
            });
            socketUser.emit("notification", notificationsUser);
            const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: invoice.ownerId, type: Wallet_1.WalletType.PROFESSIONAL } });
            socketUser.emit("wallet", walletUser);
        }
        const cachedOwnerSocket = yield redis.getData(`notification-${invoice.userId}`);
        const socketOwner = app_1.socketio.sockets.sockets.get(cachedOwnerSocket);
        if (socketOwner) {
            const notificationsOnwer = yield Transaction_1.Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: { userId: invoice.userId, read: false },
                include: [
                    {
                        model: Jobs_1.Jobs, include: [{
                                model: Material_1.Material
                            },
                            {
                                model: Users_1.Users,
                                as: "client",
                                attributes: ["id"],
                                include: [
                                    {
                                        model: Profile_1.Profile,
                                        attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                        ],
                                    }
                                ]
                            },
                            {
                                model: Users_1.Users,
                                as: "owner",
                                attributes: ["id"],
                                include: [{
                                        model: Professional_1.Professional,
                                        include: [
                                            {
                                                model: Profile_1.Profile,
                                                attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                ],
                                                include: [
                                                    {
                                                        model: ProffesionalSector_1.ProfessionalSector,
                                                        include: [
                                                            { model: Sector_1.Sector },
                                                            { model: Profession_1.Profession },
                                                        ],
                                                    }
                                                ]
                                            }
                                        ]
                                    }]
                            },
                            { model: Dispute_1.Dispute }]
                    }
                ],
                limit: 1
            });
            socketOwner.emit("notification", notificationsOnwer);
            const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: invoice.userId, type: Wallet_1.WalletType.CLIENT } });
            socketOwner.emit("wallet", walletUser);
        }
        return (0, utility_1.successResponse)(res, "Successful", newjob);
    }
    else if (status == Jobs_1.JobStatus.CANCEL) {
        if ((invoice === null || invoice === void 0 ? void 0 : invoice.state) == Jobs_1.JobStatus.ONGOING) {
            (0, utility_1.successResponseFalse)(res, "Job cannot be canceled. already ongoing");
        }
        else {
            const profile = yield Profile_1.Profile.findOne({ where: { userId: invoice === null || invoice === void 0 ? void 0 : invoice.userId } });
            const ongoingJobUser = yield Jobs_1.Jobs.findAll({
                where: {
                    status: Jobs_1.JobStatus.ONGOING,
                    userId: [invoice.userId],
                }
            });
            const pendingJobUser = yield Jobs_1.Jobs.findAll({
                where: {
                    status: Jobs_1.JobStatus.PENDING, userId: [invoice.userId],
                }
            });
            const completedJobUser = yield Jobs_1.Jobs.findAll({
                where: {
                    status: Jobs_1.JobStatus.COMPLETED, userId: [invoice.userId],
                }
            });
            const rejectedJobUser = yield Jobs_1.Jobs.findAll({
                where: {
                    status: Jobs_1.JobStatus.REJECTED, userId: [invoice.userId],
                }
            });
            const ongoingJobOwner = yield Jobs_1.Jobs.findAll({
                where: {
                    status: Jobs_1.JobStatus.ONGOING,
                    ownerId: [invoice.ownerId],
                }
            });
            const pendingJobOwner = yield Jobs_1.Jobs.findAll({
                where: {
                    status: Jobs_1.JobStatus.PENDING, ownerId: [invoice.ownerId],
                }
            });
            const completedJobOwner = yield Jobs_1.Jobs.findAll({
                where: {
                    status: Jobs_1.JobStatus.COMPLETED, ownerId: [invoice.ownerId],
                }
            });
            const rejectedJobOwner = yield Jobs_1.Jobs.findAll({
                where: {
                    status: Jobs_1.JobStatus.REJECTED, ownerId: [invoice.ownerId],
                }
            });
            const newjob = yield (invoice === null || invoice === void 0 ? void 0 : invoice.update({ status: Jobs_1.JobStatus.CANCEL, reason }));
            yield Transaction_1.Transactions.create({
                title: "Job Cancelled",
                description: `“${invoice.title}” was cancelled`,
                type: Transaction_1.TransactionType.JOB,
                creditType: Transaction_1.CreditType.NONE,
                status: "SUCCESSFUL", userId: invoice === null || invoice === void 0 ? void 0 : invoice.ownerId,
                walletId: walletProvider === null || walletProvider === void 0 ? void 0 : walletProvider.id, jobId: newjob.id
            });
            yield Transaction_1.Transactions.create({
                title: "Job Cancelled",
                description: `“${invoice.title}” was cancelled successfully. Your wallet has been credited`,
                type: Transaction_1.TransactionType.JOB,
                creditType: Transaction_1.CreditType.NONE,
                status: "SUCCESSFUL", userId: invoice === null || invoice === void 0 ? void 0 : invoice.userId,
                jobId: newjob.id
            });
            const owner = yield Professional_1.Professional.findOne({ where: { userId: invoice === null || invoice === void 0 ? void 0 : invoice.ownerId } });
            const cancelJobOwner = yield Jobs_1.Jobs.findAll({
                where: {
                    status: Jobs_1.JobStatus.CANCEL, ownerId: [invoice.ownerId],
                }
            });
            const cancelJobUser = yield Jobs_1.Jobs.findAll({
                where: {
                    status: Jobs_1.JobStatus.CANCEL, userId: [invoice.userId],
                }
            });
            yield (owner === null || owner === void 0 ? void 0 : owner.update({
                workType: Professional_1.WorkType.IDLE, totalJobCompleted: completedJobOwner.length,
                totalJobOngoing: ongoingJobOwner.length, totalJobPending: pendingJobOwner.length,
                totalJobCanceled: cancelJobOwner.length,
                totalJobRejected: rejectedJobOwner.length
            }));
            yield (profile === null || profile === void 0 ? void 0 : profile.update({
                totalOngoingHire: ongoingJobUser.length,
                totalJobCanceled: cancelJobUser.length,
                totalPendingHire: pendingJobUser.length, totalCompletedHire: completedJobUser.length,
                totalJobRejected: rejectedJobUser.length
            }));
            return (0, utility_1.successResponse)(res, "Job canceled", newjob);
        }
    }
    else {
        const newjob = yield (invoice === null || invoice === void 0 ? void 0 : invoice.update({ status: Jobs_1.JobStatus.REJECTED, reason }));
        const owner = yield Professional_1.Professional.findOne({ where: { userId: invoice === null || invoice === void 0 ? void 0 : invoice.ownerId } });
        const profile = yield Profile_1.Profile.findOne({ where: { userId: invoice === null || invoice === void 0 ? void 0 : invoice.userId } });
        yield Transaction_1.Transactions.create({
            title: "Job Rejected",
            description: `“${invoice.title}” was rejected. You have 48hrs to file a dispute until the client is credited`,
            type: Transaction_1.TransactionType.JOB,
            creditType: Transaction_1.CreditType.NONE,
            status: "SUCCESSFUL", userId: invoice === null || invoice === void 0 ? void 0 : invoice.ownerId,
            walletId: walletProvider === null || walletProvider === void 0 ? void 0 : walletProvider.id, jobId: newjob.id
        });
        yield Transaction_1.Transactions.create({
            title: "Job Rejected",
            description: `“${invoice.title}” was rejected successfully. Your wallet will be credited after 48hrs if no dispute is filled by the professional`,
            type: Transaction_1.TransactionType.JOB,
            creditType: Transaction_1.CreditType.NONE,
            status: "SUCCESSFUL", userId: invoice === null || invoice === void 0 ? void 0 : invoice.userId,
            jobId: newjob.id
        });
        const ongoingJobUser = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.ONGOING,
                userId: [invoice.userId],
            }
        });
        const pendingJobUser = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.PENDING, userId: [invoice.userId],
            }
        });
        const completedJobUser = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.COMPLETED, userId: [invoice.userId],
            }
        });
        const rejectedJobUser = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.REJECTED, userId: [invoice.userId],
            }
        });
        const ongoingJobOwner = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.ONGOING,
                ownerId: [invoice.ownerId],
            }
        });
        const pendingJobOwner = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.PENDING, ownerId: [invoice.ownerId],
            }
        });
        const completedJobOwner = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.COMPLETED, ownerId: [invoice.ownerId],
            }
        });
        const rejectedJobOwner = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.REJECTED, ownerId: [invoice.ownerId],
            }
        });
        yield (owner === null || owner === void 0 ? void 0 : owner.update({
            workType: Professional_1.WorkType.IDLE, totalJobRejected: rejectedJobOwner.length,
            totalJobOngoing: ongoingJobOwner.length
        }));
        yield (profile === null || profile === void 0 ? void 0 : profile.update({
            totalOngoingHire: ongoingJobUser.length, totalPendingHire: pendingJobUser.length, totalCompletedHire: completedJobUser.length,
            totalJobRejected: rejectedJobUser.length
        }));
        return (0, utility_1.successResponse)(res, "Successful", newjob);
    }
});
exports.updateInvoiceStatus = updateInvoiceStatus;
const bankNameQuery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bankCode, accountNumber } = req.body;
    const response = yield axios({
        method: 'get',
        url: `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${process.env.PSK}`
        }
    });
    return (0, utility_1.successResponse)(res, "Successful", response.data.data);
});
exports.bankNameQuery = bankNameQuery;
const getBank = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios({
        method: 'get',
        url: 'https://api.paystack.co/bank?country=Nigeria',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${process.env.PSK}`
        }
    });
    return (0, utility_1.successResponse)(res, "Successful", response.data.data);
});
exports.getBank = getBank;
const withdraw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { amount, pin } = req.body;
    const profile = yield Profile_1.Profile.findOne({ where: { userId: id } });
    if ((profile === null || profile === void 0 ? void 0 : profile.type) == Profile_1.ProfileType.CLIENT) {
        const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: id, type: Wallet_1.WalletType.CLIENT }, });
        const user = yield Users_1.Users.findOne({ where: { id } });
        const bankUser = yield Bank_1.Banks.findOne({ where: { userId: id } });
        if ((user === null || user === void 0 ? void 0 : user.setPin.toString()) == "false")
            return (0, utility_1.errorResponse)(res, "Please set transaction pin");
        const match = yield (0, bcryptjs_1.compare)(pin.toString(), walletUser.pin.toString());
        if (!match)
            return (0, utility_1.errorResponse)(res, "Invalid transaction pin");
        if (Number(amount) < 1000)
            return (0, utility_1.errorResponse)(res, "Minimum withdrawal amount is NGN 1000");
        if (Number(walletUser.amount) < Number(amount))
            return (0, utility_1.errorResponse)(res, "Insufficient Funds");
        const response = yield axios({
            method: 'post',
            url: 'https://api.paystack.co/transferrecipient',
            data: {
                "type": "nuban",
                "name": bankUser === null || bankUser === void 0 ? void 0 : bankUser.accountName,
                "account_number": bankUser === null || bankUser === void 0 ? void 0 : bankUser.accountNumber,
                "bank_code": bankUser === null || bankUser === void 0 ? void 0 : bankUser.bankCode,
                "currency": "NGN"
            },
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: `Bearer ${process.env.PSK}`
            }
        });
        console.log(response.data.data);
        const response2 = yield axios({
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
        });
        yield (walletUser === null || walletUser === void 0 ? void 0 : walletUser.update({ amount: Number(walletUser.amount) - Number(amount) }));
        const transaction = yield Transaction_1.Transactions.create({
            title: "Withdrawal successful",
            description: `The sum of NGN${walletUser === null || walletUser === void 0 ? void 0 : walletUser.amount} has been sent to your bank account successfully`,
            type: Transaction_1.TransactionType.DEBIT, amount,
            creditType: Transaction_1.CreditType.WITHDRAWAL,
            ref: "",
            status: "SUCCESSFUL", userId: id, walletId: walletUser === null || walletUser === void 0 ? void 0 : walletUser.id
        });
        const redis = new redis_1.Redis();
        const cachedUserSocket = yield redis.getData(`notification-${id}`);
        const socketUser = app_1.socketio.sockets.sockets.get(cachedUserSocket);
        if (socketUser) {
            const notificationsUser = yield Transaction_1.Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: { userId: id, read: false },
                include: [
                    {
                        model: Jobs_1.Jobs, include: [{
                                model: Material_1.Material
                            },
                            {
                                model: Users_1.Users,
                                as: "client",
                                attributes: ["id"],
                                include: [
                                    {
                                        model: Profile_1.Profile,
                                        attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                        ],
                                    }
                                ]
                            },
                            {
                                model: Users_1.Users,
                                as: "owner",
                                attributes: ["id"],
                                include: [{
                                        model: Professional_1.Professional,
                                        include: [
                                            {
                                                model: Profile_1.Profile,
                                                attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                ],
                                                include: [
                                                    {
                                                        model: ProffesionalSector_1.ProfessionalSector,
                                                        include: [
                                                            { model: Sector_1.Sector },
                                                            { model: Profession_1.Profession },
                                                        ],
                                                    }
                                                ]
                                            }
                                        ]
                                    }]
                            },
                            { model: Dispute_1.Dispute }]
                    }
                ],
                limit: 1
            });
            socketUser.emit("notification", notificationsUser);
            const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: id, type: Wallet_1.WalletType.CLIENT } });
            socketUser.emit("wallet", walletUser);
        }
        return (0, utility_1.successResponse)(res, "Successful", response2.data.data);
    }
    else {
        const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: id, type: Wallet_1.WalletType.PROFESSIONAL }, });
        const user = yield Users_1.Users.findOne({ where: { id } });
        const bankUser = yield Bank_1.Banks.findOne({ where: { userId: id } });
        if ((user === null || user === void 0 ? void 0 : user.setPin.toString()) == "false")
            return (0, utility_1.errorResponse)(res, "Please set transaction pin");
        const match = yield (0, bcryptjs_1.compare)(pin.toString(), walletUser.pin.toString());
        if (!match)
            return (0, utility_1.errorResponse)(res, "Invalid transaction pin");
        if (Number(amount) < 1000)
            return (0, utility_1.errorResponse)(res, "Minimum withdrawal amount is NGN 1000");
        if (Number(walletUser.amount) < Number(amount))
            return (0, utility_1.errorResponse)(res, "Insufficient Funds");
        const response = yield axios({
            method: 'post',
            url: 'https://api.paystack.co/transferrecipient',
            data: {
                "type": "nuban",
                "name": bankUser === null || bankUser === void 0 ? void 0 : bankUser.accountName,
                "account_number": bankUser === null || bankUser === void 0 ? void 0 : bankUser.accountNumber,
                "bank_code": bankUser === null || bankUser === void 0 ? void 0 : bankUser.bankCode,
                "currency": "NGN"
            },
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: `Bearer ${process.env.PSK}`
            }
        });
        console.log(response.data.data);
        const response2 = yield axios({
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
        });
        yield (walletUser === null || walletUser === void 0 ? void 0 : walletUser.update({ amount: Number(walletUser.amount) - Number(amount) }));
        const transaction = yield Transaction_1.Transactions.create({
            title: "Withdrawal successful",
            description: `The sum of NGN${walletUser === null || walletUser === void 0 ? void 0 : walletUser.amount} has been sent to your bank account successfully`,
            type: Transaction_1.TransactionType.DEBIT, amount,
            creditType: Transaction_1.CreditType.WITHDRAWAL,
            ref: "",
            status: "SUCCESSFUL", userId: id, walletId: walletUser === null || walletUser === void 0 ? void 0 : walletUser.id
        });
        const redis = new redis_1.Redis();
        const cachedUserSocket = yield redis.getData(`notification-${id}`);
        const socketUser = app_1.socketio.sockets.sockets.get(cachedUserSocket);
        if (socketUser) {
            const notificationsUser = yield Transaction_1.Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: { userId: id, read: false },
                include: [
                    {
                        model: Jobs_1.Jobs, include: [{
                                model: Material_1.Material
                            },
                            {
                                model: Users_1.Users,
                                as: "client",
                                attributes: ["id"],
                                include: [
                                    {
                                        model: Profile_1.Profile,
                                        attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                        ],
                                    }
                                ]
                            },
                            {
                                model: Users_1.Users,
                                as: "owner",
                                attributes: ["id"],
                                include: [{
                                        model: Professional_1.Professional,
                                        include: [
                                            {
                                                model: Profile_1.Profile,
                                                attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                ],
                                                include: [
                                                    {
                                                        model: ProffesionalSector_1.ProfessionalSector,
                                                        include: [
                                                            { model: Sector_1.Sector },
                                                            { model: Profession_1.Profession },
                                                        ],
                                                    }
                                                ]
                                            }
                                        ]
                                    }]
                            },
                            { model: Dispute_1.Dispute }]
                    }
                ],
                limit: 1
            });
            socketUser.emit("notification", notificationsUser);
            const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: id, type: Wallet_1.WalletType.PROFESSIONAL }, });
            socketUser.emit("wallet", walletUser);
        }
        return (0, utility_1.successResponse)(res, "Successful", response2.data.data);
    }
});
exports.withdraw = withdraw;
const payInvoiceCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, jobId, reference } = req.body;
    const invoice = yield Jobs_1.Jobs.findOne({ where: { id: jobId } });
    if (!invoice)
        return (0, utility_1.errorResponse)(res, "Job  does not exist");
    if ((invoice === null || invoice === void 0 ? void 0 : invoice.status) == Jobs_1.JobStatus.ONGOING)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Job is already ongoing" });
    if (invoice === null || invoice === void 0 ? void 0 : invoice.paid)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Job already paid for" });
    const owner = yield Professional_1.Professional.findOne({ where: { userId: invoice === null || invoice === void 0 ? void 0 : invoice.ownerId } });
    const redis = new redis_1.Redis();
    yield redis.setData(`${reference}`, JSON.stringify({ reference, jobId, amount }));
    // new code
    const profileOwner = yield Profile_1.Profile.findOne({ where: { userId: invoice === null || invoice === void 0 ? void 0 : invoice.ownerId } });
    const newjob = yield (invoice === null || invoice === void 0 ? void 0 : invoice.update({ status: invoice.mode === Jobs_1.modeType.VIRTUAL ? Jobs_1.JobStatus.ONGOING : Jobs_1.JobStatus.PENDING, paid: true }));
    const wallet = yield Wallet_1.Wallet.findOne({ where: { userId: newjob.userId, type: Wallet_1.WalletType.CLIENT } });
    const fetchJob = yield Jobs_1.Jobs.findOne({
        where: {
            id: invoice === null || invoice === void 0 ? void 0 : invoice.id
        },
        include: [{
                model: Material_1.Material
            },
            {
                model: Users_1.Users,
                as: "client",
                attributes: ["id"],
                include: [
                    {
                        model: Profile_1.Profile,
                        attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                        ],
                    }
                ]
            },
            {
                model: Users_1.Users,
                as: "owner",
                attributes: ["id"],
                include: [{
                        model: Professional_1.Professional,
                        include: [
                            {
                                model: Profile_1.Profile,
                                attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                ],
                                include: [
                                    {
                                        model: ProffesionalSector_1.ProfessionalSector,
                                        include: [
                                            { model: Sector_1.Sector },
                                            { model: Profession_1.Profession },
                                        ],
                                    }
                                ]
                            }
                        ]
                    }]
            },
            { model: Dispute_1.Dispute }]
    });
    yield Transaction_1.Transactions.create({
        title: "Invoice Paid",
        description: `Payment for “${invoice.title}” was successful. ${invoice.mode === Jobs_1.modeType.VIRTUAL ? "Job will now be executed by the professional" : "Job remains pending until location is checked"}`,
        type: Transaction_1.TransactionType.DEBIT, amount: amount,
        creditType: Transaction_1.CreditType.EARNING,
        status: "SUCCESSFUL", userId: invoice.userId, walletId: wallet === null || wallet === void 0 ? void 0 : wallet.id
    });
    yield Transaction_1.Transactions.create({
        title: "Invoice Paid",
        description: `“${invoice.title}” has been paid and remains locked until approval. ${invoice.mode === Jobs_1.modeType.VIRTUAL ? "Job is now in progress" : "Job remains pending until location is checked"}`,
        type: Transaction_1.TransactionType.NOTIFICATION, amount: amount,
        creditType: Transaction_1.CreditType.EARNING,
        status: "SUCCESSFUL", userId: invoice.ownerId, walletId: wallet === null || wallet === void 0 ? void 0 : wallet.id
    });
    const cachedUserSocket = yield redis.getData(`notification - ${invoice.ownerId} `);
    const socketUser = app_1.socketio.sockets.sockets.get(cachedUserSocket);
    if (socketUser) {
        const notificationsUser = yield Transaction_1.Transactions.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: { userId: invoice.ownerId, read: false },
            include: [
                {
                    model: Jobs_1.Jobs, include: [{
                            model: Material_1.Material
                        },
                        {
                            model: Users_1.Users,
                            as: "client",
                            attributes: ["id"],
                            include: [
                                {
                                    model: Profile_1.Profile,
                                    attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                    ],
                                }
                            ]
                        },
                        {
                            model: Users_1.Users,
                            as: "owner",
                            attributes: ["id"],
                            include: [{
                                    model: Professional_1.Professional,
                                    include: [
                                        {
                                            model: Profile_1.Profile,
                                            attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                            ],
                                            include: [
                                                {
                                                    model: ProffesionalSector_1.ProfessionalSector,
                                                    include: [
                                                        { model: Sector_1.Sector },
                                                        { model: Profession_1.Profession },
                                                    ],
                                                }
                                            ]
                                        }
                                    ]
                                }]
                        },
                        { model: Dispute_1.Dispute }]
                }
            ],
            limit: 1
        });
        socketUser.emit("notification", notificationsUser);
        const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: invoice.ownerId, type: Wallet_1.WalletType.PROFESSIONAL } });
        socketUser.emit("wallet", walletUser);
    }
    const cachedOwnerSocket = yield redis.getData(`notification - ${invoice.userId} `);
    const socketOwner = app_1.socketio.sockets.sockets.get(cachedOwnerSocket);
    if (socketOwner) {
        const notificationsOnwer = yield Transaction_1.Transactions.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: { userId: invoice.userId, read: false },
            include: [
                {
                    model: Jobs_1.Jobs, include: [{
                            model: Material_1.Material
                        },
                        {
                            model: Users_1.Users,
                            as: "client",
                            attributes: ["id"],
                            include: [
                                {
                                    model: Profile_1.Profile,
                                    attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                    ],
                                }
                            ]
                        },
                        {
                            model: Users_1.Users,
                            as: "owner",
                            attributes: ["id"],
                            include: [{
                                    model: Professional_1.Professional,
                                    include: [
                                        {
                                            model: Profile_1.Profile,
                                            attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                            ],
                                            include: [
                                                {
                                                    model: ProffesionalSector_1.ProfessionalSector,
                                                    include: [
                                                        { model: Sector_1.Sector },
                                                        { model: Profession_1.Profession },
                                                    ],
                                                }
                                            ]
                                        }
                                    ]
                                }]
                        },
                        { model: Dispute_1.Dispute }]
                }
            ],
            limit: 1
        });
        socketOwner.emit("notification", notificationsOnwer);
        const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: invoice.userId, type: Wallet_1.WalletType.CLIENT } });
        socketOwner.emit("wallet", walletUser);
    }
    const profile = yield Profile_1.Profile.findOne({ where: { userId: invoice === null || invoice === void 0 ? void 0 : invoice.userId } });
    const ongoingJobUser = yield Jobs_1.Jobs.findAll({
        where: {
            status: Jobs_1.JobStatus.ONGOING,
            userId: [fetchJob.userId],
        }
    });
    const pendingJobUser = yield Jobs_1.Jobs.findAll({
        where: {
            status: Jobs_1.JobStatus.PENDING, userId: [fetchJob.userId],
        }
    });
    const completedJobUser = yield Jobs_1.Jobs.findAll({
        where: {
            status: Jobs_1.JobStatus.COMPLETED, userId: [fetchJob.userId],
        }
    });
    const rejectedJobUser = yield Jobs_1.Jobs.findAll({
        where: {
            status: Jobs_1.JobStatus.REJECTED, userId: [fetchJob.userId],
        }
    });
    const ongoingJobOwner = yield Jobs_1.Jobs.findAll({
        where: {
            status: Jobs_1.JobStatus.ONGOING,
            ownerId: [fetchJob.ownerId],
        }
    });
    const pendingJobOwner = yield Jobs_1.Jobs.findAll({
        where: {
            status: Jobs_1.JobStatus.PENDING, ownerId: [fetchJob.ownerId],
        }
    });
    const completedJobOwner = yield Jobs_1.Jobs.findAll({
        where: {
            status: Jobs_1.JobStatus.COMPLETED, ownerId: [fetchJob.ownerId],
        }
    });
    const rejectedJobOwner = yield Jobs_1.Jobs.findAll({
        where: {
            status: Jobs_1.JobStatus.REJECTED, ownerId: [fetchJob.ownerId],
        }
    });
    yield (owner === null || owner === void 0 ? void 0 : owner.update({
        workType: Professional_1.WorkType.BUSY, totalJobOngoing: ongoingJobOwner.length, totalJobPending: pendingJobOwner.length
    }));
    yield (profile === null || profile === void 0 ? void 0 : profile.update({
        totalOngoingHire: ongoingJobUser.length, totalPendingHire: pendingJobUser.length, totalCompletedHire: completedJobUser.length,
        totalJobRejected: rejectedJobUser.length
    }));
    return (0, utility_1.successResponse)(res, "Fetched Successfully");
});
exports.payInvoiceCard = payInvoiceCard;
const payInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { amount, jobId, pin } = req.body;
    const invoice = yield Jobs_1.Jobs.findOne({ where: { id: jobId } });
    if (!invoice)
        return (0, utility_1.errorResponse)(res, "Job  does not exist");
    if (invoice === null || invoice === void 0 ? void 0 : invoice.paid)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Job already paid for" });
    if ((invoice === null || invoice === void 0 ? void 0 : invoice.status) == Jobs_1.JobStatus.ONGOING)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Job is already ongoing" });
    const owner = yield Professional_1.Professional.findOne({ where: { userId: invoice === null || invoice === void 0 ? void 0 : invoice.ownerId } });
    const wallet = yield Wallet_1.Wallet.findOne({ where: { userId: id, type: Wallet_1.WalletType.CLIENT } });
    if (!wallet.pin)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Set transaction pin" });
    const match = yield (0, bcryptjs_1.compare)(pin, wallet.pin);
    if (!match)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Invalid pin" });
    if (Number(wallet === null || wallet === void 0 ? void 0 : wallet.amount) < Number(amount))
        return (0, utility_1.errorResponse)(res, "Insufficient funds in wallet", wallet);
    yield (wallet === null || wallet === void 0 ? void 0 : wallet.update({
        amount: (Number(wallet === null || wallet === void 0 ? void 0 : wallet.amount) - Number(amount)),
        transitAmount: (Number(wallet === null || wallet === void 0 ? void 0 : wallet.transitAmount) + Number(amount)),
    }));
    if ((invoice === null || invoice === void 0 ? void 0 : invoice.mode) == Jobs_1.modeType.VIRTUAL) {
        const profileOwner = yield Profile_1.Profile.findOne({ where: { userId: invoice === null || invoice === void 0 ? void 0 : invoice.ownerId } });
        const newjob = yield (invoice === null || invoice === void 0 ? void 0 : invoice.update({ status: Jobs_1.JobStatus.ONGOING, paid: true }));
        const wallet = yield Wallet_1.Wallet.findOne({ where: { userId: newjob.userId, type: Wallet_1.WalletType.CLIENT } });
        const fetchJob = yield Jobs_1.Jobs.findOne({
            where: {
                id: invoice === null || invoice === void 0 ? void 0 : invoice.id
            },
            include: [{
                    model: Material_1.Material
                },
                {
                    model: Users_1.Users,
                    as: "client",
                    attributes: ["id"],
                    include: [
                        {
                            model: Profile_1.Profile,
                            attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                            ],
                        }
                    ]
                },
                {
                    model: Users_1.Users,
                    as: "owner",
                    attributes: ["id"],
                    include: [{
                            model: Professional_1.Professional,
                            include: [
                                {
                                    model: Profile_1.Profile,
                                    attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                    ],
                                    include: [
                                        {
                                            model: ProffesionalSector_1.ProfessionalSector,
                                            include: [
                                                { model: Sector_1.Sector },
                                                { model: Profession_1.Profession },
                                            ],
                                        }
                                    ]
                                }
                            ]
                        }]
                },
                { model: Dispute_1.Dispute }]
        });
        yield Transaction_1.Transactions.create({
            title: "Invoice Paid",
            description: `Payment for “${invoice.title}” was successful. ${invoice.mode === Jobs_1.modeType.VIRTUAL ? "Job will now be executed by the professional" : "Job remains pending until location is checked"}`,
            type: Transaction_1.TransactionType.DEBIT, amount: amount,
            creditType: Transaction_1.CreditType.EARNING,
            status: "SUCCESSFUL", userId: invoice.userId, walletId: wallet === null || wallet === void 0 ? void 0 : wallet.id
        });
        yield Transaction_1.Transactions.create({
            title: "Invoice Paid",
            description: `“${invoice.title}” has been paid and remains locked until approval. ${invoice.mode === Jobs_1.modeType.VIRTUAL ? "Job is now in progress" : "Job remains pending until location is checked"}`,
            type: Transaction_1.TransactionType.NOTIFICATION, amount: amount,
            creditType: Transaction_1.CreditType.EARNING,
            status: "SUCCESSFUL", userId: invoice.ownerId, walletId: wallet === null || wallet === void 0 ? void 0 : wallet.id
        });
        const redis = new redis_1.Redis();
        const cachedUserSocket = yield redis.getData(`notification - ${invoice.ownerId} `);
        const socketUser = app_1.socketio.sockets.sockets.get(cachedUserSocket);
        if (socketUser) {
            const notificationsUser = yield Transaction_1.Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: { userId: invoice.ownerId, read: false },
                include: [
                    {
                        model: Jobs_1.Jobs, include: [{
                                model: Material_1.Material
                            },
                            {
                                model: Users_1.Users,
                                as: "client",
                                attributes: ["id"],
                                include: [
                                    {
                                        model: Profile_1.Profile,
                                        attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                        ],
                                    }
                                ]
                            },
                            {
                                model: Users_1.Users,
                                as: "owner",
                                attributes: ["id"],
                                include: [{
                                        model: Professional_1.Professional,
                                        include: [
                                            {
                                                model: Profile_1.Profile,
                                                attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                ],
                                                include: [
                                                    {
                                                        model: ProffesionalSector_1.ProfessionalSector,
                                                        include: [
                                                            { model: Sector_1.Sector },
                                                            { model: Profession_1.Profession },
                                                        ],
                                                    }
                                                ]
                                            }
                                        ]
                                    }]
                            },
                            { model: Dispute_1.Dispute }]
                    }
                ],
                limit: 1
            });
            socketUser.emit("notification", notificationsUser);
            const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: invoice.ownerId, type: Wallet_1.WalletType.PROFESSIONAL } });
            socketUser.emit("wallet", walletUser);
        }
        const cachedOwnerSocket = yield redis.getData(`notification - ${invoice.userId} `);
        const socketOwner = app_1.socketio.sockets.sockets.get(cachedOwnerSocket);
        if (socketOwner) {
            const notificationsOnwer = yield Transaction_1.Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: { userId: invoice.userId, read: false },
                include: [
                    {
                        model: Jobs_1.Jobs, include: [{
                                model: Material_1.Material
                            },
                            {
                                model: Users_1.Users,
                                as: "client",
                                attributes: ["id"],
                                include: [
                                    {
                                        model: Profile_1.Profile,
                                        attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                        ],
                                    }
                                ]
                            },
                            {
                                model: Users_1.Users,
                                as: "owner",
                                attributes: ["id"],
                                include: [{
                                        model: Professional_1.Professional,
                                        include: [
                                            {
                                                model: Profile_1.Profile,
                                                attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                ],
                                                include: [
                                                    {
                                                        model: ProffesionalSector_1.ProfessionalSector,
                                                        include: [
                                                            { model: Sector_1.Sector },
                                                            { model: Profession_1.Profession },
                                                        ],
                                                    }
                                                ]
                                            }
                                        ]
                                    }]
                            },
                            { model: Dispute_1.Dispute }]
                    }
                ],
                limit: 1
            });
            socketOwner.emit("notification", notificationsOnwer);
            const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: invoice.userId, type: Wallet_1.WalletType.CLIENT } });
            socketOwner.emit("wallet", walletUser);
        }
        const profile = yield Profile_1.Profile.findOne({ where: { userId: invoice === null || invoice === void 0 ? void 0 : invoice.userId } });
        const ongoingJobUser = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.ONGOING,
                userId: [fetchJob.userId],
            }
        });
        const pendingJobUser = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.PENDING, userId: [fetchJob.userId],
            }
        });
        const completedJobUser = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.COMPLETED, userId: [fetchJob.userId],
            }
        });
        const rejectedJobUser = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.REJECTED, userId: [fetchJob.userId],
            }
        });
        const ongoingJobOwner = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.ONGOING,
                ownerId: [fetchJob.ownerId],
            }
        });
        const pendingJobOwner = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.PENDING, ownerId: [fetchJob.ownerId],
            }
        });
        const completedJobOwner = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.COMPLETED, ownerId: [fetchJob.ownerId],
            }
        });
        const rejectedJobOwner = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.REJECTED, ownerId: [fetchJob.ownerId],
            }
        });
        yield (owner === null || owner === void 0 ? void 0 : owner.update({
            workType: Professional_1.WorkType.BUSY, totalJobOngoing: ongoingJobOwner.length, totalJobPending: pendingJobOwner.length
        }));
        yield (profile === null || profile === void 0 ? void 0 : profile.update({
            totalOngoingHire: ongoingJobUser.length, totalPendingHire: pendingJobUser.length, totalCompletedHire: completedJobUser.length,
            totalJobRejected: rejectedJobUser.length
        }));
        (0, utility_1.successResponse)(res, "Fetched Successfully", fetchJob);
    }
    else {
        const newjob = yield (invoice === null || invoice === void 0 ? void 0 : invoice.update({ paid: true, status: Jobs_1.JobStatus.PENDING }));
        const wallet = yield Wallet_1.Wallet.findOne({ where: { userId: newjob === null || newjob === void 0 ? void 0 : newjob.userId, type: Wallet_1.WalletType.CLIENT } });
        const fetchJob = yield Jobs_1.Jobs.findOne({
            where: {
                id: invoice === null || invoice === void 0 ? void 0 : invoice.id
            },
            include: [{
                    model: Material_1.Material
                },
                {
                    model: Users_1.Users,
                    as: "client",
                    attributes: ["id"],
                    include: [
                        {
                            model: Profile_1.Profile,
                            attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                            ],
                        }
                    ]
                },
                {
                    model: Users_1.Users,
                    as: "owner",
                    attributes: ["id"],
                    include: [{
                            model: Professional_1.Professional,
                            include: [
                                {
                                    model: Profile_1.Profile,
                                    attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                    ],
                                    include: [
                                        {
                                            model: ProffesionalSector_1.ProfessionalSector,
                                            include: [
                                                { model: Sector_1.Sector },
                                                { model: Profession_1.Profession },
                                            ],
                                        }
                                    ]
                                }
                            ]
                        }]
                },
                { model: Dispute_1.Dispute }]
        });
        const transaction = yield Transaction_1.Transactions.create({
            title: "Invoice Payment",
            description: `Invoice Payment: ${invoice.description} `,
            type: Transaction_1.TransactionType.DEBIT, amount: amount,
            creditType: Transaction_1.CreditType.EARNING,
            status: "SUCCESSFUL", userId: id, walletId: wallet === null || wallet === void 0 ? void 0 : wallet.id
        });
        const redis = new redis_1.Redis();
        const cachedUserSocket = yield redis.getData(`notification - ${newjob === null || newjob === void 0 ? void 0 : newjob.ownerId} `);
        const socketUser = app_1.socketio.sockets.sockets.get(cachedUserSocket);
        if (socketUser) {
            const notificationsUser = yield Transaction_1.Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: { userId: newjob === null || newjob === void 0 ? void 0 : newjob.ownerId, read: false },
                include: [
                    {
                        model: Jobs_1.Jobs, include: [{
                                model: Material_1.Material
                            },
                            {
                                model: Users_1.Users,
                                as: "client",
                                attributes: ["id"],
                                include: [
                                    {
                                        model: Profile_1.Profile,
                                        attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                        ],
                                    }
                                ]
                            },
                            {
                                model: Users_1.Users,
                                as: "owner",
                                attributes: ["id"],
                                include: [{
                                        model: Professional_1.Professional,
                                        include: [
                                            {
                                                model: Profile_1.Profile,
                                                attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                ],
                                                include: [
                                                    {
                                                        model: ProffesionalSector_1.ProfessionalSector,
                                                        include: [
                                                            { model: Sector_1.Sector },
                                                            { model: Profession_1.Profession },
                                                        ],
                                                    }
                                                ]
                                            }
                                        ]
                                    }]
                            },
                            { model: Dispute_1.Dispute }]
                    }
                ],
                limit: 1
            });
            socketUser.emit("notification", notificationsUser);
            const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: invoice.ownerId, type: Wallet_1.WalletType.PROFESSIONAL } });
            socketUser.emit("wallet", walletUser);
        }
        const cachedOwnerSocket = yield redis.getData(`notification - ${newjob === null || newjob === void 0 ? void 0 : newjob.userId} `);
        const socketOwner = app_1.socketio.sockets.sockets.get(cachedOwnerSocket);
        if (socketOwner) {
            const notificationsOnwer = yield Transaction_1.Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: { userId: newjob === null || newjob === void 0 ? void 0 : newjob.userId, read: false },
                include: [
                    {
                        model: Jobs_1.Jobs, include: [{
                                model: Material_1.Material
                            },
                            {
                                model: Users_1.Users,
                                as: "client",
                                attributes: ["id"],
                                include: [
                                    {
                                        model: Profile_1.Profile,
                                        attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                        ],
                                    }
                                ]
                            },
                            {
                                model: Users_1.Users,
                                as: "owner",
                                attributes: ["id"],
                                include: [{
                                        model: Professional_1.Professional,
                                        include: [
                                            {
                                                model: Profile_1.Profile,
                                                attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                ],
                                                include: [
                                                    {
                                                        model: ProffesionalSector_1.ProfessionalSector,
                                                        include: [
                                                            { model: Sector_1.Sector },
                                                            { model: Profession_1.Profession },
                                                        ],
                                                    }
                                                ]
                                            }
                                        ]
                                    }]
                            },
                            { model: Dispute_1.Dispute }]
                    }
                ],
                limit: 1
            });
            socketOwner.emit("notification", notificationsOnwer);
            const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: invoice.userId, type: Wallet_1.WalletType.CLIENT } });
            socketOwner.emit("wallet", walletUser);
        }
        const profile = yield Profile_1.Profile.findOne({ where: { userId: invoice === null || invoice === void 0 ? void 0 : invoice.userId } });
        const ongoingJobUser = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.ONGOING,
                userId: [fetchJob.userId],
            }
        });
        const pendingJobUser = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.PENDING, userId: [fetchJob.userId],
            }
        });
        const completedJobUser = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.COMPLETED, userId: [fetchJob.userId],
            }
        });
        const rejectedJobUser = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.REJECTED, userId: [fetchJob.userId],
            }
        });
        const ongoingJobOwner = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.ONGOING,
                ownerId: [fetchJob.ownerId],
            }
        });
        const pendingJobOwner = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.PENDING, ownerId: [fetchJob.ownerId],
            }
        });
        const completedJobOwner = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.COMPLETED, ownerId: [fetchJob.ownerId],
            }
        });
        const rejectedJobOwner = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.REJECTED, ownerId: [fetchJob.ownerId],
            }
        });
        yield (owner === null || owner === void 0 ? void 0 : owner.update({
            workType: Professional_1.WorkType.BUSY, totalJobOngoing: ongoingJobOwner.length, totalJobPending: pendingJobOwner.length
        }));
        yield (profile === null || profile === void 0 ? void 0 : profile.update({
            totalOngoingHire: ongoingJobUser.length, totalPendingHire: pendingJobUser.length, totalCompletedHire: completedJobUser.length,
            totalJobRejected: rejectedJobUser.length
        }));
        (0, utility_1.successResponse)(res, "Fetched Successfully", fetchJob);
    }
});
exports.payInvoice = payInvoice;
const setPin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { pin } = req.body;
    const user = yield Users_1.Users.findOne({ where: { id } });
    const wallet = yield Wallet_1.Wallet.findOne({ where: { userId: id, type: Wallet_1.WalletType.PROFESSIONAL } });
    const wallet2 = yield Wallet_1.Wallet.findOne({ where: { userId: id, type: Wallet_1.WalletType.CLIENT } });
    (0, bcryptjs_1.hash)(pin, utility_1.saltRounds, function (err, hashedPin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (wallet) {
                yield (wallet === null || wallet === void 0 ? void 0 : wallet.update({ pin: hashedPin }));
            }
            if (wallet2) {
                yield (wallet2 === null || wallet2 === void 0 ? void 0 : wallet2.update({ pin: hashedPin }));
            }
            yield (user === null || user === void 0 ? void 0 : user.update({ setPin: true }));
            (0, utility_1.successResponse)(res, "Successful");
        });
    });
});
exports.setPin = setPin;
const resetPin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { newPin, oldPin } = req.body;
    const user = yield Users_1.Users.findOne({ where: { id } });
    const wallet = yield Wallet_1.Wallet.findOne({ where: { userId: id, type: Wallet_1.WalletType.CLIENT } });
    const wallet2 = yield Wallet_1.Wallet.findOne({ where: { userId: id, type: Wallet_1.WalletType.PROFESSIONAL } });
    const match = yield (0, bcryptjs_1.compare)(oldPin, wallet.pin);
    if (!match)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Invalid Pin" });
    (0, bcryptjs_1.hash)(newPin, utility_1.saltRounds, function (err, hashedPin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (wallet) {
                yield (wallet === null || wallet === void 0 ? void 0 : wallet.update({ pin: hashedPin }));
            }
            if (wallet2) {
                yield (wallet2 === null || wallet2 === void 0 ? void 0 : wallet2.update({ pin: hashedPin }));
            }
            yield (user === null || user === void 0 ? void 0 : user.update({ setPin: true }));
            (0, utility_1.successResponse)(res, "Successful");
        });
    });
});
exports.resetPin = resetPin;
const emailToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const user = yield Users_1.Users.findOne({ where: { id } });
    const serviceId = (0, utility_1.randomId)(12);
    const codeEmail = String(Math.floor(1000 + Math.random() * 9000));
    yield Verify_1.Verify.create({
        serviceId,
        code: codeEmail
    });
    const emailResult = yield (0, sms_1.sendEmailResend)(user.email, "Email Verification", `Dear User, <br><br>

    Thank you for choosing our service.To complete your registration and ensure the security of your account, please use the verification code below < br > <br>

      Verification Code: ${codeEmail} <br><br>

        Please enter this code on our website / app to proceed with your registration process.If you did not initiate this action, please ignore this email.< br > <br>

          If you have any questions or concerns, feel free to contact our support team.< br > <br>

            Thank you, <br>
              AcepickTeam`);
    if (emailResult === null || emailResult === void 0 ? void 0 : emailResult.status)
        return (0, utility_1.successResponse)(res, "Successful", Object.assign(Object.assign({}, emailResult), { serviceId }));
    return (0, utility_1.errorResponse)(res, "Failed", emailResult);
});
exports.emailToken = emailToken;
const webhookPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    console.log(hash == req.headers['x-paystack-signature']);
    if (hash == req.headers['x-paystack-signature']) {
        // Retrieve the request's body
        const event = req.body;
        console.log(event);
        if (event.data.status == "success") {
            const redis = new redis_1.Redis();
            const jobData = yield redis.getData(`${event.data.reference}`);
            const cachedjobData = JSON.parse(jobData);
            console.log("testng 22222");
            console.log(event.data.reference);
            console.log(cachedjobData);
            if (jobData) {
                const invoice = yield Jobs_1.Jobs.findOne({ where: { id: cachedjobData === null || cachedjobData === void 0 ? void 0 : cachedjobData.jobId } });
                const owner = yield Users_1.Users.findOne({ where: { id: invoice === null || invoice === void 0 ? void 0 : invoice.ownerId } });
                if ((invoice === null || invoice === void 0 ? void 0 : invoice.mode) == Jobs_1.modeType.VIRTUAL) {
                    const profileOwner = yield Profile_1.Profile.findOne({ where: { userId: invoice === null || invoice === void 0 ? void 0 : invoice.ownerId } });
                    const newjob = yield (invoice === null || invoice === void 0 ? void 0 : invoice.update({ status: Jobs_1.JobStatus.ONGOING, paid: true }));
                    const wallet = yield Wallet_1.Wallet.findOne({ where: { userId: newjob.userId, type: Wallet_1.WalletType.CLIENT } });
                    const fetchJob = yield Jobs_1.Jobs.findOne({
                        where: {
                            id: invoice === null || invoice === void 0 ? void 0 : invoice.id
                        },
                        include: [{
                                model: Material_1.Material
                            },
                            {
                                model: Users_1.Users,
                                as: "client",
                                attributes: ["id"],
                                include: [
                                    {
                                        model: Profile_1.Profile,
                                        attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                        ],
                                    }
                                ]
                            },
                            {
                                model: Users_1.Users,
                                as: "owner",
                                attributes: ["id"],
                                include: [{
                                        model: Professional_1.Professional,
                                        include: [
                                            {
                                                model: Profile_1.Profile,
                                                attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                ],
                                                include: [
                                                    {
                                                        model: ProffesionalSector_1.ProfessionalSector,
                                                        include: [
                                                            { model: Sector_1.Sector },
                                                            { model: Profession_1.Profession },
                                                        ],
                                                    }
                                                ]
                                            }
                                        ]
                                    }]
                            },
                            { model: Dispute_1.Dispute }]
                    });
                    yield Transaction_1.Transactions.create({
                        title: "Job payment sent",
                        description: `NGN${cachedjobData.amount} has been sent to ${profileOwner === null || profileOwner === void 0 ? void 0 : profileOwner.fullName} for "${invoice.title}"`,
                        type: Transaction_1.TransactionType.DEBIT, amount: cachedjobData.amount,
                        creditType: Transaction_1.CreditType.EARNING,
                        status: "SUCCESSFUL", userId: invoice.userId, walletId: wallet === null || wallet === void 0 ? void 0 : wallet.id
                    });
                    yield Transaction_1.Transactions.create({
                        title: "Job payment recieved but on escrow",
                        description: `NGN${cachedjobData.amount} has been deposited on acepick escrow account.`,
                        type: Transaction_1.TransactionType.NOTIFICATION, amount: cachedjobData.amount,
                        creditType: Transaction_1.CreditType.EARNING,
                        status: "SUCCESSFUL", userId: invoice.ownerId, walletId: wallet === null || wallet === void 0 ? void 0 : wallet.id
                    });
                    // const jobProfileUser = await Profile.findOne({ where: { userId: invoice.userId } })
                    // const jobProfileOwner = await Profile.findOne({ where: { userId: invoice.ownerId } })
                    // jobProfileOwner?.fcmToken == null ? null : sendExpoNotification(jobProfileOwner!.fcmToken, body);
                    // sendEmailResend(user!.email, "Dispute: Admin", `< p > ${ body } </p>`)
                    // jobProfileUser?.fcmToken == null ? null : sendExpoNotification(jobProfileUser!.fcmToken, body);
                    // sendEmailResend(user!.email, "Dispute: Admin", `<p>${body}</p>`)
                    const redis = new redis_1.Redis();
                    const cachedUserSocket = yield redis.getData(`notification-${invoice.ownerId}`);
                    const socketUser = app_1.socketio.sockets.sockets.get(cachedUserSocket);
                    if (socketUser) {
                        const notificationsUser = yield Transaction_1.Transactions.findAll({
                            order: [
                                ['id', 'DESC']
                            ],
                            where: { userId: invoice.ownerId, read: false },
                            include: [
                                {
                                    model: Jobs_1.Jobs, include: [{
                                            model: Material_1.Material
                                        },
                                        {
                                            model: Users_1.Users,
                                            as: "client",
                                            attributes: ["id"],
                                            include: [
                                                {
                                                    model: Profile_1.Profile,
                                                    attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                    ],
                                                }
                                            ]
                                        },
                                        {
                                            model: Users_1.Users,
                                            as: "owner",
                                            attributes: ["id"],
                                            include: [{
                                                    model: Professional_1.Professional,
                                                    include: [
                                                        {
                                                            model: Profile_1.Profile,
                                                            attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                            ],
                                                            include: [
                                                                {
                                                                    model: ProffesionalSector_1.ProfessionalSector,
                                                                    include: [
                                                                        { model: Sector_1.Sector },
                                                                        { model: Profession_1.Profession },
                                                                    ],
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }]
                                        },
                                        { model: Dispute_1.Dispute }]
                                }
                            ],
                            limit: 1
                        });
                        socketUser.emit("notification", notificationsUser);
                        const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: invoice.ownerId, type: Wallet_1.WalletType.PROFESSIONAL } });
                        socketUser.emit("wallet", walletUser);
                    }
                    const cachedOwnerSocket = yield redis.getData(`notification-${invoice.userId}`);
                    const socketOwner = app_1.socketio.sockets.sockets.get(cachedOwnerSocket);
                    if (socketOwner) {
                        const notificationsOnwer = yield Transaction_1.Transactions.findAll({
                            order: [
                                ['id', 'DESC']
                            ],
                            where: { userId: invoice.userId, read: false },
                            include: [
                                {
                                    model: Jobs_1.Jobs, include: [{
                                            model: Material_1.Material
                                        },
                                        {
                                            model: Users_1.Users,
                                            as: "client",
                                            attributes: ["id"],
                                            include: [
                                                {
                                                    model: Profile_1.Profile,
                                                    attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                    ],
                                                }
                                            ]
                                        },
                                        {
                                            model: Users_1.Users,
                                            as: "owner",
                                            attributes: ["id"],
                                            include: [{
                                                    model: Professional_1.Professional,
                                                    include: [
                                                        {
                                                            model: Profile_1.Profile,
                                                            attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                            ],
                                                            include: [
                                                                {
                                                                    model: ProffesionalSector_1.ProfessionalSector,
                                                                    include: [
                                                                        { model: Sector_1.Sector },
                                                                        { model: Profession_1.Profession },
                                                                    ],
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }]
                                        },
                                        { model: Dispute_1.Dispute }]
                                }
                            ],
                            limit: 1
                        });
                        socketOwner.emit("notification", notificationsOnwer);
                        const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: invoice.userId, type: Wallet_1.WalletType.CLIENT } });
                        socketOwner.emit("wallet", walletUser);
                    }
                    const profile = yield Profile_1.Profile.findOne({ where: { userId: invoice === null || invoice === void 0 ? void 0 : invoice.userId } });
                    const ongoingJobUser = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.ONGOING,
                            userId: [fetchJob.userId],
                        }
                    });
                    const pendingJobUser = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.PENDING, userId: [fetchJob.userId],
                        }
                    });
                    const completedJobUser = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.COMPLETED, userId: [fetchJob.userId],
                        }
                    });
                    const rejectedJobUser = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.REJECTED, userId: [fetchJob.userId],
                        }
                    });
                    const ongoingJobOwner = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.ONGOING,
                            ownerId: [fetchJob.ownerId],
                        }
                    });
                    const pendingJobOwner = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.PENDING, ownerId: [fetchJob.ownerId],
                        }
                    });
                    const completedJobOwner = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.COMPLETED, ownerId: [fetchJob.ownerId],
                        }
                    });
                    const rejectedJobOwner = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.REJECTED, ownerId: [fetchJob.ownerId],
                        }
                    });
                    yield (owner === null || owner === void 0 ? void 0 : owner.update({
                        workType: Professional_1.WorkType.BUSY, totalJobOngoing: ongoingJobOwner.length, totalJobPending: pendingJobOwner.length
                    }));
                    yield (profile === null || profile === void 0 ? void 0 : profile.update({
                        totalOngoingHire: ongoingJobUser.length, totalPendingHire: pendingJobUser.length, totalCompletedHire: completedJobUser.length,
                        totalJobRejected: rejectedJobUser.length
                    }));
                }
                else {
                    const newjob = yield (invoice === null || invoice === void 0 ? void 0 : invoice.update({ paid: true, status: Jobs_1.JobStatus.PENDING }));
                    const wallet = yield Wallet_1.Wallet.findOne({ where: { userId: newjob === null || newjob === void 0 ? void 0 : newjob.userId, type: Wallet_1.WalletType.CLIENT } });
                    const fetchJob = yield Jobs_1.Jobs.findOne({
                        where: {
                            id: invoice === null || invoice === void 0 ? void 0 : invoice.id
                        },
                        include: [{
                                model: Material_1.Material
                            },
                            {
                                model: Users_1.Users,
                                as: "client",
                                attributes: ["id"],
                                include: [
                                    {
                                        model: Profile_1.Profile,
                                        attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                        ],
                                    }
                                ]
                            },
                            {
                                model: Users_1.Users,
                                as: "owner",
                                attributes: ["id"],
                                include: [{
                                        model: Professional_1.Professional,
                                        include: [
                                            {
                                                model: Profile_1.Profile,
                                                attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                ],
                                                include: [
                                                    {
                                                        model: ProffesionalSector_1.ProfessionalSector,
                                                        include: [
                                                            { model: Sector_1.Sector },
                                                            { model: Profession_1.Profession },
                                                        ],
                                                    }
                                                ]
                                            }
                                        ]
                                    }]
                            },
                            { model: Dispute_1.Dispute }]
                    });
                    const transaction = yield Transaction_1.Transactions.create({
                        title: "Invoice Payment",
                        description: `Invoice Payment: ${invoice.description}`,
                        type: Transaction_1.TransactionType.DEBIT, amount: cachedjobData.amount,
                        creditType: Transaction_1.CreditType.EARNING,
                        status: "SUCCESSFUL", userId: invoice === null || invoice === void 0 ? void 0 : invoice.userId, walletId: wallet === null || wallet === void 0 ? void 0 : wallet.id
                    });
                    const redis = new redis_1.Redis();
                    const cachedUserSocket = yield redis.getData(`notification-${newjob === null || newjob === void 0 ? void 0 : newjob.ownerId}`);
                    const socketUser = app_1.socketio.sockets.sockets.get(cachedUserSocket);
                    if (socketUser) {
                        const notificationsUser = yield Transaction_1.Transactions.findAll({
                            order: [
                                ['id', 'DESC']
                            ],
                            where: { userId: newjob === null || newjob === void 0 ? void 0 : newjob.ownerId, read: false },
                            include: [
                                {
                                    model: Jobs_1.Jobs, include: [{
                                            model: Material_1.Material
                                        },
                                        {
                                            model: Users_1.Users,
                                            as: "client",
                                            attributes: ["id"],
                                            include: [
                                                {
                                                    model: Profile_1.Profile,
                                                    attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                    ],
                                                }
                                            ]
                                        },
                                        {
                                            model: Users_1.Users,
                                            as: "owner",
                                            attributes: ["id"],
                                            include: [{
                                                    model: Professional_1.Professional,
                                                    include: [
                                                        {
                                                            model: Profile_1.Profile,
                                                            attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                            ],
                                                            include: [
                                                                {
                                                                    model: ProffesionalSector_1.ProfessionalSector,
                                                                    include: [
                                                                        { model: Sector_1.Sector },
                                                                        { model: Profession_1.Profession },
                                                                    ],
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }]
                                        },
                                        { model: Dispute_1.Dispute }]
                                }
                            ],
                            limit: 1
                        });
                        socketUser.emit("notification", notificationsUser);
                        const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: invoice.ownerId, type: Wallet_1.WalletType.PROFESSIONAL } });
                        socketUser.emit("wallet", walletUser);
                    }
                    const cachedOwnerSocket = yield redis.getData(`notification-${newjob === null || newjob === void 0 ? void 0 : newjob.userId}`);
                    const socketOwner = app_1.socketio.sockets.sockets.get(cachedOwnerSocket);
                    if (socketOwner) {
                        const notificationsOnwer = yield Transaction_1.Transactions.findAll({
                            order: [
                                ['id', 'DESC']
                            ],
                            where: { userId: newjob === null || newjob === void 0 ? void 0 : newjob.userId, read: false },
                            include: [
                                {
                                    model: Jobs_1.Jobs, include: [{
                                            model: Material_1.Material
                                        },
                                        {
                                            model: Users_1.Users,
                                            as: "client",
                                            attributes: ["id"],
                                            include: [
                                                {
                                                    model: Profile_1.Profile,
                                                    attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                    ],
                                                }
                                            ]
                                        },
                                        {
                                            model: Users_1.Users,
                                            as: "owner",
                                            attributes: ["id"],
                                            include: [{
                                                    model: Professional_1.Professional,
                                                    include: [
                                                        {
                                                            model: Profile_1.Profile,
                                                            attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                            ],
                                                            include: [
                                                                {
                                                                    model: ProffesionalSector_1.ProfessionalSector,
                                                                    include: [
                                                                        { model: Sector_1.Sector },
                                                                        { model: Profession_1.Profession },
                                                                    ],
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }]
                                        },
                                        { model: Dispute_1.Dispute }]
                                }
                            ],
                            limit: 1
                        });
                        socketOwner.emit("notification", notificationsOnwer);
                        const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: invoice.userId, type: Wallet_1.WalletType.CLIENT } });
                        socketOwner.emit("wallet", walletUser);
                    }
                    const profile = yield Profile_1.Profile.findOne({ where: { userId: invoice === null || invoice === void 0 ? void 0 : invoice.userId } });
                    const ongoingJobUser = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.ONGOING,
                            userId: [fetchJob.userId],
                        }
                    });
                    const pendingJobUser = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.PENDING, userId: [fetchJob.userId],
                        }
                    });
                    const completedJobUser = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.COMPLETED, userId: [fetchJob.userId],
                        }
                    });
                    const rejectedJobUser = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.REJECTED, userId: [fetchJob.userId],
                        }
                    });
                    const ongoingJobOwner = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.ONGOING,
                            ownerId: [fetchJob.ownerId],
                        }
                    });
                    const pendingJobOwner = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.PENDING, ownerId: [fetchJob.ownerId],
                        }
                    });
                    const completedJobOwner = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.COMPLETED, ownerId: [fetchJob.ownerId],
                        }
                    });
                    const rejectedJobOwner = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.REJECTED, ownerId: [fetchJob.ownerId],
                        }
                    });
                    yield (owner === null || owner === void 0 ? void 0 : owner.update({
                        workType: Professional_1.WorkType.BUSY, totalJobOngoing: ongoingJobOwner.length, totalJobPending: pendingJobOwner.length
                    }));
                    yield (profile === null || profile === void 0 ? void 0 : profile.update({
                        totalOngoingHire: ongoingJobUser.length, totalPendingHire: pendingJobUser.length, totalCompletedHire: completedJobUser.length,
                        totalJobRejected: rejectedJobUser.length
                    }));
                }
            }
            else {
                const user = yield Users_1.Users.findOne({ where: { email: event.data.customer.email } });
                if (!user)
                    return res.send(200);
                const profile = yield Profile_1.Profile.findOne({ where: { userId: user.id } });
                if ((profile === null || profile === void 0 ? void 0 : profile.type) == Profile_1.ProfileType.CLIENT) {
                    const wallet = yield Wallet_1.Wallet.findOne({ where: { userId: user.id, type: Wallet_1.WalletType.CLIENT } });
                    if (!wallet)
                        return res.send(200);
                    const reference = yield Transaction_1.Transactions.findOne({ where: { ref: event.data.reference } });
                    if (!reference) {
                        let amount = event.data.amount;
                        let modifiedAmount = Math.floor(amount / 100);
                        const newWallet = yield (wallet === null || wallet === void 0 ? void 0 : wallet.update({ amount: Number(wallet.amount) + modifiedAmount, type: Wallet_1.WalletType.CLIENT }));
                        const transaction = yield Transaction_1.Transactions.create({
                            title: "Deposit",
                            type: Transaction_1.TransactionType.CREDIT, amount: modifiedAmount,
                            description: "Funding Acepick wallet",
                            creditType: Transaction_1.CreditType.FUNDING,
                            ref: event.data.reference,
                            status: "SUCCESSFUL", userId: user.id, walletId: wallet === null || wallet === void 0 ? void 0 : wallet.id
                        });
                        const redis = new redis_1.Redis();
                        const cachedUserSocket = yield redis.getData(`notification-${user.id}`);
                        const socketUser = app_1.socketio.sockets.sockets.get(cachedUserSocket);
                        if (socketUser) {
                            const notificationsUser = yield Transaction_1.Transactions.findAll({
                                order: [
                                    ['id', 'DESC']
                                ],
                                where: { userId: user.id, read: false },
                                include: [
                                    {
                                        model: Jobs_1.Jobs, include: [{
                                                model: Material_1.Material
                                            },
                                            {
                                                model: Users_1.Users,
                                                as: "client",
                                                attributes: ["id"],
                                                include: [
                                                    {
                                                        model: Profile_1.Profile,
                                                        attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                        ],
                                                    }
                                                ]
                                            },
                                            {
                                                model: Users_1.Users,
                                                as: "owner",
                                                attributes: ["id"],
                                                include: [{
                                                        model: Professional_1.Professional,
                                                        include: [
                                                            {
                                                                model: Profile_1.Profile,
                                                                attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                                ],
                                                                include: [
                                                                    {
                                                                        model: ProffesionalSector_1.ProfessionalSector,
                                                                        include: [
                                                                            { model: Sector_1.Sector },
                                                                            { model: Profession_1.Profession },
                                                                        ],
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }]
                                            },
                                            { model: Dispute_1.Dispute }]
                                    }
                                ],
                                limit: 1
                            });
                            const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: user.id, type: Wallet_1.WalletType.CLIENT } });
                            socketUser.emit("notification", notificationsUser);
                            socketUser.emit("wallet", walletUser);
                        }
                    }
                }
                else {
                    const wallet = yield Wallet_1.Wallet.findOne({ where: { userId: user.id, type: Wallet_1.WalletType.PROFESSIONAL } });
                    if (!wallet)
                        return res.send(200);
                    const reference = yield Transaction_1.Transactions.findOne({ where: { ref: event.data.reference } });
                    if (!reference) {
                        let amount = event.data.amount;
                        let modifiedAmount = Math.floor(amount / 100);
                        const newWallet = yield (wallet === null || wallet === void 0 ? void 0 : wallet.update({ amount: Number(wallet.amount) + modifiedAmount, type: Wallet_1.WalletType.PROFESSIONAL }));
                        const transaction = yield Transaction_1.Transactions.create({
                            title: "Deposit",
                            type: Transaction_1.TransactionType.CREDIT, amount: modifiedAmount,
                            description: "Funding Acepick wallet",
                            creditType: Transaction_1.CreditType.FUNDING,
                            ref: event.data.reference,
                            status: "SUCCESSFUL", userId: user.id, walletId: wallet === null || wallet === void 0 ? void 0 : wallet.id
                        });
                        const redis = new redis_1.Redis();
                        const cachedUserSocket = yield redis.getData(`notification-${user.id}`);
                        const socketUser = app_1.socketio.sockets.sockets.get(cachedUserSocket);
                        if (socketUser) {
                            const notificationsUser = yield Transaction_1.Transactions.findAll({
                                order: [
                                    ['id', 'DESC']
                                ],
                                where: { userId: user.id, read: false },
                                include: [
                                    {
                                        model: Jobs_1.Jobs, include: [{
                                                model: Material_1.Material
                                            },
                                            {
                                                model: Users_1.Users,
                                                as: "client",
                                                attributes: ["id"],
                                                include: [
                                                    {
                                                        model: Profile_1.Profile,
                                                        attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                        ],
                                                    }
                                                ]
                                            },
                                            {
                                                model: Users_1.Users,
                                                as: "owner",
                                                attributes: ["id"],
                                                include: [{
                                                        model: Professional_1.Professional,
                                                        include: [
                                                            {
                                                                model: Profile_1.Profile,
                                                                attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                                ],
                                                                include: [
                                                                    {
                                                                        model: ProffesionalSector_1.ProfessionalSector,
                                                                        include: [
                                                                            { model: Sector_1.Sector },
                                                                            { model: Profession_1.Profession },
                                                                        ],
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }]
                                            },
                                            { model: Dispute_1.Dispute }]
                                    }
                                ],
                                limit: 1
                            });
                            const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: user.id, type: Wallet_1.WalletType.PROFESSIONAL } });
                            socketUser.emit("notification", notificationsUser);
                            socketUser.emit("wallet", walletUser);
                        }
                    }
                }
            }
        }
        // Do something with event  
    }
    res.send(200);
});
exports.webhookPost = webhookPost;
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const transactions = yield Transaction_1.Transactions.findAll({
        where: { userId: id, read: false },
        include: [
            {
                model: Jobs_1.Jobs, include: [{
                        model: Material_1.Material
                    },
                    {
                        model: Users_1.Users,
                        as: "client",
                        attributes: ["id"],
                        include: [
                            {
                                model: Profile_1.Profile,
                                attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                ],
                            }
                        ]
                    },
                    {
                        model: Users_1.Users,
                        as: "owner",
                        attributes: ["id"],
                        include: [{
                                model: Professional_1.Professional,
                                include: [
                                    {
                                        model: Profile_1.Profile,
                                        attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                        ],
                                        include: [
                                            {
                                                model: ProffesionalSector_1.ProfessionalSector,
                                                include: [
                                                    { model: Sector_1.Sector },
                                                    { model: Profession_1.Profession },
                                                ],
                                            }
                                        ]
                                    }
                                ]
                            }]
                    },
                    { model: Dispute_1.Dispute }]
            }
        ],
        order: [
            ['id', 'DESC']
        ],
    });
    (0, utility_1.successResponse)(res, "Successful", transactions);
});
exports.getTransactions = getTransactions;
const addBank = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const bankExist = yield Bank_1.Banks.findAll({
        where: { userId: id }, order: [
            ['id', 'DESC']
        ],
    });
    const { accountNumber, bankCode, accountName, bankName } = req.body;
    if (bankExist.length >= 1) {
        let index = 0;
        for (let value of bankExist) {
            yield value.destroy();
            index++;
        }
        if (index == bankExist.length) {
            const insertData = {
                accountNumber, bankCode, accountName, bankName, userId: id
            };
            const banks = yield Bank_1.Banks.create(insertData);
            (0, utility_1.successResponse)(res, "Successful", banks);
        }
    }
    else {
        const insertData = {
            accountNumber, bankCode, accountName, bankName, userId: id
        };
        const banks = yield Bank_1.Banks.create(insertData);
        (0, utility_1.successResponse)(res, "Successful", banks);
    }
});
exports.addBank = addBank;
const getBanks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const banks = yield Bank_1.Banks.findAll({
        where: { userId: id }, order: [
            ['id', 'DESC']
        ],
    });
    (0, utility_1.successResponse)(res, "Successful", banks);
});
exports.getBanks = getBanks;
const deleteBank = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.query;
    try {
        const banks = yield Bank_1.Banks.findOne({ where: { id } });
        if (!banks)
            return (0, utility_1.errorResponse)(res, "Bank does not exist");
        yield (banks === null || banks === void 0 ? void 0 : banks.destroy());
        return (0, utility_1.successResponse)(res, "Bank Deleted");
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occurred - ${error}`);
    }
});
exports.deleteBank = deleteBank;
const getUserTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.user;
    const notifications = yield Transaction_1.Transactions.findAll({
        order: [
            ['id', 'DESC']
        ],
        where: {
            userId: id,
            //  read: false
        },
        include: [
            {
                model: Jobs_1.Jobs, include: [{
                        model: Material_1.Material
                    },
                    {
                        model: Users_1.Users,
                        as: "client",
                        attributes: ["id"],
                        include: [
                            {
                                model: Profile_1.Profile,
                                attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                ],
                            }
                        ]
                    },
                    {
                        model: Users_1.Users,
                        as: "owner",
                        attributes: ["id"],
                        include: [{
                                model: Professional_1.Professional,
                                include: [
                                    {
                                        model: Profile_1.Profile,
                                        attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                        ],
                                        include: [
                                            {
                                                model: ProffesionalSector_1.ProfessionalSector,
                                                include: [
                                                    { model: Sector_1.Sector },
                                                    { model: Profession_1.Profession },
                                                ],
                                            }
                                        ]
                                    }
                                ]
                            }]
                    },
                    { model: Dispute_1.Dispute }]
            }
        ],
        limit: 50
    });
    return (0, utility_1.successResponse)(res, 'Sucessful', notifications);
});
exports.getUserTransaction = getUserTransaction;
const updateTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.user;
    const { notificationId } = req.body;
    const notification = yield Transaction_1.Transactions.findOne({ where: { id: notificationId } });
    yield (notification === null || notification === void 0 ? void 0 : notification.update({ read: true }));
    return (0, utility_1.successResponse)(res, 'Sucessful');
});
exports.updateTransaction = updateTransaction;
//# sourceMappingURL=wallet.js.map