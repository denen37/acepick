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
exports.updateTicket = exports.getAllTicket = exports.getUserTicket = exports.deleteTicket = exports.getTicketMessage = exports.postTicket = exports.postTicketMessage = exports.getJobs = exports.deleteTicketMesaage = exports.deleteDisputes = exports.getAllDisputes = exports.getSingleDisputes = exports.updateDisputeStatus = exports.deleteRecording = exports.deleteUser = exports.updateUserStatus = exports.userProfile = exports.sortUsers = exports.getAllUsers = void 0;
const upload_1 = require("../../helpers/upload");
const Sector_1 = require("../../models/Sector");
const utility_1 = require("../../helpers/utility");
const Profession_1 = require("../../models/Profession");
const Users_1 = require("../../models/Users");
const sequelize_1 = require("sequelize");
const Profile_1 = require("../../models/Profile");
const Professional_1 = require("../../models/Professional");
const Wallet_1 = require("../../models/Wallet");
const Cooperation_1 = require("../../models/Cooperation");
const Jobs_1 = require("../../models/Jobs");
const VoiceRecording_1 = require("../../models/VoiceRecording");
const Dispute_1 = require("../../models/Dispute");
const TicketMessage_1 = require("../../models/TicketMessage");
const Ticket_1 = require("../../models/Ticket");
const LanLog_1 = require("../../models/LanLog");
const ProffesionalSector_1 = require("../../models/ProffesionalSector");
const sms_1 = require("../../services/sms");
const Material_1 = require("../../models/Material");
const Transaction_1 = require("../../models/Transaction");
const app_1 = require("../../app");
const redis_1 = require("../../services/redis");
const Market_1 = require("../../models/Market");
const Review_1 = require("../../models/Review");
const sequelize_typescript_1 = require("sequelize-typescript");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield Users_1.Users.findAll({
        order: [
            ['createdAt', 'DESC']
        ],
        include: [{
                model: Profile_1.Profile, where: {
                    type: Profile_1.ProfileType.CLIENT
                }
            }]
    });
    const Professional = yield Users_1.Users.findAll({
        order: [
            ['createdAt', 'DESC']
        ],
        include: [{
                model: Profile_1.Profile, where: {
                    // type: ProfileType.PROFESSIONAL,
                    corperate: false
                }
            }]
    });
    const corperate = yield Users_1.Users.findAll({
        order: [
            ['createdAt', 'DESC']
        ],
        include: [{
                model: Profile_1.Profile, where: {
                    // type: ProfileType.PROFESSIONAL,
                    corperate: true
                }
            }]
    });
    return (0, utility_1.successResponse)(res, "Successful", { client, corperate, Professional });
});
exports.getAllUsers = getAllUsers;
const sortUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, status, type, search } = req.query;
    // const { id } = req.user;
    console.log(role == Profile_1.ProfileType.CORPERATE);
    try {
        const queryParams = {};
        const queryParams2 = {};
        const queryParams3 = {};
        if (role) {
            queryParams.type = role;
        }
        if (status) {
            queryParams2.status = status;
        }
        if (type) {
            queryParams3.workType = type;
        }
        if (role == Profile_1.ProfileType.PROFESSIONAL) {
            if (search) {
                const getProfile = yield Professional_1.Professional.findAll({
                    where: queryParams3,
                    order: [
                        ['id', 'DESC']
                    ],
                    include: [{
                            model: Users_1.Users,
                            where: queryParams2,
                            attributes: ["email", "phone", "status"],
                            include: [{
                                    model: Wallet_1.Wallet,
                                    where: {
                                        type: Wallet_1.WalletType.PROFESSIONAL
                                    },
                                    attributes: ["amount"]
                                }, { model: LanLog_1.LanLog }
                            ]
                        },
                        {
                            model: Profile_1.Profile,
                            where: Object.assign(Object.assign({}, queryParams), { corperate: 0, [sequelize_1.Op.or]: [
                                    { fullName: { [sequelize_1.Op.like]: `%${search}%` } },
                                ] }),
                            attributes: ["fullName", "avatar", "lga", "state", "address", "bvn", "type", "corperate"],
                            include: [{
                                    model: ProffesionalSector_1.ProfessionalSector, include: [
                                        { model: Sector_1.Sector },
                                        { model: Profession_1.Profession },
                                    ]
                                }]
                        },
                        {
                            model: Cooperation_1.Corperate,
                        }],
                });
                if (getProfile)
                    return (0, utility_1.successResponse)(res, "Fetched Successfully", getProfile);
                return (0, utility_1.errorResponse)(res, "Failed fetching Users");
            }
            else {
                const getProfile = yield Professional_1.Professional.findAll({
                    where: queryParams3,
                    order: [
                        ['id', 'DESC']
                    ],
                    include: [{
                            model: Users_1.Users,
                            where: queryParams2,
                            attributes: ["email", "phone", "status"],
                            include: [{
                                    model: Wallet_1.Wallet,
                                    where: {
                                        type: Wallet_1.WalletType.PROFESSIONAL
                                    },
                                    attributes: ["amount"]
                                }, { model: LanLog_1.LanLog }
                            ]
                        },
                        {
                            model: Profile_1.Profile,
                            where: Object.assign(Object.assign({}, queryParams), { corperate: 0 }),
                            attributes: ["fullName", "avatar", "lga", "state", "address", "bvn", "type", "corperate"],
                            include: [{
                                    model: ProffesionalSector_1.ProfessionalSector, include: [
                                        { model: Sector_1.Sector },
                                        { model: Profession_1.Profession },
                                    ]
                                }]
                        },
                        {
                            model: Cooperation_1.Corperate,
                            attributes: ["nameOfOrg", "phone", "address", "state", "lga", "regNum", "noOfEmployees"]
                        }],
                });
                if (getProfile)
                    return (0, utility_1.successResponse)(res, "Fetched Successfully", getProfile);
                return (0, utility_1.errorResponse)(res, "Failed fetching Users");
            }
        }
        else if (role == Profile_1.ProfileType.CORPERATE) {
            if (search) {
                console.log("ppppp");
                const getProfile = yield Professional_1.Professional.findAll({
                    where: queryParams3,
                    order: [
                        ['id', 'DESC']
                    ],
                    include: [{
                            model: Users_1.Users,
                            where: queryParams2,
                            attributes: ["email", "phone", "status"],
                            include: [{
                                    model: Wallet_1.Wallet,
                                    where: {
                                        type: Wallet_1.WalletType.PROFESSIONAL
                                    }, attributes: ["amount"]
                                }, { model: LanLog_1.LanLog }
                            ]
                        },
                        {
                            model: Profile_1.Profile,
                            where: {
                                corperate: 1,
                                [sequelize_1.Op.or]: [
                                    { fullName: { [sequelize_1.Op.like]: `%${search}%` } },
                                ],
                            },
                            attributes: ["fullName", "avatar", "lga", "state", "address", "bvn", "type", "corperate"],
                            include: [{
                                    model: ProffesionalSector_1.ProfessionalSector, include: [
                                        { model: Sector_1.Sector },
                                        { model: Profession_1.Profession },
                                    ]
                                }]
                        },
                        {
                            model: Cooperation_1.Corperate,
                        }
                    ],
                });
                if (getProfile)
                    return (0, utility_1.successResponse)(res, "Fetched Successfully", getProfile);
                return (0, utility_1.errorResponse)(res, "Failed fetching Users");
            }
            else {
                const getProfile = yield Professional_1.Professional.findAll({
                    where: queryParams3,
                    order: [
                        ['id', 'DESC']
                    ],
                    include: [{
                            model: Users_1.Users,
                            where: queryParams2,
                            attributes: ["email", "phone", "status"],
                            include: [{
                                    model: Wallet_1.Wallet,
                                    where: {
                                        type: Wallet_1.WalletType.PROFESSIONAL
                                    },
                                    attributes: ["amount"]
                                }, { model: LanLog_1.LanLog }
                            ]
                        },
                        {
                            model: Profile_1.Profile,
                            where: {
                                corperate: 1
                            },
                            attributes: ["fullName", "avatar", "lga", "state", "address", "bvn", "type", "corperate"],
                            include: [{
                                    model: ProffesionalSector_1.ProfessionalSector, include: [
                                        { model: Sector_1.Sector },
                                        { model: Profession_1.Profession },
                                    ]
                                }]
                        },
                        {
                            model: Cooperation_1.Corperate,
                            attributes: ["nameOfOrg", "phone", "address", "state", "lga", "regNum", "noOfEmployees"]
                        }
                    ],
                });
                if (getProfile)
                    return (0, utility_1.successResponse)(res, "Fetched Successfully", getProfile);
                return (0, utility_1.errorResponse)(res, "Failed fetching Users");
            }
        }
        else if (role == Profile_1.ProfileType.CLIENT) {
            if (search) {
                const getProfile = yield Profile_1.Profile.findAll({
                    where: Object.assign(Object.assign({}, queryParams), { [sequelize_1.Op.or]: [
                            { fullName: { [sequelize_1.Op.like]: `%${search}%` } },
                        ] }),
                    order: [
                        ['id', 'DESC']
                    ],
                    include: [{
                            model: Users_1.Users,
                            where: queryParams2,
                            attributes: ["email", "phone", "status"],
                            include: [{
                                    model: Wallet_1.Wallet,
                                    where: {
                                        type: Wallet_1.WalletType.CLIENT
                                    },
                                    attributes: ["amount"]
                                }, { model: LanLog_1.LanLog }]
                        }],
                });
                if (getProfile)
                    return (0, utility_1.successResponse)(res, "Fetched Successfully", getProfile);
                return (0, utility_1.errorResponse)(res, "Failed fetching Users");
            }
            else {
                const getProfile = yield Profile_1.Profile.findAll({
                    where: queryParams,
                    order: [
                        ['id', 'DESC']
                    ],
                    include: [{
                            model: Users_1.Users,
                            where: queryParams2,
                            attributes: ["email", "phone", "status"],
                            include: [{
                                    model: Wallet_1.Wallet,
                                    where: {
                                        type: Wallet_1.WalletType.CLIENT
                                    },
                                    attributes: ["amount"]
                                }, { model: LanLog_1.LanLog }]
                        }],
                });
                if (getProfile)
                    return (0, utility_1.successResponse)(res, "Fetched Successfully", getProfile);
                return (0, utility_1.errorResponse)(res, "Failed fetching Users");
            }
        }
        else {
            if (search) {
                const getProfile = yield Profile_1.Profile.findAll({
                    where: Object.assign(Object.assign({}, queryParams), { [sequelize_1.Op.or]: [
                            { fullName: { [sequelize_1.Op.like]: `%${search}%` } },
                        ] }),
                    order: [
                        ['id', 'DESC']
                    ],
                    include: [{
                            model: Users_1.Users,
                            where: queryParams2,
                            attributes: ["email", "phone", "status"],
                            include: [{
                                    model: Wallet_1.Wallet,
                                    where: {
                                        type: Wallet_1.WalletType.PROFESSIONAL
                                    },
                                    attributes: ["amount"]
                                }, { model: LanLog_1.LanLog }]
                        }],
                });
                if (getProfile)
                    return (0, utility_1.successResponse)(res, "Fetched Successfully", getProfile);
                return (0, utility_1.errorResponse)(res, "Failed fetching Users");
            }
            else {
                const getProfile = yield Profile_1.Profile.findAll({
                    where: queryParams,
                    order: [
                        ['id', 'DESC']
                    ],
                    include: [{
                            model: Users_1.Users,
                            where: queryParams2,
                            attributes: ["email", "phone", "status"],
                            include: [{
                                    model: Wallet_1.Wallet,
                                    where: {
                                        type: Wallet_1.WalletType.PROFESSIONAL
                                    },
                                    attributes: ["amount"]
                                }, { model: LanLog_1.LanLog }]
                        }],
                });
                if (getProfile)
                    return (0, utility_1.successResponse)(res, "Fetched Successfully", getProfile);
                return (0, utility_1.errorResponse)(res, "Failed fetching Users");
            }
        }
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occurred - ${error}`);
    }
});
exports.sortUsers = sortUsers;
const userProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { id, type } = req.query;
    if (type == Profile_1.ProfileType.PROFESSIONAL || type == Profile_1.ProfileType.CORPERATE) {
        const profile = yield Professional_1.Professional.findOne({
            where: { userId: id },
            include: [{
                    model: Users_1.Users,
                    attributes: ["email", "phone", "status"],
                    include: [
                        {
                            model: Wallet_1.Wallet,
                            where: {
                                type: Wallet_1.WalletType.PROFESSIONAL
                            }, attributes: ["amount"]
                        },
                        { model: LanLog_1.LanLog },
                        { model: Jobs_1.Jobs, attributes: ["status", "id"] }
                    ]
                },
                //   {model: Profession},
                //   {model: Sector},
                {
                    model: Profile_1.Profile,
                    attributes: ["fullName", "avatar", "lga", "state", "address", "bvn", "type"],
                    include: [{
                            model: VoiceRecording_1.VoiceRecord,
                            attributes: ["id", "url", "createdAt"],
                        },
                        { model: Market_1.MarketPlace },
                        {
                            model: ProffesionalSector_1.ProfessionalSector, include: [
                                { model: Sector_1.Sector },
                                { model: Profession_1.Profession },
                            ]
                        }]
                },
                {
                    model: Cooperation_1.Corperate,
                    attributes: ["nameOfOrg", "phone", "address", "state", "lga", "regNum", "noOfEmployees"]
                }
            ],
        });
        const review = yield Review_1.Review.findAll({
            where: {
                proffesionalUserId: id,
            },
            include: [{
                    model: Users_1.Users, as: "user",
                    attributes: ["id"], include: [{ model: Profile_1.Profile, attributes: ["fullName", "avatar"] }]
                }]
        });
        const all_transactions_spend = yield Transaction_1.Transactions.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: {
                userId: id,
                type: Transaction_1.TransactionType.DEBIT,
            },
            attributes: [[sequelize_typescript_1.Sequelize.literal('SUM(amount)'), 'result']],
        });
        const all_transactions_earn = yield Transaction_1.Transactions.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: {
                userId: id,
                type: Transaction_1.TransactionType.CREDIT,
                creditType: Transaction_1.CreditType.EARNING
            },
            attributes: [[sequelize_typescript_1.Sequelize.literal('SUM(amount)'), 'result']],
        });
        if (profile)
            return (0, utility_1.successResponse)(res, "Fetched Successfully", {
                profile, review,
                totalSpending: (_a = all_transactions_spend[0].dataValues.result) !== null && _a !== void 0 ? _a : 0,
                totalEarning: (_b = all_transactions_earn[0].dataValues.result) !== null && _b !== void 0 ? _b : 0,
            });
        return (0, utility_1.errorResponse)(res, "Failed fetching Users");
    }
    else {
        const profile = yield Profile_1.Profile.findOne({
            where: { userId: id },
            include: [{
                    model: Users_1.Users,
                    attributes: ["email", "phone", "status"],
                    include: [{
                            model: Wallet_1.Wallet,
                            where: {
                                type: Wallet_1.WalletType.CLIENT
                            }, attributes: ["amount"]
                        },
                        { model: LanLog_1.LanLog },
                        { model: Jobs_1.Jobs, attributes: ["status", "id"] }]
                },
                { model: Market_1.MarketPlace },
                {
                    model: VoiceRecording_1.VoiceRecord,
                    attributes: ["id", "url", "createdAt"]
                }
            ],
        });
        const all_transactions_spend = yield Transaction_1.Transactions.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: {
                userId: id,
                type: Transaction_1.TransactionType.DEBIT,
            },
            attributes: [[sequelize_typescript_1.Sequelize.literal('SUM(amount)'), 'result']],
        });
        const review = yield Review_1.Review.findAll({
            where: {
                clientUserId: id
            },
            include: [{
                    model: Users_1.Users, as: "user",
                    attributes: ["id"], include: [{ model: Profile_1.Profile, attributes: ["fullName", "avatar"] }]
                }]
        });
        if (profile)
            return (0, utility_1.successResponse)(res, "Fetched Successfully", {
                profile, review,
                totalSpending: (_c = all_transactions_spend[0].dataValues.result) !== null && _c !== void 0 ? _c : 0,
            });
        return (0, utility_1.errorResponse)(res, "Failed fetching Users");
    }
});
exports.userProfile = userProfile;
const updateUserStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, id } = req.body;
    const user = yield Users_1.Users.findOne({
        where: {
            id
        }
    });
    if (!user)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "User Not Found" });
    const profile = yield Profile_1.Profile.findOne({ where: { userId: id } });
    const update = yield (user === null || user === void 0 ? void 0 : user.update({ status }));
    if (status == Users_1.UserStatus.SUSPENDED) {
        yield (0, sms_1.sendEmailResend)(user.email, "Acepick Account Status", `<p>Hello ${profile === null || profile === void 0 ? void 0 : profile.fullName},<br><br> Your account is ${status} for violating a rule, please contact support to resolve this issue. Best Regards.</p>`);
        return (0, utility_1.successResponse)(res, "Successful", update);
    }
    else {
        yield (0, sms_1.sendEmailResend)(user.email, "Acepick Account Status", `Hello ${profile === null || profile === void 0 ? void 0 : profile.fullName},<br> You can now use acepick features without restriction. Best Regards.`);
        return (0, utility_1.successResponse)(res, "Successful", update);
    }
});
exports.updateUserStatus = updateUserStatus;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const user = yield Users_1.Users.findOne({
        where: {
            id
        }
    });
    if (!user)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "user not Found" });
    const update = yield (user === null || user === void 0 ? void 0 : user.destroy());
    return (0, utility_1.successResponse)(res, "Deleted Successfully", update);
});
exports.deleteUser = deleteUser;
const deleteRecording = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const record = yield VoiceRecording_1.VoiceRecord.findOne({
        where: {
            id
        }
    });
    if (!record)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "record not Found" });
    const update = yield (record === null || record === void 0 ? void 0 : record.destroy());
    return (0, utility_1.successResponse)(res, "Deleted Successfully", update);
});
exports.deleteRecording = deleteRecording;
const updateDisputeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, infavourof } = req.body;
    const dispute = yield Dispute_1.Dispute.findOne({
        where: {
            id
        }
    });
    if (!dispute)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Dispute Not Found" });
    if (dispute.status == Dispute_1.DisputeStatus.RESOLVED)
        return (0, utility_1.errorResponse)(res, "Dispute already Resolved", { status: true, message: "Dispute already Resolved" });
    const update = yield (dispute === null || dispute === void 0 ? void 0 : dispute.update({ status: Dispute_1.DisputeStatus.RESOLVED }));
    const job = yield Jobs_1.Jobs.findOne({ where: { id: dispute.jobId } });
    yield (job === null || job === void 0 ? void 0 : job.update({
        status: Jobs_1.JobStatus.COMPLETED
    }));
    if (infavourof == Profile_1.ProfileType.PROFESSIONAL) {
        const invoice = yield Jobs_1.Jobs.findOne({
            where: {
                id: dispute.jobId
            }
        });
        const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: invoice.userId, type: Wallet_1.WalletType.CLIENT } });
        const walletProvider = yield Wallet_1.Wallet.findOne({ where: { userId: invoice.ownerId, type: Wallet_1.WalletType.PROFESSIONAL } });
        yield (walletUser === null || walletUser === void 0 ? void 0 : walletUser.update({
            transitAmount: (Number(walletUser === null || walletUser === void 0 ? void 0 : walletUser.transitAmount) - Number(invoice === null || invoice === void 0 ? void 0 : invoice.total)),
            amount: (Number(walletUser === null || walletUser === void 0 ? void 0 : walletUser.amount) + Number(invoice === null || invoice === void 0 ? void 0 : invoice.total)),
        }));
        yield Transaction_1.Transactions.create({
            title: "Deposit successful",
            description: `Your deposit of NGN${invoice.total} into your Acepick wallet on job cencelation was successful`,
            type: Transaction_1.TransactionType.CREDIT, amount: invoice === null || invoice === void 0 ? void 0 : invoice.total,
            creditType: Transaction_1.CreditType.FUNDING,
            status: "SUCCESSFUL", userId: invoice === null || invoice === void 0 ? void 0 : invoice.userId, walletId: walletUser === null || walletUser === void 0 ? void 0 : walletUser.id
        });
        yield Transaction_1.Transactions.create({
            title: "Job Canceled",
            description: `The Job "${invoice.title}" has been canceled`,
            type: Transaction_1.TransactionType.JOB,
            creditType: Transaction_1.CreditType.NONE,
            status: "CANCELED", userId: invoice === null || invoice === void 0 ? void 0 : invoice.ownerId,
            walletId: walletProvider === null || walletProvider === void 0 ? void 0 : walletProvider.id, jobId: invoice.id
        });
        yield Transaction_1.Transactions.create({
            title: "Job Canceled",
            description: `The Job "${invoice.title}" has been canceled`,
            type: Transaction_1.TransactionType.JOB,
            creditType: Transaction_1.CreditType.NONE,
            status: "CANCELED", userId: invoice === null || invoice === void 0 ? void 0 : invoice.userId,
            jobId: invoice.id
        });
        yield invoice.update({ processed: true });
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
        return (0, utility_1.successResponse)(res, "Successful", update);
    }
    else {
        const invoice = yield Jobs_1.Jobs.findOne({
            where: {
                id: dispute.jobId
            }
        });
        const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: invoice.userId, type: Wallet_1.WalletType.CLIENT } });
        const walletProvider = yield Wallet_1.Wallet.findOne({ where: { userId: invoice.ownerId, type: Wallet_1.WalletType.PROFESSIONAL } });
        yield (walletProvider === null || walletProvider === void 0 ? void 0 : walletProvider.update({
            transitAmount: (Number(walletProvider === null || walletProvider === void 0 ? void 0 : walletProvider.transitAmount) - Number(invoice === null || invoice === void 0 ? void 0 : invoice.total)),
            amount: (Number(walletProvider === null || walletProvider === void 0 ? void 0 : walletProvider.amount) + Number(invoice === null || invoice === void 0 ? void 0 : invoice.total)),
        }));
        yield Transaction_1.Transactions.create({
            title: "Deposit successful",
            description: `Your deposit of NGN${invoice.total} into your Acepick wallet on job cencelation was successful`,
            type: Transaction_1.TransactionType.CREDIT, amount: invoice === null || invoice === void 0 ? void 0 : invoice.total,
            creditType: Transaction_1.CreditType.FUNDING,
            status: "SUCCESSFUL", userId: invoice === null || invoice === void 0 ? void 0 : invoice.ownerId, walletId: walletProvider === null || walletProvider === void 0 ? void 0 : walletProvider.id
        });
        yield Transaction_1.Transactions.create({
            title: "Job Approved",
            description: `The Job "${invoice.title}" has been approved`,
            type: Transaction_1.TransactionType.JOB,
            creditType: Transaction_1.CreditType.NONE,
            status: "SUCCESSFUL", userId: invoice === null || invoice === void 0 ? void 0 : invoice.ownerId,
            walletId: walletProvider === null || walletProvider === void 0 ? void 0 : walletProvider.id, jobId: invoice.id
        });
        yield Transaction_1.Transactions.create({
            title: "Job Approved",
            description: `The Job "${invoice.title}" has been approved`,
            type: Transaction_1.TransactionType.JOB,
            creditType: Transaction_1.CreditType.NONE,
            status: "SUCCESSFUL", userId: invoice === null || invoice === void 0 ? void 0 : invoice.userId,
            jobId: invoice.id
        });
        yield invoice.update({ processed: true });
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
        return (0, utility_1.successResponse)(res, "Successful", update);
    }
});
exports.updateDisputeStatus = updateDisputeStatus;
const getSingleDisputes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const dispute = yield Dispute_1.Dispute.findOne({
        where: { id },
        include: [
            { model: Users_1.Users, attributes: ["email", "id"], as: 'reporter', include: [Profile_1.Profile] },
            { model: Users_1.Users, attributes: ["email", "id"], as: 'partner', include: [Profile_1.Profile] },
            { model: Jobs_1.Jobs }
        ],
        order: [
            ['id', 'DESC']
        ],
    });
    const voicerecord = yield VoiceRecording_1.VoiceRecord.findAll({
        where: {
            userId: [dispute === null || dispute === void 0 ? void 0 : dispute.reporterId, dispute === null || dispute === void 0 ? void 0 : dispute.partnerId],
            recieverId: [dispute === null || dispute === void 0 ? void 0 : dispute.reporterId, dispute === null || dispute === void 0 ? void 0 : dispute.partnerId]
        },
        include: [
            { model: Users_1.Users, attributes: ["email", "id"], as: 'reciever', include: [Profile_1.Profile] },
            { model: Users_1.Users, attributes: ["email", "id"], as: 'user', include: [Profile_1.Profile] },
        ]
    });
    return (0, utility_1.successResponse)(res, "Successful", { dispute, voicerecord });
});
exports.getSingleDisputes = getSingleDisputes;
const getAllDisputes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield Dispute_1.Dispute.findAll({
        include: [
            { model: Users_1.Users, attributes: ["email", "id"], as: 'reporter' },
            { model: Users_1.Users, attributes: ["email", "id"], as: 'partner' },
            { model: Jobs_1.Jobs }
        ],
        order: [
            ['id', 'DESC']
        ],
    });
    return (0, utility_1.successResponse)(res, "Successful", users);
});
exports.getAllDisputes = getAllDisputes;
const deleteDisputes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const dispute = yield Dispute_1.Dispute.findOne({
        where: {
            id
        }
    });
    if (!dispute)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "dispute not Found" });
    const update = yield (dispute === null || dispute === void 0 ? void 0 : dispute.destroy());
    return (0, utility_1.successResponse)(res, "Deleted Successfully", update);
});
exports.deleteDisputes = deleteDisputes;
const deleteTicketMesaage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const ticketMessage = yield TicketMessage_1.TicketMessage.findOne({
        where: {
            id
        }
    });
    if (!ticketMessage)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "ticket message not Found" });
    const update = yield (ticketMessage === null || ticketMessage === void 0 ? void 0 : ticketMessage.destroy());
    return (0, utility_1.successResponse)(res, "Deleted Successfully", update);
});
exports.deleteTicketMesaage = deleteTicketMesaage;
const getJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, userId } = req.query;
    const jobs = yield Jobs_1.Jobs.findAll({
        where: { status, providerId: userId },
        order: [
            ['id', 'DESC']
        ],
        include: [
            { model: Users_1.Users, attributes: ["email", "id"], as: 'user' },
            { model: Users_1.Users, attributes: ["email", "id"], as: 'provider' },
            { model: Dispute_1.Dispute }
        ]
    });
    return (0, utility_1.successResponse)(res, "Successful", jobs);
});
exports.getJobs = getJobs;
const postTicketMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { admin, ticketId, message, image } = req.body;
    // const {id} = req.user;
    // userId =  id;
    const getTicket = yield Ticket_1.Ticket.findOne({ where: { id: ticketId } });
    if (!getTicket)
        return (0, utility_1.successResponse)(res, "Ticket Not Found");
    if (req.files) {
        //     // Read content from the file
        let uploadedImageurl = [];
        for (var file of req.files) {
            // upload image here
            const result = yield (0, upload_1.upload_cloud)(file.path.replace(/ /g, "_"));
            uploadedImageurl.push(result.secure_url);
            image = uploadedImageurl;
            console.log(image);
        }
        try {
            const insertData = {
                image: uploadedImageurl[0],
                message, admin, ticketId: Number(ticketId),
                userId: getTicket.userId,
                adminId: getTicket.adminId,
            };
            const createTicketMessage = yield TicketMessage_1.TicketMessage.create(insertData);
            if (createTicketMessage)
                return (0, utility_1.successResponse)(res, "Created Successfully", createTicketMessage);
            return (0, utility_1.errorResponse)(res, "Failed Creating Ticket Message");
        }
        catch (error) {
            console.log(error);
            return (0, utility_1.errorResponse)(res, `An error occurred - ${error}`);
        }
    }
    else {
        try {
            const insertData = {
                message, admin, ticketId: Number(ticketId),
                adminId: getTicket.adminId,
                userId: getTicket.userId,
            };
            const createTicketMessage = yield TicketMessage_1.TicketMessage.create(insertData);
            if (createTicketMessage)
                return (0, utility_1.successResponse)(res, "Created Successfully", createTicketMessage);
            return (0, utility_1.errorResponse)(res, "Failed Creating Ticket Message");
        }
        catch (error) {
            console.log(error);
            return (0, utility_1.errorResponse)(res, `An error occurred - ${error}`);
        }
    }
});
exports.postTicketMessage = postTicketMessage;
const postTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { userId, name, lastMessage, image, description } = req.body;
    const { id } = req.admin;
    console.log(id);
    console.log(id);
    console.log(id);
    if (req.files) {
        //     // Read content from the file
        let uploadedImageurl = [];
        for (var file of req.files) {
            // upload image here
            const result = yield (0, upload_1.upload_cloud)(file.path.replace(/ /g, "_"));
            uploadedImageurl.push(result.secure_url);
            image = uploadedImageurl;
            console.log(image);
        }
        try {
            const insertData = {
                userId,
                adminId: id,
                name, description, lastMessage, image: {
                    images: uploadedImageurl
                }
            };
            console.log(insertData);
            const createTicket = yield Ticket_1.Ticket.create(insertData);
            if (createTicket)
                return (0, utility_1.successResponse)(res, "Created Successfully", createTicket);
            return (0, utility_1.errorResponse)(res, "Failed Creating Ticket");
        }
        catch (error) {
            console.log(error);
            return (0, utility_1.errorResponse)(res, `An error occurred - ${error}`);
        }
    }
    else {
        try {
            const insertData = {
                userId,
                adminId: id,
                name, description, lastMessage
            };
            console.log(insertData);
            const createTicket = yield Ticket_1.Ticket.create(insertData);
            if (createTicket)
                return (0, utility_1.successResponse)(res, "Created Successfully", createTicket);
            return (0, utility_1.errorResponse)(res, "Failed Creating Ticket");
        }
        catch (error) {
            console.log(error);
            return (0, utility_1.errorResponse)(res, `An error occurred - ${error}`);
        }
    }
});
exports.postTicket = postTicket;
const getTicketMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { ticketId } = req.query;
    try {
        const getTicketMessages = yield TicketMessage_1.TicketMessage.findAll({
            where: {
                ticketId
            },
            order: [
                ['id', 'DESC']
            ],
        });
        if (getTicketMessages)
            return (0, utility_1.successResponse)(res, "Fetched Successfully", getTicketMessages);
        return (0, utility_1.errorResponse)(res, "Ticket Messages Does not exist");
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occurred - ${error}`);
    }
});
exports.getTicketMessage = getTicketMessage;
const deleteTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { ticketId } = req.query;
    try {
        const getTicket = yield Ticket_1.Ticket.findOne({ where: { id: ticketId } });
        if (!getTicket)
            return (0, utility_1.errorResponse)(res, "Ticket does not exist");
        yield (getTicket === null || getTicket === void 0 ? void 0 : getTicket.destroy());
        return (0, utility_1.successResponse)(res, "Ticket Deleted");
        // return errorResponse(res, "Failed Creating Product/Service");
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occurred - ${error}`);
    }
});
exports.deleteTicket = deleteTicket;
const getUserTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { status } = req.query;
    try {
        if (status) {
            const getTickets = yield Ticket_1.Ticket.findAll({
                where: {
                    userId: id,
                    status
                },
                order: [
                    ['id', 'DESC']
                ],
            });
            if (getTickets)
                return (0, utility_1.successResponse)(res, "Fetched Successfully", getTickets);
            return (0, utility_1.errorResponse)(res, "Ticket Does not exist");
        }
        else {
            const getTickets = yield Ticket_1.Ticket.findAll({
                order: [
                    ['id', 'DESC']
                ],
            });
            if (getTickets)
                return (0, utility_1.successResponse)(res, "Fetched Successfully", getTickets);
            return (0, utility_1.errorResponse)(res, "Ticket Does not exist");
        }
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occurred - ${error}`);
    }
});
exports.getUserTicket = getUserTicket;
const getAllTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.query;
    try {
        if (status) {
            const getTickets = yield Ticket_1.Ticket.findAll({
                where: {
                    status
                },
                order: [
                    ['id', 'DESC']
                ],
            });
            if (getTickets)
                return (0, utility_1.successResponse)(res, "Fetched Successfully", getTickets);
            return (0, utility_1.errorResponse)(res, "Ticket Does not exist");
        }
        else {
            const getTickets = yield Ticket_1.Ticket.findAll({
                order: [
                    ['id', 'DESC']
                ],
            });
            if (getTickets)
                return (0, utility_1.successResponse)(res, "Fetched Successfully", getTickets);
            return (0, utility_1.errorResponse)(res, "Ticket Does not exist");
        }
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occurred - ${error}`);
    }
});
exports.getAllTicket = getAllTicket;
const updateTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, status, lastMessage, image, ticketId, description } = req.body;
    // const { id } = req.user;
    const ticket = yield Ticket_1.Ticket.findOne({ where: { id: ticketId } });
    if (!ticket)
        return (0, utility_1.successResponse)(res, "No Ticket Found");
    if (req.files) {
        //     // Read content from the file
        let uploadedImageurl = [];
        for (var file of req.files) {
            // upload image here
            const result = yield (0, upload_1.upload_cloud)(file.path.replace(/ /g, "_"));
            uploadedImageurl.push(result.secure_url);
            image = uploadedImageurl;
            console.log(image);
        }
        try {
            const insertData = {
                name: name !== null && name !== void 0 ? name : ticket === null || ticket === void 0 ? void 0 : ticket.name, status: status !== null && status !== void 0 ? status : ticket === null || ticket === void 0 ? void 0 : ticket.status,
                lastMessage: lastMessage !== null && lastMessage !== void 0 ? lastMessage : ticket === null || ticket === void 0 ? void 0 : ticket.lastMessage, description: description !== null && description !== void 0 ? description : ticket === null || ticket === void 0 ? void 0 : ticket.description,
                image: {
                    images: uploadedImageurl
                }
            };
            const updateTicket = yield ticket.update(insertData);
            // wallet?.update({balance: })
            if (updateTicket)
                return (0, utility_1.successResponse)(res, "Updated Successfully", updateTicket);
            return (0, utility_1.errorResponse)(res, "Failed Updating Ticket");
        }
        catch (error) {
            console.log(error);
            return (0, utility_1.errorResponse)(res, `An error occurred - ${error}`);
        }
    }
    else {
        try {
            const insertData = {
                name: name !== null && name !== void 0 ? name : ticket === null || ticket === void 0 ? void 0 : ticket.name, status: status !== null && status !== void 0 ? status : ticket === null || ticket === void 0 ? void 0 : ticket.status,
                image: ticket === null || ticket === void 0 ? void 0 : ticket.image,
                lastMessage: lastMessage !== null && lastMessage !== void 0 ? lastMessage : ticket === null || ticket === void 0 ? void 0 : ticket.lastMessage, description: description !== null && description !== void 0 ? description : ticket === null || ticket === void 0 ? void 0 : ticket.description,
            };
            const updateTicket = yield ticket.update(insertData);
            // wallet?.update({balance: })
            if (updateTicket)
                return (0, utility_1.successResponse)(res, "Updated Successfully", updateTicket);
            return (0, utility_1.errorResponse)(res, "Failed Updating Ticket");
        }
        catch (error) {
            console.log(error);
            return (0, utility_1.errorResponse)(res, `An error occurred - ${error}`);
        }
    }
});
exports.updateTicket = updateTicket;
//# sourceMappingURL=adminUserManagement.js.map