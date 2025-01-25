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
exports.getReview = exports.matchLocation = exports.getProfSector = exports.updateProfSector = exports.deleteProfSector = exports.unBlock = exports.fetchAllBlock = exports.fetchAllReport = exports.createReport = exports.createBlock = exports.createProfSector = exports.postTicketMessage = exports.updateExperience = exports.deleteExperience = exports.createExperience = exports.updateCertification = exports.deleteCertification = exports.createCertification = exports.updatePorfolio = exports.deletePorfolio = exports.createPorfolio = exports.updateEducation = exports.deleteEducation = exports.createEducation = exports.createReview = exports.getProviderJobs = exports.getProfileJobs = exports.getSingleJob = exports.getUserJobs = exports.deleteJob = exports.updateMaterial = exports.updateJob = exports.createJob = exports.updateJobApproved = exports.checkJobApprove = exports.updateJobSeen = exports.checkJobSeen = exports.uploadRecording = exports.deleteRecording = exports.deleteAllRecording = exports.getRecording = exports.getFavourite = exports.deleteAllFavourite = exports.deleteFavourite = exports.addFavourite = exports.getStates = void 0;
const utility_1 = require("../helpers/utility");
const Sector_1 = require("../models/Sector");
const Profession_1 = require("../models/Profession");
const Professional_1 = require("../models/Professional");
const Profile_1 = require("../models/Profile");
const Users_1 = require("../models/Users");
const LanLog_1 = require("../models/LanLog");
const Cooperation_1 = require("../models/Cooperation");
const sequelize_1 = require("sequelize");
const Favourites_1 = require("../models/Favourites");
const VoiceRecording_1 = require("../models/VoiceRecording");
const upload_1 = require("../helpers/upload");
const Jobs_1 = require("../models/Jobs");
const Material_1 = require("../models/Material");
const Dispute_1 = require("../models/Dispute");
const Wallet_1 = require("../models/Wallet");
const Transaction_1 = require("../models/Transaction");
const Review_1 = require("../models/Review");
const Education_1 = require("../models/Education");
const Porfolio_1 = require("../models/Porfolio");
const Certification_1 = require("../models/Certification");
const Experience_1 = require("../models/Experience");
const Ticket_1 = require("../models/Ticket");
const TicketMessage_1 = require("../models/TicketMessage");
const ProffesionalSector_1 = require("../models/ProffesionalSector");
const Block_1 = require("../models/Block");
const Report_1 = require("../models/Report");
const expo_1 = require("../services/expo");
const app_1 = require("../app");
const redis_1 = require("../services/redis");
const fs = require("fs");
const getStates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    fs.readFile("./keys/state.json", "utf8", (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            return (0, utility_1.errorResponse)(res, "Failed");
        }
        let states = JSON.parse(jsonString.toString().toLowerCase());
        return (0, utility_1.successResponse)(res, "Successful", states);
    });
});
exports.getStates = getStates;
const addFavourite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { professionalId } = req.body;
    const { id } = req.user;
    const professional = yield Professional_1.Professional.findOne({
        where: { userId: professionalId },
    });
    const favourite = yield Favourites_1.Favourite.findOne({
        where: { professionalId: professional === null || professional === void 0 ? void 0 : professional.id, favouriteOwnerId: id },
    });
    if (!professional)
        return (0, utility_1.errorResponse)(res, "Proffesional Not Found");
    if (favourite) {
        yield favourite.destroy();
        return (0, utility_1.successResponse)(res, "Successful", favourite);
    }
    else {
        const profile = yield Profile_1.Profile.findOne({
            where: { userId: professionalId },
        });
        const fav = yield Favourites_1.Favourite.create({
            favouriteOwnerId: id,
            professionalId: professional.id,
            userId: professionalId,
            type: (profile === null || profile === void 0 ? void 0 : profile.corperate)
                ? Profile_1.ProfileType === null || Profile_1.ProfileType === void 0 ? void 0 : Profile_1.ProfileType.CORPERATE
                : Profile_1.ProfileType === null || Profile_1.ProfileType === void 0 ? void 0 : Profile_1.ProfileType.PROFESSIONAL,
        });
        return (0, utility_1.successResponse)(res, "Successful", fav);
    }
});
exports.addFavourite = addFavourite;
const deleteFavourite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { favouriteId } = req.body;
    const { id } = req.user;
    const fav = yield Favourites_1.Favourite.findOne({ where: { id: favouriteId } });
    if (!fav)
        return (0, utility_1.errorResponse)(res, "Favourite Not Found");
    yield (fav === null || fav === void 0 ? void 0 : fav.destroy());
    return (0, utility_1.successResponse)(res, "Successful");
});
exports.deleteFavourite = deleteFavourite;
const deleteAllFavourite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const favourite = yield Favourites_1.Favourite.findAll({
        where: { favouriteOwnerId: id },
    });
    let index = 0;
    for (let value of favourite) {
        yield value.destroy();
        index++;
    }
    if (index == favourite.length) {
        return (0, utility_1.successResponse)(res, "Successful");
    }
});
exports.deleteAllFavourite = deleteAllFavourite;
const getFavourite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const professional = yield Favourites_1.Favourite.findAll({
        order: [["id", "DESC"]],
        where: { favouriteOwnerId: id, type: Profile_1.ProfileType.PROFESSIONAL },
        include: [
            {
                model: Professional_1.Professional,
                include: [
                    {
                        model: Review_1.Review,
                        include: [{
                                model: Users_1.Users, as: "user",
                                attributes: ["id"], include: [{ model: Profile_1.Profile, attributes: ["fullName", "avatar"] }]
                            }]
                    },
                    {
                        model: Profile_1.Profile,
                        where: {
                            // type: ProfileType.PROFESSIONAL,
                            corperate: false,
                            verified: true,
                        },
                        include: [
                            {
                                model: ProffesionalSector_1.ProfessionalSector,
                                include: [{ model: Sector_1.Sector }, { model: Profession_1.Profession }],
                            },
                        ],
                    },
                    { model: Cooperation_1.Corperate },
                    {
                        model: Users_1.Users,
                        include: [
                            { model: LanLog_1.LanLog },
                            {
                                model: Education_1.Education,
                                order: [["id", "DESC"]],
                            },
                            {
                                model: Certification_1.Certification,
                                order: [["id", "DESC"]],
                            },
                            {
                                model: Experience_1.Experience,
                            },
                            {
                                model: Porfolio_1.Porfolio,
                                order: [["id", "DESC"]],
                            },
                            { model: Dispute_1.Dispute },
                        ],
                    },
                ],
            },
        ],
    });
    const cooperate = yield Favourites_1.Favourite.findAll({
        where: { favouriteOwnerId: id, type: Profile_1.ProfileType.CORPERATE },
        order: [["id", "DESC"]],
        include: [
            {
                model: Professional_1.Professional,
                include: [
                    {
                        model: Review_1.Review,
                        include: [{
                                model: Users_1.Users, as: "user",
                                attributes: ["id"], include: [{ model: Profile_1.Profile, attributes: ["fullName", "avatar"] }]
                            }]
                    },
                    {
                        model: Profile_1.Profile,
                        where: {
                            // type: ProfileType.PROFESSIONAL,
                            corperate: true,
                            verified: true,
                        },
                        include: [
                            {
                                model: ProffesionalSector_1.ProfessionalSector,
                                include: [{ model: Sector_1.Sector }, { model: Profession_1.Profession }],
                            },
                        ],
                    },
                    { model: Cooperation_1.Corperate },
                    {
                        model: Users_1.Users,
                        include: [
                            { model: LanLog_1.LanLog },
                            {
                                model: Education_1.Education,
                                order: [["id", "DESC"]],
                            },
                            {
                                model: Certification_1.Certification,
                                order: [["id", "DESC"]],
                            },
                            {
                                model: Experience_1.Experience,
                            },
                            {
                                model: Porfolio_1.Porfolio,
                                order: [["id", "DESC"]],
                            },
                            { model: Dispute_1.Dispute },
                        ],
                    },
                ],
            },
        ],
    });
    return (0, utility_1.successResponse)(res, "Successful", { professional, cooperate });
});
exports.getFavourite = getFavourite;
const getRecording = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { recieverId } = req.query;
    const { id } = req.user;
    const record = yield VoiceRecording_1.VoiceRecord.findAll({
        order: [["id", "DESC"]],
        where: { userId: id, recieverId },
    });
    if (!record)
        return (0, utility_1.errorResponse)(res, "Failed", {
            status: false,
            message: "record not Found",
        });
    return (0, utility_1.successResponse)(res, "Fetch Successfully", record);
});
exports.getRecording = getRecording;
const deleteAllRecording = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    let index = 0;
    // if (!record) return errorResponse(res, "Failed", { status: false, message: "record not Found" })
    for (let value of id) {
        const record = yield VoiceRecording_1.VoiceRecord.findOne({
            where: {
                id: value,
            },
        });
        if (record) {
            const update = yield (record === null || record === void 0 ? void 0 : record.destroy());
            index++;
        }
        else {
            index++;
        }
        if (index == id.length) {
            return (0, utility_1.successResponse)(res, "Deleted All Successfully");
        }
    }
});
exports.deleteAllRecording = deleteAllRecording;
const deleteRecording = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const record = yield VoiceRecording_1.VoiceRecord.findOne({
        where: {
            id,
        },
    });
    if (!record)
        return (0, utility_1.errorResponse)(res, "Failed", {
            status: false,
            message: "record not Found",
        });
    const update = yield (record === null || record === void 0 ? void 0 : record.destroy());
    return (0, utility_1.successResponse)(res, "Deleted Successfully", update);
});
exports.deleteRecording = deleteRecording;
const uploadRecording = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { recieverId, file, duration } = req.body;
    let { id } = req.user;
    const profile = yield Profile_1.Profile.findOne({ where: { userId: id } });
    const record = yield (VoiceRecording_1.VoiceRecord === null || VoiceRecording_1.VoiceRecord === void 0 ? void 0 : VoiceRecording_1.VoiceRecord.create({
        duration,
        userId: id,
        recieverId,
        profileId: profile === null || profile === void 0 ? void 0 : profile.id,
        url: file,
    }));
    return (0, utility_1.successResponse)(res, "Successful", record);
});
exports.uploadRecording = uploadRecording;
const checkJobSeen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, ownerId } = req.query;
    const checkJob = yield Jobs_1.Jobs.findAll({ where: { [sequelize_1.Op.and]: [
                { userId }, // replace `specificValue` with the actual value
                { ownerId }
            ] } });
    let seen;
    for (const value of checkJob) {
        if (!value.seen) {
            seen = true;
        }
    }
    return (0, utility_1.successResponse)(res, "Successful", seen);
});
exports.checkJobSeen = checkJobSeen;
const updateJobSeen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const checkJob = yield Jobs_1.Jobs.findOne({ where: { [sequelize_1.Op.or]: [
                { userId: id },
                { ownerId: id }
            ] } });
    if (!checkJob)
        return (0, utility_1.successResponseFalse)(res, "Not Found");
    yield (checkJob === null || checkJob === void 0 ? void 0 : checkJob.update({ seen: true }));
    return (0, utility_1.successResponse)(res, "Successful");
});
exports.updateJobSeen = updateJobSeen;
const checkJobApprove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const checkJob = yield Jobs_1.Jobs.findOne({ where: { [sequelize_1.Op.or]: [
                { userId: id }, // replace `specificValue` with the actual value
                { ownerId: id }
            ] } });
    return (0, utility_1.successResponse)(res, "Successful", checkJob === null || checkJob === void 0 ? void 0 : checkJob.approved);
});
exports.checkJobApprove = checkJobApprove;
const updateJobApproved = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const checkJob = yield Jobs_1.Jobs.findOne({ where: { [sequelize_1.Op.or]: [
                { userId: id },
                { ownerId: id }
            ] } });
    if (!checkJob)
        return (0, utility_1.successResponseFalse)(res, "Not Found");
    yield (checkJob === null || checkJob === void 0 ? void 0 : checkJob.update({ approved: true }));
    return (0, utility_1.successResponse)(res, "Successful");
});
exports.updateJobApproved = updateJobApproved;
const createJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let { description, title, mode, state, lga, fullAddress, long, total, workmannShip, isMaterial, gettingMaterial, lan, durationUnit, durationValue, userId, materials, } = req.body;
    let { id } = req.user;
    const job = yield (Jobs_1.Jobs === null || Jobs_1.Jobs === void 0 ? void 0 : Jobs_1.Jobs.create({
        description,
        title,
        mode,
        state,
        lga,
        fullAddress,
        long,
        total,
        workmannShip,
        isMaterial,
        gettingMaterial,
        lan,
        durationUnit,
        durationValue,
        ownerId: id,
        userId: userId,
    }));
    const jobOwner = yield Professional_1.Professional.findOne({
        where: { userId: job.ownerId },
    });
    // await jobOwner?.update({ totalJobPending: (Number(jobOwner.totalJobPending) + 1) })
    const jobUser = yield Profile_1.Profile.findOne({ where: { userId: job.userId } });
    // await jobUser?.update({ totalPendingHire: (Number(jobUser.totalPendingHire) + 1) })
    const wallet = yield Wallet_1.Wallet.findOne({ where: { userId: jobUser === null || jobUser === void 0 ? void 0 : jobUser.userId, type: Wallet_1.WalletType.CLIENT } });
    yield (0, expo_1.sendExpoNotification)(jobUser.fcmToken, `${(_a = jobOwner === null || jobOwner === void 0 ? void 0 : jobOwner.profile) === null || _a === void 0 ? void 0 : _a.fullName} sent you an invoice`);
    yield Transaction_1.Transactions.create({
        title: "Invoice Sent",
        description: `${(_b = jobOwner === null || jobOwner === void 0 ? void 0 : jobOwner.profile) === null || _b === void 0 ? void 0 : _b.fullName} sent you an invoice`,
        type: Transaction_1.TransactionType.NOTIFICATION, amount: 0,
        creditType: Transaction_1.CreditType.NONE,
        status: "SUCCESSFUL", userId: job.userId, walletId: wallet === null || wallet === void 0 ? void 0 : wallet.id
    });
    const redis = new redis_1.Redis();
    const cachedUserSocket = yield redis.getData(`notification - ${job.userId} `);
    const socketUser = app_1.socketio.sockets.sockets.get(cachedUserSocket);
    if (socketUser) {
        const notificationsUser = yield Transaction_1.Transactions.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: { userId: job.ownerId, read: false },
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
        const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: job.userId, type: Wallet_1.WalletType.CLIENT } });
        socketUser.emit("wallet", walletUser);
    }
    if (materials) {
        let newMaterial = [];
        for (let value of materials) {
            newMaterial.push(Object.assign(Object.assign({}, value), { jobId: job.id }));
        }
        const material = yield Material_1.Material.bulkCreate(newMaterial);
        return (0, utility_1.successResponse)(res, "Successful", Object.assign(Object.assign({}, job.dataValues), { material }));
    }
    else {
        return (0, utility_1.successResponse)(res, "Successful", Object.assign(Object.assign({}, job.dataValues), { material: [] }));
    }
});
exports.createJob = createJob;
const updateJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { description, title, mode, state, lga, fullAddress, long, total, workmannShip, isMaterial, gettingMaterial, lan, durationUnit, durationValue, userId, jobId, status, } = req.body;
    let { id } = req.user;
    const oldJob = yield Jobs_1.Jobs.findOne({ where: { id: jobId } });
    if (!oldJob)
        return (0, utility_1.errorResponse)(res, "Job not Found");
    const job = yield (oldJob === null || oldJob === void 0 ? void 0 : oldJob.update({
        description: description !== null && description !== void 0 ? description : oldJob.description,
        title: title !== null && title !== void 0 ? title : oldJob.title,
        mode: mode !== null && mode !== void 0 ? mode : oldJob.mode,
        state: state !== null && state !== void 0 ? state : oldJob.state,
        lga: lga !== null && lga !== void 0 ? lga : oldJob.lga,
        fullAddress: fullAddress !== null && fullAddress !== void 0 ? fullAddress : oldJob.fullAddress,
        long: long !== null && long !== void 0 ? long : oldJob.long,
        total: total !== null && total !== void 0 ? total : oldJob.total,
        status: status !== null && status !== void 0 ? status : oldJob.status,
        workmannShip: workmannShip !== null && workmannShip !== void 0 ? workmannShip : oldJob.workmannShip,
        isMaterial: isMaterial !== null && isMaterial !== void 0 ? isMaterial : oldJob.isMaterial,
        gettingMaterial: gettingMaterial !== null && gettingMaterial !== void 0 ? gettingMaterial : oldJob.gettingMaterial,
        lan: lan !== null && lan !== void 0 ? lan : oldJob.lan,
        durationUnit: durationUnit !== null && durationUnit !== void 0 ? durationUnit : oldJob.durationUnit,
        durationValue: durationValue !== null && durationValue !== void 0 ? durationValue : oldJob.durationValue,
        ownerId: id,
        userId: userId !== null && userId !== void 0 ? userId : oldJob.userId,
    }));
    return (0, utility_1.successResponse)(res, "Successful", job);
});
exports.updateJob = updateJob;
const updateMaterial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { description, price, quantity, materialId, subTotal } = req.body;
    let { id } = req.user;
    const oldMaterial = yield Material_1.Material.findOne({ where: { id: materialId } });
    if (!oldMaterial)
        return (0, utility_1.errorResponse)(res, "Material not Found");
    const material = yield (oldMaterial === null || oldMaterial === void 0 ? void 0 : oldMaterial.update({
        description: description !== null && description !== void 0 ? description : oldMaterial.description,
        price: price !== null && price !== void 0 ? price : oldMaterial.price,
        subTotal: subTotal !== null && subTotal !== void 0 ? subTotal : oldMaterial.subTotal,
        quantity: quantity !== null && quantity !== void 0 ? quantity : oldMaterial.quantity,
    }));
    return (0, utility_1.successResponse)(res, "Successful", material);
});
exports.updateMaterial = updateMaterial;
const deleteJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const job = yield Jobs_1.Jobs.findOne({
        where: {
            id,
        },
    });
    if (!job)
        return (0, utility_1.errorResponse)(res, "Failed", {
            status: false,
            message: "job not Found",
        });
    const update = yield (job === null || job === void 0 ? void 0 : job.destroy());
    return (0, utility_1.successResponse)(res, "Deleted Successfully", update);
});
exports.deleteJob = deleteJob;
const getUserJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, userId } = req.query;
    const { id } = req.user;
    let query = {};
    if (status) {
        query.status =
            status == Jobs_1.JobStatus.REJECTED
                ? [Jobs_1.JobStatus.REJECTED, Jobs_1.JobStatus.DISPUTED]
                : status;
        // JobStatus.REJECTED, JobStatus.DISPUTED
    }
    if (userId) {
        const job = yield Jobs_1.Jobs.findAll({
            order: [["id", "DESC"]],
            where: Object.assign({ userId: [id], ownerId: [id, userId] }, query),
            include: [
                {
                    model: Material_1.Material,
                },
                {
                    model: Users_1.Users,
                    as: "client",
                    attributes: ["id"],
                    include: [
                        {
                            model: Profile_1.Profile,
                            attributes: [
                                "fullName",
                                "avatar",
                                "verified",
                                "lga",
                                "state",
                                "address",
                            ],
                        },
                    ],
                },
                {
                    model: Users_1.Users,
                    as: "owner",
                    attributes: ["id"],
                    include: [
                        {
                            model: Professional_1.Professional,
                            include: [
                                {
                                    model: Profile_1.Profile,
                                    attributes: [
                                        "fullName",
                                        "avatar",
                                        "verified",
                                        "lga",
                                        "state",
                                        "address",
                                    ],
                                    include: [
                                        {
                                            model: ProffesionalSector_1.ProfessionalSector,
                                            include: [{ model: Sector_1.Sector }, { model: Profession_1.Profession }],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                { model: Dispute_1.Dispute },
            ],
        });
        return (0, utility_1.successResponse)(res, "Fetched Successfully", job);
    }
    else {
        const job = yield Jobs_1.Jobs.findAll({
            order: [["id", "DESC"]],
            where: Object.assign({ [sequelize_1.Op.or]: [{ ownerId: id }, { userId: id }] }, query),
            include: [
                {
                    model: Material_1.Material,
                },
                {
                    model: Users_1.Users,
                    as: "client",
                    attributes: ["id"],
                    include: [
                        {
                            model: Profile_1.Profile,
                            attributes: [
                                "fullName",
                                "avatar",
                                "verified",
                                "lga",
                                "state",
                                "address",
                            ],
                        },
                    ],
                },
                {
                    model: Users_1.Users,
                    as: "owner",
                    attributes: ["id"],
                    include: [
                        {
                            model: Professional_1.Professional,
                            include: [
                                {
                                    model: Profile_1.Profile,
                                    attributes: [
                                        "fullName",
                                        "avatar",
                                        "verified",
                                        "lga",
                                        "state",
                                        "address",
                                    ],
                                    include: [
                                        {
                                            model: ProffesionalSector_1.ProfessionalSector,
                                            include: [{ model: Sector_1.Sector }, { model: Profession_1.Profession }],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                { model: Dispute_1.Dispute },
            ],
        });
        return (0, utility_1.successResponse)(res, "Fetched Successfully", job);
    }
});
exports.getUserJobs = getUserJobs;
const getSingleJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobId } = req.query;
    const job = yield Jobs_1.Jobs.findOne({
        where: {
            id: jobId,
        },
        include: [
            {
                model: Material_1.Material,
            },
            {
                model: Users_1.Users,
                as: "client",
                attributes: ["id"],
                include: [
                    {
                        model: Profile_1.Profile,
                        attributes: [
                            "fullName",
                            "avatar",
                            "verified",
                            "lga",
                            "state",
                            "address",
                        ],
                    },
                ],
            },
            {
                model: Users_1.Users,
                as: "owner",
                attributes: ["id"],
                include: [
                    {
                        model: Professional_1.Professional,
                        include: [
                            {
                                model: Profile_1.Profile,
                                attributes: [
                                    "fullName",
                                    "avatar",
                                    "verified",
                                    "lga",
                                    "state",
                                    "address",
                                ],
                                include: [
                                    {
                                        model: ProffesionalSector_1.ProfessionalSector,
                                        include: [{ model: Sector_1.Sector }, { model: Profession_1.Profession }],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            { model: Dispute_1.Dispute },
        ],
    });
    return (0, utility_1.successResponse)(res, "Fetched Successfully", job);
});
exports.getSingleJob = getSingleJob;
const getProfileJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, userId } = req.query;
    const { id } = req.user;
    let query = {};
    console.log(id);
    if (status) {
        query.status = status;
    }
    if (userId) {
        const job = yield Jobs_1.Jobs.findAll({
            order: [["id", "DESC"]],
            where: {
                userId: [id],
                ownerId: [id, userId],
                status: ["PENDING", "ONGOING"],
            },
            include: [
                {
                    model: Material_1.Material,
                },
                {
                    model: Users_1.Users,
                    as: "client",
                    attributes: ["id"],
                    include: [
                        {
                            model: Profile_1.Profile,
                            attributes: [
                                "fullName",
                                "avatar",
                                "verified",
                                "lga",
                                "state",
                                "address",
                            ],
                        },
                    ],
                },
                {
                    model: Users_1.Users,
                    as: "owner",
                    attributes: ["id"],
                    include: [
                        {
                            model: Professional_1.Professional,
                            include: [
                                {
                                    model: Profile_1.Profile,
                                    attributes: [
                                        "fullName",
                                        "avatar",
                                        "verified",
                                        "lga",
                                        "state",
                                        "address",
                                    ],
                                    include: [
                                        {
                                            model: ProffesionalSector_1.ProfessionalSector,
                                            include: [{ model: Sector_1.Sector }, { model: Profession_1.Profession }],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                // {
                //   model: Users,
                //   as: "user",
                //   attributes: ["id"],
                //   include: [{model: Profile, attributes: ["fullName"]}]
                // },
                { model: Dispute_1.Dispute },
            ],
        });
        return (0, utility_1.successResponse)(res, "Fetched Successfully", job);
    }
    else {
        const job = yield Jobs_1.Jobs.findAll({
            order: [["id", "DESC"]],
            where: {
                [sequelize_1.Op.or]: [{ ownerId: id }, { userId: id }],
                status: ["PENDING", "ONGOING"],
            },
            include: [
                {
                    model: Material_1.Material,
                },
                {
                    model: Users_1.Users,
                    as: "client",
                    attributes: ["id"],
                    include: [
                        {
                            model: Profile_1.Profile,
                            attributes: [
                                "fullName",
                                "avatar",
                                "verified",
                                "lga",
                                "state",
                                "address",
                            ],
                        },
                    ],
                },
                {
                    model: Users_1.Users,
                    as: "owner",
                    attributes: ["id"],
                    include: [
                        {
                            model: Professional_1.Professional,
                            include: [
                                {
                                    model: Profile_1.Profile,
                                    attributes: [
                                        "fullName",
                                        "avatar",
                                        "verified",
                                        "lga",
                                        "state",
                                        "address",
                                    ],
                                    include: [
                                        {
                                            model: ProffesionalSector_1.ProfessionalSector,
                                            include: [{ model: Sector_1.Sector }, { model: Profession_1.Profession }],
                                        },
                                    ],
                                },
                            ],
                            //  include: [{model: Professional}]
                        },
                    ],
                },
                // {
                //   model: Users,
                //   as: "user",
                //   attributes: ["id"],
                //   include: [{model: Profile, attributes: ["fullName"]}]
                // },
                { model: Dispute_1.Dispute },
            ],
        });
        return (0, utility_1.successResponse)(res, "Fetched Successfully", job);
    }
});
exports.getProfileJobs = getProfileJobs;
const getProviderJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, userId } = req.query;
    const { id } = req.user;
    let query = {};
    if (status) {
        query.status = status;
    }
    if (status) {
        query.userId = userId;
    }
    const job = yield Jobs_1.Jobs.findAll({
        order: [["id", "DESC"]],
        where: Object.assign({ providerId: id }, query),
        include: [{ model: Material_1.Material }, { model: Dispute_1.Dispute }],
    });
    return (0, utility_1.successResponse)(res, "Fetched Successfully", job);
});
exports.getProviderJobs = getProviderJobs;
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { review, id, jobId, rate, type } = req.body;
    const job = yield Jobs_1.Jobs.findOne({ where: { id: jobId } });
    if (!job)
        return (0, utility_1.successResponse)(res, "Job not found");
    if (type == "CLIENT") {
        const professional = yield Professional_1.Professional.findOne({
            where: { userId: job.ownerId },
        });
        const reviews = yield (Review_1.Review === null || Review_1.Review === void 0 ? void 0 : Review_1.Review.create({
            review,
            rate,
            clientUserId: id,
            jobId,
            userId: req.user.id,
        }));
        const findReviews = yield (Review_1.Review === null || Review_1.Review === void 0 ? void 0 : Review_1.Review.findOne({
            where: {
                clientUserId: id,
                jobId,
                userId: req.user.id,
            },
        }));
        if (findReviews)
            return (0, utility_1.successResponseFalse)(res, "Already Reviewed Job");
        const profile = yield Profile_1.Profile.findOne({ where: { userId: job.userId } });
        if (Number(profile === null || profile === void 0 ? void 0 : profile.rate) == 0) {
            yield (profile === null || profile === void 0 ? void 0 : profile.update({ rate, count: (profile === null || profile === void 0 ? void 0 : profile.count) + 1 }));
            return (0, utility_1.successResponse)(res, "Successful", reviews);
        }
        else {
            let mean = (Number(profile === null || profile === void 0 ? void 0 : profile.rate) + Number(rate)) / 2;
            yield (profile === null || profile === void 0 ? void 0 : profile.update({ rate: mean, count: (profile === null || profile === void 0 ? void 0 : profile.count) + 1 }));
            return (0, utility_1.successResponse)(res, "Successful", reviews);
        }
    }
    else {
        const professional = yield Professional_1.Professional.findOne({ where: { userId: id } });
        if (!professional)
            return (0, utility_1.successResponse)(res, "Professional not found");
        const findReviews = yield (Review_1.Review === null || Review_1.Review === void 0 ? void 0 : Review_1.Review.findOne({
            where: {
                proffesionalId: professional === null || professional === void 0 ? void 0 : professional.id,
                jobId,
                userId: req.user.id,
            },
        }));
        if (findReviews)
            return (0, utility_1.successResponseFalse)(res, "Already Reviewed Job");
        const reviews = yield (Review_1.Review === null || Review_1.Review === void 0 ? void 0 : Review_1.Review.create({
            review,
            rate,
            proffesionalId: professional === null || professional === void 0 ? void 0 : professional.id,
            jobId,
            userId: req.user.id,
            proffesionalUserId: professional === null || professional === void 0 ? void 0 : professional.userId,
        }));
        const profile = yield Profile_1.Profile.findOne({
            where: { id: professional === null || professional === void 0 ? void 0 : professional.profileId },
        });
        if (Number(profile === null || profile === void 0 ? void 0 : profile.rate) == 0) {
            yield (profile === null || profile === void 0 ? void 0 : profile.update({ rate, count: (profile === null || profile === void 0 ? void 0 : profile.count) + 1 }));
            return (0, utility_1.successResponse)(res, "Successful", reviews);
        }
        else {
            let mean = (Number(profile === null || profile === void 0 ? void 0 : profile.rate) + Number(rate)) / 2;
            yield (profile === null || profile === void 0 ? void 0 : profile.update({ rate: mean, count: (profile === null || profile === void 0 ? void 0 : profile.count) + 1 }));
            return (0, utility_1.successResponse)(res, "Successful", reviews);
        }
    }
});
exports.createReview = createReview;
const createEducation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { school, degreeType, course, gradDate } = req.body;
    let { id } = req.user;
    const education = yield (Education_1.Education === null || Education_1.Education === void 0 ? void 0 : Education_1.Education.create({
        school,
        degreeType,
        course,
        gradDate,
        userId: id,
    }));
    return (0, utility_1.successResponse)(res, "Successful", education);
});
exports.createEducation = createEducation;
const deleteEducation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const education = yield Education_1.Education.findOne({
        where: {
            id,
        },
    });
    if (!education)
        return (0, utility_1.errorResponse)(res, "Failed", {
            status: false,
            message: "Education not Found",
        });
    const update = yield (education === null || education === void 0 ? void 0 : education.destroy());
    return (0, utility_1.successResponse)(res, "Deleted Successfully", update);
});
exports.deleteEducation = deleteEducation;
const updateEducation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { school, degreeType, course, gradDate, educationId } = req.body;
    let { id } = req.user;
    const oldEducation = yield Education_1.Education.findOne({ where: { id: educationId } });
    if (!oldEducation)
        return (0, utility_1.errorResponse)(res, "Education not Found");
    const education = yield (oldEducation === null || oldEducation === void 0 ? void 0 : oldEducation.update({
        school: school !== null && school !== void 0 ? school : oldEducation.school,
        degreeType: degreeType !== null && degreeType !== void 0 ? degreeType : oldEducation.degreeType,
        course: course !== null && course !== void 0 ? course : oldEducation.course,
        gradDate: gradDate !== null && gradDate !== void 0 ? gradDate : oldEducation.gradDate,
        // endDate: endDate ?? oldEducation.endDate
    }));
    return (0, utility_1.successResponse)(res, "Successful", education);
});
exports.updateEducation = updateEducation;
const createPorfolio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title, description, duration, date, file } = req.body;
    let { id } = req.user;
    const porfolio = yield (Porfolio_1.Porfolio === null || Porfolio_1.Porfolio === void 0 ? void 0 : Porfolio_1.Porfolio.create({
        title,
        description,
        duration,
        date,
        file: (0, utility_1.convertHttpToHttps)(file),
        userId: id,
    }));
    return (0, utility_1.successResponse)(res, "Successful", porfolio);
});
exports.createPorfolio = createPorfolio;
const deletePorfolio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const porfolio = yield Porfolio_1.Porfolio.findOne({
        where: {
            id,
        },
    });
    if (!porfolio)
        return (0, utility_1.errorResponse)(res, "Failed", {
            status: false,
            message: "Porfolio not Found",
        });
    const update = yield (porfolio === null || porfolio === void 0 ? void 0 : porfolio.destroy());
    return (0, utility_1.successResponse)(res, "Deleted Successfully", update);
});
exports.deletePorfolio = deletePorfolio;
const updatePorfolio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let { title, description, duration, date, file, porfolioId } = req.body;
    let { id } = req.user;
    const oldPorfolio = yield Porfolio_1.Porfolio.findOne({ where: { id: porfolioId } });
    if (!oldPorfolio)
        return (0, utility_1.errorResponse)(res, "Education not Found");
    const porfolio = yield (oldPorfolio === null || oldPorfolio === void 0 ? void 0 : oldPorfolio.update({
        description: description !== null && description !== void 0 ? description : oldPorfolio.description,
        title: title !== null && title !== void 0 ? title : oldPorfolio.title,
        duration: duration !== null && duration !== void 0 ? duration : oldPorfolio.duration,
        date: date !== null && date !== void 0 ? date : oldPorfolio.date,
        file: (_a = (0, utility_1.convertHttpToHttps)(file)) !== null && _a !== void 0 ? _a : oldPorfolio.file,
    }));
    return (0, utility_1.successResponse)(res, "Successful", porfolio);
});
exports.updatePorfolio = updatePorfolio;
const createCertification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title, companyIssue, date } = req.body;
    let { id } = req.user;
    const certification = yield (Certification_1.Certification === null || Certification_1.Certification === void 0 ? void 0 : Certification_1.Certification.create({
        title,
        companyIssue,
        date,
        userId: id,
    }));
    return (0, utility_1.successResponse)(res, "Successful", certification);
});
exports.createCertification = createCertification;
const deleteCertification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const certification = yield Certification_1.Certification.findOne({
        where: {
            id,
        },
    });
    if (!certification)
        return (0, utility_1.errorResponse)(res, "Failed", {
            status: false,
            message: "Certification not Found",
        });
    const update = yield (certification === null || certification === void 0 ? void 0 : certification.destroy());
    return (0, utility_1.successResponse)(res, "Deleted Successfully", update);
});
exports.deleteCertification = deleteCertification;
const updateCertification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title, companyIssue, date, certificationId } = req.body;
    let { id } = req.user;
    const oldCertification = yield Certification_1.Certification.findOne({
        where: { id: certificationId },
    });
    if (!oldCertification)
        return (0, utility_1.errorResponse)(res, "Certification not Found");
    const education = yield (oldCertification === null || oldCertification === void 0 ? void 0 : oldCertification.update({
        companyIssue: companyIssue !== null && companyIssue !== void 0 ? companyIssue : oldCertification.companyIssue,
        title: title !== null && title !== void 0 ? title : oldCertification.title,
        date: date !== null && date !== void 0 ? date : oldCertification.date,
    }));
    return (0, utility_1.successResponse)(res, "Successful", education);
});
exports.updateCertification = updateCertification;
const createExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { postHeld, workPlace, startDate, endDate } = req.body;
    let { id } = req.user;
    const experience = yield (Experience_1.Experience === null || Experience_1.Experience === void 0 ? void 0 : Experience_1.Experience.create({
        postHeld,
        workPlace,
        startDate,
        endDate,
        userId: id,
    }));
    return (0, utility_1.successResponse)(res, "Successful", experience);
});
exports.createExperience = createExperience;
const deleteExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const experience = yield Experience_1.Experience.findOne({
        where: {
            id,
        },
    });
    if (!experience)
        return (0, utility_1.errorResponse)(res, "Failed", {
            status: false,
            message: "Experience not Found",
        });
    const update = yield (experience === null || experience === void 0 ? void 0 : experience.destroy());
    return (0, utility_1.successResponse)(res, "Deleted Successfully", update);
});
exports.deleteExperience = deleteExperience;
const updateExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { postHeld, workPlace, startDate, endDate, experienceId } = req.body;
    let { id } = req.user;
    const oldExperience = yield Experience_1.Experience.findOne({
        where: { id: experienceId },
    });
    if (!oldExperience)
        return (0, utility_1.errorResponse)(res, "Certification not Found");
    const education = yield (oldExperience === null || oldExperience === void 0 ? void 0 : oldExperience.update({
        workPlace: workPlace !== null && workPlace !== void 0 ? workPlace : oldExperience.workPlace,
        postHeld: postHeld !== null && postHeld !== void 0 ? postHeld : oldExperience.postHeld,
        startDate: startDate !== null && startDate !== void 0 ? startDate : oldExperience.startDate,
        endDate: endDate !== null && endDate !== void 0 ? endDate : oldExperience.endDate,
    }));
    return (0, utility_1.successResponse)(res, "Successful", education);
});
exports.updateExperience = updateExperience;
const postTicketMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { ticketId, message, image } = req.body;
    const { id } = req.user;
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
                message,
                admin: false,
                ticketId: Number(ticketId),
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
                message,
                admin: false,
                ticketId: Number(ticketId),
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
const createProfSector = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { sectorId, professionId, yearsOfExp, chargeFrom } = req.body;
    let { id } = req.user;
    const proffesional = yield Professional_1.Professional.findOne({ where: { userId: id } });
    const prof_sec = yield (ProffesionalSector_1.ProfessionalSector === null || ProffesionalSector_1.ProfessionalSector === void 0 ? void 0 : ProffesionalSector_1.ProfessionalSector.create({
        userId: id,
        sectorId,
        professionId,
        profileId: proffesional === null || proffesional === void 0 ? void 0 : proffesional.profileId,
        chargeFrom,
        yearsOfExp,
        default: false,
    }));
    return (0, utility_1.successResponse)(res, "Successful", prof_sec);
});
exports.createProfSector = createProfSector;
const createBlock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { blockedUserid } = req.body;
    let { id } = req.user;
    const blocks = yield (Block_1.Blocked === null || Block_1.Blocked === void 0 ? void 0 : Block_1.Blocked.findOne({ where: { blockedUserid } }));
    if (blocks)
        return (0, utility_1.successResponse)(res, "Successful");
    const profile = yield Profile_1.Profile.findOne({ where: { userId: blockedUserid } });
    const prof_sec = yield (Block_1.Blocked === null || Block_1.Blocked === void 0 ? void 0 : Block_1.Blocked.create({
        blockedUserid,
        userId: id,
        avatar: profile === null || profile === void 0 ? void 0 : profile.avatar,
        fullName: profile === null || profile === void 0 ? void 0 : profile.fullName,
        // type: profile?.corperate ? ProfileType?.CORPERATE : ProfileType?.PROFESSIONAL
    }));
    return (0, utility_1.successResponse)(res, "Successful", prof_sec);
});
exports.createBlock = createBlock;
const createReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { cause, userId } = req.body;
    let { id } = req.user;
    const profile = yield Profile_1.Profile.findOne({ where: { userId } });
    const report = yield (Report_1.Report === null || Report_1.Report === void 0 ? void 0 : Report_1.Report.create({
        cause,
        userId,
        reporterId: id,
        avatar: profile === null || profile === void 0 ? void 0 : profile.avatar,
        fullName: profile === null || profile === void 0 ? void 0 : profile.fullName,
    }));
    return (0, utility_1.successResponse)(res, "Successful", report);
});
exports.createReport = createReport;
const fetchAllReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.user;
    const report = yield (Report_1.Report === null || Report_1.Report === void 0 ? void 0 : Report_1.Report.findAll({
        where: { reporterId: id },
    }));
    return (0, utility_1.successResponse)(res, "Successful", report);
});
exports.fetchAllReport = fetchAllReport;
const fetchAllBlock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.user;
    const blocked = yield Block_1.Blocked.findAll({
        where: { userId: id },
        order: [["id", "DESC"]],
    });
    return (0, utility_1.successResponse)(res, "Successful", blocked);
});
exports.fetchAllBlock = fetchAllBlock;
const unBlock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blockedUserid } = req.body;
    const blocked = yield Block_1.Blocked.findOne({
        where: {
            blockedUserid,
        },
    });
    const update = yield (blocked === null || blocked === void 0 ? void 0 : blocked.destroy());
    return (0, utility_1.successResponse)(res, "Deleted Successfully", update);
});
exports.unBlock = unBlock;
const deleteProfSector = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const prof_sec = yield ProffesionalSector_1.ProfessionalSector.findOne({
        where: {
            id,
        },
    });
    if (!prof_sec)
        return (0, utility_1.errorResponse)(res, "Failed", {
            status: false,
            message: "Professional Sector not Found",
        });
    const update = yield (prof_sec === null || prof_sec === void 0 ? void 0 : prof_sec.destroy());
    return (0, utility_1.successResponse)(res, "Deleted Successfully", update);
});
exports.deleteProfSector = deleteProfSector;
const updateProfSector = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { sectorId, professionId, yearsOfExp, id } = req.body;
    const oldProSec = yield ProffesionalSector_1.ProfessionalSector.findOne({ where: { id } });
    if (!oldProSec)
        return (0, utility_1.errorResponse)(res, "Education not Found");
    const pro_sec = yield (oldProSec === null || oldProSec === void 0 ? void 0 : oldProSec.update({
        sectorId: sectorId !== null && sectorId !== void 0 ? sectorId : oldProSec.sectorId,
        yearsOfExp: yearsOfExp !== null && yearsOfExp !== void 0 ? yearsOfExp : oldProSec.yearsOfExp,
        professionId: professionId !== null && professionId !== void 0 ? professionId : oldProSec.professionId,
    }));
    return (0, utility_1.successResponse)(res, "Successful", pro_sec);
});
exports.updateProfSector = updateProfSector;
const getProfSector = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const professionalSector = yield ProffesionalSector_1.ProfessionalSector.findAll({
        order: [["id", "DESC"]],
        where: { userId: id },
        include: [{ model: Sector_1.Sector }, { model: Profession_1.Profession }],
    });
    return (0, utility_1.successResponse)(res, "Successful", professionalSector);
});
exports.getProfSector = getProfSector;
const matchLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientLantitude, clientLongitude, ownerLongitude, type, ownerLantitude, jobId, } = req.body;
    const getJob = yield Jobs_1.Jobs.findOne({
        where: {
            id: jobId,
        },
        include: [
            {
                model: Material_1.Material,
            },
            {
                model: Users_1.Users,
                as: "client",
                attributes: ["id"],
                include: [
                    {
                        model: Profile_1.Profile,
                        attributes: [
                            "fullName",
                            "avatar",
                            "verified",
                            "lga",
                            "state",
                            "address",
                        ],
                    },
                ],
            },
            {
                model: Users_1.Users,
                as: "owner",
                attributes: ["id"],
                include: [
                    {
                        model: Professional_1.Professional,
                        include: [
                            {
                                model: Profile_1.Profile,
                                attributes: [
                                    "fullName",
                                    "avatar",
                                    "verified",
                                    "lga",
                                    "state",
                                    "address",
                                ],
                                include: [
                                    {
                                        model: ProffesionalSector_1.ProfessionalSector,
                                        include: [{ model: Sector_1.Sector }, { model: Profession_1.Profession }],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            { model: Dispute_1.Dispute },
        ],
    });
    if (type == "DEPARTURE") {
        if (!(getJob === null || getJob === void 0 ? void 0 : getJob.currentOwnerLocationDeparture) ||
            !(getJob === null || getJob === void 0 ? void 0 : getJob.currentClientLocationDeparture)) {
            yield (getJob === null || getJob === void 0 ? void 0 : getJob.update({
                ownerLocationDeparture: !ownerLantitude && !ownerLongitude
                    ? getJob.ownerLocationDeparture
                    : {
                        ownerLocationDeparture: [
                            {
                                ownerLongitude,
                                ownerLantitude,
                                time: new Date(),
                            },
                        ].concat(getJob.ownerLocationDeparture == null
                            ? []
                            : getJob.ownerLocationDeparture),
                    },
                clientLocationDeparture: !clientLantitude && !clientLongitude
                    ? getJob.clientLocationDeparture
                    : {
                        clientLocationDeparture: [
                            {
                                clientLantitude,
                                clientLongitude,
                                time: new Date(),
                            },
                        ].concat(getJob.clientLocationDeparture == null
                            ? []
                            : getJob.clientLocationDeparture.clientLocationDeparture),
                    },
                currentOwnerLocationDeparture: !ownerLantitude && !ownerLongitude
                    ? getJob.currentOwnerLocationDeparture
                    : {
                        currentOwnerLocationDeparture: [
                            {
                                ownerLongitude,
                                ownerLantitude,
                                time: new Date(),
                            },
                        ],
                    },
                currentClientLocationDeparture: !clientLantitude && !clientLongitude
                    ? getJob.currentClientLocationDeparture
                    : {
                        currentClientLocationDeparture: [
                            {
                                clientLantitude,
                                clientLongitude,
                                time: new Date(),
                            },
                        ],
                    },
                ownerMatchDeparture: !ownerLantitude && !ownerLongitude
                    ? getJob.ownerMatchDeparture
                    : true,
                clientMatchDeparture: !clientLantitude && !clientLongitude
                    ? getJob.clientMatchDeparture
                    : true,
            }));
            const newGetJob = yield Jobs_1.Jobs.findOne({
                where: {
                    id: jobId,
                },
                include: [
                    {
                        model: Material_1.Material,
                    },
                    {
                        model: Users_1.Users,
                        as: "client",
                        attributes: ["id"],
                        include: [
                            {
                                model: Profile_1.Profile,
                                attributes: [
                                    "fullName",
                                    "avatar",
                                    "verified",
                                    "lga",
                                    "state",
                                    "address",
                                ],
                            },
                        ],
                    },
                    {
                        model: Users_1.Users,
                        as: "owner",
                        attributes: ["id"],
                        include: [
                            {
                                model: Professional_1.Professional,
                                include: [
                                    {
                                        model: Profile_1.Profile,
                                        attributes: [
                                            "fullName",
                                            "avatar",
                                            "verified",
                                            "lga",
                                            "state",
                                            "address",
                                        ],
                                        include: [
                                            {
                                                model: ProffesionalSector_1.ProfessionalSector,
                                                include: [{ model: Sector_1.Sector }, { model: Profession_1.Profession }],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    { model: Dispute_1.Dispute },
                ],
            });
            if ((newGetJob === null || newGetJob === void 0 ? void 0 : newGetJob.currentOwnerLocationDeparture) &&
                (newGetJob === null || newGetJob === void 0 ? void 0 : newGetJob.currentClientLocationDeparture)) {
                let value = (0, utility_1.getDistanceFromLatLonInKm)(newGetJob === null || newGetJob === void 0 ? void 0 : newGetJob.currentClientLocationDeparture.currentClientLocationDeparture[0].clientLantitude, newGetJob === null || newGetJob === void 0 ? void 0 : newGetJob.currentClientLocationDeparture.currentClientLocationDeparture[0].clientLongitude, newGetJob === null || newGetJob === void 0 ? void 0 : newGetJob.currentOwnerLocationDeparture.currentOwnerLocationDeparture[0].ownerLongitude, newGetJob === null || newGetJob === void 0 ? void 0 : newGetJob.currentOwnerLocationDeparture.currentOwnerLocationDeparture[0].ownerLantitude);
                if (value <= 200) {
                    yield newGetJob.update({
                        departureDaysCount: Number(newGetJob.departureDaysCount) + 1,
                    });
                    const owner = yield Professional_1.Professional.findOne({
                        where: { userId: newGetJob === null || newGetJob === void 0 ? void 0 : newGetJob.ownerId },
                    });
                    const profile = yield Profile_1.Profile.findOne({
                        where: { userId: newGetJob === null || newGetJob === void 0 ? void 0 : newGetJob.userId },
                    });
                    const ongoingJobUser = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.ONGOING,
                            userId: [newGetJob.userId],
                        },
                    });
                    const pendingJobUser = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.PENDING,
                            userId: [newGetJob.userId],
                        },
                    });
                    const ongoingJobOwner = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.ONGOING,
                            ownerId: [newGetJob.ownerId],
                        },
                    });
                    const pendingJobOwner = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.PENDING,
                            ownerId: [newGetJob.ownerId],
                        },
                    });
                    yield (owner === null || owner === void 0 ? void 0 : owner.update({
                        workType: Professional_1.WorkType.BUSY,
                        totalJobOngoing: ongoingJobOwner.length,
                        totalJobPending: pendingJobOwner.length,
                    }));
                    yield (profile === null || profile === void 0 ? void 0 : profile.update({
                        totalOngoingHire: ongoingJobUser.length,
                        totalPendingHire: pendingJobUser.length,
                    }));
                    yield newGetJob.update({
                        isLocationMatch: true,
                    });
                    return (0, utility_1.successResponse)(res, "Departure Matched Successful", newGetJob);
                }
                else {
                    return (0, utility_1.successResponseFalse)(res, "Departure not in close range with client");
                }
            }
            else {
                const newGetJob = yield Jobs_1.Jobs.findOne({
                    where: {
                        id: jobId,
                    },
                    include: [
                        {
                            model: Material_1.Material,
                        },
                        {
                            model: Users_1.Users,
                            as: "client",
                            attributes: ["id"],
                            include: [
                                {
                                    model: Profile_1.Profile,
                                    attributes: [
                                        "fullName",
                                        "avatar",
                                        "verified",
                                        "lga",
                                        "state",
                                        "address",
                                    ],
                                },
                            ],
                        },
                        {
                            model: Users_1.Users,
                            as: "owner",
                            attributes: ["id"],
                            include: [
                                {
                                    model: Professional_1.Professional,
                                    include: [
                                        {
                                            model: Profile_1.Profile,
                                            attributes: [
                                                "fullName",
                                                "avatar",
                                                "verified",
                                                "lga",
                                                "state",
                                                "address",
                                            ],
                                            include: [
                                                {
                                                    model: ProffesionalSector_1.ProfessionalSector,
                                                    include: [{ model: Sector_1.Sector }, { model: Profession_1.Profession }],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        { model: Dispute_1.Dispute },
                    ],
                });
                return (0, utility_1.successResponse)(res, "Departure  location updated", newGetJob);
            }
        }
        else {
            const newGetJob = yield Jobs_1.Jobs.findOne({
                where: {
                    id: jobId,
                },
                include: [
                    {
                        model: Material_1.Material,
                    },
                    {
                        model: Users_1.Users,
                        as: "client",
                        attributes: ["id"],
                        include: [
                            {
                                model: Profile_1.Profile,
                                attributes: [
                                    "fullName",
                                    "avatar",
                                    "verified",
                                    "lga",
                                    "state",
                                    "address",
                                ],
                            },
                        ],
                    },
                    {
                        model: Users_1.Users,
                        as: "owner",
                        attributes: ["id"],
                        include: [
                            {
                                model: Professional_1.Professional,
                                include: [
                                    {
                                        model: Profile_1.Profile,
                                        attributes: [
                                            "fullName",
                                            "avatar",
                                            "verified",
                                            "lga",
                                            "state",
                                            "address",
                                        ],
                                        include: [
                                            {
                                                model: ProffesionalSector_1.ProfessionalSector,
                                                include: [{ model: Sector_1.Sector }, { model: Profession_1.Profession }],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    { model: Dispute_1.Dispute },
                ],
            });
            return (0, utility_1.successResponse)(res, "Departure location updated");
        }
    }
    else {
        if (!(getJob === null || getJob === void 0 ? void 0 : getJob.currentClientLocationArrival) ||
            !(getJob === null || getJob === void 0 ? void 0 : getJob.currentOwnerLocationArrival)) {
            yield (getJob === null || getJob === void 0 ? void 0 : getJob.update({
                ownerLocationArrival: !ownerLantitude || !ownerLongitude
                    ? getJob.ownerLocationArrival
                    : {
                        ownerLocationArrival: [
                            {
                                ownerLongitude,
                                ownerLantitude,
                                time: new Date(),
                            },
                        ].concat(getJob.ownerLocationArrival == null
                            ? []
                            : getJob.ownerLocationArrival.ownerLocationArrival),
                    },
                clientLocationArrival: !clientLantitude || !clientLongitude
                    ? getJob.clientLocationArrival
                    : {
                        clientLocationArrival: [
                            {
                                clientLantitude,
                                clientLongitude,
                                time: new Date(),
                            },
                        ].concat(getJob.clientLocationArrival == null
                            ? []
                            : getJob.clientLocationArrival.clientLocationArrival),
                    },
                currentOwnerLocationArrival: !ownerLantitude || !ownerLongitude
                    ? getJob.currentOwnerLocationArrival
                    : {
                        currentOwnerLocationArrival: [
                            {
                                ownerLongitude,
                                ownerLantitude,
                                time: new Date(),
                            },
                        ],
                    },
                currentClientLocationArrival: !clientLantitude || !clientLongitude
                    ? getJob.currentClientLocationArrival
                    : {
                        currentClientLocationArrival: [
                            {
                                clientLantitude,
                                clientLongitude,
                                time: new Date(),
                            },
                        ],
                    },
                ownerMatchArrival: !ownerLantitude && !ownerLongitude ? getJob.ownerMatchArrival : true,
                clientMatchArrival: !clientLantitude && !clientLongitude
                    ? getJob.clientMatchArrival
                    : true,
            }));
            const newGetJob = yield Jobs_1.Jobs.findOne({
                where: {
                    id: jobId,
                },
                include: [
                    {
                        model: Material_1.Material,
                    },
                    {
                        model: Users_1.Users,
                        as: "client",
                        attributes: ["id"],
                        include: [
                            {
                                model: Profile_1.Profile,
                                attributes: [
                                    "fullName",
                                    "avatar",
                                    "verified",
                                    "lga",
                                    "state",
                                    "address",
                                ],
                            },
                        ],
                    },
                    {
                        model: Users_1.Users,
                        as: "owner",
                        attributes: ["id"],
                        include: [
                            {
                                model: Professional_1.Professional,
                                include: [
                                    {
                                        model: Profile_1.Profile,
                                        attributes: [
                                            "fullName",
                                            "avatar",
                                            "verified",
                                            "lga",
                                            "state",
                                            "address",
                                        ],
                                        include: [
                                            {
                                                model: ProffesionalSector_1.ProfessionalSector,
                                                include: [{ model: Sector_1.Sector }, { model: Profession_1.Profession }],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    { model: Dispute_1.Dispute },
                ],
            });
            if ((newGetJob === null || newGetJob === void 0 ? void 0 : newGetJob.currentClientLocationArrival) &&
                (newGetJob === null || newGetJob === void 0 ? void 0 : newGetJob.currentOwnerLocationArrival)) {
                let value = (0, utility_1.getDistanceFromLatLonInKm)(newGetJob === null || newGetJob === void 0 ? void 0 : newGetJob.currentClientLocationArrival.currentClientLocationArrival[0].clientLantitude, newGetJob === null || newGetJob === void 0 ? void 0 : newGetJob.currentClientLocationArrival.currentClientLocationArrival[0].clientLongitude, newGetJob === null || newGetJob === void 0 ? void 0 : newGetJob.currentOwnerLocationArrival.currentOwnerLocationArrival[0].ownerLongitude, newGetJob === null || newGetJob === void 0 ? void 0 : newGetJob.currentOwnerLocationArrival.currentOwnerLocationArrival[0].ownerLantitude);
                if (value <= 200) {
                    yield newGetJob.update({
                        departureDaysCount: Number(newGetJob.departureDaysCount) + 1,
                    });
                    const owner = yield Professional_1.Professional.findOne({
                        where: { userId: newGetJob === null || newGetJob === void 0 ? void 0 : newGetJob.ownerId },
                    });
                    yield newGetJob.update({
                        status: Jobs_1.JobStatus.ONGOING,
                    });
                    const profile = yield Profile_1.Profile.findOne({
                        where: { userId: newGetJob === null || newGetJob === void 0 ? void 0 : newGetJob.userId },
                    });
                    const ongoingJobUser = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.ONGOING,
                            userId: [newGetJob.userId],
                        },
                    });
                    const pendingJobUser = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.PENDING,
                            userId: [newGetJob.userId],
                        },
                    });
                    const ongoingJobOwner = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.ONGOING,
                            ownerId: [newGetJob.ownerId],
                        },
                    });
                    const pendingJobOwner = yield Jobs_1.Jobs.findAll({
                        where: {
                            status: Jobs_1.JobStatus.PENDING,
                            ownerId: [newGetJob.ownerId],
                        },
                    });
                    yield (owner === null || owner === void 0 ? void 0 : owner.update({
                        workType: Professional_1.WorkType.BUSY,
                        totalJobOngoing: ongoingJobOwner.length,
                        totalJobPending: pendingJobOwner.length,
                    }));
                    yield (profile === null || profile === void 0 ? void 0 : profile.update({
                        totalOngoingHire: ongoingJobUser.length,
                        totalPendingHire: pendingJobUser.length,
                    }));
                    console.log("aaaaaaaaa");
                    return (0, utility_1.successResponse)(res, "Arrival Matched Successful", newGetJob);
                }
                else {
                    console.log("bbbbbbbbb");
                    return (0, utility_1.successResponseFalse)(res, "Arrival not in close range with client");
                }
            }
            else {
                const newGetJob = yield Jobs_1.Jobs.findOne({
                    where: {
                        id: jobId,
                    },
                    include: [
                        {
                            model: Material_1.Material,
                        },
                        {
                            model: Users_1.Users,
                            as: "client",
                            attributes: ["id"],
                            include: [
                                {
                                    model: Profile_1.Profile,
                                    attributes: [
                                        "fullName",
                                        "avatar",
                                        "verified",
                                        "lga",
                                        "state",
                                        "address",
                                    ],
                                },
                            ],
                        },
                        {
                            model: Users_1.Users,
                            as: "owner",
                            attributes: ["id"],
                            include: [
                                {
                                    model: Professional_1.Professional,
                                    include: [
                                        {
                                            model: Profile_1.Profile,
                                            attributes: [
                                                "fullName",
                                                "avatar",
                                                "verified",
                                                "lga",
                                                "state",
                                                "address",
                                            ],
                                            include: [
                                                {
                                                    model: ProffesionalSector_1.ProfessionalSector,
                                                    include: [{ model: Sector_1.Sector }, { model: Profession_1.Profession }],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        { model: Dispute_1.Dispute },
                    ],
                });
                console.log("cccccccccccc");
                return (0, utility_1.successResponse)(res, "Arrival  location updated", newGetJob);
            }
        }
        else {
            const newGetJob = yield Jobs_1.Jobs.findOne({
                where: {
                    id: jobId,
                },
                include: [
                    {
                        model: Material_1.Material,
                    },
                    {
                        model: Users_1.Users,
                        as: "client",
                        attributes: ["id"],
                        include: [
                            {
                                model: Profile_1.Profile,
                                attributes: [
                                    "fullName",
                                    "avatar",
                                    "verified",
                                    "lga",
                                    "state",
                                    "address",
                                ],
                            },
                        ],
                    },
                    {
                        model: Users_1.Users,
                        as: "owner",
                        attributes: ["id"],
                        include: [
                            {
                                model: Professional_1.Professional,
                                include: [
                                    {
                                        model: Profile_1.Profile,
                                        attributes: [
                                            "fullName",
                                            "avatar",
                                            "verified",
                                            "lga",
                                            "state",
                                            "address",
                                        ],
                                        include: [
                                            {
                                                model: ProffesionalSector_1.ProfessionalSector,
                                                include: [{ model: Sector_1.Sector }, { model: Profession_1.Profession }],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    { model: Dispute_1.Dispute },
                ],
            });
            return (0, utility_1.successResponse)(res, "Arrival location updated", newGetJob);
        }
    }
});
exports.matchLocation = matchLocation;
const getReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const profile = yield Profile_1.Profile.findOne({ where: { userId: id } });
    if ((profile === null || profile === void 0 ? void 0 : profile.type) == Profile_1.ProfileType.CLIENT) {
        const review = yield Review_1.Review.findAll({
            where: {
                clientUserId: id,
            },
            include: [
                {
                    model: Users_1.Users,
                    as: "user",
                    attributes: ["id"],
                    include: [{ model: Profile_1.Profile, attributes: ["fullName", "avatar"] }],
                },
            ],
        });
        return (0, utility_1.successResponse)(res, "Successful", review);
    }
    else {
        const review = yield Review_1.Review.findAll({
            where: {
                proffesionalUserId: id,
            },
            include: [
                {
                    model: Users_1.Users,
                    as: "user",
                    attributes: ["id"],
                    include: [{ model: Profile_1.Profile, attributes: ["fullName", "avatar"] }],
                },
            ],
        });
        return (0, utility_1.successResponse)(res, "Successful", review);
    }
});
exports.getReview = getReview;
//# sourceMappingURL=client.js.map