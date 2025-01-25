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
exports.Chats = exports.chatStatus = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Users_1 = require("./Users");
const ChatMessage_1 = require("./ChatMessage");
var chatStatus;
(function (chatStatus) {
    chatStatus["READ"] = "READ";
    chatStatus["UNREAD"] = "UNREAD";
})(chatStatus || (exports.chatStatus = chatStatus = {}));
let Chats = class Chats extends sequelize_typescript_1.Model {
};
exports.Chats = Chats;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Users_1.Users),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Chats.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Users_1.Users),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Chats.prototype, "recieverId", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(chatStatus.UNREAD),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(chatStatus.UNREAD, chatStatus.READ)),
    __metadata("design:type", String)
], Chats.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(""),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Chats.prototype, "lastMessage", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Users_1.Users, { onDelete: 'CASCADE' }),
    __metadata("design:type", Users_1.Users)
], Chats.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Users_1.Users, { onDelete: 'CASCADE' }),
    __metadata("design:type", Users_1.Users)
], Chats.prototype, "reciever", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => ChatMessage_1.ChatMessage),
    __metadata("design:type", Array)
], Chats.prototype, "message", void 0);
exports.Chats = Chats = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true, tableName: 'chat' })
], Chats);
//# sourceMappingURL=Chats.js.map