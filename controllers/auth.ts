import { TOKEN_SECRET, convertHttpToHttps, createRandomRef, deleteKey, errorResponse, handleResponse, randomId, saltRounds, successResponse, successResponseFalse, validateEmail } from "../helpers/utility";
import { Request, Response } from 'express';
import { VerificationType, Verify } from "../models/Verify";
import { sendEmailResend, sendSMS } from "../services/sms";
import { UserState, UserStatus, Users } from "../models/Users";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { Profile, ProfileType } from "../models/Profile";
import { Professional } from "../models/Professional";
import { Wallet, WalletType } from "../models/Wallet";
import { LanLog } from "../models/LanLog";
import { Admin } from "../models/Admin";
import { Sector } from "../models/Sector";
import { Profession } from "../models/Profession";
import { Corperate } from "../models/Cooperation";
import { Review } from "../models/Review";
import { verifyBvn } from "../services/bvn";
import { compareTwoStrings } from 'string-similarity';

// yarn add stream-chat
import { StreamChat } from 'stream-chat';
import { JobStatus, Jobs } from "../models/Jobs";
import { Education } from "../models/Education";
import { Certification } from "../models/Certification";
import { Experience } from "../models/Experience";
import { Porfolio } from "../models/Porfolio";
import { Dispute } from "../models/Dispute";
import { CreditType, TransactionType, Transactions } from "../models/Transaction";
import { Sequelize } from "sequelize-typescript";
import { Redis } from "../services/redis";
import { ProfessionalSector } from "../models/ProffesionalSector";
import { Op } from "sequelize";
import { sendExpoNotification } from "../services/expo";


// instantiate your stream client using the API key and secret
// the secret is only used server side and gives you full access to the API
const serverClient = StreamChat.getInstance('zzfb7h72xhc5',
  '5pfxakc5zasma3hw9awd2qsqgk2fxyr4a5qb3au4kkdt27d7ttnca7vnusfuztud');
// you can still use new StreamChat('api_key', 'api_secret');

// generate a token for the user with id 'john'





export const updateProfile = async (req: Request, res: Response) => {
  let { postalCode, lga, state, address, avatar } = req.body;
  let { id } = req.user;
  const profile = await Profile.findOne({ where: { id } })
  if (!profile?.verified) return errorResponse(res, "Verify your bvn")
  await profile?.update({
    lga: lga ?? profile.lga,
    avatar: avatar ?? profile.avatar,
    state: state ?? profile.state,
    address: address ?? profile.address,
  })
  const updated = await Profile.findOne({ where: { id } })
  return successResponse(res, "Updated Successfully", updated)
}



export const updateProfessional = async (req: Request, res: Response) => {
  let { intro, language } = req.body;
  let { id } = req.user;
  const professional = await Professional.findOne({ where: { userId: id } })
  await professional?.update({
    intro: intro ?? professional.intro,
    language: language ?? professional.language
  })
  const updated = await Professional.findOne({ where: { userId: id } })
  return successResponse(res, "Updated Successfully", updated)
}




export const sendOtp = async (req: Request, res: Response) => {
  const { email, phone, type } = req.body;
  const serviceId = randomId(12);
  const codeEmail = String(Math.floor(1000 + Math.random() * 9000));
  const codeSms = String(Math.floor(1000 + Math.random() * 9000));

  if (type == VerificationType.BOTH) {
    await Verify.create({
      serviceId,
      code: codeSms
    })
    await Verify.create({
      serviceId,
      code: codeEmail
    })
    const smsResult = await sendSMS(phone, codeSms.toString());
    const emailResult = await sendEmailResend(email, "Email Verification",
      `Dear User,<br><br>
  
    Thank you for choosing our service. To complete your registration and ensure the security of your account, please use the verification code below<br><br>
    
    Verification Code: ${codeEmail}<br><br>
    
    Please enter this code on our website/app to proceed with your registration process. If you did not initiate this action, please ignore this email.<br><br>`

    );
    if (smsResult.status && emailResult?.status) return successResponse(res, "Successful", { ...smsResult, serviceId })
    return errorResponse(res, "Failed", emailResult)
  } else if (type == VerificationType.SMS) {
    await Verify.create({
      serviceId,
      code: codeSms
    })
    const smsResult = await sendSMS(phone, codeSms.toString());
    if (smsResult.status) return successResponse(res, "Successful", { ...smsResult, serviceId })
    return errorResponse(res, "Failed", smsResult)
  } else if (type == VerificationType.EMAIL) {
    await Verify.create({
      serviceId,
      code: codeEmail
    })
    const emailResult = await sendEmailResend(email, "Email Verification",
      `Dear User,<br><br>
  
    Thank you for choosing our service. To complete your registration and ensure the security of your account, please use the verification code below<br><br>
    
    Verification Code: ${codeEmail}<br><br>
    
    Please enter this code on our website/app to proceed with your registration process. If you did not initiate this action, please ignore this email.<br><br>
    
`
    );
    if (emailResult?.status) return successResponse(res, "Successful", { ...emailResult, serviceId })
    return errorResponse(res, "Failed", emailResult)
  }

  else {
    // const secret_key = createRandomRef(12, "ace_pick")
    await Verify.create({
      serviceId,
      code: codeEmail,
      client: email
    })
    const emailResult = await sendEmailResend(email, "Email Verification",
      `Dear User,<br><br>
  
    Thank you for choosing our service. To complete your registration and ensure the security of your account, please use the verification code below<br><br>
    
    Verification Code: ${codeEmail}<br><br>
    
    Please enter this code on our website/app to proceed with your registration process. If you did not initiate this action, please ignore this email.<br><br>
    
 `
    );
    if (emailResult?.status) return successResponse(res, "Successful", { ...emailResult, emailServiceId: serviceId })
    return errorResponse(res, "Failed", emailResult)

  }

};






