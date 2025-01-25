import { TOKEN_SECRET, createRandomRef, errorResponse, getRandom, randomId, saltRounds, validateEmail } from "../../helpers/utility";

import { Request, Response } from 'express';
import { upload_cloud } from '../../helpers/upload';
import { Sector } from '../../models/Sector';
import { successResponse } from '../../helpers/utility';
import { Profession } from '../../models/Profession';
import { hash } from "bcryptjs";
import { Admin } from "../../models/Admin";
import { Verify } from "../../models/Verify";
import { sendEmailResend } from "../../services/sms";
import { sign } from "jsonwebtoken";
import { Users } from "../../models/Users";
import { Invite, InviteStatus } from "../../models/Invite";







export const register = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    hash(password, saltRounds, async function (err, hashedPassword) {
        const adminExist = await Admin.findOne({ where: { email } })
        if (!validateEmail(email)) return errorResponse(res, "Failed", { status: false, message: "Enter a valid email" })
        else if (adminExist) return errorResponse(res, "Failed", { status: false, message: "Email/Phone already exist", })
        const user = await Admin.create({
            email, password: hashedPassword, role
        })
        const emailServiceId = randomId(12);
        const codeEmail = String(Math.floor(1000 + Math.random() * 9000));
        const invite = await Invite.findOne(
            {
                where: {
                    email: email
                }
            }
        )
        await invite?.update({ status: InviteStatus.ACTIVE })
        await Verify.create({
            serviceId: emailServiceId,
            code: codeEmail,
            client: email,
            secret_key: createRandomRef(12, "ace_pick",),
        })
        const emailResult = await sendEmailResend(user!.email, "Email Verification",
            `Dear User,<br><br>
      
        Thank you for choosing our service. To complete your registration and ensure the security of your account, please use the verification code below<br><br>
        
        Verification Code: ${codeEmail}<br><br>
        
        Please enter this code on our website/app to proceed with your registration process. If you did not initiate this action, please ignore this email.<br><br>
        
        If you have any questions or concerns, feel free to contact our support team.<br><br>
        
        Thank you,<br>
        AcepickTeam`
        );
        let token = sign({ id: user.id, email: user.email, admin: true }, TOKEN_SECRET);
        return successResponse(res, "Successful", {
            status: true,
            message: { email, token, emailServiceId }
        })
    });
}



export const assignRole = async (req: Request, res: Response) => {
    const { role, adminId } = req.body;
    const admin = await Admin.findOne(
        {
            where: {
                id: adminId
            }
        }
    )
    if (!admin) return errorResponse(res, "Failed", { status: false, message: "Admin Not Found" })
    const update = await admin?.update({ role })
    return successResponse(res, "Successful", update)
};



export const updateStatus = async (req: Request, res: Response) => {
    const { status, adminId } = req.body;
    const admin = await Admin.findOne(
        {
            where: {
                id: adminId
            }
        }
    )
    if (!admin) return errorResponse(res, "Failed", { status: false, message: "Admin Not Found" })
    const update = await admin?.update({ status })
    return successResponse(res, "Successful", update)
};





export const deleteAdmin = async (req: Request, res: Response) => {
    const { adminId } = req.body;
    const admin = await Admin.findOne(
        {
            where: {
                id: adminId
            }
        }
    )
    const invite = await Invite.findOne({ where: { email: admin?.email } })
    if (!admin && !invite) return errorResponse(res, "Failed", { status: false, message: "Admin Not Found" })
    await admin?.destroy()
    await invite?.destroy()
    return successResponse(res, "Successful")
};




export const changePassword = async (req: Request, res: Response) => {
    const { password, code, emailServiceId } = req.body;
    const verify = await Verify.findOne(
        {
            where: {
                code,
                serviceId: emailServiceId,
                used: false
            }
        }
    )
    if (!verify) return errorResponse(res, "Failed", { status: false, message: "Invalid Code" })
    hash(password, saltRounds, async function (err, hashedPassword) {
        const admin = await Admin.findOne({ where: { email: verify.client } });
        admin?.update({ password: hashedPassword })
        let token = sign({ id: admin!.id, email: admin!.email, admin: true }, TOKEN_SECRET);
        await verify.destroy()
        return successResponse(res, "Successful", { ...admin?.dataValues, token })
    });
};




