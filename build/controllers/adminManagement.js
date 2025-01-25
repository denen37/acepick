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
exports.postProfession = exports.postSector = void 0;
const upload_1 = require("../helpers/upload");
const Sector_1 = require("../models/Sector");
const utility_1 = require("../helpers/utility");
const Profession_1 = require("../models/Profession");
const postSector = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title } = req.body;
    // let {id} =  req.a;
    if (req.file) {
        const result = yield (0, upload_1.upload_cloud)(req.file.path.replace(/ /g, "_"));
        const sector = yield Sector_1.Sector.create({
            title,
            image: result.secure_url,
        });
        (0, utility_1.successResponse)(res, "Successful", { status: false, message: sector });
    }
    else {
        const sector = yield Sector_1.Sector.create({
            title: title,
            image: "",
        });
        (0, utility_1.successResponse)(res, "Successful", sector);
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
        (0, utility_1.successResponse)(res, "Successful", { status: false, message: profession });
    }
    else {
        const profession = yield Profession_1.Profession.create({
            title,
            image: "",
            sectorId
        });
        (0, utility_1.successResponse)(res, "Successful", profession);
    }
});
exports.postProfession = postProfession;
//# sourceMappingURL=adminManagement.js.map