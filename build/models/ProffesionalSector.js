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
exports.ProfessionalSector = exports.WorkType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Users_1 = require("./Users");
const Profession_1 = require("./Profession");
const Sector_1 = require("./Sector");
const Profile_1 = require("./Profile");
// export enum UserGender {
// 	MALE = 'MALE',
// 	FEMALE = 'FEMALE',
// 	OTHER = 'OTHER',
// }
var WorkType;
(function (WorkType) {
    WorkType["BUSY"] = "BUSY";
    WorkType["IDLE"] = "IDLE";
})(WorkType || (exports.WorkType = WorkType = {}));
let ProfessionalSector = class ProfessionalSector extends sequelize_typescript_1.Model {
};
exports.ProfessionalSector = ProfessionalSector;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Users_1.Users),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], ProfessionalSector.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.DECIMAL),
    __metadata("design:type", Object)
], ProfessionalSector.prototype, "chargeFrom", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Sector_1.Sector),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], ProfessionalSector.prototype, "sectorId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], ProfessionalSector.prototype, "yearsOfExp", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Object)
], ProfessionalSector.prototype, "default", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.ForeignKey)(() => Profession_1.Profession),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], ProfessionalSector.prototype, "professionId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.ForeignKey)(() => Profile_1.Profile),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], ProfessionalSector.prototype, "profileId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Profile_1.Profile, { onDelete: 'CASCADE' }),
    __metadata("design:type", Profile_1.Profile)
], ProfessionalSector.prototype, "profile", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Sector_1.Sector, { onDelete: 'CASCADE' }),
    __metadata("design:type", Sector_1.Sector)
], ProfessionalSector.prototype, "sector", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Profession_1.Profession, { onDelete: 'CASCADE' }),
    __metadata("design:type", Profession_1.Profession)
], ProfessionalSector.prototype, "profession", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Users_1.Users, { onDelete: 'CASCADE' }),
    __metadata("design:type", Users_1.Users)
], ProfessionalSector.prototype, "user", void 0);
exports.ProfessionalSector = ProfessionalSector = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true, tableName: 'professional_sector' })
], ProfessionalSector);
//# sourceMappingURL=ProffesionalSector.js.map