export const verifyOtp = async (req: Request, res: Response) => {
  const { emailServiceId, smsServiceId, smsCode, emailCode, type } = req.body;
  if (type === "RESET") {

    const verifyEmail = await Verify.findOne({
      where: {
        serviceId: emailServiceId
      }
    })

    if (verifyEmail) {
      if (verifyEmail.code === emailCode) {

        const verifyEmailResult = await Verify.findOne({ where: { id: verifyEmail.id } })
        await verifyEmailResult?.destroy()
        return successResponse(res, "Successful", {
          message: "successful",
          status: true
        })

      } else {

        errorResponse(res, "Failed", {
          message: "Invalid Email Code",
          status: false
        })
      }
    } else {
      errorResponse(res, "Failed", {
        message: `Email Code Already Used`,
        status: false
      })
    }
  } else if (type === "ADMIN") {

    const verifyEmail = await Verify.findOne({
      where: {
        serviceId: emailServiceId
      }
    })

    if (verifyEmail) {
      if (verifyEmail.code === emailCode) {
        const verifyEmailResult = await Verify.findOne({ where: { id: verifyEmail.id } })
        await verifyEmailResult?.destroy()
        return successResponse(res, "Successful", {
          message: "successful",
          status: true
        })

      } else {

        errorResponse(res, "Failed", {
          message: `Invalid Email Code`,
          status: false
        })
      }
    } else {
      errorResponse(res, "Failed", {
        message: `Email Code Already Used`,
        status: false
      })
    }
  } else if (type === "PIN") {

    const verifyEmail = await Verify.findOne({
      where: {
        serviceId: emailServiceId
      }
    })

    if (verifyEmail) {
      if (verifyEmail.code === emailCode) {

        const verifyEmailResult = await Verify.findOne({ where: { id: verifyEmail.id } })
        await verifyEmailResult?.destroy()
        return successResponse(res, "Successful", {
          message: "successful",
          status: true
        })

      } else {

        errorResponse(res, "Failed", {
          message: `Invalid ${"Email"} Code`,
          status: false
        })
      }
    } else {
      errorResponse(res, "Failed", {
        message: `${"Email"} Code Already Used`,
        status: false
      })
    }
  }

  else {
    // const verifySms = await  Verify.findOne({
    //   where:{
    //     serviceId:  smsServiceId
    //   }
    //  })

    const verifyEmail = await Verify.findOne({
      where: {
        serviceId: emailServiceId
      }
    })

    if (
      // verifySms && 
      verifyEmail) {
      if (
        // verifySms.code === smsCode &&
        verifyEmail.code === emailCode) {

        //   const verifySmsResult =  await Verify.findOne({ where:{ id: verifySms.id} })
        //  await  verifySmsResult?.destroy()
        const verifyEmailResult = await Verify.findOne({ where: { id: verifyEmail.id } })
        await verifyEmailResult?.destroy()
        return successResponse(res, "Successful", {
          message: "successful",
          status: true
        })

      } else {
        errorResponse(res, "Failed", {
          message: `Invalid ${
            // !verifySms?"SmS":
            "Email"} Code`,
          status: false
        })
      }
    } else {
      errorResponse(res, "Failed", {
        message: `${
          // !verifySms?"SmS":
          "Email"} Code Already Used`,
        status: false
      })
    }
  }


}




export const register = async (req: Request, res: Response) => {
  const { email, phone, password } = req.body;
  hash(password, saltRounds, async function (err, hashedPassword) {
    const userEmail = await Users.findOne({ where: { email } })
    const userPhone = await Users.findOne({ where: { phone } })
    if (!validateEmail(email)) return successResponseFalse(res, "Failed", { status: false, message: "Enter a valid email" })
    if (userPhone || userEmail) {
      if (userEmail?.state === UserState.VERIFIED || userPhone?.state === UserState.VERIFIED) {
        if (userPhone) return successResponseFalse(res, "Failed", { status: false, message: "Phone already exist", state: userPhone.state })
        if (userEmail) return successResponseFalse(res, "Failed", { status: false, message: "Email already exist", state: userEmail.state })
      } else {
        await userEmail?.destroy();
        const user = await Users.create({
          email, phone, password: hashedPassword
        })
        const wallet = await Wallet.create({ userId: user.id })
        // await user.update({ walletId: wallet.id })
        const emailServiceId = randomId(12);
        const codeEmail = String(Math.floor(1000 + Math.random() * 9000));
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
        
    `
        );
        let token = sign({ id: user.id, email: user.email }, TOKEN_SECRET);
        const chatToken = serverClient.createToken(`${String(user.id)}`);
        const profile = await Profile.findOne({ where: { userId: user.id } })

        const response = await serverClient.upsertUsers([{
          id: String(user.id),
          role: 'admin',
          mycustomfield: {
            email: `${user.email}`,
            accountType: profile?.type,
            userId: String(user.id),
          }
        }]);

        return successResponse(res, "Successful", {
          status: true,
          message: {
            email, phone, token, emailServiceId, chatToken
          }
        })

      }
    } else {
      const user = await Users.create({
        email, phone, password: hashedPassword
      })
      const wallet = await Wallet.create({ userId: user.id })
      // await user.update({ walletId: wallet.id })
      const emailServiceId = randomId(12);
      const codeEmail = String(Math.floor(1000 + Math.random() * 9000));
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
      
    `
      );
      let token = sign({ id: user.id, email: user.email }, TOKEN_SECRET);
      const chatToken = serverClient.createToken(`${String(user.id)}`);
      const profile = await Profile.findOne({ where: { userId: user.id } })
      const response = await serverClient.upsertUsers([{
        id: String(user.id),
        role: 'admin',
        mycustomfield: {
          email: `${user.email}`,
          accountType: profile?.type,
          userId: String(user.id),
        }
      }]);
      return successResponse(res, "Successful", {
        status: true,
        message: {
          email, phone, token, emailServiceId, chatToken
        }
      })

    }
  });
}






