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
exports.Transactions = exports.PaymentType = exports.TransactionDateType = exports.CreditType = exports.TransactionType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Users_1 = require("./Users");
const Wallet_1 = require("./Wallet");
const Jobs_1 = require("./Jobs");
var TransactionType;
(function (TransactionType) {
    TransactionType["DEBIT"] = "DEBIT";
    TransactionType["CREDIT"] = "CREDIT";
    TransactionType["NOTIFICATION"] = "NOTIFICATION";
    TransactionType["JOB"] = "JOB";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var CreditType;
(function (CreditType) {
    CreditType["FUNDING"] = "FUNDING";
    CreditType["EARNING"] = "EARNING";
    CreditType["WITHDRAWAL"] = "WITHDRAWAL";
    CreditType["PERCENT"] = "PERCENT";
    CreditType["NONE"] = "NONE";
})(CreditType || (exports.CreditType = CreditType = {}));
var TransactionDateType;
(function (TransactionDateType) {
    TransactionDateType["SINGLE_DATE"] = "SINGLE_DATE";
    TransactionDateType["THIS_MONTH"] = "THIS_MONTH";
    TransactionDateType["DATE_RANGE"] = "DATE_RANGE";
    TransactionDateType["MONTH"] = "MONTH";
    TransactionDateType["ALL"] = "ALL";
})(TransactionDateType || (exports.TransactionDateType = TransactionDateType = {}));
var PaymentType;
(function (PaymentType) {
    PaymentType["COMPLETE"] = "COMPLETE";
    PaymentType["PENDING"] = "PENDING";
    PaymentType["NONE"] = "NONE";
})(PaymentType || (exports.PaymentType = PaymentType = {}));
let Transactions = class Transactions extends sequelize_typescript_1.Model {
};
exports.Transactions = Transactions;
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Transactions.prototype, "ref", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Transactions.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Transactions.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(TransactionType.CREDIT, TransactionType.DEBIT, TransactionType.NOTIFICATION, TransactionType.JOB)),
    __metadata("design:type", String)
], Transactions.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(null),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(CreditType.FUNDING, CreditType.EARNING, CreditType.WITHDRAWAL, CreditType.PERCENT, CreditType.NONE)),
    __metadata("design:type", String)
], Transactions.prototype, "creditType", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Default)(PaymentType.NONE),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.ENUM(PaymentType.COMPLETE, PaymentType.PENDING, PaymentType.NONE)),
    __metadata("design:type", String)
], Transactions.prototype, "paid", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", Number)
], Transactions.prototype, "amount", void 0);
__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.BOOLEAN),
    __metadata("design:type", Boolean)
], Transactions.prototype, "read", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], Transactions.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.ForeignKey)(() => Jobs_1.Jobs),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", String)
], Transactions.prototype, "jobId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.ForeignKey)(() => Users_1.Users),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], Transactions.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(true),
    (0, sequelize_typescript_1.ForeignKey)(() => Wallet_1.Wallet),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], Transactions.prototype, "walletId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Jobs_1.Jobs, { onDelete: 'CASCADE' }),
    __metadata("design:type", Jobs_1.Jobs)
], Transactions.prototype, "job", void 0);
exports.Transactions = Transactions = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true, tableName: 'transactions' })
], Transactions);
//# sourceMappingURL=Transaction.js.map