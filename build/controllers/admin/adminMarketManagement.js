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
exports.createCategory = exports.deleteMarket = exports.updateMarketPlaceStatus = exports.sortMarketPlace = void 0;
const utility_1 = require("../../helpers/utility");
const Users_1 = require("../../models/Users");
const sequelize_1 = require("sequelize");
const Wallet_1 = require("../../models/Wallet");
const Market_1 = require("../../models/Market");
const Category_1 = require("../../models/Category");
const sortMarketPlace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, search } = req.query;
    // const { id } = req.user;
    try {
        const queryParams = {};
        if (status) {
            queryParams.status = status;
        }
        if (search) {
            const getMarketPlace = yield Market_1.MarketPlace.findAll({
                where: Object.assign(Object.assign({}, queryParams), { [sequelize_1.Op.or]: [
                        { name: { [sequelize_1.Op.like]: `%${search}%` } },
                    ] }),
                include: [{
                        model: Users_1.Users,
                        attributes: ["email", "phone", "status"],
                    }],
            });
            if (getMarketPlace)
                return (0, utility_1.successResponse)(res, "Fetched Successfully", getMarketPlace);
            return (0, utility_1.errorResponse)(res, "Failed fetching Users");
        }
        else {
            const getMarketPlace = yield Market_1.MarketPlace.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: queryParams,
                include: [{
                        model: Users_1.Users,
                        where: queryParams,
                        attributes: ["email", "phone", "status"],
                        include: [{
                                model: Wallet_1.Wallet,
                                where: {
                                    type: Wallet_1.WalletType.PROFESSIONAL
                                },
                                attributes: ["amount"]
                            }]
                    }],
            });
            if (getMarketPlace)
                return (0, utility_1.successResponse)(res, "Fetched Successfully", getMarketPlace);
            return (0, utility_1.errorResponse)(res, "Failed fetching Users");
        }
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occurred - ${error}`);
    }
});
exports.sortMarketPlace = sortMarketPlace;
const updateMarketPlaceStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, id } = req.body;
    const market = yield Market_1.MarketPlace.findOne({
        where: {
            id
        }
    });
    if (!market)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Market Place Not Found" });
    const update = yield (market === null || market === void 0 ? void 0 : market.update({ status }));
    return (0, utility_1.successResponse)(res, "Successful", update);
});
exports.updateMarketPlaceStatus = updateMarketPlaceStatus;
const deleteMarket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const market = yield Market_1.MarketPlace.findOne({
        where: {
            id
        }
    });
    if (!market)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "market not Found" });
    const update = yield (market === null || market === void 0 ? void 0 : market.destroy());
    return (0, utility_1.successResponse)(res, "Deleted Successfully", update);
});
exports.deleteMarket = deleteMarket;
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.body;
    const category = yield Category_1.Category.create({ title });
    return (0, utility_1.successResponse)(res, "Created Successfully", category);
});
exports.createCategory = createCategory;
//# sourceMappingURL=adminMarketManagement.js.map