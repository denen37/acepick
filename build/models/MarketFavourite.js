"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketFavourite = exports.FavouriteType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Users_1 = require("./Users");
const Market_1 = require("./Market");
const Products_1 = require("./Products");
var FavouriteType;
(function (FavouriteType) {
    FavouriteType["PRODUCT"] = "PRODUCT";
    FavouriteType["STORE"] = "STORE";
})(FavouriteType || (exports.FavouriteType = FavouriteType = {}));
let MarketFavourite = class MarketFavourite extends sequelize_typescript_1.Model {
};
exports.MarketFavourite = MarketFavourite;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Users_1.Users),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], MarketFavourite.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Users_1.Users),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], MarketFavourite.prototype, "favouriteOwnerId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Market_1.MarketPlace),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], MarketFavourite.prototype, "marketPlaceId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Products_1.Product),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], MarketFavourite.prototype, "productId", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(FavouriteType.PRODUCT),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(FavouriteType.PRODUCT, FavouriteType.STORE)),
    __metadata("design:type", String)
], MarketFavourite.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Market_1.MarketPlace, { onDelete: 'CASCADE' }),
    __metadata("design:type", Market_1.MarketPlace)
], MarketFavourite.prototype, "marketPlace", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Products_1.Product, { onDelete: 'CASCADE' }),
    __metadata("design:type", Products_1.Product)
], MarketFavourite.prototype, "product", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Users_1.Users, { onDelete: 'CASCADE' }),
    __metadata("design:type", Users_1.Users)
], MarketFavourite.prototype, "user", void 0);
exports.MarketFavourite = MarketFavourite = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true, tableName: 'marketFavourite' })
], MarketFavourite);
//# sourceMappingURL=MarketFavourite.js.map