export const passwordChange = async (req: Request, res: Response) => {
  let { password, newPassword } = req.body;
  const { id } = req.user;
  const user = await Users.findOne({ where: { id } })
  if (!user) return errorResponse(res, "Failed", { status: false, message: "User does not exist" })
  const match = await compare(password, user.password)
  if (!match) return errorResponse(res, "Failed", { status: false, message: "Invalid Password" })

  hash(newPassword, saltRounds, async function (err, hashedPassword) {
    await user.update({ password: hashedPassword })
    let token = sign({ id: user.id, email: user.email }, TOKEN_SECRET);
    return successResponse(res, "Successful", { status: true, message: { ...user.dataValues, token } })
  })

}


export const sendDisputeMessage = async (req: Request, res: Response) => {
  const { userId, body } = req.body
  const user = await Users.findOne({ where: { id: userId } })
  if (!user) return successResponse(res, "User not Found")
  const profile = await Profile.findOne({ where: { userId } })
  profile?.fcmToken == null ? null : sendExpoNotification(profile!.fcmToken, body);
  sendEmailResend(user!.email, "Dispute: Admin", `<p>${body}</p>`)
  return successResponse(res, "Successful")
}


export const login = async (req: Request, res: Response) => {
  let { email, password, type, fcmToken } = req.body;
  const user = await Users.findOne({ where: { email } })
  if (!user) return errorResponse(res, "Failed", { status: false, message: "User does not exist" })
  const match = await compare(password, user.password)
  if (!match) return errorResponse(res, "Failed", { status: false, message: "Invalid Credentials" })
  let token = sign({ id: user.id, email: user.email }, TOKEN_SECRET);
  const chatToken = serverClient.createToken(`${String(user.id)}`);
  const profile = await Profile.findOne({ where: { userId: user.id } })
  await profile?.update({ fcmToken })
  const profileUpdated = await Profile.findOne({ where: { userId: user.id } })
  // profile?.fcmToken == null ? null : sendExpoNotification(profileUpdated!.fcmToken, "hello world");
  if (profile?.type == ProfileType.CLIENT) {
    if (type == profile?.type) {
      const response = await serverClient.upsertUsers([{
        id: String(user.id),
        role: 'admin',
        mycustomfield: {
          email: `${user.email}`,
          accountType: profile?.type,
          userId: String(user.id),
        }
      }]);
      return successResponse(res, "Successful", { status: true, message: { ...user.dataValues, token, chatToken } })


    } else {
      return successResponseFalse(res, "Cannot access Client account")
    }


  } else {
    if (type == profile?.type) {
      const professionalProfile = await Professional.findAll(
        {
          order: [
            ['id', 'DESC']
          ],
          include: [

            { model: Corperate },
            {
              model: Profile,
              where: { userId: profile?.userId },
              include: [

                {
                  model: Users,
                  attributes: [
                    'createdAt', 'updatedAt', "email", "phone"],
                  include: [{
                    model: Wallet,
                    where: {
                      type: WalletType.PROFESSIONAL
                    }
                  },

                  {
                    model: Education,
                  },
                  {
                    model: Certification,
                  },
                  {
                    model: Experience,
                  },
                  {
                    model: Porfolio,
                    order: [
                      ['id', 'DESC'],
                    ],
                  },



                  ]
                },

              ],
            }
          ],
        }
      )
      let data = deleteKey(professionalProfile[0].dataValues, "profile", "corperate");

      let mergedObj = {
        profile: professionalProfile[0].dataValues.profile,
        professional: { ...data },
        corperate: professionalProfile[0].dataValues.corperate,
      }

      const response = await serverClient.upsertUsers([{
        id: String(user.id),
        role: 'admin',
        // mycustomfield: {
        //   email: `${user.email}`,
        //   accountType: profile?.type,
        //   data: mergedObj
        // }
      }]);
      return successResponse(res, "Successful", { status: true, message: { ...user.dataValues, token, chatToken } })
    }

    else {
      return successResponseFalse(res, "Cannot access Professional account")
    }

  }
}




export const deleteUsers = async (req: Request, res: Response) => {
  const user = await Users.findAll({})
  let index = 0
  for (let value of user) {
    await value.destroy()
    index++
  }
  if (index == user.length) {
    return successResponse(res, "Successful")
  }
}




export const registerStepTwo = async (req: Request, res: Response) => {
  let { fullName, lga, state, bvn, address, type, avatar } = req.body;
  let { id } = req.user;
  console.log(req.body)
  const user = await Users.findOne({ where: { id } });
  const profile = await Profile.findOne({ where: { userId: id } });
  if (profile) return errorResponse(res, "Failed", { status: false, message: "Profile Already Exist" })
  const profileCreate = await Profile.create({ fullName, lga, state, bvn, address, type, userId: id, avatar: convertHttpToHttps(avatar) })
  const profileX = await Profile.findOne({ where: { userId: id } });
  await sendEmailResend(user!.email, "Welcome to Acepick", `Welcome on board ${profileX!.fullName},<br><br> we are pleased to have you on Acepick, please validate your account by providing your BVN to get accessible to all features on Acepick.<br><br> Thanks.`);
  await user?.update({ state: ProfileType.CLIENT ? UserState.VERIFIED : UserState.STEP_THREE })
  successResponse(res, "Successful", { status: true, message: profileCreate })
}



export const registerStepThree = async (req: Request, res: Response) => {
  let { intro, regNum, experience, sectorId, professionId, chargeFrom } = req.body;
  let { id } = req.user;
  const user = await Users.findOne({ where: { id } });
  const professional = await Professional.findOne({ where: { userId: id } });
  if (professional) return errorResponse(res, "Failed", { status: false, message: "Professional Already Exist" })

  const profile = await Profile.findOne({ where: { userId: id } });
  const professionalCreate = await Professional.create({
    profileId: profile?.id, intro, regNum, yearsOfExp: experience, chargeFrom,
    file: { images: [] }, userId: id
  })
  const wallet = await Wallet.create({ userId: user?.id, type: WalletType.PROFESSIONAL })
  await ProfessionalSector.create({
    userId: id, sectorId, professionId, profileId: profile?.id,
    yearsOfExp: experience, default: true, chargeFrom
  })
  await profile?.update({ type: ProfileType.PROFESSIONAL, corperate: false, switch: true })
  await user?.update({ state: UserState.VERIFIED })
  successResponse(res, "Successful", professionalCreate)

}







