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
exports.VoiceRecord = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Profile_1 = require("./Profile");
const Users_1 = require("./Users");
// export enum UserGender {
// 	MALE = 'MALE',
// 	FEMALE = 'FEMALE',
// 	OTHER = 'OTHER',
// }
// export enum JobStatus {
// 	COMPLETED = 'COMPLETED',
// 	DISPUTED = 'DISPUTED',
// 	PENDING = 'PENDING',
// 	REJECTED = 'REJECTED',
// }
let VoiceRecord = class VoiceRecord extends sequelize_typescript_1.Model {
};
exports.VoiceRecord = VoiceRecord;
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VoiceRecord.prototype, "url", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], VoiceRecord.prototype, "duration", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Users_1.Users),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], VoiceRecord.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Users_1.Users),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], VoiceRecord.prototype, "recieverId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Profile_1.Profile),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], VoiceRecord.prototype, "profileId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Users_1.Users, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE', }),
    (0, sequelize_typescript_1.ForeignKey)(() => Users_1.Users),
    __metadata("design:type", Users_1.Users)
], VoiceRecord.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Users_1.Users, { foreignKey: 'recieverId', as: 'reciever', onDelete: 'CASCADE', }),
    (0, sequelize_typescript_1.ForeignKey)(() => Users_1.Users),
    __metadata("design:type", Users_1.Users)
], VoiceRecord.prototype, "reciever", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Profile_1.Profile, { onDelete: 'CASCADE' }),
    __metadata("design:type", Profile_1.Profile)
], VoiceRecord.prototype, "profile", void 0);
exports.VoiceRecord = VoiceRecord = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true, tableName: 'voicerecord' })
], VoiceRecord);
//# sourceMappingURL=VoiceRecording.js.map