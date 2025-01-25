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
exports.Invite = exports.AdminRole = exports.InviteStatus = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
// export enum UserGender {
// 	MALE = 'MALE',
// 	FEMALE = 'FEMALE',
// 	OTHER = 'OTHER',
// }
var InviteStatus;
(function (InviteStatus) {
    InviteStatus["PENDING"] = "PENDING";
    InviteStatus["INACTIVE"] = "INACTIVE";
    InviteStatus["ACTIVE"] = "ACTIVE";
})(InviteStatus || (exports.InviteStatus = InviteStatus = {}));
var AdminRole;
(function (AdminRole) {
    AdminRole["SUPER"] = "SUPER";
    AdminRole["BILLING"] = "BILLING";
    AdminRole["SUPPORT"] = "SUPPORT";
    AdminRole["ANALYTICS"] = "ANALYTICS";
})(AdminRole || (exports.AdminRole = AdminRole = {}));
let Invite = class Invite extends sequelize_typescript_1.Model {
};
exports.Invite = Invite;
__decorate([
    (0, sequelize_typescript_1.Index)({ name: 'email-index', type: 'UNIQUE', unique: true }),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Invite.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(InviteStatus.PENDING),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(InviteStatus.ACTIVE, InviteStatus.INACTIVE, InviteStatus.PENDING)),
    __metadata("design:type", String)
], Invite.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Invite.prototype, "phone", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(AdminRole.SUPPORT),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(AdminRole.SUPER, AdminRole.SUPPORT, AdminRole.ANALYTICS, AdminRole.BILLING)),
    __metadata("design:type", String)
], Invite.prototype, "role", void 0);
exports.Invite = Invite = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true, tableName: 'invite' })
], Invite);
//# sourceMappingURL=Invite.js.map