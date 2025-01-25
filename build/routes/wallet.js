"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import packages
const express_1 = require("express");
const wallet_1 = require("../controllers/wallet");
const auth_1 = require("../controllers/auth");
const routes = (0, express_1.Router)();
/*************************************************************************
API CALL START
*************************************************************************/
// INDEX ROUTE TO SHOW API IS WORKING FINE.
routes.get('/wallet', wallet_1.getWallet);
routes.get('/trans', wallet_1.getLatestTransaction);
routes.get('/banks', wallet_1.getBank);
routes.post('/fund-wallet', wallet_1.fundWallet);
routes.post("/set-pin", wallet_1.setPin);
routes.post("/reset-pin", wallet_1.resetPin);
routes.post("/bank-name-query", wallet_1.bankNameQuery);
routes.post("/send-token", wallet_1.emailToken);
routes.post("/withdrawal", wallet_1.withdraw);
routes.post("/webhook", wallet_1.webhookPost);
routes.get("/booking-history", wallet_1.getTransactions);
routes.get("/earning-summary", auth_1.getEarningSummary);
routes.get("/user-bank", wallet_1.getBanks);
routes.post("/delete-bank", wallet_1.deleteBank);
routes.post("/create-bank", wallet_1.addBank);
routes.post("/update-bank", wallet_1.addBank);
routes.get("/notification", wallet_1.getUserTransaction);
routes.post("/read-notification", wallet_1.updateTransaction);
exports.default = routes;
//# sourceMappingURL=wallet.js.map