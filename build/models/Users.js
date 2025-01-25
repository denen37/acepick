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
exports.Users = exports.UserState = exports.UserStatus = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Profile_1 = require("./Profile");
const Wallet_1 = require("./Wallet");
const LanLog_1 = require("./LanLog");
const Jobs_1 = require("./Jobs");
const Review_1 = require("./Review");
const Education_1 = require("./Education");
const Experience_1 = require("./Experience");
const Porfolio_1 = require("./Porfolio");
const Certification_1 = require("./Certification");
const Dispute_1 = require("./Dispute");
const uuid_1 = require("uuid");
const Professional_1 = require("./Professional");
const Market_1 = require("./Market");
const ProffesionalSector_1 = require("./ProffesionalSector");
// export enum UserGender {
// 	MALE = 'MALE',
// 	FEMALE = 'FEMALE',
// 	OTHER = 'OTHER',
// }
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["INACTIVE"] = "INACTIVE";
    UserStatus["SUSPENDED"] = "SUSPENDED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var UserState;
(function (UserState) {
    UserState["STEP_ONE"] = "STEP_ONE";
    UserState["STEP_TWO"] = "STEP_TWO";
    UserState["STEP_THREE"] = "STEP_THREE";
    UserState["VERIFIED"] = "VERIFIED";
})(UserState || (exports.UserState = UserState = {}));
let Users = class Users extends sequelize_typescript_1.Model {
};
exports.Users = Users;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Default)(uuid_1.v4),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Users.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", String)
], Users.prototype, "setPin", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Users.prototype, "fcmToken", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Users.prototype, "phone", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(UserStatus.ACTIVE),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.SUSPENDED)),
    __metadata("design:type", String)
], Users.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(UserState.STEP_TWO),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(UserState.STEP_ONE, UserState.STEP_TWO, UserState.STEP_THREE, UserState.VERIFIED)),
    __metadata("design:type", String)
], Users.prototype, "state", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => Wallet_1.Wallet),
    __metadata("design:type", Wallet_1.Wallet)
], Users.prototype, "wallet", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => LanLog_1.LanLog),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Users.prototype, "locationId", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => LanLog_1.LanLog),
    __metadata("design:type", LanLog_1.LanLog)
], Users.prototype, "location", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => Profile_1.Profile),
    __metadata("design:type", Profile_1.Profile)
], Users.prototype, "profile", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => Professional_1.Professional),
    __metadata("design:type", Professional_1.Professional)
], Users.prototype, "professional", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => Market_1.MarketPlace),
    __metadata("design:type", Market_1.MarketPlace)
], Users.prototype, "marketPlace", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Jobs_1.Jobs, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Users.prototype, "job", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Review_1.Review, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Users.prototype, "review", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Education_1.Education, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Users.prototype, "education", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Experience_1.Experience, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Users.prototype, "experience", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Certification_1.Certification, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Users.prototype, "certification", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Porfolio_1.Porfolio, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Users.prototype, "porfolio", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Dispute_1.Dispute, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Users.prototype, "dispute", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => ProffesionalSector_1.ProfessionalSector, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Users.prototype, "professionalSector", void 0);
exports.Users = Users = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true, tableName: 'users' })
], Users);
//# sourceMappingURL=Users.js.map