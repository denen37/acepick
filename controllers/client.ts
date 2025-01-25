import {
  convertHttpToHttps,
  errorResponse,
  getDistanceFromLatLonInKm,
  isEqual,
  isGreaterByOne,
  successResponse,
  successResponseFalse,
} from "../helpers/utility";
import { Request, Response } from "express";
import { Sector } from "../models/Sector";
import { Profession } from "../models/Profession";
import { Professional, WorkType } from "../models/Professional";
import { Profile, ProfileType } from "../models/Profile";
import { Users } from "../models/Users";
import { LanLog } from "../models/LanLog";
import { Corperate } from "../models/Cooperation";
import { Op, Sequelize } from "sequelize";
import { Favourite } from "../models/Favourites";
import { VoiceRecord } from "../models/VoiceRecording";
import { upload_cloud } from "../helpers/upload";
import { JobStatus, Jobs } from "../models/Jobs";
import { Material } from "../models/Material";
import { Dispute } from "../models/Dispute";
import { Wallet, WalletType } from "../models/Wallet";
import { CreditType, TransactionType, Transactions } from "../models/Transaction";
import { Review } from "../models/Review";
import { Education } from "../models/Education";
import { Porfolio } from "../models/Porfolio";
import { Certification } from "../models/Certification";
import { Experience } from "../models/Experience";
import { Ticket } from "../models/Ticket";
import { TicketMessage } from "../models/TicketMessage";
import { ProfessionalSector } from "../models/ProffesionalSector";
import { Blocked } from "../models/Block";
import { Report } from "../models/Report";
import { sendExpoNotification } from "../services/expo";
import { socketio } from "../app";
import { Redis } from "../services/redis";
const fs = require("fs");

export const getStates = async (req: Request, res: Response) => {
  fs.readFile("./keys/state.json", "utf8", (err: any, jsonString: any) => {
    if (err) {
      console.log("File read failed:", err);
      return errorResponse(res, "Failed");
    }
    let states = JSON.parse(jsonString.toString().toLowerCase());

    return successResponse(res, "Successful", states);
  });
};

export const addFavourite = async (req: Request, res: Response) => {
  const { professionalId } = req.body;
  const { id } = req.user;
  const professional = await Professional.findOne({
    where: { userId: professionalId },
  });
  const favourite = await Favourite.findOne({
    where: { professionalId: professional?.id, favouriteOwnerId: id },
  });
  if (!professional) return errorResponse(res, "Proffesional Not Found");
  if (favourite) {
    await favourite.destroy();
    return successResponse(res, "Successful", favourite);
  } else {
    const profile = await Profile.findOne({
      where: { userId: professionalId },
    });
    const fav = await Favourite.create({
      favouriteOwnerId: id,
      professionalId: professional.id,
      userId: professionalId,
      type: profile?.corperate
        ? ProfileType?.CORPERATE
        : ProfileType?.PROFESSIONAL,
    });
    return successResponse(res, "Successful", fav);
  }
};

export const deleteFavourite = async (req: Request, res: Response) => {
  const { favouriteId } = req.body;
  const { id } = req.user;
  const fav = await Favourite.findOne({ where: { id: favouriteId } });
  if (!fav) return errorResponse(res, "Favourite Not Found");
  await fav?.destroy();
  return successResponse(res, "Successful");
};

export const deleteAllFavourite = async (req: Request, res: Response) => {
  const { id } = req.user;
  const favourite = await Favourite.findAll({
    where: { favouriteOwnerId: id },
  });
  let index = 0;
  for (let value of favourite) {
    await value.destroy();
    index++;
  }
  if (index == favourite.length) {
    return successResponse(res, "Successful");
  }
};

export const getFavourite = async (req: Request, res: Response) => {
  const { id } = req.user;

  const professional = await Favourite.findAll({
    order: [["id", "DESC"]],
    where: { favouriteOwnerId: id, type: ProfileType.PROFESSIONAL },
    include: [
      {
        model: Professional,

        include: [
          {
            model: Review,
            include: [{
              model: Users, as: "user",
              attributes: ["id"], include: [{ model: Profile, attributes: ["fullName", "avatar"] }]
            }]
          },
          {
            model: Profile,
            where: {
              // type: ProfileType.PROFESSIONAL,
              corperate: false,
              verified: true,
            },
            include: [
              {
                model: ProfessionalSector,
                include: [{ model: Sector }, { model: Profession }],
              },
            ],
          },
          { model: Corperate },

          {
            model: Users,
            include: [
              { model: LanLog },

              {
                model: Education,
                order: [["id", "DESC"]],
              },
              {
                model: Certification,
                order: [["id", "DESC"]],
              },
              {
                model: Experience,
              },
              {
                model: Porfolio,
                order: [["id", "DESC"]],
              },

              { model: Dispute },
            ],
          },
        ],
      },
    ],
  });





  const cooperate = await Favourite.findAll({
    where: { favouriteOwnerId: id, type: ProfileType.CORPERATE },
    order: [["id", "DESC"]],
    include: [
      {
        model: Professional,

        include: [
          {
            model: Review,
            include: [{
              model: Users, as: "user",
              attributes: ["id"], include: [{ model: Profile, attributes: ["fullName", "avatar"] }]
            }]
          },

          {
            model: Profile,
            where: {
              // type: ProfileType.PROFESSIONAL,
              corperate: true,
              verified: true,
            },

            include: [
              {
                model: ProfessionalSector,
                include: [{ model: Sector }, { model: Profession }],
              },
            ],
          },
          { model: Corperate },

          {
            model: Users,
            include: [
              { model: LanLog },

              {
                model: Education,
                order: [["id", "DESC"]],
              },
              {
                model: Certification,
                order: [["id", "DESC"]],
              },
              {
                model: Experience,
              },
              {
                model: Porfolio,
                order: [["id", "DESC"]],
              },

              { model: Dispute },
            ],
          },
        ],
      },
    ],
  });



 
  return successResponse(res, "Successful", { professional, cooperate });
};

