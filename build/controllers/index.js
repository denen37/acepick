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
exports.search = exports.getProfession = exports.getSector = exports.uploadFiles = exports.testN = exports.apiIndex = void 0;
const utility_1 = require("../helpers/utility");
const Sector_1 = require("../models/Sector");
const Profession_1 = require("../models/Profession");
const Professional_1 = require("../models/Professional");
const Profile_1 = require("../models/Profile");
const Users_1 = require("../models/Users");
const LanLog_1 = require("../models/LanLog");
const Cooperation_1 = require("../models/Cooperation");
const sequelize_1 = require("sequelize");
const Education_1 = require("../models/Education");
const Certification_1 = require("../models/Certification");
const Experience_1 = require("../models/Experience");
const Porfolio_1 = require("../models/Porfolio");
const Dispute_1 = require("../models/Dispute");
const ProffesionalSector_1 = require("../models/ProffesionalSector");
const upload_1 = require("../helpers/upload");
const Review_1 = require("../models/Review");
const Jobs_1 = require("../models/Jobs");
const expo_1 = require("../services/expo");
const apiIndex = (req, res) => __awaiter(void 0, void 0, void 0, function* () { return (0, utility_1.successResponse)(res, "API Working!"); });
exports.apiIndex = apiIndex;
const testN = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, token } = req.query;
    if (token) {
        console.log(token);
        console.log(token);
        console.log(token);
        return (0, utility_1.successResponse)(res, "successful");
    }
    const user = yield Users_1.Users.findOne({ where: { email } });
    if (!user)
        return (0, utility_1.successResponse)(res, "No user found");
    const profile = yield Profile_1.Profile.findOne({ where: { userId: user.id } });
    (profile === null || profile === void 0 ? void 0 : profile.fcmToken) == null ? null : (0, expo_1.sendExpoNotification)(profile.fcmToken, "hello world");
    return (0, utility_1.successResponse)(res, "successful");
});
exports.testN = testN;
const uploadFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let urls;
    if (req.files) {
        let uploadPromises = [];
        if (Array.isArray(req.files)) {
            // If req.files is an array, iterate directly and store promises
            uploadPromises = req.files.map((file) => (0, upload_1.upload_cloud)(file.path));
        }
        else {
            // If req.files is an object, iterate over each field and its associated file array
            for (const fieldName in req.files) {
                if (req.files.hasOwnProperty(fieldName)) {
                    const fileArray = req.files[fieldName];
                    fileArray.forEach((file) => {
                        uploadPromises.push((0, upload_1.upload_cloud)(file.path));
                    });
                }
            }
        }
        // Wait for all uploads to complete and store the secure URLs
        const urls = yield Promise.all(uploadPromises);
        return (0, utility_1.successResponse)(res, "Files Uploaded", urls);
    }
    else {
        return (0, utility_1.successResponseFalse)(res, "No Files Selected");
    }
});
exports.uploadFiles = uploadFiles;
const getSector = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sector = yield Sector_1.Sector.findAll({
        include: [{ model: Profession_1.Profession }],
        order: [["id", "DESC"]],
    });
    (0, utility_1.successResponse)(res, "Successful", sector);
});
exports.getSector = getSector;
const getProfession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    if (!id)
        return (0, utility_1.errorResponse)(res, "Please pass sector id");
    const profession = yield Profession_1.Profession.findAll({
        where: { sectorId: id },
        order: [["id", "DESC"]],
    });
    (0, utility_1.successResponse)(res, "Successful", profession);
});
exports.getProfession = getProfession;
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { sector, profession, lat, long, exp, value } = req.query;
    value = value === null || value === void 0 ? void 0 : value.toString().replace("+", " ");
    console.log(sector, profession, lat, long, exp, value);
    let queryParamsAllProf = {};
    let queryCorperateProfession;
    if (exp && exp != "") {
        queryCorperateProfession.yearsOfExp = exp;
    }
    if (sector && sector != "") {
        queryParamsAllProf = {
            sectorId: sector,
        };
    }
    if (profession != null && profession != "") {
        queryParamsAllProf = {
            professionId: profession,
        };
    }
    let valueSearchGeneral;
    if (value && value != "") {
        console.log("...loading");
        valueSearchGeneral = {
            [sequelize_1.Op.or]: [
                // { '$profile.fullName$': { [Op.like]: '%' + value + '%' } },
                {
                    "$profile.professional_sector.sector.title$": {
                        [sequelize_1.Op.like]: `%${value}%`,
                    },
                },
                {
                    "$profile.professional_sector.profession.title$": {
                        [sequelize_1.Op.like]: `%${value}%`,
                    },
                },
            ],
        };
    }
    const professional = yield Professional_1.Professional.findAll({
        order: [["id", "DESC"]],
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
                        where: JSON.stringify(queryParamsAllProf) == "{}"
                            ? undefined
                            : Object.assign({}, queryParamsAllProf),
                    },
                ],
            },
            { model: Cooperation_1.Corperate },
            {
                model: Users_1.Users,
                include: [
                    {
                        model: Jobs_1.Jobs,
                        where: {
                            status: Jobs_1.JobStatus.COMPLETED,
                        },
                        required: false,
                        limit: 3
                    },
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
        where: !queryCorperateProfession && !valueSearchGeneral
            ? undefined
            : Object.assign(Object.assign({}, queryCorperateProfession), valueSearchGeneral),
    });
    let newProfessionals = [];
    professional.forEach((e) => {
        if (e.dataValues.user.dataValues.location) {
            let value = (0, utility_1.getDistanceFromLatLonInKm)(e.dataValues.user.dataValues.location.dataValues.lantitude, e.dataValues.user.dataValues.location.dataValues.longitude, lat, long);
            let data = (0, utility_1.deleteKey)(e.dataValues, "profile", "corperate");
            if (lat == "" || !lat || long == "" || !long) {
                newProfessionals.push({
                    profile: e.dataValues.profile,
                    corperate: null,
                    professional: data,
                });
            }
            else {
                if (value <= 500) {
                    newProfessionals.push({
                        profile: e.dataValues.profile,
                        corperate: null,
                        professional: data,
                    });
                }
            }
        }
    });
    const corperates = yield Professional_1.Professional.findAll({
        order: [["id", "DESC"]],
        where: JSON.stringify(queryCorperateProfession) == "{}" &&
            JSON.stringify(valueSearchGeneral) == "{}"
            ? undefined
            : Object.assign(Object.assign({}, queryCorperateProfession), valueSearchGeneral),
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
                        where: JSON.stringify(queryParamsAllProf) == "{}"
                            ? undefined
                            : Object.assign({}, queryParamsAllProf),
                    },
                ],
            },
            {
                model: Cooperation_1.Corperate,
            },
            {
                model: Users_1.Users,
                include: [
                    { model: LanLog_1.LanLog },
                    {
                        model: Education_1.Education,
                    },
                    {
                        model: Certification_1.Certification,
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
    });
    let newCorperates = [];
    corperates.forEach((e) => {
        if (e.dataValues.user.dataValues.location) {
            let value = (0, utility_1.getDistanceFromLatLonInKm)(e.dataValues.user.dataValues.location.dataValues.lantitude, e.dataValues.user.dataValues.location.dataValues.longitude, lat, long);
            let data = (0, utility_1.deleteKey)(e.dataValues, "profile", "corperate");
            if (lat == "" || !lat || long == "" || !long) {
                newCorperates.push({
                    profile: e.dataValues.profile,
                    corperate: e.dataValues.corperate,
                    professional: data,
                });
            }
            else {
                if (value <= 50) {
                    newCorperates.push({
                        profile: e.dataValues.profile,
                        corperate: e.dataValues.corperate,
                        professional: data,
                    });
                }
            }
        }
    });
    (0, utility_1.successResponse)(res, "Successful", {
        professionals: newProfessionals,
        newCorperates,
    });
});
exports.search = search;
//# sourceMappingURL=index.js.map