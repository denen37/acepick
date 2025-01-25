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
exports.Ticket = exports.ticketStatus = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Users_1 = require("./Users");
const TicketMessage_1 = require("./TicketMessage");
const Admin_1 = require("./Admin");
var ticketStatus;
(function (ticketStatus) {
    ticketStatus["WAITING"] = "WAITING";
    ticketStatus["ACTIVE"] = "ACTIVE";
    ticketStatus["CLOSED"] = "CLOSED";
})(ticketStatus || (exports.ticketStatus = ticketStatus = {}));
let Ticket = class Ticket extends sequelize_typescript_1.Model {
};
exports.Ticket = Ticket;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Users_1.Users),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Ticket.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(1),
    (0, sequelize_typescript_1.ForeignKey)(() => Admin_1.Admin),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Ticket.prototype, "adminId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Ticket.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Ticket.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(ticketStatus.WAITING),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(ticketStatus.ACTIVE, ticketStatus.CLOSED, ticketStatus.WAITING)),
    __metadata("design:type", String)
], Ticket.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(""),
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Ticket.prototype, "lastMessage", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.JSON),
    __metadata("design:type", Object)
], Ticket.prototype, "image", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Users_1.Users, { onDelete: 'CASCADE' }),
    __metadata("design:type", Users_1.Users)
], Ticket.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Admin_1.Admin, { onDelete: 'CASCADE' }),
    __metadata("design:type", Admin_1.Admin)
], Ticket.prototype, "admin", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => TicketMessage_1.TicketMessage),
    __metadata("design:type", Array)
], Ticket.prototype, "message", void 0);
exports.Ticket = Ticket = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true, tableName: 'ticket' })
], Ticket);
//# sourceMappingURL=Ticket.js.map