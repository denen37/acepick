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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTopic = exports.deleteTopic = exports.getTopic = exports.postTopic = exports.getWalletTransaction = exports.dashboardUserSummary = exports.sendVerification = exports.sortVerificationUsers = exports.sendAnnoncement = exports.deleteAnnoncement = exports.getAnnoncement = exports.updateTos = exports.createTos = exports.createFaq = exports.updateFaq = exports.deleteTos = exports.deleteFaq = exports.postTos = exports.getTos = exports.getFaq = exports.postFaq = exports.updateSector = exports.updateProfession = exports.deleteProfession = exports.deleteSector = exports.postProfession = exports.postSector = void 0;
const upload_1 = require("../../helpers/upload");
const Sector_1 = require("../../models/Sector");
const utility_1 = require("../../helpers/utility");
const Profession_1 = require("../../models/Profession");
const Faq_1 = require("../../models/Faq");
const Tos_1 = require("../../models/Tos");
const Profile_1 = require("../../models/Profile");
const sequelize_1 = require("sequelize");
const Users_1 = require("../../models/Users");
const sms_1 = require("../../services/sms");
const Market_1 = require("../../models/Market");
const Transaction_1 = require("../../models/Transaction");
const Announcement_1 = require("../../models/Announcement");
const Jobs_1 = require("../../models/Jobs");
const Topic_1 = require("../../models/Topic");
const moment_1 = __importDefault(require("moment"));
const Professional_1 = require("../../models/Professional");
// import { Job } from '../../models/VoiceRecording';
const postSector = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title } = req.body;
    // let {id} =  req.a;
    if (req.file) {
        const result = yield (0, upload_1.upload_cloud)(req.file.path.replace(/ /g, "_"));
        const sector = yield Sector_1.Sector.create({
            title,
            image: result.secure_url,
        });
        return (0, utility_1.successResponse)(res, "Successful", { status: true, message: sector });
    }
    else {
        const sector = yield Sector_1.Sector.create({
            title: title,
            image: "",
        });
        return (0, utility_1.successResponse)(res, "Successful", sector);
    }
});
exports.postSector = postSector;
const postProfession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title, sectorId } = req.body;
    // let {id} =  req.admin;
    if (req.file) {
        const result = yield (0, upload_1.upload_cloud)(req.file.path.replace(/ /g, "_"));
        const profession = yield Profession_1.Profession.create({
            title,
            image: result.secure_url,
            sectorId
        });
        return (0, utility_1.successResponse)(res, "Successful", { status: true, message: profession });
    }
    else {
        const profession = yield Profession_1.Profession.create({
            title,
            image: "",
            sectorId
        });
        return (0, utility_1.successResponse)(res, "Successful", profession);
    }
});
exports.postProfession = postProfession;
const deleteSector = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const sector = yield Sector_1.Sector.findOne({
        where: {
            id
        }
    });
    if (!sector)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "sector not Found" });
    const update = yield (sector === null || sector === void 0 ? void 0 : sector.destroy());
    return (0, utility_1.successResponse)(res, "Deleted Successfully", update);
});
exports.deleteSector = deleteSector;
const deleteProfession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const profession = yield Profession_1.Profession.findOne({
        where: {
            id
        }
    });
    if (!profession)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "profession not Found" });
    const update = yield (profession === null || profession === void 0 ? void 0 : profession.destroy());
    return (0, utility_1.successResponse)(res, "Deleted Successfully", update);
});
exports.deleteProfession = deleteProfession;
const updateProfession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title, sectorId, id } = req.body;
    // let {id} =  req.admin;
    const professionOld = yield Profession_1.Profession.findOne({ where: { id } });
    if (req.file) {
        const result = yield (0, upload_1.upload_cloud)(req.file.path.replace(/ /g, "_"));
        const profession = yield (professionOld === null || professionOld === void 0 ? void 0 : professionOld.update({
            title: title !== null && title !== void 0 ? title : professionOld.title,
            image: result.secure_url,
            sectorId: sectorId !== null && sectorId !== void 0 ? sectorId : professionOld.sectorId,
        }));
        return (0, utility_1.successResponse)(res, "Successful", { status: true, message: profession });
    }
    else {
        const profession = yield (professionOld === null || professionOld === void 0 ? void 0 : professionOld.update({
            title: title !== null && title !== void 0 ? title : professionOld.title,
            image: professionOld.image,
            sectorId: sectorId !== null && sectorId !== void 0 ? sectorId : professionOld.sectorId,
        }));
        return (0, utility_1.successResponse)(res, "Successful", profession);
    }
});
exports.updateProfession = updateProfession;
const updateSector = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title, id } = req.body;
    const sectorOld = yield Sector_1.Sector.findOne({ where: { id } });
    if (req.file) {
        const result = yield (0, upload_1.upload_cloud)(req.file.path.replace(/ /g, "_"));
        const sector = yield (sectorOld === null || sectorOld === void 0 ? void 0 : sectorOld.update({
            title: title !== null && title !== void 0 ? title : sectorOld.title,
            image: result.secure_url,
        }));
        return (0, utility_1.successResponse)(res, "Successful", { status: true, message: sector });
    }
    else {
        const sector = yield (sectorOld === null || sectorOld === void 0 ? void 0 : sectorOld.update({
            title: title !== null && title !== void 0 ? title : sectorOld.title,
            image: sectorOld.image,
        }));
        return (0, utility_1.successResponse)(res, "Successful", sector);
    }
});
exports.updateSector = updateSector;
const postFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title, body } = req.body;
    const faq = yield Faq_1.Faq.create({
        title,
        body,
    });
    return (0, utility_1.successResponse)(res, "Successful", faq);
});
exports.postFaq = postFaq;
const getFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const faq = yield Faq_1.Faq.findAll({});
    return (0, utility_1.successResponse)(res, "Successful", faq);
});
exports.getFaq = getFaq;
const getTos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tos = yield Tos_1.Tos.findAll({});
    return (0, utility_1.successResponse)(res, "Successful", tos);
});
exports.getTos = getTos;
const postTos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title, body } = req.body;
    const tos = yield Tos_1.Tos.create({
        title,
        body,
    });
    return (0, utility_1.successResponse)(res, "Successful", tos);
});
exports.postTos = postTos;
const deleteFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const faq = yield Faq_1.Faq.findOne({
        where: {
            id
        }
    });
    if (!faq)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "faq not Found" });
    const update = yield (faq === null || faq === void 0 ? void 0 : faq.destroy());
    return (0, utility_1.successResponse)(res, "Deleted Successfully", update);
});
exports.deleteFaq = deleteFaq;
const deleteTos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const tos = yield Tos_1.Tos.findOne({
        where: {
            id
        }
    });
    if (!tos)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "ter of service not Found" });
    const update = yield (tos === null || tos === void 0 ? void 0 : tos.destroy());
    return (0, utility_1.successResponse)(res, "Deleted Successfully", update);
});
exports.deleteTos = deleteTos;
const updateFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title, body, id } = req.body;
    const faqOld = yield Faq_1.Faq.findOne({ where: { id } });
    if (!faqOld)
        return (0, utility_1.successResponse)(res, "Faq Not Found");
    const faq = yield (faqOld === null || faqOld === void 0 ? void 0 : faqOld.update({
        title: title !== null && title !== void 0 ? title : faqOld.title,
        body: body !== null && body !== void 0 ? body : faqOld.body
    }));
    return (0, utility_1.successResponse)(res, "Successful", faq);
});
exports.updateFaq = updateFaq;
const createFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title, body } = req.body;
    const faq = yield Faq_1.Faq.create({ title, body });
    return (0, utility_1.successResponse)(res, "Successful", faq);
});
exports.createFaq = createFaq;
const createTos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title, body } = req.body;
    const tos = yield Tos_1.Tos.create({ title, body });
    return (0, utility_1.successResponse)(res, "Successful", tos);
});
exports.createTos = createTos;
const updateTos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title, body, id } = req.body;
    const tosOld = yield Tos_1.Tos.findOne({ where: { id } });
    if (!tosOld)
        return (0, utility_1.successResponse)(res, "Tos Not Found");
    const tos = yield (tosOld === null || tosOld === void 0 ? void 0 : tosOld.update({
        title: title !== null && title !== void 0 ? title : tosOld.title,
        body: body !== null && body !== void 0 ? body : tosOld.body
    }));
    return (0, utility_1.successResponse)(res, "Successful", tos);
});
exports.updateTos = updateTos;
const getAnnoncement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const announcement = yield Announcement_1.Announcement.findAll({});
    return (0, utility_1.successResponse)(res, "Successful", announcement);
});
exports.getAnnoncement = getAnnoncement;
const deleteAnnoncement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const announcement = yield Announcement_1.Announcement.findOne({
        where: {
            id
        }
    });
    if (!announcement)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Announcement not Found" });
    const update = yield (announcement === null || announcement === void 0 ? void 0 : announcement.destroy());
    return (0, utility_1.successResponse)(res, "Deleted Successfully", update);
});
exports.deleteAnnoncement = deleteAnnoncement;
const sendAnnoncement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { subject, body, type, status, verified, userId } = req.body;
    let query = {};
    let queryProfile = {};
    if (status && status != "") {
        query.status = status;
    }
    if (verified && verified != "") {
        queryProfile.verified = verified == "VERIFIED" ? true : false;
    }
    yield Announcement_1.Announcement.create({ subject, body, title: subject });
    if (type == Profile_1.ProfileType.CLIENT) {
        const profile = yield Profile_1.Profile.findAll({
            where: Object.assign({ type: Profile_1.ProfileType.CLIENT }, queryProfile),
            include: [{
                    model: Users_1.Users,
                    where: Object.assign({}, query),
                    attributes: ["email"]
                }]
        });
        let index = 0;
        for (let value of profile) {
            yield (0, sms_1.sendEmailResend)(value.dataValues.user.dataValues.email, subject, `${body}`);
            index++;
        }
        if (index == profile.length) {
            return (0, utility_1.successResponse)(res, "Successful");
        }
    }
    else if (type == Profile_1.ProfileType.PROFESSIONAL) {
        const profile = yield Profile_1.Profile.findAll({
            where: Object.assign({ type: Profile_1.ProfileType.PROFESSIONAL, corperate: false }, queryProfile),
            include: [{ model: Users_1.Users, where: Object.assign({}, query), attributes: ["email"] }]
        });
        let index = 0;
        for (let value of profile) {
            yield (0, sms_1.sendEmailResend)(value.dataValues.user.dataValues.email, subject, `${body}`);
            index++;
        }
        if (index == profile.length) {
            return (0, utility_1.successResponse)(res, "Successful");
        }
    }
    else if (type == Profile_1.ProfileType.PROFESSIONAL) {
        const profile = yield Profile_1.Profile.findAll({
            where: Object.assign({ type: Profile_1.ProfileType.PROFESSIONAL, corperate: true }, queryProfile),
            include: [{ model: Users_1.Users, where: Object.assign({}, query), attributes: ["email"] }]
        });
        let index = 0;
        for (let value of profile) {
            yield (0, sms_1.sendEmailResend)(value.dataValues.user.dataValues.email, subject, `${body}`);
            index++;
        }
        if (index == profile.length) {
            return (0, utility_1.successResponse)(res, "Successful");
        }
    }
    else if (type == "MARKETPLACE") {
        const market = yield Market_1.MarketPlace.findAll({
            where: { type, },
            include: [
                { model: Profile_1.Profile, where: Object.assign({}, queryProfile) },
                {
                    model: Users_1.Users,
                    where: Object.assign({}, query), attributes: ["email"]
                }
            ]
        });
        let index = 0;
        for (let value of market) {
            yield (0, sms_1.sendEmailResend)(value.dataValues.user.dataValues.email, subject, `${body}`);
            index++;
        }
        if (index == market.length) {
            return (0, utility_1.successResponse)(res, "Successful");
        }
    }
    else if (type == "ALL") {
        const profile = yield Profile_1.Profile.findAll({
            where: Object.assign({}, queryProfile),
            include: [{ model: Users_1.Users, where: Object.assign({}, query), attributes: ["email"] }]
        });
        let index = 0;
        for (let value of profile) {
            yield (0, sms_1.sendEmailResend)(value.dataValues.user.dataValues.email, subject, `${body}`);
            index++;
        }
        if (index == profile.length) {
            return (0, utility_1.successResponse)(res, "Successful");
        }
    }
    else if (type == "SINGLE") {
        const profile = yield Profile_1.Profile.findAll({
            where: Object.assign(Object.assign({}, queryProfile), { userId: userId }),
            include: [{ model: Users_1.Users, where: Object.assign({}, query), attributes: ["email"] }]
        });
        let index = 0;
        for (let value of profile) {
            yield (0, sms_1.sendEmailResend)(value.dataValues.user.dataValues.email, subject, `${body}`);
            index++;
        }
        if (index == profile.length) {
            return (0, utility_1.successResponse)(res, "Successful");
        }
    }
});
exports.sendAnnoncement = sendAnnoncement;
const sortVerificationUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { type, noOfHires, noOfJobs } = req.query;
    let query = {};
    let queryProfile = {};
    if (noOfHires && noOfHires != "") {
        let [start, end] = noOfHires.toString().split("-").map(Number);
        query.totalHire = {
            [sequelize_1.Op.between]: [start, end]
        };
    }
    if (noOfJobs && noOfJobs != "") {
        let [start, end] = noOfJobs.toString().split("-").map(Number);
        queryProfile.totalJobCompleted = {
            [sequelize_1.Op.between]: [start, end]
        };
        ;
    }
    if (type == Profile_1.ProfileType.CLIENT) {
        const profile = yield Profile_1.Profile.findAll({
            where: Object.assign(Object.assign({ type: Profile_1.ProfileType.CLIENT }, query), { notified: false }),
            include: [{
                    model: Users_1.Users,
                    attributes: ["email"]
                }]
        });
        return (0, utility_1.successResponse)(res, "Successful", profile);
    }
    else if (type == Profile_1.ProfileType.PROFESSIONAL) {
        const profile = yield Profile_1.Profile.findAll({
            where: { type: Profile_1.ProfileType.PROFESSIONAL, corperate: false, notified: false },
            include: [{ model: Users_1.Users, attributes: ["email"] }, { model: Professional_1.Professional, where: Object.assign({}, queryProfile) }]
        });
        return (0, utility_1.successResponse)(res, "Successful", profile);
    }
    else if (type == Profile_1.ProfileType.PROFESSIONAL) {
        const profile = yield Profile_1.Profile.findAll({
            where: { type: Profile_1.ProfileType.PROFESSIONAL, corperate: true, notified: false },
            include: [{ model: Users_1.Users, attributes: ["email"] }, { model: Professional_1.Professional, where: Object.assign({}, queryProfile) }]
        });
        return (0, utility_1.successResponse)(res, "Successful", profile);
    }
    else {
        const profile = yield Profile_1.Profile.findAll({
            where: { type: Profile_1.ProfileType.PROFESSIONAL, corperate: true, notified: false },
            include: [{ model: Users_1.Users, attributes: ["email"] }, { model: Professional_1.Professional, where: Object.assign({}, queryProfile) }]
        });
        const profile2 = yield Profile_1.Profile.findAll({
            where: { type: Profile_1.ProfileType.PROFESSIONAL, corperate: false, notified: false },
            include: [{ model: Users_1.Users, attributes: ["email"] }, { model: Professional_1.Professional, where: Object.assign({}, queryProfile) }]
        });
        const profile3 = yield Profile_1.Profile.findAll({
            where: Object.assign(Object.assign({ type: Profile_1.ProfileType.CLIENT }, query), { notified: false }),
            include: [{
                    model: Users_1.Users,
                    attributes: ["email"]
                }]
        });
        let merged = (0, utility_1.mergeDuplicates)(profile.concat(profile2).concat(profile3));
        return (0, utility_1.successResponse)(res, "Successful", profile.concat(profile2).concat(profile3));
    }
});
exports.sortVerificationUsers = sortVerificationUsers;
const sendVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { userId } = req.body;
    const profile = yield Profile_1.Profile.findAll({
        where: { userId: userId },
        include: [{ model: Users_1.Users, attributes: ["email"] }]
    });
    let index = 0;
    for (let value of profile) {
        yield value.update({ verified: false, notified: true });
        yield (0, sms_1.sendEmailResend)(value.dataValues.user.dataValues.email, "Verification Needed", `Hello ${value === null || value === void 0 ? void 0 : value.fullName},<br><br> Your account needs to be validated,<br><br> Kindly login the Acepick App to proceed with your verification.<br><br> Best Regards.`);
        index++;
    }
    if (index == profile.length) {
        return (0, utility_1.successResponse)(res, "Successful");
    }
});
exports.sendVerification = sendVerification;
// export const getTransactionDashboard = async (req: Request, res: Response) => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = today.getMonth();
//     const prvmonth = today.getMonth() - 1;
//     // Get the start date of the month
//     const monthstartDate = new Date(year, month, 1);
//     // Get the end date of the month
//     const monthendDate = new Date(year, month + 1, 0);
//     // Get the start date of the month
//     const previousMonthstartDate = new Date(year, prvmonth, 1);
//     // Get the end date of the month
//     const previousMonthendDate = new Date(year, prvmonth + 1, 0);
//     try {
//         const getAllTransactionsThisMonth = await Transactions.findAll({
//             where: {
//                 createdAt: {
//                     [Op.gte]: monthstartDate,
//                     [Op.lte]: monthendDate,
//                 }
//             }
//         });
//         const getAllTransactionsPrevMonth = await Transactions.findAll({
//             where: {
//                 createdAt: {
//                     [Op.gte]: previousMonthstartDate,
//                     [Op.lte]: previousMonthendDate,
//                 }
//             }
//         });
//         const numbers1 = [getAllTransactionsPrevMonth.length + 1, getAllTransactionsThisMonth.length + 1];
//         const difference1 = calculateDifferenceBetweenMinMax(numbers1);
//         const getCreditTransactionsThisMonth = await Transactions.findAll({
//             where: {
//                 type: TransactionType.CREDIT,
//                 createdAt: {
//                     [Op.gte]: monthstartDate,
//                     [Op.lte]: monthendDate,
//                 }
//             }
//         });
//         const getCreditTransactionsPrevMonth = await Transactions.findAll({
//             where: {
//                 type: TransactionType.CREDIT,
//                 createdAt: {
//                     [Op.gte]: previousMonthstartDate,
//                     [Op.lte]: previousMonthendDate,
//                 }
//             }
//         });
//         const numbers2 = [getCreditTransactionsPrevMonth.length + 1, getCreditTransactionsThisMonth.length + 1];
//         const difference2 = calculateDifferenceBetweenMinMax(numbers2);
//         const getDebitTransactionsThisMonth = await Transactions.findAll({
//             where: {
//                 type: TransactionType.DEBIT,
//                 createdAt: {
//                     [Op.gte]: monthstartDate,
//                     [Op.lte]: monthendDate,
//                 }
//             }
//         });
//         const getDebitTransactionsPrevMonth = await Transactions.findAll({
//             where: {
//                 type: TransactionType.DEBIT,
//                 createdAt: {
//                     [Op.gte]: previousMonthstartDate,
//                     [Op.lte]: previousMonthendDate,
//                 }
//             }
//         });
//         const numbers3 = [getDebitTransactionsPrevMonth.length + 1, getDebitTransactionsThisMonth.length + 1];
//         const difference3 = calculateDifferenceBetweenMinMax(numbers3);
//         // const summary = await AdminTransaction.findAll({});
//         if (getDebitTransactionsPrevMonth) return successResponse(res, "Fetched Successfully", {
//             allTransactions: {
//                 count: getAllTransactionsThisMonth.length,
//                 transaction: getAllTransactionsThisMonth,
//                 ...difference1
//             },
//             debitTransactions: {
//                 count: getDebitTransactionsThisMonth.length,
//                 transaction: getDebitTransactionsThisMonth,
//                 ...difference3
//             },
//             creditTransactions: {
//                 count: getCreditTransactionsThisMonth.length,
//                 transaction: getCreditTransactionsThisMonth,
//                 ...difference2
//             },
//             // transactionSummary: summary
//         }
//         );
//         return errorResponse(res, "Transactions Does not exist");
//     } catch (error) {
//         console.log(error);
//         return errorResponse(res, `An error occurred - ${error}`);
//     }
// }
const dashboardUserSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield Profile_1.Profile.findAll({
        where: {
            type: Profile_1.ProfileType.CLIENT
        },
    });
    const active = yield Users_1.Users.findAll({
        where: {
            status: Users_1.UserStatus.ACTIVE
        },
    });
    const inactive = yield Users_1.Users.findAll({
        where: {
            status: Users_1.UserStatus.INACTIVE
        },
    });
    const professional = yield Profile_1.Profile.findAll({
        where: {
            // type: ProfileType.PROFESSIONAL,
            corperate: false
        },
    });
    const coorperate = yield Profile_1.Profile.findAll({
        where: {
            // type: ProfileType.PROFESSIONAL,
            corperate: true
        },
    });
    const jobCompleted = yield Jobs_1.Jobs.findAll({
        where: {
            status: Jobs_1.JobStatus.COMPLETED
        },
    });
    const jobPending = yield Jobs_1.Jobs.findAll({
        where: {
            status: Jobs_1.JobStatus.PENDING
        },
    });
    const jobDisputed = yield Jobs_1.Jobs.findAll({
        where: {
            status: Jobs_1.JobStatus.DISPUTED
        },
    });
    const jobRejected = yield Jobs_1.Jobs.findAll({
        where: {
            status: Jobs_1.JobStatus.REJECTED
        },
    });
    const jobOngoing = yield Jobs_1.Jobs.findAll({
        where: {
            status: Jobs_1.JobStatus.ONGOING
        },
    });
    const totalJob = yield Jobs_1.Jobs.findAll({
        where: {},
    });
    const totalUser = yield Users_1.Users.findAll({
        where: {},
    });
    const markets = yield Market_1.MarketPlace.findAll({});
    const sector = yield Sector_1.Sector.findAll({});
    const profession = yield Profession_1.Profession.findAll({});
    return (0, utility_1.successResponse)(res, "Successful", {
        client: client.length,
        activeUsers: active.length,
        inActiveUsers: inactive.length,
        playStore: 0,
        iosStore: 0,
        totalUser: totalUser.length,
        totalJob: totalJob.length,
        professional: professional.length, coorperate: coorperate.length,
        jobCompleted: jobCompleted.length,
        jobPending: jobPending.length, jobDisputed: jobDisputed.length, jobOngoing: jobOngoing.length,
        jobRejected: jobRejected.length,
        markets: markets.length, sector: sector.length, profession: profession.length
    });
});
exports.dashboardUserSummary = dashboardUserSummary;
const getWalletTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { date, startDate, endDate, type } = req.body;
    try {
        const myDate = date == '' || !date ? (0, moment_1.default)().add(1, 'd') : new Date(date);
        const mystartDate = startDate == '' || !startDate ? (0, moment_1.default)().add(1, 'd') : new Date(startDate);
        const myendDate = endDate == '' || !endDate ? (0, moment_1.default)().add(1, 'd') : new Date(endDate);
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const yearCustom = date == "" || !date ? new Date().getFullYear() : new Date(date).getFullYear();
        const monthCustom = date == "" || !date ? new Date().getMonth() : new Date(date).getMonth();
        // Get the start date of the month
        const monthstartDateCustom = new Date(yearCustom, monthCustom, 1);
        // Get the end date of the month
        const monthendDateCustom = new Date(yearCustom, monthCustom + 1, 0);
        // Get the start date of the month
        const monthstartDate = new Date(year, month, 1);
        // Get the end date of the month
        const monthendDate = new Date(year, month + 1, 0);
        const TODAY_START = (0, moment_1.default)(myDate).format('YYYY-MM-DD 00:00');
        const TODAY_END = (0, moment_1.default)(myDate).format('YYYY-MM-DD 23:59');
        const DATE_START = (0, moment_1.default)(mystartDate).format('YYYY-MM-DD 00:00');
        const DATE_END = (0, moment_1.default)(myendDate).format('YYYY-MM-DD 23:59');
        const money_earned = yield Transaction_1.Transactions.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: {
                // businessId,
                createdAt: type == Transaction_1.TransactionDateType.SINGLE_DATE ? {
                    [sequelize_1.Op.gt]: TODAY_START,
                    [sequelize_1.Op.lt]: TODAY_END,
                } : type == Transaction_1.TransactionDateType.THIS_MONTH ? {
                    [sequelize_1.Op.gte]: monthstartDate,
                    [sequelize_1.Op.lte]: monthendDate,
                } : type == Transaction_1.TransactionDateType.MONTH ? {
                    [sequelize_1.Op.gte]: monthstartDateCustom,
                    [sequelize_1.Op.lte]: monthendDateCustom,
                } : {
                    [sequelize_1.Op.gte]: DATE_START,
                    [sequelize_1.Op.lte]: DATE_END,
                },
                creditType: Transaction_1.CreditType.EARNING
            },
            attributes: [[sequelize_1.Sequelize.literal('COALESCE(SUM(amount), 0)'), 'result']],
        });
        const money_paid = yield Transaction_1.Transactions.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: {
                // businessId,
                createdAt: type == Transaction_1.TransactionDateType.SINGLE_DATE ? {
                    [sequelize_1.Op.gt]: TODAY_START,
                    [sequelize_1.Op.lt]: TODAY_END,
                } : type == Transaction_1.TransactionDateType.THIS_MONTH ? {
                    [sequelize_1.Op.gte]: monthstartDate,
                    [sequelize_1.Op.lte]: monthendDate,
                } : {
                    [sequelize_1.Op.gte]: DATE_START,
                    [sequelize_1.Op.lte]: DATE_END,
                },
                creditType: Transaction_1.CreditType.WITHDRAWAL
            },
            attributes: [[sequelize_1.Sequelize.literal('COALESCE(SUM(amount), 0)'), 'result']],
        });
        const money_pending = yield Transaction_1.Transactions.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: {
                // businessId,
                createdAt: type == Transaction_1.TransactionDateType.SINGLE_DATE ? {
                    [sequelize_1.Op.gt]: TODAY_START,
                    [sequelize_1.Op.lt]: TODAY_END,
                } : type == Transaction_1.TransactionDateType.THIS_MONTH ? {
                    [sequelize_1.Op.gte]: monthstartDate,
                    [sequelize_1.Op.lte]: monthendDate,
                } : {
                    [sequelize_1.Op.gte]: DATE_START,
                    [sequelize_1.Op.lte]: DATE_END,
                },
                paid: Transaction_1.PaymentType.PENDING
            },
            attributes: [[sequelize_1.Sequelize.literal('COALESCE(SUM(amount), 0)'), 'result']],
        });
        const transactions_debit = yield Transaction_1.Transactions.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: {
                // businessId,
                createdAt: type == Transaction_1.TransactionDateType.SINGLE_DATE ? {
                    [sequelize_1.Op.gt]: TODAY_START,
                    [sequelize_1.Op.lt]: TODAY_END,
                } : type == Transaction_1.TransactionDateType.THIS_MONTH ? {
                    [sequelize_1.Op.gte]: monthstartDate,
                    [sequelize_1.Op.lte]: monthendDate,
                } : {
                    [sequelize_1.Op.gte]: DATE_START,
                    [sequelize_1.Op.lte]: DATE_END,
                },
                type: Transaction_1.TransactionType.DEBIT,
            },
            attributes: [[sequelize_1.Sequelize.literal('COALESCE(SUM(amount), 0)'), 'result']],
        });
        const transactions_credit = yield Transaction_1.Transactions.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: {
                // businessId,
                createdAt: type == Transaction_1.TransactionDateType.SINGLE_DATE ? {
                    [sequelize_1.Op.gt]: TODAY_START,
                    [sequelize_1.Op.lt]: TODAY_END,
                } : type == Transaction_1.TransactionDateType.THIS_MONTH ? {
                    [sequelize_1.Op.gte]: monthstartDate,
                    [sequelize_1.Op.lte]: monthendDate,
                } : {
                    [sequelize_1.Op.gte]: DATE_START,
                    [sequelize_1.Op.lte]: DATE_END,
                },
                type: Transaction_1.TransactionType.CREDIT,
            },
            attributes: [[sequelize_1.Sequelize.literal('COALESCE(SUM(amount), 0)'), 'result']],
        });
        const transactions = yield Transaction_1.Transactions.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: {
                // businessId,
                createdAt: type == Transaction_1.TransactionDateType.SINGLE_DATE ? {
                    [sequelize_1.Op.gt]: TODAY_START,
                    [sequelize_1.Op.lt]: TODAY_END,
                } : type == Transaction_1.TransactionDateType.THIS_MONTH ? {
                    [sequelize_1.Op.gte]: monthstartDate,
                    [sequelize_1.Op.lte]: monthendDate,
                } : {
                    [sequelize_1.Op.gte]: DATE_START,
                    [sequelize_1.Op.lte]: DATE_END,
                },
            },
            // attributes: [[Sequelize.literal('COALESCE(SUM(amount), 0)'), 'result']],
        });
        if (type == Transaction_1.TransactionDateType.SINGLE_DATE) {
            return (0, utility_1.successResponse)(res, 'Sucessful', {
                // total_credit: summarizeTransactions(transactions_credit, TransactionDateType.SINGLE_DATE),
                // total_debit: summarizeTransactions(transactions_debit, TransactionDateType.SINGLE_DATE),
                // money_earned: summarizeTransactions(money_earned, TransactionDateType.SINGLE_DATE),
                // money_paid: summarizeTransactions(money_paid, TransactionDateType.SINGLE_DATE),
                graph: [{
                        name: "Total Money Pending",
                        amount: money_pending[0].dataValues.result
                    },
                    {
                        name: "Total Money Earned",
                        amount: money_earned[0].dataValues.result
                    },
                    {
                        name: "Total Money Paid",
                        amount: money_paid[0].dataValues.result
                    },
                    {
                        name: "Total Debit",
                        amount: transactions_debit[0].dataValues.result
                    },
                    {
                        name: "Total Credit",
                        amount: transactions_credit[0].dataValues.result
                    }],
                transactions
            });
        }
        else if (type == Transaction_1.TransactionDateType.THIS_MONTH) {
            return (0, utility_1.successResponse)(res, 'Sucessful', {
                // total_credit: summarizeTransactions(transactions_credit, TransactionDateType.THIS_MONTH),
                // total_debit: summarizeTransactions(transactions_debit, TransactionDateType.THIS_MONTH),
                // money_earned: summarizeTransactions(money_earned, TransactionDateType.THIS_MONTH),
                // money_paid: summarizeTransactions(money_paid, TransactionDateType.THIS_MONTH),
                // money_pending: summarizeTransactions(money_pending, TransactionDateType.THIS_MONTH),
                graph: [{
                        name: "Total Money Pending",
                        amount: money_pending[0].dataValues.result
                    },
                    {
                        name: "Total Money Earned",
                        amount: money_earned[0].dataValues.result
                    },
                    {
                        name: "Total Money Paid",
                        amount: money_paid[0].dataValues.result
                    },
                    {
                        name: "Total Debit",
                        amount: transactions_debit[0].dataValues.result
                    },
                    {
                        name: "Total Credit",
                        amount: transactions_credit[0].dataValues.result
                    }
                ],
                transactions
            });
        }
        else if (type == Transaction_1.TransactionDateType.DATE_RANGE) {
            const diffTime = Math.abs((new Date(endDate).getTime()) - (new Date(startDate).getTime()));
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return (0, utility_1.successResponse)(res, 'Sucessful', {
                // total_credit: summarizeTransactions(transactions_credit, TransactionDateType.DATE_RANGE, diffDays),
                // total_debit: summarizeTransactions(transactions_debit, TransactionDateType.DATE_RANGE, diffDays),
                // money_earned: summarizeTransactions(money_earned, TransactionDateType.DATE_RANGE, diffDays),
                // money_paid: summarizeTransactions(money_paid, TransactionDateType.DATE_RANGE, diffDays),
                // money_pending: summarizeTransactions(money_pending, TransactionDateType.DATE_RANGE, diffDays),
                graph: [{
                        name: "Total Money Pending",
                        amount: money_pending[0].dataValues.result
                    },
                    {
                        name: "Total Money Earned",
                        amount: money_earned[0].dataValues.result
                    },
                    {
                        name: "Total Money Paid",
                        amount: money_paid[0].dataValues.result
                    },
                    {
                        name: "Total Debit",
                        amount: transactions_debit[0].dataValues.result
                    },
                    {
                        name: "Total Credit",
                        amount: transactions_credit[0].dataValues.result
                    }
                ],
                transactions
            });
        }
        else if (type == Transaction_1.TransactionDateType.MONTH) {
            return (0, utility_1.successResponse)(res, 'Sucessful', {
                // total_credit: summarizeTransactions(transactions_credit, TransactionDateType.DATE_RANGE, diffDays),
                // total_debit: summarizeTransactions(transactions_debit, TransactionDateType.DATE_RANGE, diffDays),
                // money_earned: summarizeTransactions(money_earned, TransactionDateType.DATE_RANGE, diffDays),
                // money_paid: summarizeTransactions(money_paid, TransactionDateType.DATE_RANGE, diffDays),
                // money_pending: summarizeTransactions(money_pending, TransactionDateType.DATE_RANGE, diffDays),
                graph: [{
                        name: "Total Money Pending",
                        amount: money_pending[0].dataValues.result
                    },
                    {
                        name: "Total Money Earned",
                        amount: money_earned[0].dataValues.result
                    },
                    {
                        name: "Total Money Paid",
                        amount: money_paid[0].dataValues.result
                    },
                    {
                        name: "Total Debit",
                        amount: transactions_debit[0].dataValues.result
                    },
                    {
                        name: "Total Credit",
                        amount: transactions_credit[0].dataValues.result
                    }
                ],
                transactions
            });
        }
        else if (type == Transaction_1.TransactionDateType.ALL) {
            const alltransactions_credit = yield Transaction_1.Transactions.findAll({
                where: {
                    // businessId,
                    type: Transaction_1.TransactionType.CREDIT,
                },
                attributes: [[sequelize_1.Sequelize.literal('COALESCE(SUM(amount), 0)'), 'result']],
            });
            const money_earned = yield Transaction_1.Transactions.findAll({
                where: {
                    // businessId,
                    creditType: Transaction_1.CreditType.EARNING
                },
                attributes: [[sequelize_1.Sequelize.literal('COALESCE(SUM(amount), 0)'), 'result']],
            });
            const money_pending = yield Transaction_1.Transactions.findAll({
                where: {
                    // businessId,
                    paid: Transaction_1.PaymentType.PENDING
                },
                attributes: [[sequelize_1.Sequelize.literal('COALESCE(SUM(amount), 0)'), 'result']],
            });
            const money_paid = yield Transaction_1.Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: {
                    // businessId,
                    creditType: Transaction_1.CreditType.WITHDRAWAL
                },
                attributes: [[sequelize_1.Sequelize.literal('COALESCE(SUM(amount), 0)'), 'result']],
            });
            const alltransactions_debit = yield Transaction_1.Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: {
                    // businessId,
                    type: Transaction_1.TransactionType.DEBIT,
                },
                attributes: [[sequelize_1.Sequelize.literal('COALESCE(SUM(amount), 0)'), 'result']],
            });
            const transactions = yield Transaction_1.Transactions.findAll({
                where: {}, order: [
                    ['id', 'DESC']
                ],
            });
            return (0, utility_1.successResponse)(res, 'Sucessful', {
                // total_credit: summarizeTransactions(alltransactions_credit, TransactionDateType.ALL),
                // total_debit: summarizeTransactions(alltransactions_debit, TransactionDateType.ALL),
                // money_earned: summarizeTransactions(money_earned, TransactionDateType.ALL),
                // money_paid: summarizeTransactions(money_paid, TransactionDateType.ALL),
                // money_pending: summarizeTransactions(money_pending, TransactionDateType.ALL),
                // transactions
                graph: [{
                        name: "Total Money Pending",
                        amount: money_pending[0].dataValues.result
                    },
                    {
                        name: "Total Money Earned",
                        amount: money_earned[0].dataValues.result
                    },
                    {
                        name: "Total Money Paid",
                        amount: money_paid[0].dataValues.result
                    },
                    {
                        name: "Total Debit",
                        amount: alltransactions_debit[0].dataValues.result
                    },
                    {
                        name: "Total Credit",
                        amount: alltransactions_credit[0].dataValues.result
                    }
                ],
                transactions
            });
        }
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.handleResponse)(res, 500, false, `An error occured - ${error}`);
    }
});
exports.getWalletTransaction = getWalletTransaction;
const postTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title } = req.body;
    const topic = yield Topic_1.Topic.create({
        title
    });
    return (0, utility_1.successResponse)(res, "Successful", topic);
});
exports.postTopic = postTopic;
const getTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topic = yield Topic_1.Topic.findAll({
        order: [
            ['id', 'DESC']
        ],
    });
    return (0, utility_1.successResponse)(res, "Successful", topic);
});
exports.getTopic = getTopic;
const deleteTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const topic = yield Topic_1.Topic.findOne({
        where: {
            id
        }
    });
    if (!topic)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Topic not Found" });
    const update = yield (topic === null || topic === void 0 ? void 0 : topic.destroy());
    return (0, utility_1.successResponse)(res, "Deleted Successfully", update);
});
exports.deleteTopic = deleteTopic;
const updateTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title, id } = req.body;
    const topicOld = yield Topic_1.Topic.findOne({ where: { id } });
    if (!topicOld)
        return (0, utility_1.successResponse)(res, "Topic Not Found");
    const faq = yield (topicOld === null || topicOld === void 0 ? void 0 : topicOld.update({
        title: title !== null && title !== void 0 ? title : topicOld.title,
    }));
    return (0, utility_1.successResponse)(res, "Successful", faq);
});
exports.updateTopic = updateTopic;
//# sourceMappingURL=adminManagement.js.map