export const getRecording = async (req: Request, res: Response) => {
  const { recieverId } = req.query;
  const { id } = req.user;
  const record = await VoiceRecord.findAll({
    order: [["id", "DESC"]],
    where: { userId: id, recieverId },
  });
  if (!record)
    return errorResponse(res, "Failed", {
      status: false,
      message: "record not Found",
    });
  return successResponse(res, "Fetch Successfully", record);
};

export const deleteAllRecording = async (req: Request, res: Response) => {
  const { id } = req.body;

  let index = 0;
  // if (!record) return errorResponse(res, "Failed", { status: false, message: "record not Found" })
  for (let value of id) {
    const record = await VoiceRecord.findOne({
      where: {
        id: value,
      },
    });
    if (record) {
      const update = await record?.destroy();
      index++;
    } else {
      index++;
    }
    if (index == id.length) {
      return successResponse(res, "Deleted All Successfully");
    }
  }
};

export const deleteRecording = async (req: Request, res: Response) => {
  const { id } = req.query;
  const record = await VoiceRecord.findOne({
    where: {
      id,
    },
  });
  if (!record)
    return errorResponse(res, "Failed", {
      status: false,
      message: "record not Found",
    });

  const update = await record?.destroy();
  return successResponse(res, "Deleted Successfully", update);
};

export const uploadRecording = async (req: Request, res: Response) => {
  let { recieverId, file, duration } = req.body;
  let { id } = req.user;
  const profile = await Profile.findOne({ where: { userId: id } });
  const record = await VoiceRecord?.create({
    duration,
    userId: id,
    recieverId,
    profileId: profile?.id,
    url: file,
  });
  return successResponse(res, "Successful", record);
};

export const checkJobSeen = async (req: Request, res: Response) => {
  const { userId, ownerId } = req.query;
  const checkJob = await Jobs.findAll({ where: { [Op.and]: [
    { userId },  // replace `specificValue` with the actual value
    { ownerId }
  ] } });
  let seen;
  for(const value of checkJob){
    if(!value.seen){
      seen = true;
    }
  }
  return successResponse(res, "Successful", seen);
};



export const updateJobSeen = async (req: Request, res: Response) => {
  const { id } = req.body;
  const checkJob = await Jobs.findOne({ where: { [Op.or]: [
    { userId: id },
    { ownerId: id }
  ] } });
  if(!checkJob) return successResponseFalse(res, "Not Found");
  await checkJob?.update({seen: true})
  return successResponse(res, "Successful");
};




export const checkJobApprove = async (req: Request, res: Response) => {
  const { id } = req.query;
  const checkJob = await Jobs.findOne({ where: { [Op.or]: [
    { userId: id },  // replace `specificValue` with the actual value
    { ownerId: id }
  ] } });
  return successResponse(res, "Successful", checkJob?.approved);
};


export const updateJobApproved = async (req: Request, res: Response) => {
  const { id } = req.body;
  const checkJob = await Jobs.findOne({ where: { [Op.or]: [
    { userId: id },
    { ownerId: id }
  ] } });
  if(!checkJob) return successResponseFalse(res, "Not Found");
  await checkJob?.update({approved: true})
  return successResponse(res, "Successful");
};




export const createJob = async (req: Request, res: Response) => {
  let {
    description,
    title,
    mode,
    state,
    lga,
    fullAddress,
    long,
    total,
    workmannShip,
    isMaterial,
    gettingMaterial,
    lan,
    durationUnit,
    durationValue,
    userId,
    materials,
  } = req.body;
  let { id } = req.user;

  const job = await Jobs?.create({
    description,
    title,
    mode,
    state,
    lga,
    fullAddress,
    long,
    total,
    workmannShip,
    isMaterial,
    gettingMaterial,
    lan,
    durationUnit,
    durationValue,
    ownerId: id,
    userId: userId,
  });
  const jobOwner = await Professional.findOne({
    where: { userId: job.ownerId },
  });
  // await jobOwner?.update({ totalJobPending: (Number(jobOwner.totalJobPending) + 1) })

  const jobUser = await Profile.findOne({ where: { userId: job.userId } });
  // await jobUser?.update({ totalPendingHire: (Number(jobUser.totalPendingHire) + 1) })
  const wallet = await Wallet.findOne({where:{userId: jobUser?.userId, type: WalletType.CLIENT}})
  await sendExpoNotification(jobUser!.fcmToken, `${jobOwner?.profile?.fullName} sent you an invoice`);
  await Transactions.create({
    title: "Invoice Sent",
    description: `${jobOwner?.profile?.fullName} sent you an invoice`,
    type: TransactionType.NOTIFICATION, amount: 0,
    creditType: CreditType.NONE,
    status: "SUCCESSFUL", userId: job.userId, walletId: wallet?.id
  });
  const redis = new Redis();
  const cachedUserSocket: any = await redis.getData(`notification - ${job.userId} `)
  const socketUser = socketio.sockets.sockets.get(cachedUserSocket);
  if (socketUser) {
    const notificationsUser = await Transactions.findAll({
      order: [
        ['id', 'DESC']
      ],
      where: { userId: job.ownerId, read: false },
      include: [
        {
          model: Jobs, include: [{
            model: Material
          },
          {
            model: Users,
            as: "client",
            attributes: ["id"],
            include: [
              {
                model: Profile,
                attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                ],
              }
            ]
          },
          {
            model: Users,
            as: "owner",
            attributes: ["id"],
            include: [{
              model: Professional,
              include: [
                {
                  model: Profile,
                  attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                  ],
                  include: [
                    {
                      model: ProfessionalSector,
                      include: [
                        { model: Sector },
                        { model: Profession },
                      ],

                    }
                  ]
                }
              ]

            }]
          },
          { model: Dispute }]
        }
      ],
      limit: 1

    });
    socketUser.emit("notification", notificationsUser)

    const walletUser = await Wallet.findOne({ where: { userId: job!.userId, type: WalletType.CLIENT } })


    socketUser.emit("wallet", walletUser)
  }

  if (materials) {
    let newMaterial: any = [];
    for (let value of materials) {
      newMaterial.push({ ...value, jobId: job.id });
    }
    const material = await Material.bulkCreate(newMaterial);
    return successResponse(res, "Successful", { ...job.dataValues, material });
  } else {
    return successResponse(res, "Successful", {
      ...job.dataValues,
      material: [],
    });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  let {
    description,
    title,
    mode,
    state,
    lga,
    fullAddress,
    long,
    total,
    workmannShip,
    isMaterial,
    gettingMaterial,
    lan,
    durationUnit,
    durationValue,
    userId,
    jobId,
    status,
  } = req.body;
  let { id } = req.user;
  const oldJob = await Jobs.findOne({ where: { id: jobId } });
  if (!oldJob) return errorResponse(res, "Job not Found");
  const job = await oldJob?.update({
    description: description ?? oldJob.description,
    title: title ?? oldJob.title,
    mode: mode ?? oldJob.mode,
    state: state ?? oldJob.state,
    lga: lga ?? oldJob.lga,
    fullAddress: fullAddress ?? oldJob.fullAddress,
    long: long ?? oldJob.long,
    total: total ?? oldJob.total,
    status: status ?? oldJob.status,
    workmannShip: workmannShip ?? oldJob.workmannShip,
    isMaterial: isMaterial ?? oldJob.isMaterial,
    gettingMaterial: gettingMaterial ?? oldJob.gettingMaterial,
    lan: lan ?? oldJob.lan,
    durationUnit: durationUnit ?? oldJob.durationUnit,
    durationValue: durationValue ?? oldJob.durationValue,
    ownerId: id,
    userId: userId ?? oldJob.userId,
  });
  return successResponse(res, "Successful", job);
};

