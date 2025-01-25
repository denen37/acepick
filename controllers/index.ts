import {
  deleteKey,
  errorResponse,
  getDistanceFromLatLonInKm,
  successResponse,
  successResponseFalse,
} from "../helpers/utility";
import { Request, Response } from "express";
import { Sector } from "../models/Sector";
import { Profession } from "../models/Profession";
import { Professional } from "../models/Professional";
import { Profile, ProfileType } from "../models/Profile";
import { Users } from "../models/Users";
import { LanLog } from "../models/LanLog";
import { Corperate } from "../models/Cooperation";
import { Op } from "sequelize";
import { Education } from "../models/Education";
import { Certification } from "../models/Certification";
import { Experience } from "../models/Experience";
import { Porfolio } from "../models/Porfolio";
import { Dispute } from "../models/Dispute";
import { ProfessionalSector } from "../models/ProffesionalSector";
import { upload_cloud } from "../helpers/upload";
import { Review } from "../models/Review";
import { Jobs, JobStatus } from "../models/Jobs";
import { sendExpoNotification } from "../services/expo";

export const apiIndex = async (req: Request, res: Response) =>
  successResponse(res, "API Working!");


export const testN = async (req: Request, res: Response) => {
  const {email, token} = req.query;
  if(token){
    console.log(token)
    console.log(token)
    console.log(token)
    return successResponse(res, "successful")
  }
  const user = await Users.findOne({where:{email}})
  if(!user) return successResponse(res, "No user found")
  const profile = await Profile.findOne({where:{userId: user.id}})
  profile?.fcmToken == null ? null : sendExpoNotification(profile!.fcmToken, "hello world");
  return successResponse(res, "successful")
}




export const uploadFiles = async (req: Request, res: Response) => {
  let urls: any;

  if (req.files) {
    let uploadPromises: Promise<string>[] = [];

    if (Array.isArray(req.files)) {
      // If req.files is an array, iterate directly and store promises
      uploadPromises = req.files.map((file) => upload_cloud(file.path));
    } else {
      // If req.files is an object, iterate over each field and its associated file array
      for (const fieldName in req.files) {
        if (req.files.hasOwnProperty(fieldName)) {
          const fileArray = req.files[fieldName];
          fileArray.forEach((file) => {
            uploadPromises.push(upload_cloud(file.path));
          });
        }
      }
    }

    // Wait for all uploads to complete and store the secure URLs
    const urls = await Promise.all(uploadPromises);

    return successResponse(res, "Files Uploaded", urls);
  } else {
    return successResponseFalse(res, "No Files Selected");
  }
};

export const getSector = async (req: Request, res: Response) => {
  const sector = await Sector.findAll({
    include: [{ model: Profession }],
    order: [["id", "DESC"]],
  });
  successResponse(res, "Successful", sector);
};

export const getProfession = async (req: Request, res: Response) => {
  const { id } = req.query;
  if (!id) return errorResponse(res, "Please pass sector id");
  const profession = await Profession.findAll({
    where: { sectorId: id },
    order: [["id", "DESC"]],
  });
  successResponse(res, "Successful", profession);
};

export const search = async (req: Request, res: Response) => {
  let { sector, profession, lat, long, exp, value } = req.query;

  value = value?.toString().replace("+", " ");
  console.log(sector, profession, lat, long, exp, value);
  let queryParamsAllProf: any = {};

  let queryCorperateProfession: any;

  if (exp && exp != "") {
    queryCorperateProfession.yearsOfExp = exp;
  }

  if (sector && sector != "") {
    queryParamsAllProf = {
      sectorId: sector,
    };
  }

  if (profession != null && profession != "") {
    queryParamsAllProf = {
      professionId: profession,
    };
  }

  let valueSearchGeneral: any;
  if (value && value != "") {
    console.log("...loading");
    valueSearchGeneral = {
      [Op.or]: [
        // { '$profile.fullName$': { [Op.like]: '%' + value + '%' } },
        {
          "$profile.professional_sector.sector.title$": {
            [Op.like]: `%${value}%`,
          },
        },
        {
          "$profile.professional_sector.profession.title$": {
            [Op.like]: `%${value}%`,
          },
        },
      ],
    };
  }

  const professional = await Professional.findAll({
    order: [["id", "DESC"]],
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

            where:
              JSON.stringify(queryParamsAllProf) == "{}"
                ? undefined
                : {
                    ...queryParamsAllProf,
                  },
          },
        ],
      },
      { model: Corperate },

      {
        model: Users,
        include: [
          {
            model: Jobs,
            where: {
              status: JobStatus.COMPLETED,
            },
            required: false,
            limit: 3
          },
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
    where:
      !queryCorperateProfession && !valueSearchGeneral
        ? undefined
        : {
            ...queryCorperateProfession,
            ...valueSearchGeneral,
          },
  });

  let newProfessionals: any = [];
  professional.forEach((e) => {
    if (e.dataValues.user.dataValues.location) {
      let value = getDistanceFromLatLonInKm(
        e.dataValues.user.dataValues.location.dataValues.lantitude,
        e.dataValues.user.dataValues.location.dataValues.longitude,
        lat,
        long
      );
      let data = deleteKey(e.dataValues, "profile", "corperate");
      if (lat == "" || !lat || long == "" || !long) {
        newProfessionals.push({
          profile: e.dataValues.profile,
          corperate: null,
          professional: data,
        });
      } else {
        if (value <= 500) {
          newProfessionals.push({
            profile: e.dataValues.profile,
            corperate: null,
            professional: data,
          });
        }
      }
    }
  });

  const corperates = await Professional.findAll({
    order: [["id", "DESC"]],
    where:
      JSON.stringify(queryCorperateProfession) == "{}" &&
      JSON.stringify(valueSearchGeneral) == "{}"
        ? undefined
        : {
            ...queryCorperateProfession,
            ...valueSearchGeneral,
          },

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
            where:
              JSON.stringify(queryParamsAllProf) == "{}"
                ? undefined
                : {
                    ...queryParamsAllProf,
                  },
          },
        ],
      },

      {
        model: Corperate,
      },

      {
        model: Users,
        include: [
          { model: LanLog },
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
            order: [["id", "DESC"]],
          },

          { model: Dispute },
        ],
      },
    ],
  });
  
  let newCorperates: any = [];
  corperates.forEach((e) => {
    if (e.dataValues.user.dataValues.location) {
      let value = getDistanceFromLatLonInKm(
        e.dataValues.user.dataValues.location.dataValues.lantitude,
        e.dataValues.user.dataValues.location.dataValues.longitude,
        lat,
        long
      );
      let data = deleteKey(e.dataValues, "profile", "corperate");

      if (lat == "" || !lat || long == "" || !long) {
        newCorperates.push({
          profile: e.dataValues.profile,
          corperate: e.dataValues.corperate,
          professional: data,
        });
      } else {
        if (value <= 50) {
          newCorperates.push({
            profile: e.dataValues.profile,
            corperate: e.dataValues.corperate,
            professional: data,
          });
        }
      }
    }
  });
  successResponse(res, "Successful", {
    professionals: newProfessionals,
    newCorperates,
  });
};