export const corperateReg = async (req: Request, res: Response) => {
  let { nameOfOrg, phone, address, state, lga, postalCode, regNum, noOfEmployees } = req.body;
  let { id } = req.user;
  const user = await Users.findOne({ where: { id } });
  const corperate = await Corperate.findOne({ where: { userId: id } });
  if (corperate) return errorResponse(res, "Failed", { status: false, message: "Coorperate Account Already Exist" })
  const profile = await Profile.findOne({ where: { userId: id } });
  const coorperateCreate = await Corperate.create({
    nameOfOrg, phone, address, state, lga, postalCode, regNum, noOfEmployees, profileId: profile?.id,
    userId: id
  })
  const prof = await Professional.findOne({ where: { userId: id } })
  await profile?.update({ corperate: true, fullName: nameOfOrg })
  await prof?.update({ corperateId: coorperateCreate.id })
  await user?.update({ state: UserState.VERIFIED })
  successResponse(res, "Successful", coorperateCreate)
}




export const swithAccount = async (req: Request, res: Response) => {
  let { id } = req.user;
  let { type } = req.query;
  const profile = await Profile.findOne({ where: { userId: id } });
  if (type == ProfileType.CLIENT) {
    await profile?.update({ type: ProfileType.CLIENT })
    return successResponse(res, "Successful")
  } else {
    if (profile?.corperate == null) {
      return successResponseFalse(res, "Completed Proffesional account setup")
    } else {
      await profile?.update({ type: ProfileType.PROFESSIONAL })
      return successResponse(res, "Successful")
    }
  }
}




export const updateFcmToken = async (req: Request, res: Response) => {
  let { token } = req.body;
  let { id } = req.user;
  const user = await Users.findOne({ where: { id } });
  await user?.update({ fcmToken: token })
  successResponse(res, "Successful", token)
}







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
    const user = await Users.findOne({ where: { email: verify.client } });
    user?.update({ password: hashedPassword })
    let token = sign({ id: user!.id, email: user!.email, admin: true }, TOKEN_SECRET);
    await verify.destroy()
    return successResponse(res, "Successful", { ...user?.dataValues, token })
  });
};





export const resetPassword = async (req: Request, res: Response) => {
  const { newPassword, oldPassword } = req.body;
  const { id } = req.admin;
  const user = await Admin.findOne(
    {
      where: {
        id
      }
    }
  )
  const match = await compare(oldPassword, user!.password)
  if (!match) return errorResponse(res, "Failed", { status: false, message: "Invalid Password" })
  hash(newPassword, saltRounds, async function (err, hashedPassword) {
    user?.update({ password: hashedPassword, firstTimer: false, status: UserStatus.ACTIVE })
    let token = sign({ id: user!.id, email: user!.email, admin: true }, TOKEN_SECRET);
    return successResponse(res, "Password Updated", { ...user?.dataValues, token })
  });
};



export const adminLogin = async (req: Request, res: Response) => {
  let { email, password } = req.body;
  const admin = await Admin.findOne({ where: { email } })
  if (!admin) return errorResponse(res, "Failed", { status: false, message: "User does not exist" })
  const match = await compare(password, admin.password)
  if (!match) return errorResponse(res, "Failed", { status: false, message: "Invalid Credentials" })
  let token = sign({ id: admin.id, email: admin.email, admin: true }, TOKEN_SECRET);
  return successResponse(res, "Successful", { status: true, message: { ...admin.dataValues, token } })
}




export const ProfAccountInfo = async (req: Request, res: Response) => {
  const { id } = req.user;
  const profile = await Professional.findOne(
    {
      where: { userId: id },
      attributes: {
        exclude: []
      },
      include: [
        {
          model: Users,
          attributes: [
            "email", "phone"], include: [{
              model: Wallet,
              where: {
                type: WalletType.PROFESSIONAL
              }
            }]
        },
        {
          model: Corperate,
        },

        {
          model: Profile,
          attributes: [
            'createdAt', 'updatedAt', "fullName", "avatar", "lga", "state", "address", "bvn", "type"],
          include: [{
            model: ProfessionalSector, include: [
              { model: Sector },
              { model: Profession },
            ]
          },]
        }
      ],

    }
  )
  if (!profile) return errorResponse(res, "Failed", { status: false, message: "Profile Does'nt exist" })
  return successResponse(res, "Successful", profile)
};