export const updateMaterial = async (req: Request, res: Response) => {
  let { description, price, quantity, materialId, subTotal } = req.body;
  let { id } = req.user;
  const oldMaterial = await Material.findOne({ where: { id: materialId } });
  if (!oldMaterial) return errorResponse(res, "Material not Found");
  const material = await oldMaterial?.update({
    description: description ?? oldMaterial.description,
    price: price ?? oldMaterial.price,
    subTotal: subTotal ?? oldMaterial.subTotal,
    quantity: quantity ?? oldMaterial.quantity,
  });
  return successResponse(res, "Successful", material);
};

export const deleteJob = async (req: Request, res: Response) => {
  const { id } = req.query;
  const job = await Jobs.findOne({
    where: {
      id,
    },
  });
  if (!job)
    return errorResponse(res, "Failed", {
      status: false,
      message: "job not Found",
    });
  const update = await job?.destroy();
  return successResponse(res, "Deleted Successfully", update);
};

export const getUserJobs = async (req: Request, res: Response) => {
  const { status, userId } = req.query;
  const { id } = req.user;
  let query: any = {};
  if (status) {
    query.status =
      status == JobStatus.REJECTED
        ? [JobStatus.REJECTED, JobStatus.DISPUTED]
        : status;
    // JobStatus.REJECTED, JobStatus.DISPUTED
  }
  if (userId) {
    const job = await Jobs.findAll({
      order: [["id", "DESC"]],
      where: {
        userId: [id],
        ownerId: [id, userId],
        ...query,
      },
      include: [
        {
          model: Material,
        },
        {
          model: Users,
          as: "client",
          attributes: ["id"],
          include: [
            {
              model: Profile,
              attributes: [
                "fullName",
                "avatar",
                "verified",
                "lga",
                "state",
                "address",
              ],
            },
          ],
        },
        {
          model: Users,
          as: "owner",
          attributes: ["id"],
          include: [
            {
              model: Professional,
              include: [
                {
                  model: Profile,
                  attributes: [
                    "fullName",
                    "avatar",
                    "verified",
                    "lga",
                    "state",
                    "address",
                  ],
                  include: [
                    {
                      model: ProfessionalSector,
                      include: [{ model: Sector }, { model: Profession }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        { model: Dispute },
      ],
    });

    return successResponse(res, "Fetched Successfully", job);
  } else {
    const job = await Jobs.findAll({
      order: [["id", "DESC"]],
      where: {
        [Op.or]: [{ ownerId: id }, { userId: id }],
        ...query,
      },
      include: [
        {
          model: Material,
        },
        {
          model: Users,
          as: "client",
          attributes: ["id"],
          include: [
            {
              model: Profile,
              attributes: [
                "fullName",
                "avatar",
                "verified",
                "lga",
                "state",
                "address",
              ],
            },
          ],
        },
        {
          model: Users,
          as: "owner",
          attributes: ["id"],
          include: [
            {
              model: Professional,
              include: [
                {
                  model: Profile,
                  attributes: [
                    "fullName",
                    "avatar",
                    "verified",
                    "lga",
                    "state",
                    "address",
                  ],
                  include: [
                    {
                      model: ProfessionalSector,
                      include: [{ model: Sector }, { model: Profession }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        { model: Dispute },
      ],
    });
    return successResponse(res, "Fetched Successfully", job);
  }
};

export const getSingleJob = async (req: Request, res: Response) => {
  const { jobId } = req.query;

  const job = await Jobs.findOne({
    where: {
      id: jobId,
    },
    include: [
      {
        model: Material,
      },
      {
        model: Users,
        as: "client",
        attributes: ["id"],
        include: [
          {
            model: Profile,
            attributes: [
              "fullName",
              "avatar",
              "verified",
              "lga",
              "state",
              "address",
            ],
          },
        ],
      },
      {
        model: Users,
        as: "owner",
        attributes: ["id"],
        include: [
          {
            model: Professional,
            include: [
              {
                model: Profile,
                attributes: [
                  "fullName",
                  "avatar",
                  "verified",
                  "lga",
                  "state",
                  "address",
                ],
                include: [
                  {
                    model: ProfessionalSector,
                    include: [{ model: Sector }, { model: Profession }],
                  },
                ],
              },
            ],
          },
        ],
      },
      { model: Dispute },
    ],
  });
  return successResponse(res, "Fetched Successfully", job);
};

export const getProfileJobs = async (req: Request, res: Response) => {
  const { status, userId } = req.query;
  const { id } = req.user;
  let query: any = {};
  console.log(id);

  if (status) {
    query.status = status;
  }
  if (userId) {
    const job = await Jobs.findAll({
      order: [["id", "DESC"]],
      where: {
        userId: [id],
        ownerId: [id, userId],
        status: ["PENDING", "ONGOING"],
      },
      include: [
        {
          model: Material,
        },
        {
          model: Users,
          as: "client",
          attributes: ["id"],
          include: [
            {
              model: Profile,
              attributes: [
                "fullName",
                "avatar",
                "verified",
                "lga",
                "state",
                "address",
              ],
            },
          ],
        },
        {
          model: Users,
          as: "owner",
          attributes: ["id"],
          include: [
            {
              model: Professional,
              include: [
                {
                  model: Profile,
                  attributes: [
                    "fullName",
                    "avatar",
                    "verified",
                    "lga",
                    "state",
                    "address",
                  ],
                  include: [
                    {
                      model: ProfessionalSector,
                      include: [{ model: Sector }, { model: Profession }],
                    },
                  ],
                },
              ],
            },
          ],
        },
        // {
        //   model: Users,
        //   as: "user",
        //   attributes: ["id"],
        //   include: [{model: Profile, attributes: ["fullName"]}]
        // },
        { model: Dispute },
      ],
    });

    return successResponse(res, "Fetched Successfully", job);
  } else {
    const job = await Jobs.findAll({
      order: [["id", "DESC"]],
      where: {
        [Op.or]: [{ ownerId: id }, { userId: id }],
        status: ["PENDING", "ONGOING"],
      },
      include: [
        {
          model: Material,
        },
        {
          model: Users,
          as: "client",
          attributes: ["id"],
          include: [
            {
              model: Profile,
              attributes: [
                "fullName",
                "avatar",
                "verified",
                "lga",
                "state",
                "address",
              ],
            },
          ],
        },
        {
          model: Users,
          as: "owner",
          attributes: ["id"],
          include: [
            {
              model: Professional,
              include: [
                {
                  model: Profile,
                  attributes: [
                    "fullName",
                    "avatar",
                    "verified",
                    "lga",
                    "state",
                    "address",
                  ],
                  include: [
                    {
                      model: ProfessionalSector,
                      include: [{ model: Sector }, { model: Profession }],
                    },
                  ],
                },
              ],

              //  include: [{model: Professional}]
            },
          ],
        },
        // {
        //   model: Users,
        //   as: "user",
        //   attributes: ["id"],
        //   include: [{model: Profile, attributes: ["fullName"]}]
        // },
        { model: Dispute },
      ],
    });

    return successResponse(res, "Fetched Successfully", job);
  }
};

export const getProviderJobs = async (req: Request, res: Response) => {
  const { status, userId } = req.query;
  const { id } = req.user;
  let query: any = {};

  if (status) {
    query.status = status;
  }

  if (status) {
    query.userId = userId;
  }

  const job = await Jobs.findAll({
    order: [["id", "DESC"]],
    where: {
      providerId: id,
      ...query,
    },
    include: [{ model: Material }, { model: Dispute }],
  });
  return successResponse(res, "Fetched Successfully", job);
};

export const createReview = async (req: Request, res: Response) => {
  let { review, id, jobId, rate, type } = req.body;
  const job = await Jobs.findOne({ where: { id: jobId } });
  if (!job) return successResponse(res, "Job not found");

  if (type == "CLIENT") {
    const professional = await Professional.findOne({
      where: { userId: job.ownerId },
    });
    const reviews = await Review?.create({
      review,
      rate,
      clientUserId: id,
      jobId,
      userId: req.user.id,
    });
    const findReviews = await Review?.findOne({
      where: {
        clientUserId: id,
        jobId,
        userId: req.user.id,
      },
    });
    if (findReviews) return successResponseFalse(res, "Already Reviewed Job");
    const profile = await Profile.findOne({ where: { userId: job.userId } });
    if (Number(profile?.rate) == 0) {
      await profile?.update({ rate, count: profile?.count + 1 });
      return successResponse(res, "Successful", reviews);
    } else {
      let mean = (Number(profile?.rate) + Number(rate)) / 2;

      await profile?.update({ rate: mean, count: profile?.count + 1 });
      return successResponse(res, "Successful", reviews);
    }
  } else {
    const professional = await Professional.findOne({ where: { userId: id } });
    if (!professional) return successResponse(res, "Professional not found");
    const findReviews = await Review?.findOne({
      where: {
        proffesionalId: professional?.id,
        jobId,
        userId: req.user.id,
      },
    });
    if (findReviews) return successResponseFalse(res, "Already Reviewed Job");

    const reviews = await Review?.create({
      review,
      rate,
      proffesionalId: professional?.id,
      jobId,
      userId: req.user.id,
      proffesionalUserId: professional?.userId,
    });
    const profile = await Profile.findOne({
      where: { id: professional?.profileId },
    });
    if (Number(profile?.rate) == 0) {
      await profile?.update({ rate, count: profile?.count + 1 });

      return successResponse(res, "Successful", reviews);
    } else {
      let mean = (Number(profile?.rate) + Number(rate)) / 2;

      await profile?.update({ rate: mean, count: profile?.count + 1 });
      return successResponse(res, "Successful", reviews);
    }
  }
};

export const createEducation = async (req: Request, res: Response) => {
  let { school, degreeType, course, gradDate } = req.body;
  let { id } = req.user;
  const education = await Education?.create({
    school,
    degreeType,
    course,
    gradDate,
    userId: id,
  });
  return successResponse(res, "Successful", education);
};

export const deleteEducation = async (req: Request, res: Response) => {
  const { id } = req.query;
  const education = await Education.findOne({
    where: {
      id,
    },
  });
  if (!education)
    return errorResponse(res, "Failed", {
      status: false,
      message: "Education not Found",
    });
  const update = await education?.destroy();
  return successResponse(res, "Deleted Successfully", update);
};

export const updateEducation = async (req: Request, res: Response) => {
  let { school, degreeType, course, gradDate, educationId } = req.body;
  let { id } = req.user;
  const oldEducation = await Education.findOne({ where: { id: educationId } });
  if (!oldEducation) return errorResponse(res, "Education not Found");
  const education = await oldEducation?.update({
    school: school ?? oldEducation.school,
    degreeType: degreeType ?? oldEducation.degreeType,
    course: course ?? oldEducation.course,
    gradDate: gradDate ?? oldEducation.gradDate,
    // endDate: endDate ?? oldEducation.endDate
  });
  return successResponse(res, "Successful", education);
};

export const createPorfolio = async (req: Request, res: Response) => {
  let { title, description, duration, date, file } = req.body;
  let { id } = req.user;
  const porfolio = await Porfolio?.create({
    title,
    description,
    duration,
    date,
    file: convertHttpToHttps(file),
    userId: id,
  });
  return successResponse(res, "Successful", porfolio);
};

export const deletePorfolio = async (req: Request, res: Response) => {
  const { id } = req.query;
  const porfolio = await Porfolio.findOne({
    where: {
      id,
    },
  });
  if (!porfolio)
    return errorResponse(res, "Failed", {
      status: false,
      message: "Porfolio not Found",
    });
  const update = await porfolio?.destroy();
  return successResponse(res, "Deleted Successfully", update);
};

export const updatePorfolio = async (req: Request, res: Response) => {
  let { title, description, duration, date, file, porfolioId } = req.body;
  let { id } = req.user;
  const oldPorfolio = await Porfolio.findOne({ where: { id: porfolioId } });
  if (!oldPorfolio) return errorResponse(res, "Education not Found");
  const porfolio = await oldPorfolio?.update({
    description: description ?? oldPorfolio.description,
    title: title ?? oldPorfolio.title,
    duration: duration ?? oldPorfolio.duration,
    date: date ?? oldPorfolio.date,
    file: convertHttpToHttps(file) ?? oldPorfolio.file,
  });
  return successResponse(res, "Successful", porfolio);
};

export const createCertification = async (req: Request, res: Response) => {
  let { title, companyIssue, date } = req.body;
  let { id } = req.user;
  const certification = await Certification?.create({
    title,
    companyIssue,
    date,
    userId: id,
  });
  return successResponse(res, "Successful", certification);
};

export const deleteCertification = async (req: Request, res: Response) => {
  const { id } = req.query;
  const certification = await Certification.findOne({
    where: {
      id,
    },
  });
  if (!certification)
    return errorResponse(res, "Failed", {
      status: false,
      message: "Certification not Found",
    });
  const update = await certification?.destroy();
  return successResponse(res, "Deleted Successfully", update);
};

export const updateCertification = async (req: Request, res: Response) => {
  let { title, companyIssue, date, certificationId } = req.body;
  let { id } = req.user;
  const oldCertification = await Certification.findOne({
    where: { id: certificationId },
  });
  if (!oldCertification) return errorResponse(res, "Certification not Found");
  const education = await oldCertification?.update({
    companyIssue: companyIssue ?? oldCertification.companyIssue,
    title: title ?? oldCertification.title,
    date: date ?? oldCertification.date,
  });
  return successResponse(res, "Successful", education);
};

export const createExperience = async (req: Request, res: Response) => {
  let { postHeld, workPlace, startDate, endDate } = req.body;
  let { id } = req.user;
  const experience = await Experience?.create({
    postHeld,
    workPlace,
    startDate,
    endDate,
    userId: id,
  });
  return successResponse(res, "Successful", experience);
};

export const deleteExperience = async (req: Request, res: Response) => {
  const { id } = req.query;
  const experience = await Experience.findOne({
    where: {
      id,
    },
  });
  if (!experience)
    return errorResponse(res, "Failed", {
      status: false,
      message: "Experience not Found",
    });
  const update = await experience?.destroy();
  return successResponse(res, "Deleted Successfully", update);
};

export const updateExperience = async (req: Request, res: Response) => {
  let { postHeld, workPlace, startDate, endDate, experienceId } = req.body;
  let { id } = req.user;
  const oldExperience = await Experience.findOne({
    where: { id: experienceId },
  });
  if (!oldExperience) return errorResponse(res, "Certification not Found");
  const education = await oldExperience?.update({
    workPlace: workPlace ?? oldExperience.workPlace,
    postHeld: postHeld ?? oldExperience.postHeld,
    startDate: startDate ?? oldExperience.startDate,
    endDate: endDate ?? oldExperience.endDate,
  });

  return successResponse(res, "Successful", education);
};

export const postTicketMessage = async (req: Request, res: Response) => {
  let { ticketId, message, image } = req.body;
  const { id } = req.user;
  // userId =  id;
  const getTicket = await Ticket.findOne({ where: { id: ticketId } });
  if (!getTicket) return successResponse(res, "Ticket Not Found");

  if (req.files) {
    //     // Read content from the file
    let uploadedImageurl = [];
    for (var file of req.files as any) {
      // upload image here
      const result = await upload_cloud(file.path.replace(/ /g, "_"));
      uploadedImageurl.push(result.secure_url);
      image = uploadedImageurl;
      console.log(image);
    }
    try {
      const insertData = {
        image: uploadedImageurl[0],
        message,
        admin: false,
        ticketId: Number(ticketId),
        userId: getTicket.userId,
        adminId: getTicket.adminId,
      };
      const createTicketMessage = await TicketMessage.create(insertData);
      if (createTicketMessage)
        return successResponse(
          res,
          "Created Successfully",
          createTicketMessage
        );
      return errorResponse(res, "Failed Creating Ticket Message");
    } catch (error) {
      console.log(error);
      return errorResponse(res, `An error occurred - ${error}`);
    }
  } else {
    try {
      const insertData = {
        message,
        admin: false,
        ticketId: Number(ticketId),
        adminId: getTicket.adminId,
        userId: getTicket.userId,
      };
      const createTicketMessage = await TicketMessage.create(insertData);
      if (createTicketMessage)
        return successResponse(
          res,
          "Created Successfully",
          createTicketMessage
        );
      return errorResponse(res, "Failed Creating Ticket Message");
    } catch (error) {
      console.log(error);
      return errorResponse(res, `An error occurred - ${error}`);
    }
  }
};

export const createProfSector = async (req: Request, res: Response) => {
  let { sectorId, professionId, yearsOfExp, chargeFrom } = req.body;
  let { id } = req.user;
  const proffesional = await Professional.findOne({ where: { userId: id } });
  const prof_sec = await ProfessionalSector?.create({
    userId: id,
    sectorId,
    professionId,
    profileId: proffesional?.profileId,
    chargeFrom,
    yearsOfExp,
    default: false,
  });
  return successResponse(res, "Successful", prof_sec);
};

export const createBlock = async (req: Request, res: Response) => {
  let { blockedUserid } = req.body;
  let { id } = req.user;
  const blocks = await Blocked?.findOne({ where: { blockedUserid } });
  if (blocks) return successResponse(res, "Successful");
  const profile = await Profile.findOne({ where: { userId: blockedUserid } });
  const prof_sec = await Blocked?.create({
    blockedUserid,
    userId: id,
    avatar: profile?.avatar,
    fullName: profile?.fullName,

    // type: profile?.corperate ? ProfileType?.CORPERATE : ProfileType?.PROFESSIONAL
  });
  return successResponse(res, "Successful", prof_sec);
};

export const createReport = async (req: Request, res: Response) => {
  let { cause, userId } = req.body;
  let { id } = req.user;
  const profile = await Profile.findOne({ where: { userId } });
  const report = await Report?.create({
    cause,
    userId,
    reporterId: id,
    avatar: profile?.avatar,
    fullName: profile?.fullName,
  });
  return successResponse(res, "Successful", report);
};

export const fetchAllReport = async (req: Request, res: Response) => {
  let { id } = req.user;
  const report = await Report?.findAll({
    where: { reporterId: id },
  });
  return successResponse(res, "Successful", report);
};

export const fetchAllBlock = async (req: Request, res: Response) => {
  let { id } = req.user;

  const blocked = await Blocked.findAll({
    where: { userId: id },
    order: [["id", "DESC"]],
  });

  return successResponse(res, "Successful", blocked);
};

export const unBlock = async (req: Request, res: Response) => {
  const { blockedUserid } = req.body;
  const blocked = await Blocked.findOne({
    where: {
      blockedUserid,
    },
  });
  const update = await blocked?.destroy();
  return successResponse(res, "Deleted Successfully", update);
};

export const deleteProfSector = async (req: Request, res: Response) => {
  const { id } = req.query;
  const prof_sec = await ProfessionalSector.findOne({
    where: {
      id,
    },
  });
  if (!prof_sec)
    return errorResponse(res, "Failed", {
      status: false,
      message: "Professional Sector not Found",
    });
  const update = await prof_sec?.destroy();
  return successResponse(res, "Deleted Successfully", update);
};

export const updateProfSector = async (req: Request, res: Response) => {
  let { sectorId, professionId, yearsOfExp, id } = req.body;
  const oldProSec = await ProfessionalSector.findOne({ where: { id } });
  if (!oldProSec) return errorResponse(res, "Education not Found");
  const pro_sec = await oldProSec?.update({
    sectorId: sectorId ?? oldProSec.sectorId,
    yearsOfExp: yearsOfExp ?? oldProSec.yearsOfExp,
    professionId: professionId ?? oldProSec.professionId,
  });
  return successResponse(res, "Successful", pro_sec);
};

export const getProfSector = async (req: Request, res: Response) => {
  const { id } = req.user;
  const professionalSector = await ProfessionalSector.findAll({
    order: [["id", "DESC"]],
    where: { userId: id },
    include: [{ model: Sector }, { model: Profession }],
  });
  return successResponse(res, "Successful", professionalSector);
};

export const matchLocation = async (req: Request, res: Response) => {
  const {
    clientLantitude,
    clientLongitude,
    ownerLongitude,
    type,
    ownerLantitude,
    jobId,
  } = req.body;

  const getJob = await Jobs.findOne({
    where: {
      id: jobId,
    },
    include: [
      {
        model: Material,
      },
      {
        model: Users,
        as: "client",
        attributes: ["id"],
        include: [
          {
            model: Profile,
            attributes: [
              "fullName",
              "avatar",
              "verified",
              "lga",
              "state",
              "address",
            ],
          },
        ],
      },
      {
        model: Users,
        as: "owner",
        attributes: ["id"],
        include: [
          {
            model: Professional,
            include: [
              {
                model: Profile,
                attributes: [
                  "fullName",
                  "avatar",
                  "verified",
                  "lga",
                  "state",
                  "address",
                ],
                include: [
                  {
                    model: ProfessionalSector,
                    include: [{ model: Sector }, { model: Profession }],
                  },
                ],
              },
            ],
          },
        ],
      },
      { model: Dispute },
    ],
  });

  if (type == "DEPARTURE") {
    if (
      !getJob?.currentOwnerLocationDeparture ||
      !getJob?.currentClientLocationDeparture
    ) {
      await getJob?.update({
        ownerLocationDeparture:
          !ownerLantitude && !ownerLongitude
            ? getJob.ownerLocationDeparture
            : {
                ownerLocationDeparture: [
                  {
                    ownerLongitude,
                    ownerLantitude,
                    time: new Date(),
                  },
                ].concat(
                  getJob.ownerLocationDeparture == null
                    ? []
                    : getJob.ownerLocationDeparture
                ),
              },
        clientLocationDeparture:
          !clientLantitude && !clientLongitude
            ? getJob.clientLocationDeparture
            : {
                clientLocationDeparture: [
                  {
                    clientLantitude,
                    clientLongitude,
                    time: new Date(),
                  },
                ].concat(
                  getJob.clientLocationDeparture == null
                    ? []
                    : getJob.clientLocationDeparture.clientLocationDeparture
                ),
              },
        currentOwnerLocationDeparture:
          !ownerLantitude && !ownerLongitude
            ? getJob.currentOwnerLocationDeparture
            : {
                currentOwnerLocationDeparture: [
                  {
                    ownerLongitude,
                    ownerLantitude,
                    time: new Date(),
                  },
                ],
              },
        currentClientLocationDeparture:
          !clientLantitude && !clientLongitude
            ? getJob.currentClientLocationDeparture
            : {
                currentClientLocationDeparture: [
                  {
                    clientLantitude,
                    clientLongitude,
                    time: new Date(),
                  },
                ],
              },
        ownerMatchDeparture:
          !ownerLantitude && !ownerLongitude
            ? getJob.ownerMatchDeparture
            : true,
        clientMatchDeparture:
          !clientLantitude && !clientLongitude
            ? getJob.clientMatchDeparture
            : true,
      });

      const newGetJob = await Jobs.findOne({
        where: {
          id: jobId,
        },
        include: [
          {
            model: Material,
          },
          {
            model: Users,
            as: "client",
            attributes: ["id"],
            include: [
              {
                model: Profile,
                attributes: [
                  "fullName",
                  "avatar",
                  "verified",
                  "lga",
                  "state",
                  "address",
                ],
              },
            ],
          },
          {
            model: Users,
            as: "owner",
            attributes: ["id"],
            include: [
              {
                model: Professional,
                include: [
                  {
                    model: Profile,
                    attributes: [
                      "fullName",
                      "avatar",
                      "verified",
                      "lga",
                      "state",
                      "address",
                    ],
                    include: [
                      {
                        model: ProfessionalSector,
                        include: [{ model: Sector }, { model: Profession }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          { model: Dispute },
        ],
      });

      if (
        newGetJob?.currentOwnerLocationDeparture &&
        newGetJob?.currentClientLocationDeparture
      ) {
        let value = getDistanceFromLatLonInKm(
          newGetJob?.currentClientLocationDeparture
            .currentClientLocationDeparture[0].clientLantitude,
          newGetJob?.currentClientLocationDeparture
            .currentClientLocationDeparture[0].clientLongitude,
          newGetJob?.currentOwnerLocationDeparture
            .currentOwnerLocationDeparture[0].ownerLongitude,
          newGetJob?.currentOwnerLocationDeparture
            .currentOwnerLocationDeparture[0].ownerLantitude
        );
        if (value <= 200) {
          await newGetJob.update({
            departureDaysCount: Number(newGetJob.departureDaysCount) + 1,
          });

          const owner = await Professional.findOne({
            where: { userId: newGetJob?.ownerId },
          });
          const profile = await Profile.findOne({
            where: { userId: newGetJob?.userId },
          });
          const ongoingJobUser = await Jobs.findAll({
            where: {
              status: JobStatus.ONGOING,
              userId: [newGetJob.userId],
            },
          });
          const pendingJobUser = await Jobs.findAll({
            where: {
              status: JobStatus.PENDING,
              userId: [newGetJob.userId],
            },
          });
          const ongoingJobOwner = await Jobs.findAll({
            where: {
              status: JobStatus.ONGOING,
              ownerId: [newGetJob.ownerId],
            },
          });
          const pendingJobOwner = await Jobs.findAll({
            where: {
              status: JobStatus.PENDING,
              ownerId: [newGetJob.ownerId],
            },
          });
          await owner?.update({
            workType: WorkType.BUSY,
            totalJobOngoing: ongoingJobOwner.length,
            totalJobPending: pendingJobOwner.length,
          });
          await profile?.update({
            totalOngoingHire: ongoingJobUser.length,
            totalPendingHire: pendingJobUser.length,
          });
          await newGetJob.update({
            isLocationMatch: true,
          });
          return successResponse(
            res,
            "Departure Matched Successful",
            newGetJob
          );
        } else {
          return successResponseFalse(
            res,
            "Departure not in close range with client"
          );
        }
      } else {
        const newGetJob = await Jobs.findOne({
          where: {
            id: jobId,
          },
          include: [
            {
              model: Material,
            },
            {
              model: Users,
              as: "client",
              attributes: ["id"],
              include: [
                {
                  model: Profile,
                  attributes: [
                    "fullName",
                    "avatar",
                    "verified",
                    "lga",
                    "state",
                    "address",
                  ],
                },
              ],
            },
            {
              model: Users,
              as: "owner",
              attributes: ["id"],
              include: [
                {
                  model: Professional,
                  include: [
                    {
                      model: Profile,
                      attributes: [
                        "fullName",
                        "avatar",
                        "verified",
                        "lga",
                        "state",
                        "address",
                      ],
                      include: [
                        {
                          model: ProfessionalSector,
                          include: [{ model: Sector }, { model: Profession }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            { model: Dispute },
          ],
        });

        return successResponse(res, "Departure  location updated", newGetJob);
      }
    } else {
      const newGetJob = await Jobs.findOne({
        where: {
          id: jobId,
        },
        include: [
          {
            model: Material,
          },
          {
            model: Users,
            as: "client",
            attributes: ["id"],
            include: [
              {
                model: Profile,
                attributes: [
                  "fullName",
                  "avatar",
                  "verified",
                  "lga",
                  "state",
                  "address",
                ],
              },
            ],
          },
          {
            model: Users,
            as: "owner",
            attributes: ["id"],
            include: [
              {
                model: Professional,
                include: [
                  {
                    model: Profile,
                    attributes: [
                      "fullName",
                      "avatar",
                      "verified",
                      "lga",
                      "state",
                      "address",
                    ],
                    include: [
                      {
                        model: ProfessionalSector,
                        include: [{ model: Sector }, { model: Profession }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          { model: Dispute },
        ],
      });
      return successResponse(res, "Departure location updated");
    }
  } else {
    if (
      !getJob?.currentClientLocationArrival ||
      !getJob?.currentOwnerLocationArrival
    ) {
      await getJob?.update({
        ownerLocationArrival:
          !ownerLantitude || !ownerLongitude
            ? getJob.ownerLocationArrival
            : {
                ownerLocationArrival: [
                  {
                    ownerLongitude,
                    ownerLantitude,
                    time: new Date(),
                  },
                ].concat(
                  getJob.ownerLocationArrival == null
                    ? []
                    : getJob.ownerLocationArrival.ownerLocationArrival
                ),
              },
        clientLocationArrival:
          !clientLantitude || !clientLongitude
            ? getJob.clientLocationArrival
            : {
                clientLocationArrival: [
                  {
                    clientLantitude,
                    clientLongitude,
                    time: new Date(),
                  },
                ].concat(
                  getJob.clientLocationArrival == null
                    ? []
                    : getJob.clientLocationArrival.clientLocationArrival
                ),
              },
        currentOwnerLocationArrival:
          !ownerLantitude || !ownerLongitude
            ? getJob.currentOwnerLocationArrival
            : {
                currentOwnerLocationArrival: [
                  {
                    ownerLongitude,
                    ownerLantitude,
                    time: new Date(),
                  },
                ],
              },
        currentClientLocationArrival:
          !clientLantitude || !clientLongitude
            ? getJob.currentClientLocationArrival
            : {
                currentClientLocationArrival: [
                  {
                    clientLantitude,
                    clientLongitude,
                    time: new Date(),
                  },
                ],
              },
        ownerMatchArrival:
          !ownerLantitude && !ownerLongitude ? getJob.ownerMatchArrival : true,
        clientMatchArrival:
          !clientLantitude && !clientLongitude
            ? getJob.clientMatchArrival
            : true,
      });

      const newGetJob = await Jobs.findOne({
        where: {
          id: jobId,
        },
        include: [
          {
            model: Material,
          },
          {
            model: Users,
            as: "client",
            attributes: ["id"],
            include: [
              {
                model: Profile,
                attributes: [
                  "fullName",
                  "avatar",
                  "verified",
                  "lga",
                  "state",
                  "address",
                ],
              },
            ],
          },
          {
            model: Users,
            as: "owner",
            attributes: ["id"],
            include: [
              {
                model: Professional,
                include: [
                  {
                    model: Profile,
                    attributes: [
                      "fullName",
                      "avatar",
                      "verified",
                      "lga",
                      "state",
                      "address",
                    ],
                    include: [
                      {
                        model: ProfessionalSector,
                        include: [{ model: Sector }, { model: Profession }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          { model: Dispute },
        ],
      });

      if (
        newGetJob?.currentClientLocationArrival &&
        newGetJob?.currentOwnerLocationArrival
      ) {
        let value = getDistanceFromLatLonInKm(
          newGetJob?.currentClientLocationArrival
            .currentClientLocationArrival[0].clientLantitude,
          newGetJob?.currentClientLocationArrival
            .currentClientLocationArrival[0].clientLongitude,
          newGetJob?.currentOwnerLocationArrival.currentOwnerLocationArrival[0]
            .ownerLongitude,
          newGetJob?.currentOwnerLocationArrival.currentOwnerLocationArrival[0]
            .ownerLantitude
        );
        if (value <= 200) {
          await newGetJob.update({
            departureDaysCount: Number(newGetJob.departureDaysCount) + 1,
          });
          const owner = await Professional.findOne({
            where: { userId: newGetJob?.ownerId },
          });

          await newGetJob.update({
            status: JobStatus.ONGOING,
          });

          const profile = await Profile.findOne({
            where: { userId: newGetJob?.userId },
          });
          const ongoingJobUser = await Jobs.findAll({
            where: {
              status: JobStatus.ONGOING,
              userId: [newGetJob.userId],
            },
          });
          const pendingJobUser = await Jobs.findAll({
            where: {
              status: JobStatus.PENDING,
              userId: [newGetJob.userId],
            },
          });
          const ongoingJobOwner = await Jobs.findAll({
            where: {
              status: JobStatus.ONGOING,
              ownerId: [newGetJob.ownerId],
            },
          });
          const pendingJobOwner = await Jobs.findAll({
            where: {
              status: JobStatus.PENDING,
              ownerId: [newGetJob.ownerId],
            },
          });
          await owner?.update({
            workType: WorkType.BUSY,
            totalJobOngoing: ongoingJobOwner.length,
            totalJobPending: pendingJobOwner.length,
          });
          await profile?.update({
            totalOngoingHire: ongoingJobUser.length,
            totalPendingHire: pendingJobUser.length,
          });

          console.log("aaaaaaaaa");
          return successResponse(res, "Arrival Matched Successful", newGetJob);
        } else {
          console.log("bbbbbbbbb");
          return successResponseFalse(
            res,
            "Arrival not in close range with client"
          );
        }
      } else {
        const newGetJob = await Jobs.findOne({
          where: {
            id: jobId,
          },
          include: [
            {
              model: Material,
            },
            {
              model: Users,
              as: "client",
              attributes: ["id"],
              include: [
                {
                  model: Profile,
                  attributes: [
                    "fullName",
                    "avatar",
                    "verified",
                    "lga",
                    "state",
                    "address",
                  ],
                },
              ],
            },
            {
              model: Users,
              as: "owner",
              attributes: ["id"],
              include: [
                {
                  model: Professional,
                  include: [
                    {
                      model: Profile,
                      attributes: [
                        "fullName",
                        "avatar",
                        "verified",
                        "lga",
                        "state",
                        "address",
                      ],
                      include: [
                        {
                          model: ProfessionalSector,
                          include: [{ model: Sector }, { model: Profession }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            { model: Dispute },
          ],
        });

        console.log("cccccccccccc");
        return successResponse(res, "Arrival  location updated", newGetJob);
      }
    } else {
      const newGetJob = await Jobs.findOne({
        where: {
          id: jobId,
        },
        include: [
          {
            model: Material,
          },
          {
            model: Users,
            as: "client",
            attributes: ["id"],
            include: [
              {
                model: Profile,
                attributes: [
                  "fullName",
                  "avatar",
                  "verified",
                  "lga",
                  "state",
                  "address",
                ],
              },
            ],
          },
          {
            model: Users,
            as: "owner",
            attributes: ["id"],
            include: [
              {
                model: Professional,
                include: [
                  {
                    model: Profile,
                    attributes: [
                      "fullName",
                      "avatar",
                      "verified",
                      "lga",
                      "state",
                      "address",
                    ],
                    include: [
                      {
                        model: ProfessionalSector,
                        include: [{ model: Sector }, { model: Profession }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          { model: Dispute },
        ],
      });

      return successResponse(res, "Arrival location updated", newGetJob);
    }
  }
};

export const getReview = async (req: Request, res: Response) => {
  const { id } = req.user;
  const profile = await Profile.findOne({ where: { userId: id } });
  if (profile?.type == ProfileType.CLIENT) {
    const review = await Review.findAll({
      where: {
        clientUserId: id,
      },
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id"],
          include: [{ model: Profile, attributes: ["fullName", "avatar"] }],
        },
      ],
    });
    return successResponse(res, "Successful", review);
  } else {
    const review = await Review.findAll({
      where: {
        proffesionalUserId: id,
      },
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id"],
          include: [{ model: Profile, attributes: ["fullName", "avatar"] }],
        },
      ],
    });
    return successResponse(res, "Successful", review);
  }
};
