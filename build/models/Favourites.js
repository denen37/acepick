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
exports.Favourite = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Users_1 = require("./Users");
const Professional_1 = require("./Professional");
const Profile_1 = require("./Profile");
let Favourite = class Favourite extends sequelize_typescript_1.Model {
};
exports.Favourite = Favourite;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Users_1.Users),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Favourite.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Users_1.Users),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Favourite.prototype, "favouriteOwnerId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Professional_1.Professional),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Favourite.prototype, "professionalId", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(Profile_1.ProfileType.CLIENT),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(Profile_1.ProfileType.CLIENT, Profile_1.ProfileType.PROFESSIONAL, Profile_1.ProfileType.CORPERATE)),
    __metadata("design:type", String)
], Favourite.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Professional_1.Professional, { onDelete: 'CASCADE' }),
    __metadata("design:type", Professional_1.Professional)
], Favourite.prototype, "professional", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Users_1.Users, { onDelete: 'CASCADE' }),
    __metadata("design:type", Users_1.Users)
], Favourite.prototype, "user", void 0);
exports.Favourite = Favourite = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true, tableName: 'favourite' })
], Favourite);
//# sourceMappingURL=Favourites.js.map