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
exports.Dispute = exports.DisputeStatus = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Users_1 = require("./Users");
const Jobs_1 = require("./Jobs");
var DisputeStatus;
(function (DisputeStatus) {
    DisputeStatus["RESOLVED"] = "RESOLVED";
    DisputeStatus["PENDING"] = "PENDING";
    DisputeStatus["SUPERADMIN"] = "SUPERADMIN";
})(DisputeStatus || (exports.DisputeStatus = DisputeStatus = {}));
let Dispute = class Dispute extends sequelize_typescript_1.Model {
};
exports.Dispute = Dispute;
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Dispute.prototype, "cause", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(DisputeStatus.PENDING),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(DisputeStatus.RESOLVED, DisputeStatus.PENDING, DisputeStatus.SUPERADMIN)),
    __metadata("design:type", String)
], Dispute.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", Object)
], Dispute.prototype, "url", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Jobs_1.Jobs),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Dispute.prototype, "jobId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Users_1.Users),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Dispute.prototype, "reporterId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Users_1.Users),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Dispute.prototype, "partnerId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Jobs_1.Jobs, { onDelete: 'CASCADE' }),
    __metadata("design:type", Jobs_1.Jobs)
], Dispute.prototype, "job", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Users_1.Users, { onDelete: 'CASCADE', foreignKey: 'reporterId', as: 'reporter', }),
    __metadata("design:type", Users_1.Users)
], Dispute.prototype, "reporter", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Users_1.Users, { onDelete: 'CASCADE', foreignKey: 'partnerId', as: 'partner', }),
    __metadata("design:type", Users_1.Users)
], Dispute.prototype, "partner", void 0);
exports.Dispute = Dispute = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true, tableName: 'dispute' })
], Dispute);
//# sourceMappingURL=Dispute.js.map