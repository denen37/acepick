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
exports.updateProfile = exports.getAdminDetails = exports.getAllAdmin = exports.updateAdminOnlineStatus = exports.userRoles = exports.deleteInvite = exports.getUserInvite = exports.getInvite = exports.updateInvite = exports.sendInvite = exports.checkEmail = exports.changePassword = exports.deleteAdmin = exports.updateStatus = exports.assignRole = exports.register = void 0;
const utility_1 = require("../../helpers/utility");
const utility_2 = require("../../helpers/utility");
const bcryptjs_1 = require("bcryptjs");
const Admin_1 = require("../../models/Admin");
const Verify_1 = require("../../models/Verify");
const sms_1 = require("../../services/sms");
const jsonwebtoken_1 = require("jsonwebtoken");
const Invite_1 = require("../../models/Invite");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = req.body;
    (0, bcryptjs_1.hash)(password, utility_1.saltRounds, function (err, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminExist = yield Admin_1.Admin.findOne({ where: { email } });
            if (!(0, utility_1.validateEmail)(email))
                return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Enter a valid email" });
            else if (adminExist)
                return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Email/Phone already exist", });
            const user = yield Admin_1.Admin.create({
                email, password: hashedPassword, role
            });
            const emailServiceId = (0, utility_1.randomId)(12);
            const codeEmail = String(Math.floor(1000 + Math.random() * 9000));
            const invite = yield Invite_1.Invite.findOne({
                where: {
                    email: email
                }
            });
            yield (invite === null || invite === void 0 ? void 0 : invite.update({ status: Invite_1.InviteStatus.ACTIVE }));
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
        
        If you have any questions or concerns, feel free to contact our support team.<br><br>
        
        Thank you,<br>
        AcepickTeam`);
            let token = (0, jsonwebtoken_1.sign)({ id: user.id, email: user.email, admin: true }, utility_1.TOKEN_SECRET);
            return (0, utility_2.successResponse)(res, "Successful", {
                status: true,
                message: { email, token, emailServiceId }
            });
        });
    });
});
exports.register = register;
const assignRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, adminId } = req.body;
    const admin = yield Admin_1.Admin.findOne({
        where: {
            id: adminId
        }
    });
    if (!admin)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Admin Not Found" });
    const update = yield (admin === null || admin === void 0 ? void 0 : admin.update({ role }));
    return (0, utility_2.successResponse)(res, "Successful", update);
});
exports.assignRole = assignRole;
const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, adminId } = req.body;
    const admin = yield Admin_1.Admin.findOne({
        where: {
            id: adminId
        }
    });
    if (!admin)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Admin Not Found" });
    const update = yield (admin === null || admin === void 0 ? void 0 : admin.update({ status }));
    return (0, utility_2.successResponse)(res, "Successful", update);
});
exports.updateStatus = updateStatus;
const deleteAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { adminId } = req.body;
    const admin = yield Admin_1.Admin.findOne({
        where: {
            id: adminId
        }
    });
    const invite = yield Invite_1.Invite.findOne({ where: { email: admin === null || admin === void 0 ? void 0 : admin.email } });
    if (!admin && !invite)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Admin Not Found" });
    yield (admin === null || admin === void 0 ? void 0 : admin.destroy());
    yield (invite === null || invite === void 0 ? void 0 : invite.destroy());
    return (0, utility_2.successResponse)(res, "Successful");
});
exports.deleteAdmin = deleteAdmin;
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
            const admin = yield Admin_1.Admin.findOne({ where: { email: verify.client } });
            admin === null || admin === void 0 ? void 0 : admin.update({ password: hashedPassword });
            let token = (0, jsonwebtoken_1.sign)({ id: admin.id, email: admin.email, admin: true }, utility_1.TOKEN_SECRET);
            yield verify.destroy();
            return (0, utility_2.successResponse)(res, "Successful", Object.assign(Object.assign({}, admin === null || admin === void 0 ? void 0 : admin.dataValues), { token }));
        });
    });
});
exports.changePassword = changePassword;
const checkEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.query;
    const admin = yield Admin_1.Admin.findOne({
        where: {
            email
        }
    });
    if (admin)
        return (0, utility_2.successResponse)(res, "Successful", { status: true, message: "Email Exist" });
    return (0, utility_2.successResponse)(res, "Successful", { status: false, message: "Email Does Exist" });
});
exports.checkEmail = checkEmail;
const sendInvite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, email, phone } = req.body;
    const invite = yield Invite_1.Invite.findOne({
        where: {
            email: email
        }
    });
    const admin = yield Admin_1.Admin.findOne({
        where: {
            email: email
        }
    });
    if (invite)
        return (0, utility_1.errorResponse)(res, "Failed", { status: true, message: "Invite Already Sent" });
    if (admin)
        return (0, utility_1.errorResponse)(res, "Failed", { status: true, message: "Invite Already Sent" });
    const update = yield (Invite_1.Invite === null || Invite_1.Invite === void 0 ? void 0 : Invite_1.Invite.create({ role, email, phone }));
    const password = (0, utility_1.getRandom)(8).toString();
    (0, bcryptjs_1.hash)(password, utility_1.saltRounds, function (err, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            // let token = sign({ id: user!.id, email: user!.email }, TOKEN_SECRET);
            const admin = yield Admin_1.Admin.create({ phone, email, role, password: hashedPassword });
            yield (0, sms_1.sendEmailResend)(email, "INVITATION TO JOIN ACEPICK ADMIN", `Please click the link below to join AcePick<br><br> <strong><a href=https://admin-dashboard-77c7.onrender.com >JOIN ACEPICK</a></strong> <br><br> Use the code below to reset your password. ${password} .`);
            return (0, utility_2.successResponse)(res, "Successful", admin);
        });
    });
});
exports.sendInvite = sendInvite;
const updateInvite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, id } = req.body;
    const invite = yield Invite_1.Invite.findOne({
        where: {
            id
        }
    });
    const update = yield (invite === null || invite === void 0 ? void 0 : invite.update({ status }));
    return (0, utility_2.successResponse)(res, "Successful", update);
});
exports.updateInvite = updateInvite;
const getInvite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const invite = yield Invite_1.Invite.findAll({});
    return (0, utility_2.successResponse)(res, "Successful", invite);
});
exports.getInvite = getInvite;
const getUserInvite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.query;
    const invite = yield Invite_1.Invite.findAll({ where: { email } });
    return (0, utility_2.successResponse)(res, "Successful", invite);
});
exports.getUserInvite = getUserInvite;
const deleteInvite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const invite = yield Invite_1.Invite.findOne({
        where: {
            id
        }
    });
    if (!invite)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Invite not Found" });
    if (invite.status == Invite_1.InviteStatus.ACTIVE)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Cannot Deleted Active invite" });
    const update = yield (invite === null || invite === void 0 ? void 0 : invite.destroy());
    return (0, utility_2.successResponse)(res, "Deleted Successfully", update);
});
exports.deleteInvite = deleteInvite;
const userRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield Admin_1.Admin.findAll({ where: { role: "ADMIN" } });
    const adminEdit = yield Admin_1.Admin.findAll({ where: { role: "EDIT" } });
    const adminView = yield Admin_1.Admin.findAll({ where: { role: "VIEW" } });
    return (0, utility_2.successResponse)(res, "Successful", { admin: admin, edit: adminEdit, view: adminView });
});
exports.userRoles = userRoles;
// export const updateAdminStatus = async (req: Request, res: Response)=>{
//     const { status , adminId} = req.body;
//        const admin =  await Admin.findOne(
//             {where:{
//                 id:adminId,
//             }}
//         )
//         if(!admin) return errorResponse(res, "Failed", {status: false, message: "Admin Not Found"})
//         const update = await admin?.update({status})
//         return successResponse(res, "Successful", update)
// };
const updateAdminOnlineStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { online } = req.body;
    const { id } = req.admin;
    const admin = yield Admin_1.Admin.findOne({
        where: {
            id,
        }
    });
    if (!admin)
        return (0, utility_1.errorResponse)(res, "Failed", { status: false, message: "Admin Not Found" });
    const update = yield (admin === null || admin === void 0 ? void 0 : admin.update({ online }));
    return (0, utility_2.successResponse)(res, "Successful", update);
});
exports.updateAdminOnlineStatus = updateAdminOnlineStatus;
const getAllAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield Admin_1.Admin.findAll({});
    return (0, utility_2.successResponse)(res, "Successful", admin);
});
exports.getAllAdmin = getAllAdmin;
const getAdminDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.admin;
    const admin = yield Admin_1.Admin.findOne({ where: { id } });
    return (0, utility_2.successResponse)(res, "Successful", admin);
});
exports.getAdminDetails = getAdminDetails;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { firstName, lastName } = req.body;
    let { id } = req.admin;
    const admin = yield Admin_1.Admin.findOne({ where: { id } });
    yield (admin === null || admin === void 0 ? void 0 : admin.update({
        firstName: firstName !== null && firstName !== void 0 ? firstName : admin.firstName,
        lastName: lastName !== null && lastName !== void 0 ? lastName : admin.lastName
    }));
    const updated = yield Admin_1.Admin.findOne({ where: { id } });
    return res.status(200).send({ message: "Updated Successfully", updated });
});
exports.updateProfile = updateProfile;
//# sourceMappingURL=adminAuth.js.map