export const checkEmail = async (req: Request, res: Response) => {
    const { email } = req.query;
    const admin = await Admin.findOne(
        {
            where: {
                email
            }
        }
    )
    if (admin) return successResponse(res, "Successful", { status: true, message: "Email Exist" })
    return successResponse(res, "Successful", { status: false, message: "Email Does Exist" })
}

export const sendInvite = async (req: Request, res: Response) => {
    const { role, email, phone } = req.body;
    const invite = await Invite.findOne(
        {
            where: {
                email: email
            }
        }
    )
    const admin = await Admin.findOne(
        {
            where: {
                email: email
            }
        }
    )
    if (invite) return errorResponse(res, "Failed", { status: true, message: "Invite Already Sent" })
    if (admin) return errorResponse(res, "Failed", { status: true, message: "Invite Already Sent" })
    const update = await Invite?.create({ role, email, phone })
    const password = getRandom(8).toString()
    hash(password, saltRounds, async function (err, hashedPassword) {

        // let token = sign({ id: user!.id, email: user!.email }, TOKEN_SECRET);
        const admin = await Admin.create({ phone, email, role, password: hashedPassword })
        await sendEmailResend(email,
            "INVITATION TO JOIN ACEPICK ADMIN",
            `Please click the link below to join AcePick<br><br> <strong><a href=https://admin-dashboard-77c7.onrender.com >JOIN ACEPICK</a></strong> <br><br> Use the code below to reset your password. ${password} .`
        );
        return successResponse(res, "Successful", admin)
    });

};


export const updateInvite = async (req: Request, res: Response) => {
    const { status, id } = req.body;
    const invite = await Invite.findOne(
        {
            where: {
                id
            }
        }
    )
    const update = await invite?.update({ status })
    return successResponse(res, "Successful", update)
};





export const getInvite = async (req: Request, res: Response) => {
    const invite = await Invite.findAll({})
    return successResponse(res, "Successful", invite)
};



export const getUserInvite = async (req: Request, res: Response) => {
    const { email } = req.query;
    const invite = await Invite.findAll({ where: { email } })
    return successResponse(res, "Successful", invite)
};




export const deleteInvite = async (req: Request, res: Response) => {
    const { id } = req.body;
    const invite = await Invite.findOne(
        {
            where: {
                id
            }
        }
    )
    if (!invite) return errorResponse(res, "Failed", { status: false, message: "Invite not Found" })
    if (invite.status == InviteStatus.ACTIVE) return errorResponse(res, "Failed", { status: false, message: "Cannot Deleted Active invite" })
    const update = await invite?.destroy()
    return successResponse(res, "Deleted Successfully", update)
};





export const userRoles = async (req: Request, res: Response) => {
    const admin = await Admin.findAll({ where: { role: "ADMIN" } })
    const adminEdit = await Admin.findAll({ where: { role: "EDIT" } })
    const adminView = await Admin.findAll({ where: { role: "VIEW" } })
    return successResponse(res, "Successful", { admin: admin, edit: adminEdit, view: adminView })
};




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




export const updateAdminOnlineStatus = async (req: Request, res: Response) => {
    const { online } = req.body;
    const { id } = req.admin
    const admin = await Admin.findOne(
        {
            where: {
                id,
            }
        }
    )
    if (!admin) return errorResponse(res, "Failed", { status: false, message: "Admin Not Found" })
    const update = await admin?.update({ online })
    return successResponse(res, "Successful", update)
};







export const getAllAdmin = async (req: Request, res: Response) => {
    const admin = await Admin.findAll({})
    return successResponse(res, "Successful", admin)
};




export const getAdminDetails = async (req: Request, res: Response) => {
    const { id } = req.admin
    const admin = await Admin.findOne({ where: { id } })
    return successResponse(res, "Successful", admin)
};




export const updateProfile = async (req: Request, res: Response) => {
    let { firstName, lastName } = req.body;
    let { id } = req.admin;
    const admin = await Admin.findOne({ where: { id } })
    await admin?.update({
        firstName: firstName ?? admin.firstName,
        lastName: lastName ?? admin.lastName
    })
    const updated = await Admin.findOne({ where: { id } })
    return res.status(200).send({ message: "Updated Successfully", updated })


}
