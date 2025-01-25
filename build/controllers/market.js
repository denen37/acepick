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
exports.getMarketFavourite = exports.deleteAllMarketFavourite = exports.deleteProduct = exports.deleteMarketFavourite = exports.updateMarketPlace = exports.updateProduct = exports.addMarketFavourite = exports.createReview = exports.fetchUserProduct = exports.fetchStoreProduct = exports.fetchCategory = exports.fetchUserStore = exports.fetchSingleStore = exports.createProduct = exports.createMarketPlace = exports.sortMarketPlace = void 0;
const utility_1 = require("../helpers/utility");
const Users_1 = require("../models/Users");
const sequelize_1 = require("sequelize");
const Market_1 = require("../models/Market");
const Wallet_1 = require("../models/Wallet");
const Profile_1 = require("../models/Profile");
const Products_1 = require("../models/Products");
const Category_1 = require("../models/Category");
const ReviewMarket_1 = require("../models/ReviewMarket");
const LanLog_1 = require("../models/LanLog");
const MarketFavourite_1 = require("../models/MarketFavourite");
const sortMarketPlace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, value, lat, long, } = req.query;
    // const { id } = req.user;
    let newProduct = [];
    let newMarket = [];
    try {
        const queryParams = {};
        if (status) {
            queryParams.status = status;
        }
        if (value) {
            const getMarketPlace = yield Market_1.MarketPlace.findAll({
                where: Object.assign(Object.assign({}, queryParams), { [sequelize_1.Op.or]: [
                        { name: { [sequelize_1.Op.like]: `%${value}%` } },
                    ] }),
                include: [{
                        model: Users_1.Users,
                        attributes: ["email", "phone", "status"],
                        include: [{ model: LanLog_1.LanLog }],
                    }, { model: Profile_1.Profile },
                    { model: Category_1.Category },],
            });
            const getProduct = yield Products_1.Product.findAll({
                where: Object.assign(Object.assign({}, queryParams), { [sequelize_1.Op.or]: [
                        { name: { [sequelize_1.Op.like]: `%${value}%` } },
                        // { description: { [Op.like]: `%${value}%` } },
                        // { tags: { [Op.like]: `%${value}%` } }
                    ] }),
                include: [{
                        model: Users_1.Users,
                        attributes: ["email", "phone", "status"],
                        include: [{ model: LanLog_1.LanLog }],
                    }],
            });
            getProduct.forEach((e) => {
                if (e.dataValues.user.dataValues.location) {
                    let value = (0, utility_1.getDistanceFromLatLonInKm)(e.dataValues.user.dataValues.location.dataValues.lantitude, e.dataValues.user.dataValues.location.dataValues.longitude, lat, long);
                    if (lat == "" || !lat || long == "" || !long) {
                        newProduct.push(e);
                    }
                    else {
                        if (value <= 500) {
                            newProduct.push(e);
                        }
                    }
                }
            });
            getMarketPlace.forEach((e) => {
                if (e.dataValues.user.dataValues.location) {
                    let value = (0, utility_1.getDistanceFromLatLonInKm)(e.dataValues.user.dataValues.location.dataValues.lantitude, e.dataValues.user.dataValues.location.dataValues.longitude, lat, long);
                    if (lat == "" || !lat || long == "" || !long) {
                        newMarket.push(e);
                    }
                    else {
                        if (value <= 500) {
                            newMarket.push(e);
                        }
                    }
                }
            });
            return (0, utility_1.successResponse)(res, "Fetched Successfully", { store: newMarket, product: newProduct });
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
                            }, { model: LanLog_1.LanLog }]
                    },
                    { model: Profile_1.Profile },
                    { model: Category_1.Category },
                ],
            });
            const getProduct = yield Products_1.Product.findAll({
                where: Object.assign({}, queryParams),
                include: [{
                        model: Users_1.Users,
                        attributes: ["email", "phone", "status"],
                        include: [{ model: LanLog_1.LanLog }],
                    }],
            });
            getProduct.forEach((e) => {
                if (e.dataValues.user.dataValues.location) {
                    let value = (0, utility_1.getDistanceFromLatLonInKm)(e.dataValues.user.dataValues.location.dataValues.lantitude, e.dataValues.user.dataValues.location.dataValues.longitude, lat, long);
                    if (lat == "" || !lat || long == "" || !long) {
                        newProduct.push(e);
                    }
                    else {
                        if (value <= 500) {
                            newProduct.push(e);
                        }
                    }
                }
            });
            getMarketPlace.forEach((e) => {
                if (e.dataValues.user.dataValues.location) {
                    let value = (0, utility_1.getDistanceFromLatLonInKm)(e.dataValues.user.dataValues.location.dataValues.lantitude, e.dataValues.user.dataValues.location.dataValues.longitude, lat, long);
                    if (lat == "" || !lat || long == "" || !long) {
                        newMarket.push(e);
                    }
                    else {
                        if (value <= 500) {
                            newMarket.push(e);
                        }
                    }
                }
            });
            return (0, utility_1.successResponse)(res, "Fetched Successfully", { store: newMarket, product: newProduct });
        }
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occurred - ${error}`);
    }
});
exports.sortMarketPlace = sortMarketPlace;
const createMarketPlace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { avatar, name, description, tags, state, lga, address, phone, facebook, instagram, productPhotos, categoryId } = req.body;
    let { id } = req.user;
    const user = yield Users_1.Users.findOne({ where: { id } });
    const profile = yield Profile_1.Profile.findOne({ where: { userId: id } });
    const marketPlace = yield Market_1.MarketPlace.findOne({ where: { userId: id } });
    if (marketPlace)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Market Place Already Exist" });
    const files = [];
    for (let value of productPhotos) {
        files.push((0, utility_1.convertHttpToHttps)(value));
    }
    const marketPlaceCreate = yield Market_1.MarketPlace.create({
        photo: (0, utility_1.convertHttpToHttps)(avatar), name, description, tags, state, lga, address, phone, facebook,
        instagram, file: files, userId: id, profileId: profile.id, categoryId
    });
    yield (profile === null || profile === void 0 ? void 0 : profile.update({ store: true }));
    return (0, utility_1.successResponse)(res, "Successful", marketPlaceCreate);
});
exports.createMarketPlace = createMarketPlace;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, description, tags, price, productImage, categoryId } = req.body;
    let { id } = req.user;
    const user = yield Users_1.Users.findOne({ where: { id } });
    const profile = yield Profile_1.Profile.findOne({ where: { userId: id } });
    const marketPlace = yield Market_1.MarketPlace.findOne({ where: { userId: id } });
    if (!marketPlace)
        return (0, utility_1.successResponse)(res, "Not Found");
    const files = [];
    for (let value of productImage) {
        files.push((0, utility_1.convertHttpToHttps)(value));
    }
    const productCreate = yield Products_1.Product.create({
        name, description, tags, price, file: files, userId: id, marketPlaceId: marketPlace.id, profileId: profile.id, categoryId
    });
    return (0, utility_1.successResponse)(res, "Successful", productCreate);
});
exports.createProduct = createProduct;
const fetchSingleStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.query;
    const marketPlace = yield Market_1.MarketPlace.findOne({
        where: { id }, include: [{
                model: Users_1.Users,
                attributes: ["email", "phone", "status"],
                include: [{ model: LanLog_1.LanLog }],
            }, { model: Profile_1.Profile },
            { model: Category_1.Category },],
    });
    if (!marketPlace)
        return (0, utility_1.successResponse)(res, "Store Not Found");
    return (0, utility_1.successResponse)(res, "Successful", marketPlace);
});
exports.fetchSingleStore = fetchSingleStore;
const fetchUserStore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.user;
    const marketPlace = yield Market_1.MarketPlace.findOne({
        where: { userId: id },
        include: [{
                model: Users_1.Users,
                attributes: ["email", "phone", "status"],
                include: [{ model: LanLog_1.LanLog }],
            }, { model: Profile_1.Profile },
            { model: Category_1.Category },],
    });
    if (!marketPlace)
        return (0, utility_1.successResponse)(res, "Store Not Found");
    return (0, utility_1.successResponse)(res, "Successful", marketPlace);
});
exports.fetchUserStore = fetchUserStore;
const fetchCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield Category_1.Category.findAll({});
    return (0, utility_1.successResponse)(res, "Successful", category);
});
exports.fetchCategory = fetchCategory;
const fetchStoreProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.query;
    const products = yield Products_1.Product.findAll({
        where: { userId: id }, include: [{
                model: Users_1.Users,
                attributes: ["email", "phone", "status"],
                include: [{ model: LanLog_1.LanLog }],
            }],
    });
    return (0, utility_1.successResponse)(res, "Successful", products);
});
exports.fetchStoreProduct = fetchStoreProduct;
const fetchUserProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.user;
    const products = yield Products_1.Product.findAll({
        where: { userId: id }, include: [{
                model: Users_1.Users,
                attributes: ["email", "phone", "status"],
                include: [{ model: LanLog_1.LanLog }],
            }],
    });
    return (0, utility_1.successResponse)(res, "Successful", products);
});
exports.fetchUserProduct = fetchUserProduct;
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { review, marketPlaceId, rate } = req.body;
    let { id } = req.user;
    const marketPlace = yield Market_1.MarketPlace.findOne({ where: { id: marketPlaceId } });
    if (!marketPlace)
        return (0, utility_1.successResponse)(res, "Market Place not found");
    const reviews = yield (ReviewMarket_1.ReviewMarket === null || ReviewMarket_1.ReviewMarket === void 0 ? void 0 : ReviewMarket_1.ReviewMarket.create({
        review,
        rate: rate,
        marketPlaceId: marketPlace === null || marketPlace === void 0 ? void 0 : marketPlace.id,
        userId: id,
        marketPlaceUserId: marketPlace === null || marketPlace === void 0 ? void 0 : marketPlace.userId,
    }));
    if (Number(marketPlace === null || marketPlace === void 0 ? void 0 : marketPlace.rate) == 0) {
        yield marketPlace.update({ rate });
        return (0, utility_1.successResponse)(res, "Successful", reviews);
    }
    else {
        let mean = (Number(((marketPlace === null || marketPlace === void 0 ? void 0 : marketPlace.rate) + rate)) / 2);
        yield marketPlace.update({ rate: mean });
        return (0, utility_1.successResponse)(res, "Successful", reviews);
    }
});
exports.createReview = createReview;
const addMarketFavourite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.body;
    const { id } = req.user;
    if (type == "MARKETPLACE") {
        const marketPlace = yield Market_1.MarketPlace.findOne({ where: { id: req.body.id } });
        const favourite = yield MarketFavourite_1.MarketFavourite.findOne({ where: { marketPlaceId: marketPlace === null || marketPlace === void 0 ? void 0 : marketPlace.id, favouriteOwnerId: id } });
        if (favourite) {
            yield favourite.destroy();
            return (0, utility_1.successResponse)(res, "Successful", favourite);
        }
        else {
            const fav = yield MarketFavourite_1.MarketFavourite.create({ favouriteOwnerId: id, marketPlaceId: marketPlace === null || marketPlace === void 0 ? void 0 : marketPlace.id, userId: marketPlace === null || marketPlace === void 0 ? void 0 : marketPlace.userId, type: MarketFavourite_1.FavouriteType.STORE });
            return (0, utility_1.successResponse)(res, "Successful", fav);
        }
    }
    else {
        const product = yield Products_1.Product.findOne({ where: { id: req.body.id } });
        const favourite = yield MarketFavourite_1.MarketFavourite.findOne({ where: { productId: product === null || product === void 0 ? void 0 : product.id, favouriteOwnerId: id } });
        if (favourite) {
            yield favourite.destroy();
            return (0, utility_1.successResponse)(res, "Successful", favourite);
        }
        else {
            const fav = yield MarketFavourite_1.MarketFavourite.create({ favouriteOwnerId: id, productId: product === null || product === void 0 ? void 0 : product.id, userId: product === null || product === void 0 ? void 0 : product.userId, type: MarketFavourite_1.FavouriteType.PRODUCT });
            return (0, utility_1.successResponse)(res, "Successful", fav);
        }
    }
});
exports.addMarketFavourite = addMarketFavourite;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, description, tags, price, productImage, categoryId, productId } = req.body;
    let { id } = req.user;
    const oldProduct = yield Products_1.Product.findOne({ where: { id: productId } });
    if (!oldProduct)
        return (0, utility_1.errorResponse)(res, "Product not Found");
    const product = yield (oldProduct === null || oldProduct === void 0 ? void 0 : oldProduct.update({
        name: name !== null && name !== void 0 ? name : oldProduct.name,
        description: description !== null && description !== void 0 ? description : oldProduct.description,
        tags: tags !== null && tags !== void 0 ? tags : oldProduct.tags,
        price: price !== null && price !== void 0 ? price : oldProduct.price,
        file: productImage !== null && productImage !== void 0 ? productImage : oldProduct.file,
        categoryId: categoryId !== null && categoryId !== void 0 ? categoryId : oldProduct.categoryId,
    }));
    return (0, utility_1.successResponse)(res, "Successful", product);
});
exports.updateProduct = updateProduct;
const updateMarketPlace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { avatar, name, description, tags, state, lga, address, phone, facebook, instagram, productPhotos, categoryId } = req.body;
    let { id } = req.user;
    const oldMarketPlace = yield Market_1.MarketPlace.findOne({ where: { userId: id } });
    if (!oldMarketPlace)
        return (0, utility_1.errorResponse)(res, "Market not Found");
    const marketPlace = yield (oldMarketPlace === null || oldMarketPlace === void 0 ? void 0 : oldMarketPlace.update({
        photo: avatar !== null && avatar !== void 0 ? avatar : oldMarketPlace.photo,
        name: name !== null && name !== void 0 ? name : oldMarketPlace.name,
        description: description !== null && description !== void 0 ? description : oldMarketPlace.description,
        tags: tags !== null && tags !== void 0 ? tags : oldMarketPlace.tags,
        state: state !== null && state !== void 0 ? state : oldMarketPlace.state,
        lga: lga !== null && lga !== void 0 ? lga : oldMarketPlace.lga,
        address: address !== null && address !== void 0 ? address : oldMarketPlace.address,
        phone: phone !== null && phone !== void 0 ? phone : oldMarketPlace.phone,
        facebook: facebook !== null && facebook !== void 0 ? facebook : oldMarketPlace.facebook,
        instagram: instagram !== null && instagram !== void 0 ? instagram : oldMarketPlace.instagram,
        file: productPhotos !== null && productPhotos !== void 0 ? productPhotos : oldMarketPlace.file,
        categoryId: categoryId !== null && categoryId !== void 0 ? categoryId : oldMarketPlace.categoryId
    }));
    return (0, utility_1.successResponse)(res, "Successful", marketPlace);
});
exports.updateMarketPlace = updateMarketPlace;
const deleteMarketFavourite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { favouriteId } = req.body;
    const { id } = req.user;
    const fav = yield MarketFavourite_1.MarketFavourite.findOne({ where: { id: favouriteId } });
    if (!fav)
        return (0, utility_1.errorResponse)(res, "Favourite Not Found");
    yield (fav === null || fav === void 0 ? void 0 : fav.destroy());
    return (0, utility_1.successResponse)(res, "Successful");
});
exports.deleteMarketFavourite = deleteMarketFavourite;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (id) {
        const product = yield Products_1.Product.findOne({ where: { id } });
        if (!product)
            return (0, utility_1.errorResponse)(res, "Product Not Found");
        yield (product === null || product === void 0 ? void 0 : product.destroy());
        return (0, utility_1.successResponse)(res, "Successful");
    }
    else {
        return (0, utility_1.successResponseFalse)(res, "Please pass an id");
    }
});
exports.deleteProduct = deleteProduct;
const deleteAllMarketFavourite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const favourite = yield MarketFavourite_1.MarketFavourite.findAll({ where: { favouriteOwnerId: id } });
    let index = 0;
    for (let value of favourite) {
        yield value.destroy();
        index++;
    }
    if (index == favourite.length) {
        return (0, utility_1.successResponse)(res, "Successful");
    }
});
exports.deleteAllMarketFavourite = deleteAllMarketFavourite;
const getMarketFavourite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const product = yield MarketFavourite_1.MarketFavourite.findAll({
        where: { favouriteOwnerId: id, type: MarketFavourite_1.FavouriteType.PRODUCT },
        order: [
            ['id', 'DESC']
        ],
        include: [
            {
                model: Products_1.Product,
                include: [{
                        model: Users_1.Users,
                        attributes: ["email", "phone", "status"],
                        include: [{ model: LanLog_1.LanLog }],
                    }],
            },
        ]
    });
    const store = yield MarketFavourite_1.MarketFavourite.findAll({
        order: [
            ['id', 'DESC']
        ],
        where: { favouriteOwnerId: id, type: MarketFavourite_1.FavouriteType.STORE },
        include: [
            {
                model: Market_1.MarketPlace,
                include: [{
                        model: Users_1.Users,
                        attributes: ["email", "phone", "status"],
                        include: [{ model: LanLog_1.LanLog }],
                    }, { model: Profile_1.Profile },
                    { model: Category_1.Category },],
            }
        ]
    });
    return (0, utility_1.successResponse)(res, "Successful", { product, store });
});
exports.getMarketFavourite = getMarketFavourite;
//# sourceMappingURL=market.js.map