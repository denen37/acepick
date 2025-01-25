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
exports.deleteDisputes = exports.getUserDisputes = exports.createDispute = exports.updateDisputeStatus = exports.postTicket = exports.updateTicket = exports.updateChat = exports.getUserChat = exports.deleteChat = exports.getChatMessage = exports.postChat = exports.postChatMessage = void 0;
const upload_1 = require("../helpers/upload");
const Chats_1 = require("../models/Chats");
const utility_1 = require("../helpers/utility");
const ChatMessage_1 = require("../models/ChatMessage");
const notification_1 = require("../services/notification");
const Ticket_1 = require("../models/Ticket");
const Dispute_1 = require("../models/Dispute");
const Jobs_1 = require("../models/Jobs");
const Users_1 = require("../models/Users");
const Professional_1 = require("../models/Professional");
const Profile_1 = require("../models/Profile");
const sequelize_1 = require("sequelize");
const ProffesionalSector_1 = require("../models/ProffesionalSector");
const Sector_1 = require("../models/Sector");
const Profession_1 = require("../models/Profession");
const Transaction_1 = require("../models/Transaction");
const Wallet_1 = require("../models/Wallet");
const postChatMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { chatId, message } = req.body;
    const getChat = yield Chats_1.Chats.findOne({ where: { id: chatId } });
    if (!getChat)
        return (0, utility_1.successResponse)(res, "Chat Not Found");
    if (req.files) {
        //     // Read content from the file
        let uploadedImageurl = [];
        for (var file of req.files) {
            // upload image here
            const result = yield (0, upload_1.upload_cloud)(file.path.replace(/ /g, "_"));
            uploadedImageurl.push(result.secure_url);
        }
        try {
            const insertData = {
                image: uploadedImageurl[0],
                message, chatId: Number(chatId),
                userId: getChat.userId,
                recieverId: getChat.recieverId,
            };
            const createChatMessage = yield ChatMessage_1.ChatMessage.create(insertData);
            yield (0, notification_1.sendToken)(getChat.recieverId, "Message", message);
            if (createChatMessage)
                return (0, utility_1.successResponse)(res, "Created Successfully", createChatMessage);
            return (0, utility_1.errorResponse)(res, "Failed Creating Chat Message");
        }
        catch (error) {
            console.log(error);
            return (0, utility_1.errorResponse)(res, `An error occurred - ${error}`);
        }
    }
    else {
        try {
            const insertData = {
                message, chatId: Number(chatId),
                userId: getChat.userId,
                recieverId: getChat.recieverId,
            };
            const createChatMessage = yield ChatMessage_1.ChatMessage.create(insertData);
            yield (0, notification_1.sendToken)(getChat.recieverId, "Message", message);
            if (createChatMessage)
                return (0, utility_1.successResponse)(res, "Created Successfully", createChatMessage);
            return (0, utility_1.errorResponse)(res, "Failed Creating Chat Message");
        }
        catch (error) {
            console.log(error);
            return (0, utility_1.errorResponse)(res, `An error occurred - ${error}`);
        }
    }
});
exports.postChatMessage = postChatMessage;
const postChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { recieverId, lastMessage } = req.body;
    const { id } = req.user;
    try {
        const insertData = {
            userId: id,
            recieverId,
            lastMessage
        };
        console.log(insertData);
        const createChat = yield Chats_1.Chats.create(insertData);
        if (createChat)
            return (0, utility_1.successResponse)(res, "Created Successfully", createChat);
        return (0, utility_1.errorResponse)(res, "Failed Creating Chat");
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occurred - ${error}`);
    }
});
exports.postChat = postChat;
const getChatMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { chatId } = req.query;
    const { id } = req.user;
    try {
        const getChatMessages = yield ChatMessage_1.ChatMessage.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: {
                chatId,
                userId: id
            }
        });
        if (getChatMessages)
            return (0, utility_1.successResponse)(res, "Fetched Successfully", getChatMessages);
        return (0, utility_1.errorResponse)(res, "Chat Messages Does not exist");
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occurred - ${error}`);
    }
});
exports.getChatMessage = getChatMessage;
const deleteChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { chatId } = req.query;
    try {
        const getChat = yield Chats_1.Chats.findOne({ where: { id: chatId } });
        if (!getChat)
            return (0, utility_1.errorResponse)(res, "Chat does not exist");
        yield (getChat === null || getChat === void 0 ? void 0 : getChat.destroy());
        return (0, utility_1.successResponse)(res, "Chat Deleted");
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occurred - ${error}`);
    }
});
exports.deleteChat = deleteChat;
const getUserChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    try {
        const getChats = yield Chats_1.Chats.findAll({
            where: { userId: id },
            order: [
                ['id', 'DESC']
            ],
        });
        if (getChats)
            return (0, utility_1.successResponse)(res, "Fetched Successfully", getChats);
        return (0, utility_1.errorResponse)(res, "Chat Does not exist");
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occurred - ${error}`);
    }
});
exports.getUserChat = getUserChat;
const updateChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { status, lastMessage, chatId } = req.body;
    // const { id } = req.user;
    const chats = yield Chats_1.Chats.findOne({ where: { id: chatId } });
    if (!chats)
        return (0, utility_1.successResponse)(res, "No Chat Found");
    try {
        const insertData = {
            status: status !== null && status !== void 0 ? status : chats === null || chats === void 0 ? void 0 : chats.status,
            lastMessage: lastMessage !== null && lastMessage !== void 0 ? lastMessage : chats === null || chats === void 0 ? void 0 : chats.lastMessage,
        };
        const updateChat = yield chats.update(insertData);
        if (updateChat)
            return (0, utility_1.successResponse)(res, "Updated Successfully", updateChat);
        return (0, utility_1.errorResponse)(res, "Failed Updating Chat");
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occurred - ${error}`);
    }
});
exports.updateChat = updateChat;
const updateTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let { topic, status, ticketId, message } = req.body;
    // const { id } = req.user;
    const ticket = yield Ticket_1.Ticket.findOne({ where: { id: ticketId } });
    if (!ticket)
        return (0, utility_1.successResponse)(res, "No Ticket Found");
    try {
        const insertData = {
            name: topic !== null && topic !== void 0 ? topic : ticket === null || ticket === void 0 ? void 0 : ticket.name, status: status !== null && status !== void 0 ? status : ticket === null || ticket === void 0 ? void 0 : ticket.status,
            image: ticket === null || ticket === void 0 ? void 0 : ticket.image,
            lastMessage: (_a = ticket === null || ticket === void 0 ? void 0 : ticket.lastMessage) !== null && _a !== void 0 ? _a : "",
            description: message !== null && message !== void 0 ? message : ticket === null || ticket === void 0 ? void 0 : ticket.description,
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
});
exports.updateTicket = updateTicket;
const postTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { topic, message } = req.body;
    let { id } = req.user;
    try {
        const insertData = {
            userId: req.user ? req.user.id : id,
            adminId: req.user ? 1 : req.admin.id,
            name: topic, description: message, lastMessage: ""
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
});
exports.postTicket = postTicket;
const updateDisputeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, id } = req.body;
    const dispute = yield Dispute_1.Dispute.findOne({
        where: {
            id
        }
    });
    if (!dispute)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Dispute Not Found" });
    const update = yield (dispute === null || dispute === void 0 ? void 0 : dispute.update({ status }));
    if (status == Dispute_1.DisputeStatus.RESOLVED) {
        const job = yield Jobs_1.Jobs.findOne({ where: { id: dispute.jobId } });
        yield (job === null || job === void 0 ? void 0 : job.update({
            status: Jobs_1.JobStatus.COMPLETED
        }));
    }
    else {
        return (0, utility_1.successResponse)(res, "Successful", update);
    }
});
exports.updateDisputeStatus = updateDisputeStatus;
const createDispute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobId, cause } = req.body;
    const { id } = req.user;
    const job = yield Jobs_1.Jobs.findOne({ where: { id: jobId } });
    const dispute = yield Dispute_1.Dispute.create({
        cause, url: "", jobId, reporterId: id, partnerId: (job === null || job === void 0 ? void 0 : job.userId) == id ? job === null || job === void 0 ? void 0 : job.ownerId : job === null || job === void 0 ? void 0 : job.userId
    });
    const walletProvider = yield Wallet_1.Wallet.findOne({ where: { userId: job === null || job === void 0 ? void 0 : job.ownerId, type: Wallet_1.WalletType.PROFESSIONAL } });
    yield Transaction_1.Transactions.create({
        title: "Dispute Filed",
        description: `Dispute filed for “${job.title}” was successful`,
        type: Transaction_1.TransactionType.JOB,
        creditType: Transaction_1.CreditType.NONE,
        status: "SUCCESSFUL", userId: job === null || job === void 0 ? void 0 : job.ownerId,
        walletId: walletProvider === null || walletProvider === void 0 ? void 0 : walletProvider.id, jobId: job.id
    });
    yield Transaction_1.Transactions.create({
        title: "Dispute Filed",
        description: `A dispute has been filed for “${job.title}”. The money paid is locked until dispute is resolved.`,
        type: Transaction_1.TransactionType.JOB,
        creditType: Transaction_1.CreditType.NONE,
        status: "SUCCESSFUL", userId: job === null || job === void 0 ? void 0 : job.userId,
        jobId: job.id
    });
    yield (job === null || job === void 0 ? void 0 : job.update({
        status: Jobs_1.JobStatus.DISPUTED
    }));
    return (0, utility_1.successResponse)(res, "Successful", dispute);
});
exports.createDispute = createDispute;
const getUserDisputes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const { status } = req.query;
    if (!status) {
        const disputes = yield Dispute_1.Dispute.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { reporterId: id },
                    { partnerId: id },
                ],
            },
            include: [
                {
                    model: Users_1.Users, attributes: ["email", "id"], as: 'reporter',
                    include: [{ model: Professional_1.Professional },
                        {
                            model: Profile_1.Profile, include: [{
                                    model: ProffesionalSector_1.ProfessionalSector, include: [
                                        { model: Sector_1.Sector, attributes: ["title"] },
                                        { model: Profession_1.Profession, attributes: ["title"] }
                                    ]
                                },]
                        }]
                },
                {
                    model: Users_1.Users, attributes: ["email", "id"], as: 'partner', include: [{ model: Professional_1.Professional },
                        {
                            model: Profile_1.Profile, include: [{
                                    model: ProffesionalSector_1.ProfessionalSector, include: [
                                        { model: Sector_1.Sector, attributes: ["title"] },
                                        { model: Profession_1.Profession, attributes: ["title"] }
                                    ]
                                },]
                        }]
                },
                { model: Jobs_1.Jobs }
            ],
            order: [
                ['id', 'DESC']
            ],
        });
        return (0, utility_1.successResponse)(res, "Successful", disputes);
    }
    else {
        const disputes = yield Dispute_1.Dispute.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { reporterId: id },
                    { partnerId: id },
                ],
                status
            },
            include: [
                {
                    model: Users_1.Users,
                    attributes: ["email", "id"], as: 'reporter',
                    include: [
                        { model: Professional_1.Professional },
                        {
                            model: Profile_1.Profile, include: [{
                                    model: ProffesionalSector_1.ProfessionalSector, include: [
                                        { model: Sector_1.Sector, attributes: ["title"] },
                                        { model: Profession_1.Profession, attributes: ["title"] }
                                    ]
                                },]
                        }
                    ]
                },
                {
                    model: Users_1.Users, attributes: ["email", "id"], as: 'partner', include: [{ model: Professional_1.Professional },
                        {
                            model: Profile_1.Profile, include: [{
                                    model: ProffesionalSector_1.ProfessionalSector, include: [
                                        { model: Sector_1.Sector, attributes: ["title"] },
                                        { model: Profession_1.Profession, attributes: ["title"] }
                                    ]
                                },]
                        },
                    ]
                },
                { model: Jobs_1.Jobs }
            ],
            order: [
                ['id', 'DESC']
            ],
        });
        return (0, utility_1.successResponse)(res, "Successful", disputes);
    }
});
exports.getUserDisputes = getUserDisputes;
const deleteDisputes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
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
//# sourceMappingURL=social.js.map