export const accountInfo = async (req: Request, res: Response) => {
  const { id } = req.user;
  const profileX = await Profile.findOne(
    {
      where: { userId: id },
      include: [{
        model: Users,
        attributes: [
          'createdAt', 'updatedAt', "email", "phone"], include: [{
            model: Wallet,

          },

          { model: Dispute }
          ]
      }
      ],
    }
  )
  if (!profileX) return errorResponse(res, "Failed", { status: false, message: "Profile Does'nt exist" })
  if (profileX?.type == ProfileType.CLIENT) {

    const canceledJob = await Jobs.findAll({
      where: {
        status: JobStatus.CANCEL,
        userId: [id],
      }
    })


    const ongoingJob = await Jobs.findAll({
      where: {
        status: JobStatus.ONGOING,
        userId: [id],
      }
    })



    const completedJob = await Jobs.findAll({
      where: {
        status: JobStatus.COMPLETED,
        userId: [id],
      }
    })


    const rejectedJob = await Jobs.findAll({
      where: {
        status: [JobStatus.REJECTED, JobStatus.DISPUTED],
        userId: [id],
      }
    })


    const pendingJob = await Jobs.findAll({
      where: {
        // status: [JobStatus.PENDING, JobStatus.INVOICE],
        status: [JobStatus.PENDING],
        userId: [id],
      }
    })




    const review = await Review.findAll({
      where: {
        clientUserId: id
      },
      include: [{
        model: Users, as: "user",
        attributes: ["id"], include: [{ model: Profile, attributes: ["fullName", "avatar"] }]
      }]
    })


    const disputes = await Dispute.findAll({
      where: {
        [Op.or]: [
          { reporterId: id },
          { partnerId: id }
        ]
      }
    })


    const all_transactions = await Transactions.findAll({
      order: [
        ['id', 'DESC']
      ],
      where: {
        userId: id,
        type: TransactionType.DEBIT,
      },
      attributes: [[Sequelize.literal('SUM(amount)'), 'result']],
    });


    await profileX.update({
      totalExpense: all_transactions[0].dataValues.result ?? 0,
      totalReview: review.length, totalJobCanceled: canceledJob.length, totalDisputes: disputes.length,
      totalOngoingHire: ongoingJob.length, totalCompletedHire: completedJob.length, totalJobRejected: rejectedJob.length,
      totalPendingHire: pendingJob.length,
    })

    const profile = await Profile.findOne(
      {
        where: { userId: id },
        include: [{
          model: Users,
          attributes: [
            'createdAt', 'updatedAt', "email", "phone"],
          include: [{
            model: Wallet,
            where: {
              type: WalletType.CLIENT
            }
          },
          {
            model: Review,
            order: [
              ['id', 'DESC'],
            ],
            limit: 4,

          },

          { model: Dispute }
          ]
        }
        ],
      }
    )

    return successResponse(res, "Successful", {
      profile: profile,
      professional: null,
      corperate: null,
      review: review.slice(0, 4)
    })
  } else {

    const canceledJob = await Jobs.findAll({
      where: {
        status: JobStatus.CANCEL,
        ownerId: [id],

      }
    })



    const ongoingJob = await Jobs.findAll({
      where: {
        status: JobStatus.ONGOING,
        ownerId: [id],

      }
    })




    const pendingJob = await Jobs.findAll({
      where: {
        status: [JobStatus.PENDING, JobStatus.INVOICE],
        ownerId: [id],

      }
    })



    const rejectedJob = await Jobs.findAll({
      where: {
        status: [JobStatus.REJECTED, JobStatus.DISPUTED],
        ownerId: [id],

      }
    })



    const completedJob = await Jobs.findAll({
      where: {
        status: JobStatus.COMPLETED,
        ownerId: [id],

      }
    })


    const rejectedAmount = await Jobs.findAll({
      where: {
        status: JobStatus.CANCEL
      }, attributes: [[Sequelize.literal('COALESCE(SUM(total), 0.0)'), 'result']],
    })


    const completedAmount = await Jobs.findAll({
      where: {
        status: JobStatus.COMPLETED,
      }, attributes: [[Sequelize.literal('COALESCE(SUM(total), 0.0)'), 'result']]
    })

    const wallet = await Wallet.findOne({
      where: {
        userId: id,
        type: WalletType.PROFESSIONAL
      }
    })

    const updateProffessionalProfile = await Professional.findOne({ where: { userId: id } })
    const review = await Review.findAll({
      where: {
        proffesionalUserId: id
      },
      include: [{
        model: Users, as: "user",
        attributes: ["id"], include: [{ model: Profile, attributes: ["fullName", "avatar"] }]
      }]
    })


    const disputes = await Dispute.findAll({
      where: {
        [Op.or]: [
          { reporterId: id },
          { partnerId: id }
        ]
      }
    })


    await profileX.update({ totalReview: review.length, totalJobCanceled: canceledJob.length, totalDisputes: disputes.length })
    const all_transactions = await Transactions.findAll({
      order: [
        ['id', 'DESC']
      ],
      where: {
        userId: id,
        type: TransactionType.CREDIT,
        creditType: CreditType.EARNING
      },
      attributes: [[Sequelize.literal('SUM(amount)'), 'result']],
    });


    await updateProffessionalProfile?.update({
      totalEarning: all_transactions[0].dataValues.result ?? 0,
      availableWithdrawalAmount: wallet?.amount,
      totalReview: review.length,
      totalDispute: disputes.length,
      rejectedAmount: Number(rejectedAmount[0].dataValues.result),
      pendingAmount: wallet?.transitAmount,
      completedAmount: Number(completedAmount[0].dataValues.result),
      totalJobCompleted: completedJob.length, totalJobCanceled: canceledJob.length,
      totalJobPending: pendingJob.length, totalJobOngoing: ongoingJob.length,
      totalJobRejected: rejectedJob.length

    })




    const professionalProfile = await Professional.findAll(

      {
        order: [
          ['id', 'DESC']
        ],
        include: [

          { model: Corperate },
          {
            model: Profile,
            where: { userId: id },
            include: [

              {
                model: Users,
                attributes: [
                  'createdAt', 'updatedAt', "email", "phone"],
                include: [{
                  model: Wallet,
                  where: {
                    type: WalletType.PROFESSIONAL
                  }
                },

                {
                  model: Education,
                },
                {
                  model: Certification,
                },
                {
                  model: Experience,
                },
                {
                  model: Porfolio,
                  order: [
                    ['id', 'DESC'],
                  ],
                },
                {
                  model: Review,
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
      }
    )



    let data = deleteKey(professionalProfile[0].dataValues, "profile", "corperate");

    let mergedObj = {
      profile: professionalProfile[0].dataValues.profile,
      professional: { ...data },
      corperate: professionalProfile[0].dataValues.corperate,
      review: review.slice(0, 4)
    }

    if (!profileX) return errorResponse(res, "Failed", { status: false, message: "Profile Does'nt exist" })
    return successResponse(res, "Successful", mergedObj)
  }


};





export const accountSingleInfo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const profileX = await Profile.findOne(
    {
      where: { userId: id },
      include: [{
        model: Users,
        attributes: [
          'createdAt', 'updatedAt', "email", "phone"], include: [{
            model: Wallet,


          },

          { model: Dispute }
          ]
      }
      ],
    }
  )
  console.log(profileX?.type)
  if (!profileX) return errorResponse(res, "Failed", { status: false, message: "Profile Does'nt exist" })
  if (profileX?.type == ProfileType.CLIENT) {


    const canceledJob = await Jobs.findAll({
      where: {
        status: JobStatus.CANCEL,
        userId: [id],
      }
    })


    const ongoingJob = await Jobs.findAll({
      where: {
        status: JobStatus.ONGOING,
        userId: [id],
      }
    })



    const completedJob = await Jobs.findAll({
      where: {
        status: JobStatus.COMPLETED,
        userId: [id],
      }
    })


    const rejectedJob = await Jobs.findAll({
      where: {
        status: [JobStatus.REJECTED, JobStatus.DISPUTED],
        userId: [id],
      }
    })


    const pendingJob = await Jobs.findAll({
      where: {
        status: [JobStatus.PENDING, JobStatus.INVOICE],
        userId: [id],
      }
    })




    const review = await Review.findAll({
      where: {
        clientUserId: id
      },
      include: [{
        model: Users, as: "user",
        attributes: ["id"], include: [{ model: Profile, attributes: ["fullName", "avatar"] }]
      }]
    })


    const disputes = await Dispute.findAll({
      where: {
        [Op.or]: [
          { reporterId: id },
          { partnerId: id }
        ]
      }
    })

    const all_transactions = await Transactions.findAll({
      order: [
        ['id', 'DESC']
      ],
      where: {
        userId: id,
        type: TransactionType.DEBIT,
      },
      attributes: [[Sequelize.literal('SUM(amount)'), 'result']],
    });


    await profileX.update({
      totalExpense: all_transactions[0].dataValues.result ?? 0,
      totalReview: review.length, totalJobCanceled: canceledJob.length, totalDisputes: disputes.length,
      totalOngoingHire: ongoingJob.length, totalCompletedHire: completedJob.length, totalJobRejected: rejectedJob.length,
      totalPendingHire: pendingJob.length,
    })

    const profile = await Profile.findOne(
      {
        where: { userId: id },
        include: [{
          model: Users,
          attributes: [
            'createdAt', 'updatedAt', "email", "phone"], include: [{
              model: Wallet,
              where: {
                type: WalletType.CLIENT
              }

            },

            { model: Dispute }
            ]
        }
        ],
      }
    )
    return successResponse(res, "Successful", {
      profile: profile,
      professional: null,
      corperate: null,
      review: review.slice(0, 4)
    })
  } else {

    const canceledJob = await Jobs.findAll({
      where: {
        status: JobStatus.CANCEL,
        ownerId: [id],

      }
    })



    const ongoingJob = await Jobs.findAll({
      where: {
        status: JobStatus.ONGOING,
        ownerId: [id],

      }
    })




    const pendingJob = await Jobs.findAll({
      where: {
        status: [JobStatus.PENDING, JobStatus.INVOICE],
        ownerId: [id],

      }
    })



    const rejectedJob = await Jobs.findAll({
      where: {
        status: [JobStatus.REJECTED, JobStatus.DISPUTED],
        ownerId: [id],

      }
    })



    const completedJob = await Jobs.findAll({
      where: {
        status: JobStatus.COMPLETED,
        ownerId: [id],

      }
    })


    const rejectedAmount = await Jobs.findAll({
      where: {
        status: JobStatus.CANCEL
      }, attributes: [[Sequelize.literal('COALESCE(SUM(total), 0.0)'), 'result']],
    })


    const completedAmount = await Jobs.findAll({
      where: {
        status: JobStatus.COMPLETED,
      }, attributes: [[Sequelize.literal('COALESCE(SUM(total), 0.0)'), 'result']]
    })

    const wallet = await Wallet.findOne({
      where: {
        userId: id,
        type: WalletType.PROFESSIONAL
      }
    })


    const review = await Review.findAll({
      where: {
        proffesionalUserId: id,
      },
      include: [{
        model: Users, as: "user",
        attributes: ["id"], include: [{ model: Profile, attributes: ["fullName", "avatar"] }]
      }]
    })


    const disputes = await Dispute.findAll({
      where: {
        [Op.or]: [
          { reporterId: id },
          { partnerId: id }
        ]
      }
    })

    const updateProffessionalProfile = await Professional.findOne({
      where: { userId: id },
    })

    await profileX.update({ totalReview: review.length, totalJobCanceled: canceledJob.length, totalDisputes: disputes.length })

    const all_transactions = await Transactions.findAll({
      order: [
        ['id', 'DESC']
      ],
      where: {
        userId: id,
        type: TransactionType.CREDIT,
        creditType: CreditType.EARNING
      },
      attributes: [[Sequelize.literal('SUM(amount)'), 'result']],
    });


    await updateProffessionalProfile?.update({
      totalEarning: all_transactions[0].dataValues.result ?? 0,
      availableWithdrawalAmount: wallet?.amount,
      totalReview: review.length,
      totalDispute: disputes.length,
      rejectedAmount: Number(rejectedAmount[0].dataValues.result),
      pendingAmount: wallet?.transitAmount,
      completedAmount: Number(completedAmount[0].dataValues.result),
      totalJobCompleted: completedJob.length, totalJobCanceled: canceledJob.length,
      totalJobPending: pendingJob.length, totalJobOngoing: ongoingJob.length,
      totalJobRejected: rejectedJob.length

    })



    const professional = await Professional.findOne({
      where: { userId: id },
      include: [
        {
          model: Profile,

          include: [
            {
              model: ProfessionalSector,
              include: [
                { model: Sector },
                { model: Profession },
              ],
              order: [
                ['id', 'DESC'],
              ],

            }
          ]
        },
        { model: Corperate },

        {
          model: Users,
          include: [{ model: LanLog },

          {
            model: Education,
            order: [
              ['id', 'DESC'],
            ],
          },
          {
            model: Certification,
            order: [
              ['id', 'DESC'],
            ],
          },
          {
            model: Experience,
          },
          {
            model: Porfolio,
            order: [
              ['id', 'DESC'],
            ],
          },

          { model: Dispute }
          ]


        },
      ],

    });



    let data = deleteKey(professional?.dataValues, "profile", "corperate");

    return successResponse(res, "Successful", {
      profile: professional?.dataValues.profile,
      corperate: professional?.dataValues.corperate,
      professional: data,
      review: review.slice(0, 4)
    })
  }


};




export const postlocationData = async (req: Request, res: Response) => {

  const { lan, log, address } = req.body;
  const { id } = req.user;

  try {
    const getlocation = await LanLog.findOne({
      where: {
        userId: id
      }
    });
    const user = await Users.findOne({
      where: {
        id
      }
    });
    if (getlocation) {
      const location = await getlocation.update({
        lantitude: lan ?? getlocation.lantitude, longitude: log ?? getlocation.longitude,
        userId: id, address: address ?? getlocation.address,
        coordinates: { type: 'Point', coordinates: [lan ?? getlocation.lantitude, log ?? getlocation.longitude] },
      })
      if (location) return successResponse(res, "Updated Successfully", location);
      return errorResponse(res, "Failed updating Location");
    } else {
      const insertData = {
        lantitude: lan, longitude: log, userId: id, address,
        coordinates: { type: 'Point', coordinates: [lan, log] },
      }
      const location = await LanLog.create(insertData);
      await user?.update({ locationId: location.id })
      if (location) return successResponse(res, "Created Successfully", location);
      return errorResponse(res, "Failed Creating Location");
    }

  } catch (error) {
    console.log(error);
    return errorResponse(res, `An error occurred - ${error}`);
  }
}





export const verifyBvnDetail = async (req: Request, res: Response) => {
  try {
    const redis = new Redis();
    const { bvnInpt } = req.body;
    const { id } = req.user;
    const user = await Users.findOne({ where: { id } })
    const profile = await Profile.findOne({ where: { userId: id } })
    // console.log(profile);
    const cachedUserBvn = await redis.getData(`bvn-${profile!.id}`);
    if (cachedUserBvn) {
      const { first_name, middle_name, last_name, gender, phone } = JSON.parse(cachedUserBvn);
      const full_name = `${last_name ?? ""} ${first_name ?? ""} ${middle_name ?? ""}`;
      if (compareTwoStrings(`${full_name}`.toLowerCase(), `${profile?.fullName}`.toLowerCase()) < 0.72) {
        console.log(full_name)
        console.log(`${profile?.fullName}`)
        console.log(compareTwoStrings(`${full_name}`.toLowerCase(), `${profile?.fullName}`.toLowerCase()))
        await sendEmailResend(user!.email, "Verification Failed", `Hello ${profile?.fullName}, Your account validated failed,<br><br> reason: BVN data mismatch.<br><br> Try again. Best Regards.`);
        return errorResponse(res, 'BVN data mismatch');
      } else {
        await profile?.update({ verified: true })
        await sendEmailResend(user!.email, "Verification Successful", `Hello ${profile?.fullName}, Your account is now validated, you now have full access to all features.<br><br> Thank you for trusting Acepick. Best Regards.`);
        return successResponse(res, 'Verification Successful', { full_name, gender, phone });
      }
    }
    const bvn = await verifyBvn(bvnInpt);
    if (bvn!.message.verificationStatus == "NOT VERIFIED") return errorResponse(res, `${bvn!.message.description}`);
    await redis.setData(`bvn-${profile!.id}`, JSON.stringify(bvn.message.response), 3600); // cache in redis for 1 hour
    const { first_name, middle_name, last_name, gender, phone } = bvn.message.response;
    const full_name = `${last_name ?? ""} ${first_name ?? ""} ${middle_name ?? ""}`;
    console.log(bvn.message)
    if (compareTwoStrings(`${full_name}`.toLowerCase(), `${profile?.fullName}`.toLowerCase()) < 0.72) {
      console.log(compareTwoStrings(`${full_name}`.toLowerCase(), `${profile?.fullName}`.toLowerCase()))
      console.log(full_name)
      console.log(`${profile?.fullName}`)
      await sendEmailResend(user!.email, "Verification Failed", `Hello ${profile?.fullName},<br><br> Your account validated failed,<br><br> reason: BVN data mismatch.<br><br> Try again. Best Regards.`);
      return errorResponse(res, 'BVN data mismatch');
    } else {
      await profile?.update({ verified: true })
      await sendEmailResend(user!.email, "Verification Successful", `Hello ${profile?.fullName},<br><br> Your account is now validated, you now have full access to all features.<br><br> Thank you for trusting Acepick. Best Regards.`);
      return successResponse(res, 'Verification Successful', { full_name, gender, phone, });
    }
  } catch (error) {
    console.log(error);
    return errorResponse(res, `An error occurred - ${error}`);
  }
}




export const getEarningSummary = async (req: Request, res: Response) => {
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
  const monthF1: any = formatter.format(monthstartDate);
  const monthF2: any = formatter.format(previous1MonthstartDate);
  const monthF3: any = formatter.format(previous2MonthstartDate);
  const monthF4: any = formatter.format(previous3MonthstartDate);
  const monthF5: any = formatter.format(previous4MonthstartDate);

  const { id } = req.user;
  const profile = await Profile.findOne(
    {
      where: { userId: id },
      include: [{
        model: Users,
        attributes: [
          'createdAt', 'updatedAt', "email", "phone"]
      }
      ],
    }
  )
  console.log(profile?.type)
  if (!profile) return errorResponse(res, "Failed", { status: false, message: "Profile Does'nt exist" })
  if (profile?.type == ProfileType.CLIENT) {
    try {

      const all_transactions = await Transactions.findAll({
        order: [
          ['id', 'DESC']
        ],
        where: {
          userId: id,
          type: TransactionType.DEBIT,
        },
        attributes: [[Sequelize.literal('SUM(amount)'), 'result']],
      });

      const transactions = await Transactions.findAll({
        order: [
          ['id', 'DESC']
        ],
        where: {
          userId: id,
          createdAt: {
            [Op.gt]: monthstartDate,
            [Op.lt]: monthendDate,
          },
          type: TransactionType.DEBIT,
        },
        attributes: [[Sequelize.literal('SUM(amount)'), 'result']],
      });


      const transactions_1 = await Transactions.findAll({
        order: [
          ['id', 'DESC']
        ],
        where: {
          userId: id,
          createdAt: {
            [Op.gt]: previous1MonthstartDate,
            [Op.lt]: previous1MonthendDate,
          },
          type: TransactionType.DEBIT,
        },
        attributes: [[Sequelize.literal('SUM(amount)'), 'result']],
      });


      const transactions_2 = await Transactions.findAll({
        order: [
          ['id', 'DESC']
        ],
        where: {
          userId: id,
          createdAt: {
            [Op.gt]: previous2MonthstartDate,
            [Op.lt]: previous2MonthendDate,
          },
          type: TransactionType.DEBIT,
        },
        attributes: [[Sequelize.literal('SUM(amount)'), 'result']],
      });


      const transactions_3 = await Transactions.findAll({
        order: [
          ['id', 'DESC']
        ],
        where: {
          userId: id,
          createdAt: {
            [Op.gt]: previous3MonthstartDate,
            [Op.lt]: previous3MonthendDate,
          },
          type: TransactionType.DEBIT,
        },
        attributes: [[Sequelize.literal('SUM(amount)'), 'result']],
      });



      const transactions_4 = await Transactions.findAll({
        order: [
          ['id', 'DESC']
        ],
        where: {
          userId: id,
          createdAt: {
            [Op.gt]: previous4MonthstartDate,
            [Op.lt]: previous4MonthendDate,
          },
          type: TransactionType.DEBIT,
        },
        attributes: [[Sequelize.literal('SUM(amount)'), 'result']],
      });


      return successResponse(res, 'Sucessful', {
        month: [monthF1, monthF2,
          monthF3, monthF4,
          monthF5,
        ].reverse(),
        spending: [transactions[0].dataValues.result ?? 0, transactions_1[0].dataValues.result ?? 0,
        transactions_2[0].dataValues.result ?? 0, transactions_3[0].dataValues.result ?? 0,
        transactions_4[0].dataValues.result ?? 0,
        ].reverse(),

        totalSpending: all_transactions[0].dataValues.result ?? 0,
        currentMonthSpending: transactions[0].dataValues.result ?? 0,
      });

    } catch (error) {
      console.log(error);
      return handleResponse(res, 500, false, `An error occured - ${error}`);
    }
  } else {
    try {

      const all_transactions = await Transactions.findAll({
        order: [
          ['id', 'DESC']
        ],
        where: {
          userId: id,
          type: TransactionType.CREDIT,
          creditType: CreditType.EARNING
        },
        attributes: [[Sequelize.literal('SUM(amount)'), 'result']],
      });


      const transactions = await Transactions.findAll({
        order: [
          ['id', 'DESC']
        ],
        where: {
          userId: id,
          createdAt: {
            [Op.gt]: monthstartDate,
            [Op.lt]: monthendDate,
          },
          type: TransactionType.CREDIT,
          creditType: CreditType.EARNING
        },
        attributes: [[Sequelize.literal('SUM(amount)'), 'result']],
      });


      const transactions_1 = await Transactions.findAll({
        order: [
          ['id', 'DESC']
        ],
        where: {
          userId: id,
          createdAt: {
            [Op.gt]: previous1MonthstartDate,
            [Op.lt]: previous1MonthendDate,
          },
          creditType: CreditType.EARNING,
          type: TransactionType.CREDIT,
        },
        attributes: [[Sequelize.literal('SUM(amount)'), 'result']],
      });


      const transactions_2 = await Transactions.findAll({
        order: [
          ['id', 'DESC']
        ],
        where: {
          userId: id,
          createdAt: {
            [Op.gt]: previous2MonthstartDate,
            [Op.lt]: previous2MonthendDate,
          },
          creditType: CreditType.EARNING,
          type: TransactionType.CREDIT,
        },
        attributes: [[Sequelize.literal('SUM(amount)'), 'result']],
      });


      const transactions_3 = await Transactions.findAll({
        order: [
          ['id', 'DESC']
        ],
        where: {
          userId: id,
          createdAt: {
            [Op.gt]: previous3MonthstartDate,
            [Op.lt]: previous3MonthendDate,
          },
          type: TransactionType.CREDIT,
          creditType: CreditType.EARNING
        },
        attributes: [[Sequelize.literal('SUM(amount)'), 'result']],
      });



      const transactions_4 = await Transactions.findAll({
        order: [
          ['id', 'DESC']
        ],
        where: {
          userId: id,
          createdAt: {
            [Op.gt]: previous4MonthstartDate,
            [Op.lt]: previous4MonthendDate,
          },
          type: TransactionType.CREDIT,
          creditType: CreditType.EARNING
        },
        attributes: [[Sequelize.literal('SUM(amount)'), 'result']],
      });


      return successResponse(res, 'Sucessful', {
        month: [monthF1, monthF2,
          monthF3, monthF4,
          monthF5,
        ].reverse(),
        earning: [transactions[0].dataValues.result ?? 0, transactions_1[0].dataValues.result ?? 0,
        transactions_2[0].dataValues.result ?? 0, transactions_3[0].dataValues.result ?? 0,
        transactions_4[0].dataValues.result ?? 0,
        ].reverse(),
        totalEarning: all_transactions[0].dataValues.result ?? 0,
        currentMonthEarning: transactions[0].dataValues.result ?? 0,
      });

    } catch (error) {
      console.log(error);
      return handleResponse(res, 500, false, `An error occured - ${error}`);
    }
  }

};
