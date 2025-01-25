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
exports.getEarningSummary = exports.verifyBvnDetail = exports.postlocationData = exports.accountSingleInfo = exports.accountInfo = exports.ProfAccountInfo = exports.adminLogin = exports.resetPassword = exports.changePassword = exports.updateFcmToken = exports.swithAccount = exports.corperateReg = exports.registerStepThree = exports.registerStepTwo = exports.deleteUsers = exports.login = exports.sendDisputeMessage = exports.passwordChange = exports.register = exports.verifyOtp = exports.sendOtp = exports.updateProfessional = exports.updateProfile = void 0;
const utility_1 = require("../helpers/utility");
const Verify_1 = require("../models/Verify");
const sms_1 = require("../services/sms");
const Users_1 = require("../models/Users");
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const Profile_1 = require("../models/Profile");
const Professional_1 = require("../models/Professional");
const Wallet_1 = require("../models/Wallet");
const LanLog_1 = require("../models/LanLog");
const Admin_1 = require("../models/Admin");
const Sector_1 = require("../models/Sector");
const Profession_1 = require("../models/Profession");
const Cooperation_1 = require("../models/Cooperation");
const Review_1 = require("../models/Review");
const bvn_1 = require("../services/bvn");
const string_similarity_1 = require("string-similarity");
// yarn add stream-chat
const stream_chat_1 = require("stream-chat");
const Jobs_1 = require("../models/Jobs");
const Education_1 = require("../models/Education");
const Certification_1 = require("../models/Certification");
const Experience_1 = require("../models/Experience");
const Porfolio_1 = require("../models/Porfolio");
const Dispute_1 = require("../models/Dispute");
const Transaction_1 = require("../models/Transaction");
const sequelize_typescript_1 = require("sequelize-typescript");
const redis_1 = require("../services/redis");
const ProffesionalSector_1 = require("../models/ProffesionalSector");
const sequelize_1 = require("sequelize");
const expo_1 = require("../services/expo");
// instantiate your stream client using the API key and secret
// the secret is only used server side and gives you full access to the API
const serverClient = stream_chat_1.StreamChat.getInstance('zzfb7h72xhc5', '5pfxakc5zasma3hw9awd2qsqgk2fxyr4a5qb3au4kkdt27d7ttnca7vnusfuztud');
// you can still use new StreamChat('api_key', 'api_secret');
// generate a token for the user with id 'john'
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { postalCode, lga, state, address, avatar } = req.body;
    let { id } = req.user;
    const profile = yield Profile_1.Profile.findOne({ where: { id } });
    if (!(profile === null || profile === void 0 ? void 0 : profile.verified))
        return (0, utility_1.errorResponse)(res, "Verify your bvn");
    yield (profile === null || profile === void 0 ? void 0 : profile.update({
        lga: lga !== null && lga !== void 0 ? lga : profile.lga,
        avatar: avatar !== null && avatar !== void 0 ? avatar : profile.avatar,
        state: state !== null && state !== void 0 ? state : profile.state,
        address: address !== null && address !== void 0 ? address : profile.address,
    }));
    const updated = yield Profile_1.Profile.findOne({ where: { id } });
    return (0, utility_1.successResponse)(res, "Updated Successfully", updated);
});
exports.updateProfile = updateProfile;
const updateProfessional = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { intro, language } = req.body;
    let { id } = req.user;
    const professional = yield Professional_1.Professional.findOne({ where: { userId: id } });
    yield (professional === null || professional === void 0 ? void 0 : professional.update({
        intro: intro !== null && intro !== void 0 ? intro : professional.intro,
        language: language !== null && language !== void 0 ? language : professional.language
    }));
    const updated = yield Professional_1.Professional.findOne({ where: { userId: id } });
    return (0, utility_1.successResponse)(res, "Updated Successfully", updated);
});
exports.updateProfessional = updateProfessional;
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phone, type } = req.body;
    const serviceId = (0, utility_1.randomId)(12);
    const codeEmail = String(Math.floor(1000 + Math.random() * 9000));
    const codeSms = String(Math.floor(1000 + Math.random() * 9000));
    if (type == Verify_1.VerificationType.BOTH) {
        yield Verify_1.Verify.create({
            serviceId,
            code: codeSms
        });
        yield Verify_1.Verify.create({
            serviceId,
            code: codeEmail
        });
        const smsResult = yield (0, sms_1.sendSMS)(phone, codeSms.toString());
        const emailResult = yield (0, sms_1.sendEmailResend)(email, "Email Verification", `Dear User,<br><br>
  
    Thank you for choosing our service. To complete your registration and ensure the security of your account, please use the verification code below<br><br>
    
    Verification Code: ${codeEmail}<br><br>
    
    Please enter this code on our website/app to proceed with your registration process. If you did not initiate this action, please ignore this email.<br><br>`);
        if (smsResult.status && (emailResult === null || emailResult === void 0 ? void 0 : emailResult.status))
            return (0, utility_1.successResponse)(res, "Successful", Object.assign(Object.assign({}, smsResult), { serviceId }));
        return (0, utility_1.errorResponse)(res, "Failed", emailResult);
    }
    else if (type == Verify_1.VerificationType.SMS) {
        yield Verify_1.Verify.create({
            serviceId,
            code: codeSms
        });
        const smsResult = yield (0, sms_1.sendSMS)(phone, codeSms.toString());
        if (smsResult.status)
            return (0, utility_1.successResponse)(res, "Successful", Object.assign(Object.assign({}, smsResult), { serviceId }));
        return (0, utility_1.errorResponse)(res, "Failed", smsResult);
    }
    else if (type == Verify_1.VerificationType.EMAIL) {
        yield Verify_1.Verify.create({
            serviceId,
            code: codeEmail
        });
        const emailResult = yield (0, sms_1.sendEmailResend)(email, "Email Verification", `Dear User,<br><br>
  
    Thank you for choosing our service. To complete your registration and ensure the security of your account, please use the verification code below<br><br>
    
    Verification Code: ${codeEmail}<br><br>
    
    Please enter this code on our website/app to proceed with your registration process. If you did not initiate this action, please ignore this email.<br><br>
    
`);
        if (emailResult === null || emailResult === void 0 ? void 0 : emailResult.status)
            return (0, utility_1.successResponse)(res, "Successful", Object.assign(Object.assign({}, emailResult), { serviceId }));
        return (0, utility_1.errorResponse)(res, "Failed", emailResult);
    }
    else {
        // const secret_key = createRandomRef(12, "ace_pick")
        yield Verify_1.Verify.create({
            serviceId,
            code: codeEmail,
            client: email
        });
        const emailResult = yield (0, sms_1.sendEmailResend)(email, "Email Verification", `Dear User,<br><br>
  
    Thank you for choosing our service. To complete your registration and ensure the security of your account, please use the verification code below<br><br>
    
    Verification Code: ${codeEmail}<br><br>
    
    Please enter this code on our website/app to proceed with your registration process. If you did not initiate this action, please ignore this email.<br><br>
    
 `);
        if (emailResult === null || emailResult === void 0 ? void 0 : emailResult.status)
            return (0, utility_1.successResponse)(res, "Successful", Object.assign(Object.assign({}, emailResult), { emailServiceId: serviceId }));
        return (0, utility_1.errorResponse)(res, "Failed", emailResult);
    }
});
exports.sendOtp = sendOtp;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { emailServiceId, smsServiceId, smsCode, emailCode, type } = req.body;
    if (type === "RESET") {
        const verifyEmail = yield Verify_1.Verify.findOne({
            where: {
                serviceId: emailServiceId
            }
        });
        if (verifyEmail) {
            if (verifyEmail.code === emailCode) {
                const verifyEmailResult = yield Verify_1.Verify.findOne({ where: { id: verifyEmail.id } });
                yield (verifyEmailResult === null || verifyEmailResult === void 0 ? void 0 : verifyEmailResult.destroy());
                return (0, utility_1.successResponse)(res, "Successful", {
                    message: "successful",
                    status: true
                });
            }
            else {
                (0, utility_1.errorResponse)(res, "Failed", {
                    message: "Invalid Email Code",
                    status: false
                });
            }
        }
        else {
            (0, utility_1.errorResponse)(res, "Failed", {
                message: `Email Code Already Used`,
                status: false
            });
        }
    }
    else if (type === "ADMIN") {
        const verifyEmail = yield Verify_1.Verify.findOne({
            where: {
                serviceId: emailServiceId
            }
        });
        if (verifyEmail) {
            if (verifyEmail.code === emailCode) {
                const verifyEmailResult = yield Verify_1.Verify.findOne({ where: { id: verifyEmail.id } });
                yield (verifyEmailResult === null || verifyEmailResult === void 0 ? void 0 : verifyEmailResult.destroy());
                return (0, utility_1.successResponse)(res, "Successful", {
                    message: "successful",
                    status: true
                });
            }
            else {
                (0, utility_1.errorResponse)(res, "Failed", {
                    message: `Invalid Email Code`,
                    status: false
                });
            }
        }
        else {
            (0, utility_1.errorResponse)(res, "Failed", {
                message: `Email Code Already Used`,
                status: false
            });
        }
    }
    else if (type === "PIN") {
        const verifyEmail = yield Verify_1.Verify.findOne({
            where: {
                serviceId: emailServiceId
            }
        });
        if (verifyEmail) {
            if (verifyEmail.code === emailCode) {
                const verifyEmailResult = yield Verify_1.Verify.findOne({ where: { id: verifyEmail.id } });
                yield (verifyEmailResult === null || verifyEmailResult === void 0 ? void 0 : verifyEmailResult.destroy());
                return (0, utility_1.successResponse)(res, "Successful", {
                    message: "successful",
                    status: true
                });
            }
            else {
                (0, utility_1.errorResponse)(res, "Failed", {
                    message: `Invalid ${"Email"} Code`,
                    status: false
                });
            }
        }
        else {
            (0, utility_1.errorResponse)(res, "Failed", {
                message: `${"Email"} Code Already Used`,
                status: false
            });
        }
    }
    else {
        // const verifySms = await  Verify.findOne({
        //   where:{
        //     serviceId:  smsServiceId
        //   }
        //  })
        const verifyEmail = yield Verify_1.Verify.findOne({
            where: {
                serviceId: emailServiceId
            }
        });
        if (
        // verifySms && 
        verifyEmail) {
            if (
            // verifySms.code === smsCode &&
            verifyEmail.code === emailCode) {
                //   const verifySmsResult =  await Verify.findOne({ where:{ id: verifySms.id} })
                //  await  verifySmsResult?.destroy()
                const verifyEmailResult = yield Verify_1.Verify.findOne({ where: { id: verifyEmail.id } });
                yield (verifyEmailResult === null || verifyEmailResult === void 0 ? void 0 : verifyEmailResult.destroy());
                return (0, utility_1.successResponse)(res, "Successful", {
                    message: "successful",
                    status: true
                });
            }
            else {
                (0, utility_1.errorResponse)(res, "Failed", {
                    message: `Invalid ${
                    // !verifySms?"SmS":
                    "Email"} Code`,
                    status: false
                });
            }
        }
        else {
            (0, utility_1.errorResponse)(res, "Failed", {
                message: `${
                // !verifySms?"SmS":
                "Email"} Code Already Used`,
                status: false
            });
        }
    }
});
exports.verifyOtp = verifyOtp;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phone, password } = req.body;
    (0, bcryptjs_1.hash)(password, utility_1.saltRounds, function (err, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const userEmail = yield Users_1.Users.findOne({ where: { email } });
            const userPhone = yield Users_1.Users.findOne({ where: { phone } });
            if (!(0, utility_1.validateEmail)(email))
                return (0, utility_1.successResponseFalse)(res, "Failed", { status: false, message: "Enter a valid email" });
            if (userPhone || userEmail) {
                if ((userEmail === null || userEmail === void 0 ? void 0 : userEmail.state) === Users_1.UserState.VERIFIED || (userPhone === null || userPhone === void 0 ? void 0 : userPhone.state) === Users_1.UserState.VERIFIED) {
                    if (userPhone)
                        return (0, utility_1.successResponseFalse)(res, "Failed", { status: false, message: "Phone already exist", state: userPhone.state });
                    if (userEmail)
                        return (0, utility_1.successResponseFalse)(res, "Failed", { status: false, message: "Email already exist", state: userEmail.state });
                }
                else {
                    yield (userEmail === null || userEmail === void 0 ? void 0 : userEmail.destroy());
                    const user = yield Users_1.Users.create({
                        email, phone, password: hashedPassword
                    });
                    const wallet = yield Wallet_1.Wallet.create({ userId: user.id });
                    // await user.update({ walletId: wallet.id })
                    const emailServiceId = (0, utility_1.randomId)(12);
                    const codeEmail = String(Math.floor(1000 + Math.random() * 9000));
                    yield Verify_1.Verify.create({
                        serviceId: emailServiceId,
                        code: codeEmail,
                        client: email,
                        secret_key: (0, utility_1.createRandomRef)(12, "ace_pick"),
                    });
                    const emailResult = yield (0, sms_1.sendEmailResend)(user.email, "Email Verification", `Dear User,<br><br>
      
        Thank you for choosing our service. To complete your registration and ensure the security of your account, please use the verification code below<br><br>
        
        Verification Code: ${codeEmail}<br><br>
        
        Please enter this code on our website/app to proceed with your registration process. If you did not initiate this action, please ignore this email.<br><br>
        
    `);
                    let token = (0, jsonwebtoken_1.sign)({ id: user.id, email: user.email }, utility_1.TOKEN_SECRET);
                    const chatToken = serverClient.createToken(`${String(user.id)}`);
                    const profile = yield Profile_1.Profile.findOne({ where: { userId: user.id } });
                    const response = yield serverClient.upsertUsers([{
                            id: String(user.id),
                            role: 'admin',
                            mycustomfield: {
                                email: `${user.email}`,
                                accountType: profile === null || profile === void 0 ? void 0 : profile.type,
                                userId: String(user.id),
                            }
                        }]);
                    return (0, utility_1.successResponse)(res, "Successful", {
                        status: true,
                        message: {
                            email, phone, token, emailServiceId, chatToken
                        }
                    });
                }
            }
            else {
                const user = yield Users_1.Users.create({
                    email, phone, password: hashedPassword
                });
                const wallet = yield Wallet_1.Wallet.create({ userId: user.id });
                // await user.update({ walletId: wallet.id })
                const emailServiceId = (0, utility_1.randomId)(12);
                const codeEmail = String(Math.floor(1000 + Math.random() * 9000));
                yield Verify_1.Verify.create({
                    serviceId: emailServiceId,
                    code: codeEmail,
                    client: email,
                    secret_key: (0, utility_1.createRandomRef)(12, "ace_pick"),
                });
                const emailResult = yield (0, sms_1.sendEmailResend)(user.email, "Email Verification", `Dear User,<br><br>
    
      Thank you for choosing our service. To complete your registration and ensure the security of your account, please use the verification code below<br><br>
      
      Verification Code: ${codeEmail}<br><br>
      
      Please enter this code on our website/app to proceed with your registration process. If you did not initiate this action, please ignore this email.<br><br>
      
    `);
                let token = (0, jsonwebtoken_1.sign)({ id: user.id, email: user.email }, utility_1.TOKEN_SECRET);
                const chatToken = serverClient.createToken(`${String(user.id)}`);
                const profile = yield Profile_1.Profile.findOne({ where: { userId: user.id } });
                const response = yield serverClient.upsertUsers([{
                        id: String(user.id),
                        role: 'admin',
                        mycustomfield: {
                            email: `${user.email}`,
                            accountType: profile === null || profile === void 0 ? void 0 : profile.type,
                            userId: String(user.id),
                        }
                    }]);
                return (0, utility_1.successResponse)(res, "Successful", {
                    status: true,
                    message: {
                        email, phone, token, emailServiceId, chatToken
                    }
                });
            }
        });
    });
});
exports.register = register;
const passwordChange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { password, newPassword } = req.body;
    const { id } = req.user;
    const user = yield Users_1.Users.findOne({ where: { id } });
    if (!user)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "User does not exist" });
    const match = yield (0, bcryptjs_1.compare)(password, user.password);
    if (!match)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Invalid Password" });
    (0, bcryptjs_1.hash)(newPassword, utility_1.saltRounds, function (err, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user.update({ password: hashedPassword });
            let token = (0, jsonwebtoken_1.sign)({ id: user.id, email: user.email }, utility_1.TOKEN_SECRET);
            return (0, utility_1.successResponse)(res, "Successful", { status: true, message: Object.assign(Object.assign({}, user.dataValues), { token }) });
        });
    });
});
exports.passwordChange = passwordChange;
const sendDisputeMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, body } = req.body;
    const user = yield Users_1.Users.findOne({ where: { id: userId } });
    if (!user)
        return (0, utility_1.successResponse)(res, "User not Found");
    const profile = yield Profile_1.Profile.findOne({ where: { userId } });
    (profile === null || profile === void 0 ? void 0 : profile.fcmToken) == null ? null : (0, expo_1.sendExpoNotification)(profile.fcmToken, body);
    (0, sms_1.sendEmailResend)(user.email, "Dispute: Admin", `<p>${body}</p>`);
    return (0, utility_1.successResponse)(res, "Successful");
});
exports.sendDisputeMessage = sendDisputeMessage;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password, type, fcmToken } = req.body;
    const user = yield Users_1.Users.findOne({ where: { email } });
    if (!user)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "User does not exist" });
    const match = yield (0, bcryptjs_1.compare)(password, user.password);
    if (!match)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Invalid Credentials" });
    let token = (0, jsonwebtoken_1.sign)({ id: user.id, email: user.email }, utility_1.TOKEN_SECRET);
    const chatToken = serverClient.createToken(`${String(user.id)}`);
    const profile = yield Profile_1.Profile.findOne({ where: { userId: user.id } });
    yield (profile === null || profile === void 0 ? void 0 : profile.update({ fcmToken }));
    const profileUpdated = yield Profile_1.Profile.findOne({ where: { userId: user.id } });
    // profile?.fcmToken == null ? null : sendExpoNotification(profileUpdated!.fcmToken, "hello world");
    if ((profile === null || profile === void 0 ? void 0 : profile.type) == Profile_1.ProfileType.CLIENT) {
        if (type == (profile === null || profile === void 0 ? void 0 : profile.type)) {
            const response = yield serverClient.upsertUsers([{
                    id: String(user.id),
                    role: 'admin',
                    mycustomfield: {
                        email: `${user.email}`,
                        accountType: profile === null || profile === void 0 ? void 0 : profile.type,
                        userId: String(user.id),
                    }
                }]);
            return (0, utility_1.successResponse)(res, "Successful", { status: true, message: Object.assign(Object.assign({}, user.dataValues), { token, chatToken }) });
        }
        else {
            return (0, utility_1.successResponseFalse)(res, "Cannot access Client account");
        }
    }
    else {
        if (type == (profile === null || profile === void 0 ? void 0 : profile.type)) {
            const professionalProfile = yield Professional_1.Professional.findAll({
                order: [
                    ['id', 'DESC']
                ],
                include: [
                    { model: Cooperation_1.Corperate },
                    {
                        model: Profile_1.Profile,
                        where: { userId: profile === null || profile === void 0 ? void 0 : profile.userId },
                        include: [
                            {
                                model: Users_1.Users,
                                attributes: [
                                    'createdAt', 'updatedAt', "email", "phone"
                                ],
                                include: [{
                                        model: Wallet_1.Wallet,
                                        where: {
                                            type: Wallet_1.WalletType.PROFESSIONAL
                                        }
                                    },
                                    {
                                        model: Education_1.Education,
                                    },
                                    {
                                        model: Certification_1.Certification,
                                    },
                                    {
                                        model: Experience_1.Experience,
                                    },
                                    {
                                        model: Porfolio_1.Porfolio,
                                        order: [
                                            ['id', 'DESC'],
                                        ],
                                    },
                                ]
                            },
                        ],
                    }
                ],
            });
            let data = (0, utility_1.deleteKey)(professionalProfile[0].dataValues, "profile", "corperate");
            let mergedObj = {
                profile: professionalProfile[0].dataValues.profile,
                professional: Object.assign({}, data),
                corperate: professionalProfile[0].dataValues.corperate,
            };
            const response = yield serverClient.upsertUsers([{
                    id: String(user.id),
                    role: 'admin',
                    // mycustomfield: {
                    //   email: `${user.email}`,
                    //   accountType: profile?.type,
                    //   data: mergedObj
                    // }
                }]);
            return (0, utility_1.successResponse)(res, "Successful", { status: true, message: Object.assign(Object.assign({}, user.dataValues), { token, chatToken }) });
        }
        else {
            return (0, utility_1.successResponseFalse)(res, "Cannot access Professional account");
        }
    }
});
exports.login = login;
const deleteUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Users_1.Users.findAll({});
    let index = 0;
    for (let value of user) {
        yield value.destroy();
        index++;
    }
    if (index == user.length) {
        return (0, utility_1.successResponse)(res, "Successful");
    }
});
exports.deleteUsers = deleteUsers;
const registerStepTwo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { fullName, lga, state, bvn, address, type, avatar } = req.body;
    let { id } = req.user;
    console.log(req.body);
    const user = yield Users_1.Users.findOne({ where: { id } });
    const profile = yield Profile_1.Profile.findOne({ where: { userId: id } });
    if (profile)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Profile Already Exist" });
    const profileCreate = yield Profile_1.Profile.create({ fullName, lga, state, bvn, address, type, userId: id, avatar: (0, utility_1.convertHttpToHttps)(avatar) });
    const profileX = yield Profile_1.Profile.findOne({ where: { userId: id } });
    yield (0, sms_1.sendEmailResend)(user.email, "Welcome to Acepick", `Welcome on board ${profileX.fullName},<br><br> we are pleased to have you on Acepick, please validate your account by providing your BVN to get accessible to all features on Acepick.<br><br> Thanks.`);
    yield (user === null || user === void 0 ? void 0 : user.update({ state: Profile_1.ProfileType.CLIENT ? Users_1.UserState.VERIFIED : Users_1.UserState.STEP_THREE }));
    (0, utility_1.successResponse)(res, "Successful", { status: true, message: profileCreate });
});
exports.registerStepTwo = registerStepTwo;
const registerStepThree = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { intro, regNum, experience, sectorId, professionId, chargeFrom } = req.body;
    let { id } = req.user;
    const user = yield Users_1.Users.findOne({ where: { id } });
    const professional = yield Professional_1.Professional.findOne({ where: { userId: id } });
    if (professional)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Professional Already Exist" });
    const profile = yield Profile_1.Profile.findOne({ where: { userId: id } });
    const professionalCreate = yield Professional_1.Professional.create({
        profileId: profile === null || profile === void 0 ? void 0 : profile.id, intro, regNum, yearsOfExp: experience, chargeFrom,
        file: { images: [] }, userId: id
    });
    const wallet = yield Wallet_1.Wallet.create({ userId: user === null || user === void 0 ? void 0 : user.id, type: Wallet_1.WalletType.PROFESSIONAL });
    yield ProffesionalSector_1.ProfessionalSector.create({
        userId: id, sectorId, professionId, profileId: profile === null || profile === void 0 ? void 0 : profile.id,
        yearsOfExp: experience, default: true, chargeFrom
    });
    yield (profile === null || profile === void 0 ? void 0 : profile.update({ type: Profile_1.ProfileType.PROFESSIONAL, corperate: false, switch: true }));
    yield (user === null || user === void 0 ? void 0 : user.update({ state: Users_1.UserState.VERIFIED }));
    (0, utility_1.successResponse)(res, "Successful", professionalCreate);
});
exports.registerStepThree = registerStepThree;
const corperateReg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { nameOfOrg, phone, address, state, lga, postalCode, regNum, noOfEmployees } = req.body;
    let { id } = req.user;
    const user = yield Users_1.Users.findOne({ where: { id } });
    const corperate = yield Cooperation_1.Corperate.findOne({ where: { userId: id } });
    if (corperate)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Coorperate Account Already Exist" });
    const profile = yield Profile_1.Profile.findOne({ where: { userId: id } });
    const coorperateCreate = yield Cooperation_1.Corperate.create({
        nameOfOrg, phone, address, state, lga, postalCode, regNum, noOfEmployees, profileId: profile === null || profile === void 0 ? void 0 : profile.id,
        userId: id
    });
    const prof = yield Professional_1.Professional.findOne({ where: { userId: id } });
    yield (profile === null || profile === void 0 ? void 0 : profile.update({ corperate: true, fullName: nameOfOrg }));
    yield (prof === null || prof === void 0 ? void 0 : prof.update({ corperateId: coorperateCreate.id }));
    yield (user === null || user === void 0 ? void 0 : user.update({ state: Users_1.UserState.VERIFIED }));
    (0, utility_1.successResponse)(res, "Successful", coorperateCreate);
});
exports.corperateReg = corperateReg;
const swithAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = req.user;
    let { type } = req.query;
    const profile = yield Profile_1.Profile.findOne({ where: { userId: id } });
    if (type == Profile_1.ProfileType.CLIENT) {
        yield (profile === null || profile === void 0 ? void 0 : profile.update({ type: Profile_1.ProfileType.CLIENT }));
        return (0, utility_1.successResponse)(res, "Successful");
    }
    else {
        if ((profile === null || profile === void 0 ? void 0 : profile.corperate) == null) {
            return (0, utility_1.successResponseFalse)(res, "Completed Proffesional account setup");
        }
        else {
            yield (profile === null || profile === void 0 ? void 0 : profile.update({ type: Profile_1.ProfileType.PROFESSIONAL }));
            return (0, utility_1.successResponse)(res, "Successful");
        }
    }
});
exports.swithAccount = swithAccount;
const updateFcmToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { token } = req.body;
    let { id } = req.user;
    const user = yield Users_1.Users.findOne({ where: { id } });
    yield (user === null || user === void 0 ? void 0 : user.update({ fcmToken: token }));
    (0, utility_1.successResponse)(res, "Successful", token);
});
exports.updateFcmToken = updateFcmToken;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, code, emailServiceId } = req.body;
    const verify = yield Verify_1.Verify.findOne({
        where: {
            code,
            serviceId: emailServiceId,
            used: false
        }
    });
    if (!verify)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Invalid Code" });
    (0, bcryptjs_1.hash)(password, utility_1.saltRounds, function (err, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users_1.Users.findOne({ where: { email: verify.client } });
            user === null || user === void 0 ? void 0 : user.update({ password: hashedPassword });
            let token = (0, jsonwebtoken_1.sign)({ id: user.id, email: user.email, admin: true }, utility_1.TOKEN_SECRET);
            yield verify.destroy();
            return (0, utility_1.successResponse)(res, "Successful", Object.assign(Object.assign({}, user === null || user === void 0 ? void 0 : user.dataValues), { token }));
        });
    });
});
exports.changePassword = changePassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword, oldPassword } = req.body;
    const { id } = req.admin;
    const user = yield Admin_1.Admin.findOne({
        where: {
            id
        }
    });
    const match = yield (0, bcryptjs_1.compare)(oldPassword, user.password);
    if (!match)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Invalid Password" });
    (0, bcryptjs_1.hash)(newPassword, utility_1.saltRounds, function (err, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            user === null || user === void 0 ? void 0 : user.update({ password: hashedPassword, firstTimer: false, status: Users_1.UserStatus.ACTIVE });
            let token = (0, jsonwebtoken_1.sign)({ id: user.id, email: user.email, admin: true }, utility_1.TOKEN_SECRET);
            return (0, utility_1.successResponse)(res, "Password Updated", Object.assign(Object.assign({}, user === null || user === void 0 ? void 0 : user.dataValues), { token }));
        });
    });
});
exports.resetPassword = resetPassword;
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    const admin = yield Admin_1.Admin.findOne({ where: { email } });
    if (!admin)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "User does not exist" });
    const match = yield (0, bcryptjs_1.compare)(password, admin.password);
    if (!match)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Invalid Credentials" });
    let token = (0, jsonwebtoken_1.sign)({ id: admin.id, email: admin.email, admin: true }, utility_1.TOKEN_SECRET);
    return (0, utility_1.successResponse)(res, "Successful", { status: true, message: Object.assign(Object.assign({}, admin.dataValues), { token }) });
});
exports.adminLogin = adminLogin;
const ProfAccountInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.user;
    const profile = yield Professional_1.Professional.findOne({
        where: { userId: id },
        attributes: {
            exclude: []
        },
        include: [
            {
                model: Users_1.Users,
                attributes: [
                    "email", "phone"
                ], include: [{
                        model: Wallet_1.Wallet,
                        where: {
                            type: Wallet_1.WalletType.PROFESSIONAL
                        }
                    }]
            },
            {
                model: Cooperation_1.Corperate,
            },
            {
                model: Profile_1.Profile,
                attributes: [
                    'createdAt', 'updatedAt', "fullName", "avatar", "lga", "state", "address", "bvn", "type"
                ],
                include: [{
                        model: ProffesionalSector_1.ProfessionalSector, include: [
                            { model: Sector_1.Sector },
                            { model: Profession_1.Profession },
                        ]
                    },]
            }
        ],
    });
    if (!profile)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Profile Does'nt exist" });
    return (0, utility_1.successResponse)(res, "Successful", profile);
});
exports.ProfAccountInfo = ProfAccountInfo;
const accountInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.user;
    const profileX = yield Profile_1.Profile.findOne({
        where: { userId: id },
        include: [{
                model: Users_1.Users,
                attributes: [
                    'createdAt', 'updatedAt', "email", "phone"
                ], include: [{
                        model: Wallet_1.Wallet,
                    },
                    { model: Dispute_1.Dispute }
                ]
            }
        ],
    });
    if (!profileX)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Profile Does'nt exist" });
    if ((profileX === null || profileX === void 0 ? void 0 : profileX.type) == Profile_1.ProfileType.CLIENT) {
        const canceledJob = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.CANCEL,
                userId: [id],
            }
        });
        const ongoingJob = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.ONGOING,
                userId: [id],
            }
        });
        const completedJob = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.COMPLETED,
                userId: [id],
            }
        });
        const rejectedJob = yield Jobs_1.Jobs.findAll({
            where: {
                status: [Jobs_1.JobStatus.REJECTED, Jobs_1.JobStatus.DISPUTED],
                userId: [id],
            }
        });
        const pendingJob = yield Jobs_1.Jobs.findAll({
            where: {
                // status: [JobStatus.PENDING, JobStatus.INVOICE],
                status: [Jobs_1.JobStatus.PENDING],
                userId: [id],
            }
        });
        const review = yield Review_1.Review.findAll({
            where: {
                clientUserId: id
            },
            include: [{
                    model: Users_1.Users, as: "user",
                    attributes: ["id"], include: [{ model: Profile_1.Profile, attributes: ["fullName", "avatar"] }]
                }]
        });
        const disputes = yield Dispute_1.Dispute.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { reporterId: id },
                    { partnerId: id }
                ]
            }
        });
        const all_transactions = yield Transaction_1.Transactions.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: {
                userId: id,
                type: Transaction_1.TransactionType.DEBIT,
            },
            attributes: [[sequelize_typescript_1.Sequelize.literal('SUM(amount)'), 'result']],
        });
        yield profileX.update({
            totalExpense: (_a = all_transactions[0].dataValues.result) !== null && _a !== void 0 ? _a : 0,
            totalReview: review.length, totalJobCanceled: canceledJob.length, totalDisputes: disputes.length,
            totalOngoingHire: ongoingJob.length, totalCompletedHire: completedJob.length, totalJobRejected: rejectedJob.length,
            totalPendingHire: pendingJob.length,
        });
        const profile = yield Profile_1.Profile.findOne({
            where: { userId: id },
            include: [{
                    model: Users_1.Users,
                    attributes: [
                        'createdAt', 'updatedAt', "email", "phone"
                    ],
                    include: [{
                            model: Wallet_1.Wallet,
                            where: {
                                type: Wallet_1.WalletType.CLIENT
                            }
                        },
                        {
                            model: Review_1.Review,
                            order: [
                                ['id', 'DESC'],
                            ],
                            limit: 4,
                        },
                        { model: Dispute_1.Dispute }
                    ]
                }
            ],
        });
        return (0, utility_1.successResponse)(res, "Successful", {
            profile: profile,
            professional: null,
            corperate: null,
            review: review.slice(0, 4)
        });
    }
    else {
        const canceledJob = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.CANCEL,
                ownerId: [id],
            }
        });
        const ongoingJob = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.ONGOING,
                ownerId: [id],
            }
        });
        const pendingJob = yield Jobs_1.Jobs.findAll({
            where: {
                status: [Jobs_1.JobStatus.PENDING, Jobs_1.JobStatus.INVOICE],
                ownerId: [id],
            }
        });
        const rejectedJob = yield Jobs_1.Jobs.findAll({
            where: {
                status: [Jobs_1.JobStatus.REJECTED, Jobs_1.JobStatus.DISPUTED],
                ownerId: [id],
            }
        });
        const completedJob = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.COMPLETED,
                ownerId: [id],
            }
        });
        const rejectedAmount = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.CANCEL
            }, attributes: [[sequelize_typescript_1.Sequelize.literal('COALESCE(SUM(total), 0.0)'), 'result']],
        });
        const completedAmount = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.COMPLETED,
            }, attributes: [[sequelize_typescript_1.Sequelize.literal('COALESCE(SUM(total), 0.0)'), 'result']]
        });
        const wallet = yield Wallet_1.Wallet.findOne({
            where: {
                userId: id,
                type: Wallet_1.WalletType.PROFESSIONAL
            }
        });
        const updateProffessionalProfile = yield Professional_1.Professional.findOne({ where: { userId: id } });
        const review = yield Review_1.Review.findAll({
            where: {
                proffesionalUserId: id
            },
            include: [{
                    model: Users_1.Users, as: "user",
                    attributes: ["id"], include: [{ model: Profile_1.Profile, attributes: ["fullName", "avatar"] }]
                }]
        });
        const disputes = yield Dispute_1.Dispute.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { reporterId: id },
                    { partnerId: id }
                ]
            }
        });
        yield profileX.update({ totalReview: review.length, totalJobCanceled: canceledJob.length, totalDisputes: disputes.length });
        const all_transactions = yield Transaction_1.Transactions.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: {
                userId: id,
                type: Transaction_1.TransactionType.CREDIT,
                creditType: Transaction_1.CreditType.EARNING
            },
            attributes: [[sequelize_typescript_1.Sequelize.literal('SUM(amount)'), 'result']],
        });
        yield (updateProffessionalProfile === null || updateProffessionalProfile === void 0 ? void 0 : updateProffessionalProfile.update({
            totalEarning: (_b = all_transactions[0].dataValues.result) !== null && _b !== void 0 ? _b : 0,
            availableWithdrawalAmount: wallet === null || wallet === void 0 ? void 0 : wallet.amount,
            totalReview: review.length,
            totalDispute: disputes.length,
            rejectedAmount: Number(rejectedAmount[0].dataValues.result),
            pendingAmount: wallet === null || wallet === void 0 ? void 0 : wallet.transitAmount,
            completedAmount: Number(completedAmount[0].dataValues.result),
            totalJobCompleted: completedJob.length, totalJobCanceled: canceledJob.length,
            totalJobPending: pendingJob.length, totalJobOngoing: ongoingJob.length,
            totalJobRejected: rejectedJob.length
        }));
        const professionalProfile = yield Professional_1.Professional.findAll({
            order: [
                ['id', 'DESC']
            ],
            include: [
                { model: Cooperation_1.Corperate },
                {
                    model: Profile_1.Profile,
                    where: { userId: id },
                    include: [
                        {
                            model: Users_1.Users,
                            attributes: [
                                'createdAt', 'updatedAt', "email", "phone"
                            ],
                            include: [{
                                    model: Wallet_1.Wallet,
                                    where: {
                                        type: Wallet_1.WalletType.PROFESSIONAL
                                    }
                                },
                                {
                                    model: Education_1.Education,
                                },
                                {
                                    model: Certification_1.Certification,
                                },
                                {
                                    model: Experience_1.Experience,
                                },
                                {
                                    model: Porfolio_1.Porfolio,
                                    order: [
                                        ['id', 'DESC'],
                                    ],
                                },
                                {
                                    model: Review_1.Review,
                                    order: [
                                        ['id', 'DESC'],
                                    ],
                                    limit: 4,
                                },
                            ]
                        },
                    ],
                }
            ],
        });
        let data = (0, utility_1.deleteKey)(professionalProfile[0].dataValues, "profile", "corperate");
        let mergedObj = {
            profile: professionalProfile[0].dataValues.profile,
            professional: Object.assign({}, data),
            corperate: professionalProfile[0].dataValues.corperate,
            review: review.slice(0, 4)
        };
        if (!profileX)
            return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Profile Does'nt exist" });
        return (0, utility_1.successResponse)(res, "Successful", mergedObj);
    }
});
exports.accountInfo = accountInfo;
const accountSingleInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.params;
    const profileX = yield Profile_1.Profile.findOne({
        where: { userId: id },
        include: [{
                model: Users_1.Users,
                attributes: [
                    'createdAt', 'updatedAt', "email", "phone"
                ], include: [{
                        model: Wallet_1.Wallet,
                    },
                    { model: Dispute_1.Dispute }
                ]
            }
        ],
    });
    console.log(profileX === null || profileX === void 0 ? void 0 : profileX.type);
    if (!profileX)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Profile Does'nt exist" });
    if ((profileX === null || profileX === void 0 ? void 0 : profileX.type) == Profile_1.ProfileType.CLIENT) {
        const canceledJob = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.CANCEL,
                userId: [id],
            }
        });
        const ongoingJob = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.ONGOING,
                userId: [id],
            }
        });
        const completedJob = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.COMPLETED,
                userId: [id],
            }
        });
        const rejectedJob = yield Jobs_1.Jobs.findAll({
            where: {
                status: [Jobs_1.JobStatus.REJECTED, Jobs_1.JobStatus.DISPUTED],
                userId: [id],
            }
        });
        const pendingJob = yield Jobs_1.Jobs.findAll({
            where: {
                status: [Jobs_1.JobStatus.PENDING, Jobs_1.JobStatus.INVOICE],
                userId: [id],
            }
        });
        const review = yield Review_1.Review.findAll({
            where: {
                clientUserId: id
            },
            include: [{
                    model: Users_1.Users, as: "user",
                    attributes: ["id"], include: [{ model: Profile_1.Profile, attributes: ["fullName", "avatar"] }]
                }]
        });
        const disputes = yield Dispute_1.Dispute.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { reporterId: id },
                    { partnerId: id }
                ]
            }
        });
        const all_transactions = yield Transaction_1.Transactions.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: {
                userId: id,
                type: Transaction_1.TransactionType.DEBIT,
            },
            attributes: [[sequelize_typescript_1.Sequelize.literal('SUM(amount)'), 'result']],
        });
        yield profileX.update({
            totalExpense: (_a = all_transactions[0].dataValues.result) !== null && _a !== void 0 ? _a : 0,
            totalReview: review.length, totalJobCanceled: canceledJob.length, totalDisputes: disputes.length,
            totalOngoingHire: ongoingJob.length, totalCompletedHire: completedJob.length, totalJobRejected: rejectedJob.length,
            totalPendingHire: pendingJob.length,
        });
        const profile = yield Profile_1.Profile.findOne({
            where: { userId: id },
            include: [{
                    model: Users_1.Users,
                    attributes: [
                        'createdAt', 'updatedAt', "email", "phone"
                    ], include: [{
                            model: Wallet_1.Wallet,
                            where: {
                                type: Wallet_1.WalletType.CLIENT
                            }
                        },
                        { model: Dispute_1.Dispute }
                    ]
                }
            ],
        });
        return (0, utility_1.successResponse)(res, "Successful", {
            profile: profile,
            professional: null,
            corperate: null,
            review: review.slice(0, 4)
        });
    }
    else {
        const canceledJob = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.CANCEL,
                ownerId: [id],
            }
        });
        const ongoingJob = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.ONGOING,
                ownerId: [id],
            }
        });
        const pendingJob = yield Jobs_1.Jobs.findAll({
            where: {
                status: [Jobs_1.JobStatus.PENDING, Jobs_1.JobStatus.INVOICE],
                ownerId: [id],
            }
        });
        const rejectedJob = yield Jobs_1.Jobs.findAll({
            where: {
                status: [Jobs_1.JobStatus.REJECTED, Jobs_1.JobStatus.DISPUTED],
                ownerId: [id],
            }
        });
        const completedJob = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.COMPLETED,
                ownerId: [id],
            }
        });
        const rejectedAmount = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.CANCEL
            }, attributes: [[sequelize_typescript_1.Sequelize.literal('COALESCE(SUM(total), 0.0)'), 'result']],
        });
        const completedAmount = yield Jobs_1.Jobs.findAll({
            where: {
                status: Jobs_1.JobStatus.COMPLETED,
            }, attributes: [[sequelize_typescript_1.Sequelize.literal('COALESCE(SUM(total), 0.0)'), 'result']]
        });
        const wallet = yield Wallet_1.Wallet.findOne({
            where: {
                userId: id,
                type: Wallet_1.WalletType.PROFESSIONAL
            }
        });
        const review = yield Review_1.Review.findAll({
            where: {
                proffesionalUserId: id,
            },
            include: [{
                    model: Users_1.Users, as: "user",
                    attributes: ["id"], include: [{ model: Profile_1.Profile, attributes: ["fullName", "avatar"] }]
                }]
        });
        const disputes = yield Dispute_1.Dispute.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { reporterId: id },
                    { partnerId: id }
                ]
            }
        });
        const updateProffessionalProfile = yield Professional_1.Professional.findOne({
            where: { userId: id },
        });
        yield profileX.update({ totalReview: review.length, totalJobCanceled: canceledJob.length, totalDisputes: disputes.length });
        const all_transactions = yield Transaction_1.Transactions.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: {
                userId: id,
                type: Transaction_1.TransactionType.CREDIT,
                creditType: Transaction_1.CreditType.EARNING
            },
            attributes: [[sequelize_typescript_1.Sequelize.literal('SUM(amount)'), 'result']],
        });
        yield (updateProffessionalProfile === null || updateProffessionalProfile === void 0 ? void 0 : updateProffessionalProfile.update({
            totalEarning: (_b = all_transactions[0].dataValues.result) !== null && _b !== void 0 ? _b : 0,
            availableWithdrawalAmount: wallet === null || wallet === void 0 ? void 0 : wallet.amount,
            totalReview: review.length,
            totalDispute: disputes.length,
            rejectedAmount: Number(rejectedAmount[0].dataValues.result),
            pendingAmount: wallet === null || wallet === void 0 ? void 0 : wallet.transitAmount,
            completedAmount: Number(completedAmount[0].dataValues.result),
            totalJobCompleted: completedJob.length, totalJobCanceled: canceledJob.length,
            totalJobPending: pendingJob.length, totalJobOngoing: ongoingJob.length,
            totalJobRejected: rejectedJob.length
        }));
        const professional = yield Professional_1.Professional.findOne({
            where: { userId: id },
            include: [
                {
                    model: Profile_1.Profile,
                    include: [
                        {
                            model: ProffesionalSector_1.ProfessionalSector,
                            include: [
                                { model: Sector_1.Sector },
                                { model: Profession_1.Profession },
                            ],
                            order: [
                                ['id', 'DESC'],
                            ],
                        }
                    ]
                },
                { model: Cooperation_1.Corperate },
                {
                    model: Users_1.Users,
                    include: [{ model: LanLog_1.LanLog },
                        {
                            model: Education_1.Education,
                            order: [
                                ['id', 'DESC'],
                            ],
                        },
                        {
                            model: Certification_1.Certification,
                            order: [
                                ['id', 'DESC'],
                            ],
                        },
                        {
                            model: Experience_1.Experience,
                        },
                        {
                            model: Porfolio_1.Porfolio,
                            order: [
                                ['id', 'DESC'],
                            ],
                        },
                        { model: Dispute_1.Dispute }
                    ]
                },
            ],
        });
        let data = (0, utility_1.deleteKey)(professional === null || professional === void 0 ? void 0 : professional.dataValues, "profile", "corperate");
        return (0, utility_1.successResponse)(res, "Successful", {
            profile: professional === null || professional === void 0 ? void 0 : professional.dataValues.profile,
            corperate: professional === null || professional === void 0 ? void 0 : professional.dataValues.corperate,
            professional: data,
            review: review.slice(0, 4)
        });
    }
});
exports.accountSingleInfo = accountSingleInfo;
const postlocationData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lan, log, address } = req.body;
    const { id } = req.user;
    try {
        const getlocation = yield LanLog_1.LanLog.findOne({
            where: {
                userId: id
            }
        });
        const user = yield Users_1.Users.findOne({
            where: {
                id
            }
        });
        if (getlocation) {
            const location = yield getlocation.update({
                lantitude: lan !== null && lan !== void 0 ? lan : getlocation.lantitude, longitude: log !== null && log !== void 0 ? log : getlocation.longitude,
                userId: id, address: address !== null && address !== void 0 ? address : getlocation.address,
                coordinates: { type: 'Point', coordinates: [lan !== null && lan !== void 0 ? lan : getlocation.lantitude, log !== null && log !== void 0 ? log : getlocation.longitude] },
            });
            if (location)
                return (0, utility_1.successResponse)(res, "Updated Successfully", location);
            return (0, utility_1.errorResponse)(res, "Failed updating Location");
        }
        else {
            const insertData = {
                lantitude: lan, longitude: log, userId: id, address,
                coordinates: { type: 'Point', coordinates: [lan, log] },
            };
            const location = yield LanLog_1.LanLog.create(insertData);
            yield (user === null || user === void 0 ? void 0 : user.update({ locationId: location.id }));
            if (location)
                return (0, utility_1.successResponse)(res, "Created Successfully", location);
            return (0, utility_1.errorResponse)(res, "Failed Creating Location");
        }
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occurred - ${error}`);
    }
});
exports.postlocationData = postlocationData;
const verifyBvnDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const redis = new redis_1.Redis();
        const { bvnInpt } = req.body;
        const { id } = req.user;
        const user = yield Users_1.Users.findOne({ where: { id } });
        const profile = yield Profile_1.Profile.findOne({ where: { userId: id } });
        // console.log(profile);
        const cachedUserBvn = yield redis.getData(`bvn-${profile.id}`);
        if (cachedUserBvn) {
            const { first_name, middle_name, last_name, gender, phone } = JSON.parse(cachedUserBvn);
            const full_name = `${last_name !== null && last_name !== void 0 ? last_name : ""} ${first_name !== null && first_name !== void 0 ? first_name : ""} ${middle_name !== null && middle_name !== void 0 ? middle_name : ""}`;
            if ((0, string_similarity_1.compareTwoStrings)(`${full_name}`.toLowerCase(), `${profile === null || profile === void 0 ? void 0 : profile.fullName}`.toLowerCase()) < 0.72) {
                console.log(full_name);
                console.log(`${profile === null || profile === void 0 ? void 0 : profile.fullName}`);
                console.log((0, string_similarity_1.compareTwoStrings)(`${full_name}`.toLowerCase(), `${profile === null || profile === void 0 ? void 0 : profile.fullName}`.toLowerCase()));
                yield (0, sms_1.sendEmailResend)(user.email, "Verification Failed", `Hello ${profile === null || profile === void 0 ? void 0 : profile.fullName}, Your account validated failed,<br><br> reason: BVN data mismatch.<br><br> Try again. Best Regards.`);
                return (0, utility_1.errorResponse)(res, 'BVN data mismatch');
            }
            else {
                yield (profile === null || profile === void 0 ? void 0 : profile.update({ verified: true }));
                yield (0, sms_1.sendEmailResend)(user.email, "Verification Successful", `Hello ${profile === null || profile === void 0 ? void 0 : profile.fullName}, Your account is now validated, you now have full access to all features.<br><br> Thank you for trusting Acepick. Best Regards.`);
                return (0, utility_1.successResponse)(res, 'Verification Successful', { full_name, gender, phone });
            }
        }
        const bvn = yield (0, bvn_1.verifyBvn)(bvnInpt);
        if (bvn.message.verificationStatus == "NOT VERIFIED")
            return (0, utility_1.errorResponse)(res, `${bvn.message.description}`);
        yield redis.setData(`bvn-${profile.id}`, JSON.stringify(bvn.message.response), 3600); // cache in redis for 1 hour
        const { first_name, middle_name, last_name, gender, phone } = bvn.message.response;
        const full_name = `${last_name !== null && last_name !== void 0 ? last_name : ""} ${first_name !== null && first_name !== void 0 ? first_name : ""} ${middle_name !== null && middle_name !== void 0 ? middle_name : ""}`;
        console.log(bvn.message);
        if ((0, string_similarity_1.compareTwoStrings)(`${full_name}`.toLowerCase(), `${profile === null || profile === void 0 ? void 0 : profile.fullName}`.toLowerCase()) < 0.72) {
            console.log((0, string_similarity_1.compareTwoStrings)(`${full_name}`.toLowerCase(), `${profile === null || profile === void 0 ? void 0 : profile.fullName}`.toLowerCase()));
            console.log(full_name);
            console.log(`${profile === null || profile === void 0 ? void 0 : profile.fullName}`);
            yield (0, sms_1.sendEmailResend)(user.email, "Verification Failed", `Hello ${profile === null || profile === void 0 ? void 0 : profile.fullName},<br><br> Your account validated failed,<br><br> reason: BVN data mismatch.<br><br> Try again. Best Regards.`);
            return (0, utility_1.errorResponse)(res, 'BVN data mismatch');
        }
        else {
            yield (profile === null || profile === void 0 ? void 0 : profile.update({ verified: true }));
            yield (0, sms_1.sendEmailResend)(user.email, "Verification Successful", `Hello ${profile === null || profile === void 0 ? void 0 : profile.fullName},<br><br> Your account is now validated, you now have full access to all features.<br><br> Thank you for trusting Acepick. Best Regards.`);
            return (0, utility_1.successResponse)(res, 'Verification Successful', { full_name, gender, phone, });
        }
    }
    catch (error) {
        console.log(error);
        return (0, utility_1.errorResponse)(res, `An error occurred - ${error}`);
    }
});
exports.verifyBvnDetail = verifyBvnDetail;
const getEarningSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    // const prvmonth = today.getMonth() - 1;
    // Get the start date of the month
    const monthstartDate = new Date(year, month, 1);
    // Get the end date of the month
    const monthendDate = new Date(year, month + 1, 0);
    // Get the start date of the month
    const previous1MonthstartDate = new Date(year, (today.getMonth() - 1), 1);
    // Get the end date of the month
    const previous1MonthendDate = new Date(year, (today.getMonth() - 1) + 1, 0);
    // Get the start date of the month
    const previous2MonthstartDate = new Date(year, (today.getMonth() - 2), 1);
    // Get the end date of the month
    const previous2MonthendDate = new Date(year, (today.getMonth() - 2) + 1, 0);
    // Get the start date of the month
    const previous3MonthstartDate = new Date(year, (today.getMonth() - 3), 1);
    // Get the end date of the month
    const previous3MonthendDate = new Date(year, (today.getMonth() - 3) + 1, 0);
    // Get the start date of the month
    const previous4MonthstartDate = new Date(year, (today.getMonth() - 4), 1);
    // Get the end date of the month
    const previous4MonthendDate = new Date(year, (today.getMonth() - 4) + 1, 0);
    const formatter = new Intl.DateTimeFormat('en', { month: 'short' });
    const monthF1 = formatter.format(monthstartDate);
    const monthF2 = formatter.format(previous1MonthstartDate);
    const monthF3 = formatter.format(previous2MonthstartDate);
    const monthF4 = formatter.format(previous3MonthstartDate);
    const monthF5 = formatter.format(previous4MonthstartDate);
    const { id } = req.user;
    const profile = yield Profile_1.Profile.findOne({
        where: { userId: id },
        include: [{
                model: Users_1.Users,
                attributes: [
                    'createdAt', 'updatedAt', "email", "phone"
                ]
            }
        ],
    });
    console.log(profile === null || profile === void 0 ? void 0 : profile.type);
    if (!profile)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Profile Does'nt exist" });
    if ((profile === null || profile === void 0 ? void 0 : profile.type) == Profile_1.ProfileType.CLIENT) {
        try {
            const all_transactions = yield Transaction_1.Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: {
                    userId: id,
                    type: Transaction_1.TransactionType.DEBIT,
                },
                attributes: [[sequelize_typescript_1.Sequelize.literal('SUM(amount)'), 'result']],
            });
            const transactions = yield Transaction_1.Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: {
                    userId: id,
                    createdAt: {
                        [sequelize_1.Op.gt]: monthstartDate,
                        [sequelize_1.Op.lt]: monthendDate,
                    },
                    type: Transaction_1.TransactionType.DEBIT,
                },
                attributes: [[sequelize_typescript_1.Sequelize.literal('SUM(amount)'), 'result']],
            });
            const transactions_1 = yield Transaction_1.Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: {
                    userId: id,
                    createdAt: {
                        [sequelize_1.Op.gt]: previous1MonthstartDate,
                        [sequelize_1.Op.lt]: previous1MonthendDate,
                    },
                    type: Transaction_1.TransactionType.DEBIT,
                },
                attributes: [[sequelize_typescript_1.Sequelize.literal('SUM(amount)'), 'result']],
            });
            const transactions_2 = yield Transaction_1.Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: {
                    userId: id,
                    createdAt: {
                        [sequelize_1.Op.gt]: previous2MonthstartDate,
                        [sequelize_1.Op.lt]: previous2MonthendDate,
                    },
                    type: Transaction_1.TransactionType.DEBIT,
                },
                attributes: [[sequelize_typescript_1.Sequelize.literal('SUM(amount)'), 'result']],
            });
            const transactions_3 = yield Transaction_1.Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: {
                    userId: id,
                    createdAt: {
                        [sequelize_1.Op.gt]: previous3MonthstartDate,
                        [sequelize_1.Op.lt]: previous3MonthendDate,
                    },
                    type: Transaction_1.TransactionType.DEBIT,
                },
                attributes: [[sequelize_typescript_1.Sequelize.literal('SUM(amount)'), 'result']],
            });
            const transactions_4 = yield Transaction_1.Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: {
                    userId: id,
                    createdAt: {
                        [sequelize_1.Op.gt]: previous4MonthstartDate,
                        [sequelize_1.Op.lt]: previous4MonthendDate,
                    },
                    type: Transaction_1.TransactionType.DEBIT,
                },
                attributes: [[sequelize_typescript_1.Sequelize.literal('SUM(amount)'), 'result']],
            });
            return (0, utility_1.successResponse)(res, 'Sucessful', {
                month: [monthF1, monthF2,
                    monthF3, monthF4,
                    monthF5,
                ].reverse(),
                spending: [(_a = transactions[0].dataValues.result) !== null && _a !== void 0 ? _a : 0, (_b = transactions_1[0].dataValues.result) !== null && _b !== void 0 ? _b : 0, (_c = transactions_2[0].dataValues.result) !== null && _c !== void 0 ? _c : 0, (_d = transactions_3[0].dataValues.result) !== null && _d !== void 0 ? _d : 0, (_e = transactions_4[0].dataValues.result) !== null && _e !== void 0 ? _e : 0,
                ].reverse(),
                totalSpending: (_f = all_transactions[0].dataValues.result) !== null && _f !== void 0 ? _f : 0,
                currentMonthSpending: (_g = transactions[0].dataValues.result) !== null && _g !== void 0 ? _g : 0,
            });
        }
        catch (error) {
            console.log(error);
            return (0, utility_1.handleResponse)(res, 500, false, `An error occured - ${error}`);
        }
    }
    else {
        try {
            const all_transactions = yield Transaction_1.Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: {
                    userId: id,
                    type: Transaction_1.TransactionType.CREDIT,
                    creditType: Transaction_1.CreditType.EARNING
                },
                attributes: [[sequelize_typescript_1.Sequelize.literal('SUM(amount)'), 'result']],
            });
            const transactions = yield Transaction_1.Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: {
                    userId: id,
                    createdAt: {
                        [sequelize_1.Op.gt]: monthstartDate,
                        [sequelize_1.Op.lt]: monthendDate,
                    },
                    type: Transaction_1.TransactionType.CREDIT,
                    creditType: Transaction_1.CreditType.EARNING
                },
                attributes: [[sequelize_typescript_1.Sequelize.literal('SUM(amount)'), 'result']],
            });
            const transactions_1 = yield Transaction_1.Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: {
                    userId: id,
                    createdAt: {
                        [sequelize_1.Op.gt]: previous1MonthstartDate,
                        [sequelize_1.Op.lt]: previous1MonthendDate,
                    },
                    creditType: Transaction_1.CreditType.EARNING,
                    type: Transaction_1.TransactionType.CREDIT,
                },
                attributes: [[sequelize_typescript_1.Sequelize.literal('SUM(amount)'), 'result']],
            });
            const transactions_2 = yield Transaction_1.Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: {
                    userId: id,
                    createdAt: {
                        [sequelize_1.Op.gt]: previous2MonthstartDate,
                        [sequelize_1.Op.lt]: previous2MonthendDate,
                    },
                    creditType: Transaction_1.CreditType.EARNING,
                    type: Transaction_1.TransactionType.CREDIT,
                },
                attributes: [[sequelize_typescript_1.Sequelize.literal('SUM(amount)'), 'result']],
            });
            const transactions_3 = yield Transaction_1.Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: {
                    userId: id,
                    createdAt: {
                        [sequelize_1.Op.gt]: previous3MonthstartDate,
                        [sequelize_1.Op.lt]: previous3MonthendDate,
                    },
                    type: Transaction_1.TransactionType.CREDIT,
                    creditType: Transaction_1.CreditType.EARNING
                },
                attributes: [[sequelize_typescript_1.Sequelize.literal('SUM(amount)'), 'result']],
            });
            const transactions_4 = yield Transaction_1.Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: {
                    userId: id,
                    createdAt: {
                        [sequelize_1.Op.gt]: previous4MonthstartDate,
                        [sequelize_1.Op.lt]: previous4MonthendDate,
                    },
                    type: Transaction_1.TransactionType.CREDIT,
                    creditType: Transaction_1.CreditType.EARNING
                },
                attributes: [[sequelize_typescript_1.Sequelize.literal('SUM(amount)'), 'result']],
            });
            return (0, utility_1.successResponse)(res, 'Sucessful', {
                month: [monthF1, monthF2,
                    monthF3, monthF4,
                    monthF5,
                ].reverse(),
                earning: [(_h = transactions[0].dataValues.result) !== null && _h !== void 0 ? _h : 0, (_j = transactions_1[0].dataValues.result) !== null && _j !== void 0 ? _j : 0, (_k = transactions_2[0].dataValues.result) !== null && _k !== void 0 ? _k : 0, (_l = transactions_3[0].dataValues.result) !== null && _l !== void 0 ? _l : 0, (_m = transactions_4[0].dataValues.result) !== null && _m !== void 0 ? _m : 0,
                ].reverse(),
                totalEarning: (_o = all_transactions[0].dataValues.result) !== null && _o !== void 0 ? _o : 0,
                currentMonthEarning: (_p = transactions[0].dataValues.result) !== null && _p !== void 0 ? _p : 0,
            });
        }
        catch (error) {
            console.log(error);
            return (0, utility_1.handleResponse)(res, 500, false, `An error occured - ${error}`);
        }
    }
});
exports.getEarningSummary = getEarningSummary;
//# sourceMappingURL=auth.js.map