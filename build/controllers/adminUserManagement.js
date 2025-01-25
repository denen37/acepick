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
exports.updateUserStatus = exports.userProfile = exports.sortUsers = exports.getAllUsers = void 0;
const utility_1 = require("../helpers/utility");
const Users_1 = require("../models/Users");
const sequelize_1 = require("sequelize");
const Profile_1 = require("../models/Profile");
const Professional_1 = require("../models/Professional");
const Wallet_1 = require("../models/Wallet");
const Cooperation_1 = require("../models/Cooperation");
const Jobs_1 = require("../models/Jobs");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield Users_1.Users.findAll({});
    return (0, utility_1.successResponse)(res, "Successful", users);
});
exports.getAllUsers = getAllUsers;
const sortUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, status, type, search } = req.query;
    // const { id } = req.user;
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
        if (role == Profile_1.ProfileType.PROFESSIONAL || role == Profile_1.ProfileType.CORPERATE) {
            if (search) {
                const getProfile = yield Professional_1.Professional.findAll({
                    where: queryParams3,
                    include: [{
                        model: Users_1.Users,
                        where: queryParams2,
                        attributes: ["email", "phone", "status"],
                        include: [{ model: Wallet_1.Wallet, attributes: ["amount"] }]
                    },
                    {
                        model: Profile_1.Profile,
                        where: Object.assign(Object.assign({}, queryParams), {
                            [sequelize_1.Op.or]: [
                                { firstName: { [sequelize_1.Op.like]: `%${search}%` } },
                                { lastName: { [sequelize_1.Op.like]: `%${search}%` } },
                            ]
                        }),
                        attributes: ["firstName", "lastName", "avatar", "lga", "state", "address", "nin", "type"]
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
                    include: [{
                        model: Users_1.Users,
                        where: queryParams2,
                        attributes: ["email", "phone", "status"],
                        include: [{ model: Wallet_1.Wallet, attributes: ["amount"] }]
                    },
                    {
                        model: Profile_1.Profile,
                        where: queryParams,
                        attributes: ["firstName", "lastName", "avatar", "lga", "state", "address", "nin", "type"]
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
        else {
            if (search) {
                const getProfile = yield Profile_1.Profile.findAll({
                    where: Object.assign(Object.assign({}, queryParams), {
                        [sequelize_1.Op.or]: [
                            { firstName: { [sequelize_1.Op.like]: `%${search}%` } },
                            { lastName: { [sequelize_1.Op.like]: `%${search}%` } },
                        ]
                    }),
                    include: [{
                        model: Users_1.Users,
                        where: queryParams2,
                        attributes: ["email", "phone", "status"],
                        include: [{ model: Wallet_1.Wallet, attributes: ["amount"] }]
                    }],
                });
                if (getProfile)
                    return (0, utility_1.successResponse)(res, "Fetched Successfully", getProfile);
                return (0, utility_1.errorResponse)(res, "Failed fetching Users");
            }
            else {
                const getProfile = yield Profile_1.Profile.findAll({
                    where: queryParams,
                    include: [{
                        model: Users_1.Users,
                        where: queryParams2,
                        attributes: ["email", "phone", "status"],
                        include: [{ model: Wallet_1.Wallet, attributes: ["amount"] }]
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
    const { id, type } = req.query;
    if (type == Profile_1.ProfileType.PROFESSIONAL || type == Profile_1.ProfileType.CORPERATE) {
        const getProfile = yield Professional_1.Professional.findOne({
            where: { id },
            include: [{
                model: Users_1.Users,
                attributes: ["email", "phone", "status"],
                include: [
                    { model: Wallet_1.Wallet, attributes: ["amount"] },
                    { model: Jobs_1.Jobs, attributes: ["status", "id"] }
                ]
            },
            {
                model: Profile_1.Profile,
                attributes: ["firstName", "lastName", "avatar", "lga", "state", "address", "nin", "type"]
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
    else {
        const getProfile = yield Profile_1.Profile.findOne({
            where: { id },
            include: [{
                model: Users_1.Users,
                attributes: ["email", "phone", "status"],
                include: [{ model: Wallet_1.Wallet, attributes: ["amount"] },
                { model: Jobs_1.Jobs, attributes: ["status", "id"] }]
            }],
        });
        if (getProfile)
            return (0, utility_1.successResponse)(res, "Fetched Successfully", getProfile);
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
    const update = yield (user === null || user === void 0 ? void 0 : user.update({ status }));
    return (0, utility_1.successResponse)(res, "Successful", update);
});
exports.updateUserStatus = updateUserStatus;
//# sourceMappingURL=adminUserManagement.js.map