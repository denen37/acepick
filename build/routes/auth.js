"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import packages
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const sms_1 = require("../services/sms");
const template_1 = require("../config/template");
const routes = (0, express_1.Router)();
/*************************************************************************
API CALL START
*************************************************************************/
// INDEX ROUTE TO SHOW API IS WORKING FINE.
routes.post('/send-otp', auth_1.sendOtp);
routes.get('/profile', auth_1.accountInfo);
routes.get('/switch', auth_1.swithAccount);
routes.get('/profile/:id', auth_1.accountSingleInfo);
routes.post('/update-profile', auth_1.updateProfile);
routes.post('/update-professional', auth_1.updateProfessional);
routes.get('/professional/profile', auth_1.ProfAccountInfo);
routes.post('/corperate', auth_1.ProfAccountInfo);
routes.post('/register', auth_1.register);
routes.post('/register-steptwo', auth_1.registerStepTwo);
routes.post('/prof-register-stepthree', auth_1.registerStepThree);
routes.post('/corperate-register', auth_1.corperateReg);
routes.post('/login', auth_1.login);
routes.post('/password-change', auth_1.passwordChange);
routes.post('/change-password', auth_1.changePassword);
routes.post('/verify-otp', auth_1.verifyOtp);
routes.post('/update-fcm-token', auth_1.updateFcmToken);
routes.post("/verify-bvn", auth_1.verifyBvnDetail);
routes.get("/delete-users", auth_1.deleteUsers);
// routes.get("/createCat", createCat)
routes.get('/send-email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, sms_1.sendEmailResend)('awardenen@gmail.com', 'Wecome to Acepick', (0, template_1.templateData)('<h1>Hi, Welcome to Acepick</h1>', 'Denen'), 'Denen');
        return {
            status: response === null || response === void 0 ? void 0 : response.status,
            message: response === null || response === void 0 ? void 0 : response.message
        };
    }
    catch (error) {
        return {
            status: 500,
            message: error
        };
    }
}));
exports.default = routes;
//# sourceMappingURL=auth.js.map