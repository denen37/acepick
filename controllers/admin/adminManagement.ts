

import { Request, Response } from 'express';
import { upload_cloud } from '../../helpers/upload';
import { Sector } from '../../models/Sector';
import { calculateDifferenceBetweenMinMax, errorResponse, handleResponse, mergeDuplicates, successResponse, summarizeTransactions } from '../../helpers/utility';
import { Profession } from '../../models/Profession';
import { Faq } from '../../models/Faq';
import { Tos } from '../../models/Tos';
import { Profile, ProfileType } from '../../models/Profile';
import { Op, Sequelize, json, where } from 'sequelize';
import { UserStatus, Users } from '../../models/Users';
import { sendEmailResend } from '../../services/sms';
import { MarketPlace } from '../../models/Market';
import { CreditType, PaymentType, TransactionDateType, TransactionType, Transactions } from '../../models/Transaction';
import { Announcement } from '../../models/Announcement';
import { JobStatus, Jobs } from '../../models/Jobs';
import { AdminTransaction } from '../../models/AdminTransaction';
import { Topic } from '../../models/Topic';
import moment from 'moment';
import { Professional } from '../../models/Professional';
// import { Job } from '../../models/VoiceRecording';


export const postSector = async (req: Request, res: Response) => {
    let { title } = req.body;
    // let {id} =  req.a;

    if (req.file) {
        const result = await upload_cloud(req.file.path.replace(/ /g, "_"));

        const sector = await Sector.create({
            title,
            image: result.secure_url,
        })
        return successResponse(res, "Successful", { status: true, message: sector })
    } else {
        const sector = await Sector.create({
            title: title,
            image: "",
        })
        return successResponse(res, "Successful", sector)
    }
}




export const postProfession = async (req: Request, res: Response) => {
    let { title, sectorId } = req.body;
    // let {id} =  req.admin;

    if (req.file) {
        const result = await upload_cloud(req.file.path.replace(/ /g, "_"));

        const profession = await Profession.create({
            title,
            image: result.secure_url,
            sectorId
        })
        return successResponse(res, "Successful", { status: true, message: profession })
    } else {
        const profession = await Profession.create({
            title,
            image: "",
            sectorId
        })
        return successResponse(res, "Successful", profession)
    }
}




export const deleteSector = async (req: Request, res: Response) => {
    const { id } = req.body;
    const sector = await Sector.findOne(
        {
            where: {
                id
            }
        }
    )
    if (!sector) return errorResponse(res, "Failed", { status: false, message: "sector not Found" })

    const update = await sector?.destroy()
    return successResponse(res, "Deleted Successfully", update)
};



export const deleteProfession = async (req: Request, res: Response) => {
    const { id } = req.body;
    const profession = await Profession.findOne(
        {
            where: {
                id
            }
        }
    )
    if (!profession) return errorResponse(res, "Failed", { status: false, message: "profession not Found" })

    const update = await profession?.destroy()
    return successResponse(res, "Deleted Successfully", update)
};




export const updateProfession = async (req: Request, res: Response) => {
    let { title, sectorId, id } = req.body;
    // let {id} =  req.admin;
    const professionOld = await Profession.findOne({ where: { id } })


    if (req.file) {
        const result = await upload_cloud(req.file.path.replace(/ /g, "_"));

        const profession = await professionOld?.update({
            title: title ?? professionOld.title,
            image: result.secure_url,
            sectorId: sectorId ?? professionOld.sectorId,
        })
        return successResponse(res, "Successful", { status: true, message: profession })
    } else {
        const profession = await professionOld?.update({
            title: title ?? professionOld.title,
            image: professionOld.image,
            sectorId: sectorId ?? professionOld.sectorId,
        })
        return successResponse(res, "Successful", profession)
    }
}




export const updateSector = async (req: Request, res: Response) => {
    let { title, id } = req.body;
    const sectorOld = await Sector.findOne({ where: { id } })
    if (req.file) {
        const result = await upload_cloud(req.file.path.replace(/ /g, "_"));

        const sector = await sectorOld?.update({
            title: title ?? sectorOld.title,
            image: result.secure_url,

        })
        return successResponse(res, "Successful", { status: true, message: sector })
    } else {
        const sector = await sectorOld?.update({
            title: title ?? sectorOld.title,
            image: sectorOld.image,

        })
        return successResponse(res, "Successful", sector)
    }
}



export const postFaq = async (req: Request, res: Response) => {
    let { title, body } = req.body;

    const faq = await Faq.create({
        title,
        body,
    })
    return successResponse(res, "Successful", faq)

}




export const getFaq = async (req: Request, res: Response) => {
    const faq = await Faq.findAll({})
    return successResponse(res, "Successful", faq)

}



export const getTos = async (req: Request, res: Response) => {
    const tos = await Tos.findAll({})
    return successResponse(res, "Successful", tos)
}




export const postTos = async (req: Request, res: Response) => {
    let { title, body } = req.body;

    const tos = await Tos.create({
        title,
        body,
    })
    return successResponse(res, "Successful", tos)

}



export const deleteFaq = async (req: Request, res: Response) => {
    const { id } = req.body;
    const faq = await Faq.findOne(
        {
            where: {
                id
            }
        }
    )
    if (!faq) return errorResponse(res, "Failed", { status: false, message: "faq not Found" })

    const update = await faq?.destroy()
    return successResponse(res, "Deleted Successfully", update)
};




export const deleteTos = async (req: Request, res: Response) => {
    const { id } = req.body;
    const tos = await Tos.findOne(
        {
            where: {
                id
            }
        }
    )
    if (!tos) return errorResponse(res, "Failed", { status: false, message: "ter of service not Found" })

    const update = await tos?.destroy()
    return successResponse(res, "Deleted Successfully", update)
};




export const updateFaq = async (req: Request, res: Response) => {
    let { title, body, id } = req.body;
    const faqOld = await Faq.findOne({ where: { id } })
    if (!faqOld) return successResponse(res, "Faq Not Found")

    const faq = await faqOld?.update({
        title: title ?? faqOld.title,
        body: body ?? faqOld.body
    })
    return successResponse(res, "Successful", faq)

}




export const createFaq = async (req: Request, res: Response) => {
    let { title, body } = req.body;
    const faq = await Faq.create({ title, body })
    return successResponse(res, "Successful", faq)
}




export const createTos = async (req: Request, res: Response) => {
    let { title, body } = req.body;
    const tos = await Tos.create({ title, body })
    return successResponse(res, "Successful", tos)
}



export const updateTos = async (req: Request, res: Response) => {
    let { title, body, id } = req.body;
    const tosOld = await Tos.findOne({ where: { id } })
    if (!tosOld) return successResponse(res, "Tos Not Found")

    const tos = await tosOld?.update({
        title: title ?? tosOld.title,
        body: body ?? tosOld.body
    })
    return successResponse(res, "Successful", tos)

}





export const getAnnoncement = async (req: Request, res: Response) => {
    const announcement = await Announcement.findAll({})
    return successResponse(res, "Successful", announcement)
}


export const deleteAnnoncement = async (req: Request, res: Response) => {
    const { id } = req.body;
    const announcement = await Announcement.findOne(
        {
            where: {
                id
            }
        }
    )
    if (!announcement) return errorResponse(res, "Failed", { status: false, message: "Announcement not Found" })

    const update = await announcement?.destroy()
    return successResponse(res, "Deleted Successfully", update)
};


export const sendAnnoncement = async (req: Request, res: Response) => {
    let { subject, body, type, status, verified, userId } = req.body;


    let query: any = {};
    let queryProfile: any = {};


    if (status && status != "") {
        query.status = status;
    }



    if (verified && verified != "") {
        queryProfile.verified = verified == "VERIFIED" ? true : false;
    }

    await Announcement.create({ subject, body, title: subject })
    if (type == ProfileType.CLIENT) {
        const profile = await Profile.findAll({
            where: { type: ProfileType.CLIENT, ...queryProfile },
            include: [{
                model: Users,
                where: { ...query },
                attributes: ["email"]
            }]
        })
        let index = 0;
        for (let value of profile) {
            await sendEmailResend(value.dataValues.user.dataValues.email, subject, `${body}`);
            index++
        }
        if (index == profile.length) {
            return successResponse(res, "Successful")
        }

    }

    else if (type == ProfileType.PROFESSIONAL) {
        const profile = await Profile.findAll({
            where: { type: ProfileType.PROFESSIONAL, corperate: false, ...queryProfile },
            include: [{ model: Users, where: { ...query }, attributes: ["email"] }]
        })
        let index = 0;
        for (let value of profile) {
            await sendEmailResend(value.dataValues.user.dataValues.email, subject, `${body}`);
            index++
        }
        if (index == profile.length) {
            return successResponse(res, "Successful")
        }

    }


    else if (type == ProfileType.PROFESSIONAL) {
        const profile = await Profile.findAll({
            where: { type: ProfileType.PROFESSIONAL, corperate: true, ...queryProfile },
            include: [{ model: Users, where: { ...query }, attributes: ["email"] }]
        })
        let index = 0;
        for (let value of profile) {
            await sendEmailResend(value.dataValues.user.dataValues.email, subject, `${body}`);
            index++
        }
        if (index == profile.length) {
            return successResponse(res, "Successful")
        }

    }

    else if (type == "MARKETPLACE") {
        const market = await MarketPlace.findAll({
            where: { type, },
            include: [
                { model: Profile, where: { ...queryProfile } },
                {
                    model: Users,

                    where: { ...query }, attributes: ["email"]
                }]
        })
        let index = 0;
        for (let value of market) {
            await sendEmailResend(value.dataValues.user.dataValues.email, subject, `${body}`);
            index++
        }
        if (index == market.length) {
            return successResponse(res, "Successful")
        }

    }


    else if (type == "ALL") {

        const profile = await Profile.findAll({
            where: { ...queryProfile },
            include: [{ model: Users, where: { ...query }, attributes: ["email"] }]
        })
        let index = 0;
        for (let value of profile) {
            await sendEmailResend(value.dataValues.user.dataValues.email, subject, `${body}`);
            index++
        }
        if (index == profile.length) {
            return successResponse(res, "Successful")
        }
    } else if (type == "SINGLE") {
        const profile = await Profile.findAll({
            where: { ...queryProfile, userId: userId },
            include: [{ model: Users, where: { ...query }, attributes: ["email"] }]
        })
        let index = 0;
        for (let value of profile) {
            await sendEmailResend(value.dataValues.user.dataValues.email, subject, `${body}`);
            index++
        }
        if (index == profile.length) {
            return successResponse(res, "Successful")
        }

    }

}





export const sortVerificationUsers = async (req: Request, res: Response) => {
    let { type, noOfHires, noOfJobs } = req.query;

    let query: any = {};
    let queryProfile: any = {};


    if (noOfHires && noOfHires != "") {
        let [start, end] = noOfHires.toString().split("-").map(Number);
        query.totalHire = {
            [Op.between]: [start, end]
        };
    }



    if (noOfJobs && noOfJobs != "") {
        let [start, end] = noOfJobs.toString().split("-").map(Number);
        queryProfile.totalJobCompleted = {
            [Op.between]: [start, end]
        };;
    }

    if (type == ProfileType.CLIENT) {
        const profile = await Profile.findAll({
            where: { type: ProfileType.CLIENT, ...query, notified: false },
            include: [{
                model: Users,
                attributes: ["email"]
            }]
        })
        return successResponse(res, "Successful", profile)

    }

    else if (type == ProfileType.PROFESSIONAL) {
        const profile = await Profile.findAll({
            where: { type: ProfileType.PROFESSIONAL, corperate: false, notified: false },
            include: [{ model: Users, attributes: ["email"] }, { model: Professional, where: { ...queryProfile } }]
        })
        return successResponse(res, "Successful", profile)

    }


    else if (type == ProfileType.PROFESSIONAL) {
        const profile = await Profile.findAll({
            where: { type: ProfileType.PROFESSIONAL, corperate: true, notified: false },
            include: [{ model: Users, attributes: ["email"] }, { model: Professional, where: { ...queryProfile } }]
        })

        return successResponse(res, "Successful", profile)


    }


    else {

        const profile = await Profile.findAll({
            where: { type: ProfileType.PROFESSIONAL, corperate: true, notified: false },
            include: [{ model: Users, attributes: ["email"] }, { model: Professional, where: { ...queryProfile } }]
        })
        const profile2 = await Profile.findAll({
            where: { type: ProfileType.PROFESSIONAL, corperate: false, notified: false },
            include: [{ model: Users, attributes: ["email"] }, { model: Professional, where: { ...queryProfile } }]
        })

        const profile3 = await Profile.findAll({
            where: { type: ProfileType.CLIENT, ...query, notified: false },
            include: [{
                model: Users,
                attributes: ["email"]
            }]
        })
        let merged = mergeDuplicates(profile.concat(profile2).concat(profile3))
        return successResponse(res, "Successful", profile.concat(profile2).concat(profile3))
    }

}





export const sendVerification = async (req: Request, res: Response) => {
    let { userId } = req.body;
    const profile = await Profile.findAll({
        where: { userId: userId },
        include: [{ model: Users, attributes: ["email"] }]
    })
    let index = 0;
    for (let value of profile) {
        await value.update({ verified: false, notified: true })
        await sendEmailResend(value.dataValues.user.dataValues.email, "Verification Needed", `Hello ${value?.fullName},<br><br> Your account needs to be validated,<br><br> Kindly login the Acepick App to proceed with your verification.<br><br> Best Regards.`);
        index++
    }
    if (index == profile.length) {
        return successResponse(res, "Successful")
    }

}






// export const getTransactionDashboard = async (req: Request, res: Response) => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = today.getMonth();
//     const prvmonth = today.getMonth() - 1;
//     // Get the start date of the month
//     const monthstartDate = new Date(year, month, 1);
//     // Get the end date of the month
//     const monthendDate = new Date(year, month + 1, 0);
//     // Get the start date of the month
//     const previousMonthstartDate = new Date(year, prvmonth, 1);
//     // Get the end date of the month
//     const previousMonthendDate = new Date(year, prvmonth + 1, 0);

//     try {
//         const getAllTransactionsThisMonth = await Transactions.findAll({
//             where: {
//                 createdAt: {
//                     [Op.gte]: monthstartDate,
//                     [Op.lte]: monthendDate,
//                 }
//             }
//         });
//         const getAllTransactionsPrevMonth = await Transactions.findAll({
//             where: {
//                 createdAt: {
//                     [Op.gte]: previousMonthstartDate,
//                     [Op.lte]: previousMonthendDate,
//                 }
//             }
//         });
//         const numbers1 = [getAllTransactionsPrevMonth.length + 1, getAllTransactionsThisMonth.length + 1];
//         const difference1 = calculateDifferenceBetweenMinMax(numbers1);
//         const getCreditTransactionsThisMonth = await Transactions.findAll({
//             where: {
//                 type: TransactionType.CREDIT,
//                 createdAt: {
//                     [Op.gte]: monthstartDate,
//                     [Op.lte]: monthendDate,
//                 }
//             }
//         });
//         const getCreditTransactionsPrevMonth = await Transactions.findAll({
//             where: {
//                 type: TransactionType.CREDIT,
//                 createdAt: {
//                     [Op.gte]: previousMonthstartDate,
//                     [Op.lte]: previousMonthendDate,
//                 }
//             }
//         });
//         const numbers2 = [getCreditTransactionsPrevMonth.length + 1, getCreditTransactionsThisMonth.length + 1];
//         const difference2 = calculateDifferenceBetweenMinMax(numbers2);
//         const getDebitTransactionsThisMonth = await Transactions.findAll({
//             where: {
//                 type: TransactionType.DEBIT,
//                 createdAt: {
//                     [Op.gte]: monthstartDate,
//                     [Op.lte]: monthendDate,
//                 }
//             }
//         });
//         const getDebitTransactionsPrevMonth = await Transactions.findAll({
//             where: {
//                 type: TransactionType.DEBIT,
//                 createdAt: {
//                     [Op.gte]: previousMonthstartDate,
//                     [Op.lte]: previousMonthendDate,
//                 }
//             }
//         });
//         const numbers3 = [getDebitTransactionsPrevMonth.length + 1, getDebitTransactionsThisMonth.length + 1];
//         const difference3 = calculateDifferenceBetweenMinMax(numbers3);
//         // const summary = await AdminTransaction.findAll({});

//         if (getDebitTransactionsPrevMonth) return successResponse(res, "Fetched Successfully", {
//             allTransactions: {
//                 count: getAllTransactionsThisMonth.length,
//                 transaction: getAllTransactionsThisMonth,
//                 ...difference1
//             },
//             debitTransactions: {
//                 count: getDebitTransactionsThisMonth.length,
//                 transaction: getDebitTransactionsThisMonth,
//                 ...difference3
//             },
//             creditTransactions: {
//                 count: getCreditTransactionsThisMonth.length,
//                 transaction: getCreditTransactionsThisMonth,
//                 ...difference2
//             },
//             // transactionSummary: summary
//         }
//         );
//         return errorResponse(res, "Transactions Does not exist");

//     } catch (error) {
//         console.log(error);
//         return errorResponse(res, `An error occurred - ${error}`);
//     }
// }





export const dashboardUserSummary = async (req: Request, res: Response) => {
    const client = await Profile.findAll({
        where: {
            type: ProfileType.CLIENT
        },
    });




    const active = await Users.findAll({
        where: {
            status: UserStatus.ACTIVE
        },
    });



    const inactive = await Users.findAll({
        where: {
            status: UserStatus.INACTIVE
        },
    });

    const professional = await Profile.findAll({
        where: {
            // type: ProfileType.PROFESSIONAL,
            corperate: false
        },
    });

    const coorperate = await Profile.findAll({
        where: {
            // type: ProfileType.PROFESSIONAL,
            corperate: true
        },
    });

    const jobCompleted = await Jobs.findAll({
        where: {
            status: JobStatus.COMPLETED
        },
    });

    const jobPending = await Jobs.findAll({
        where: {
            status: JobStatus.PENDING
        },
    });

    const jobDisputed = await Jobs.findAll({
        where: {
            status: JobStatus.DISPUTED
        },
    });


    const jobRejected = await Jobs.findAll({
        where: {
            status: JobStatus.REJECTED
        },
    });


    const jobOngoing = await Jobs.findAll({
        where: {
            status: JobStatus.ONGOING
        },
    });


    const totalJob = await Jobs.findAll({
        where: {

        },
    });


    const totalUser = await Users.findAll({
        where: {

        },
    });



    const markets = await MarketPlace.findAll({

    });



    const sector = await Sector.findAll({

    });


    const profession = await Profession.findAll({

    });


    return successResponse(res, "Successful", {
        client: client.length,
        activeUsers: active.length,
        inActiveUsers: inactive.length,
        playStore: 0,
        iosStore: 0,
        totalUser: totalUser.length,
        totalJob: totalJob.length,
        professional: professional.length, coorperate: coorperate.length,
        jobCompleted: jobCompleted.length,
        jobPending: jobPending.length, jobDisputed: jobDisputed.length, jobOngoing: jobOngoing.length,
        jobRejected: jobRejected.length,
        markets: markets.length, sector: sector.length, profession: profession.length
    })
}




export const getWalletTransaction = async (req: Request, res: Response) => {

    let { date, startDate, endDate, type } = req.body;


    try {

        const myDate = date == '' || !date ? moment().add(1, 'd') : new Date(date);
        const mystartDate = startDate == '' || !startDate ? moment().add(1, 'd') : new Date(startDate);
        const myendDate = endDate == '' || !endDate ? moment().add(1, 'd') : new Date(endDate);
        const today = new Date();

        const year = today.getFullYear();
        const month = today.getMonth();



        const yearCustom = date == "" || !date ? new Date().getFullYear() : new Date(date).getFullYear();
        const monthCustom = date == "" || !date ? new Date().getMonth() : new Date(date).getMonth();


        // Get the start date of the month
        const monthstartDateCustom = new Date(yearCustom, monthCustom, 1);

        // Get the end date of the month
        const monthendDateCustom = new Date(yearCustom, monthCustom + 1, 0);


        // Get the start date of the month
        const monthstartDate = new Date(year, month, 1);

        // Get the end date of the month
        const monthendDate = new Date(year, month + 1, 0);

        const TODAY_START = moment(myDate).format('YYYY-MM-DD 00:00');
        const TODAY_END = moment(myDate).format('YYYY-MM-DD 23:59');


        const DATE_START = moment(mystartDate).format('YYYY-MM-DD 00:00');
        const DATE_END = moment(myendDate).format('YYYY-MM-DD 23:59');

        const money_earned = await Transactions.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: {
                // businessId,
                createdAt: type == TransactionDateType.SINGLE_DATE ? {
                    [Op.gt]: TODAY_START,
                    [Op.lt]: TODAY_END,
                } : type == TransactionDateType.THIS_MONTH ? {
                    [Op.gte]: monthstartDate,
                    [Op.lte]: monthendDate,
                } : type == TransactionDateType.MONTH ? {
                    [Op.gte]: monthstartDateCustom,
                    [Op.lte]: monthendDateCustom,
                } : {
                    [Op.gte]: DATE_START,
                    [Op.lte]: DATE_END,
                },
                creditType: CreditType.EARNING
            },
            attributes: [[Sequelize.literal('COALESCE(SUM(amount), 0)'), 'result']],
        });


        const money_paid = await Transactions.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: {
                // businessId,
                createdAt: type == TransactionDateType.SINGLE_DATE ? {
                    [Op.gt]: TODAY_START,
                    [Op.lt]: TODAY_END,
                } : type == TransactionDateType.THIS_MONTH ? {
                    [Op.gte]: monthstartDate,
                    [Op.lte]: monthendDate,
                } : {
                    [Op.gte]: DATE_START,
                    [Op.lte]: DATE_END,
                },
                creditType: CreditType.WITHDRAWAL
            },
            attributes: [[Sequelize.literal('COALESCE(SUM(amount), 0)'), 'result']],
        });




        const money_pending = await Transactions.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: {
                // businessId,
                createdAt: type == TransactionDateType.SINGLE_DATE ? {
                    [Op.gt]: TODAY_START,
                    [Op.lt]: TODAY_END,
                } : type == TransactionDateType.THIS_MONTH ? {
                    [Op.gte]: monthstartDate,
                    [Op.lte]: monthendDate,
                } : {
                    [Op.gte]: DATE_START,
                    [Op.lte]: DATE_END,
                },
                paid: PaymentType.PENDING
            },
            attributes: [[Sequelize.literal('COALESCE(SUM(amount), 0)'), 'result']],
        });




        const transactions_debit = await Transactions.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: {
                // businessId,
                createdAt: type == TransactionDateType.SINGLE_DATE ? {
                    [Op.gt]: TODAY_START,
                    [Op.lt]: TODAY_END,
                } : type == TransactionDateType.THIS_MONTH ? {
                    [Op.gte]: monthstartDate,
                    [Op.lte]: monthendDate,
                } : {
                    [Op.gte]: DATE_START,
                    [Op.lte]: DATE_END,
                },
                type: TransactionType.DEBIT,
            },
            attributes: [[Sequelize.literal('COALESCE(SUM(amount), 0)'), 'result']],
        });


        const transactions_credit = await Transactions.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: {
                // businessId,
                createdAt: type == TransactionDateType.SINGLE_DATE ? {
                    [Op.gt]: TODAY_START,
                    [Op.lt]: TODAY_END,
                } : type == TransactionDateType.THIS_MONTH ? {
                    [Op.gte]: monthstartDate,
                    [Op.lte]: monthendDate,
                } : {
                    [Op.gte]: DATE_START,
                    [Op.lte]: DATE_END,
                },
                type: TransactionType.CREDIT,
            },
            attributes: [[Sequelize.literal('COALESCE(SUM(amount), 0)'), 'result']],
        });


        const transactions = await Transactions.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: {
                // businessId,
                createdAt: type == TransactionDateType.SINGLE_DATE ? {
                    [Op.gt]: TODAY_START,
                    [Op.lt]: TODAY_END,
                } : type == TransactionDateType.THIS_MONTH ? {
                    [Op.gte]: monthstartDate,
                    [Op.lte]: monthendDate,
                } : {
                    [Op.gte]: DATE_START,
                    [Op.lte]: DATE_END,
                },

            },
            // attributes: [[Sequelize.literal('COALESCE(SUM(amount), 0)'), 'result']],
        });

        if (type == TransactionDateType.SINGLE_DATE) {

            return successResponse(res, 'Sucessful', {
                // total_credit: summarizeTransactions(transactions_credit, TransactionDateType.SINGLE_DATE),
                // total_debit: summarizeTransactions(transactions_debit, TransactionDateType.SINGLE_DATE),
                // money_earned: summarizeTransactions(money_earned, TransactionDateType.SINGLE_DATE),
                // money_paid: summarizeTransactions(money_paid, TransactionDateType.SINGLE_DATE),
                graph: [{
                    name: "Total Money Pending",
                    amount: money_pending![0].dataValues.result
                },
                {
                    name: "Total Money Earned",
                    amount: money_earned[0].dataValues.result
                },
                {
                    name: "Total Money Paid",
                    amount: money_paid[0].dataValues.result
                },
                {
                    name: "Total Debit",
                    amount: transactions_debit[0].dataValues.result
                },
                {
                    name: "Total Credit",
                    amount: transactions_credit[0].dataValues.result
                }
                ],
                transactions
            }
            );
        } else if (type == TransactionDateType.THIS_MONTH) {
            return successResponse(res, 'Sucessful',
                {
                    // total_credit: summarizeTransactions(transactions_credit, TransactionDateType.THIS_MONTH),
                    // total_debit: summarizeTransactions(transactions_debit, TransactionDateType.THIS_MONTH),
                    // money_earned: summarizeTransactions(money_earned, TransactionDateType.THIS_MONTH),
                    // money_paid: summarizeTransactions(money_paid, TransactionDateType.THIS_MONTH),
                    // money_pending: summarizeTransactions(money_pending, TransactionDateType.THIS_MONTH),
                    graph: [{
                        name: "Total Money Pending",
                        amount: money_pending[0].dataValues.result
                    },
                    {
                        name: "Total Money Earned",
                        amount: money_earned[0].dataValues.result
                    },
                    {
                        name: "Total Money Paid",
                        amount: money_paid[0].dataValues.result
                    },
                    {
                        name: "Total Debit",
                        amount: transactions_debit[0].dataValues.result
                    },
                    {
                        name: "Total Credit",
                        amount: transactions_credit[0].dataValues.result
                    }
                    ],
                    transactions
                }
            );
        } else if (type == TransactionDateType.DATE_RANGE) {

            const diffTime = Math.abs((new Date(endDate).getTime()) - (new Date(startDate).getTime()))
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return successResponse(res, 'Sucessful',
                {
                    // total_credit: summarizeTransactions(transactions_credit, TransactionDateType.DATE_RANGE, diffDays),
                    // total_debit: summarizeTransactions(transactions_debit, TransactionDateType.DATE_RANGE, diffDays),
                    // money_earned: summarizeTransactions(money_earned, TransactionDateType.DATE_RANGE, diffDays),
                    // money_paid: summarizeTransactions(money_paid, TransactionDateType.DATE_RANGE, diffDays),
                    // money_pending: summarizeTransactions(money_pending, TransactionDateType.DATE_RANGE, diffDays),
                    graph: [{
                        name: "Total Money Pending",
                        amount: money_pending[0].dataValues.result
                    },
                    {
                        name: "Total Money Earned",
                        amount: money_earned[0].dataValues.result
                    },
                    {
                        name: "Total Money Paid",
                        amount: money_paid[0].dataValues.result
                    },
                    {
                        name: "Total Debit",
                        amount: transactions_debit[0].dataValues.result
                    },
                    {
                        name: "Total Credit",
                        amount: transactions_credit[0].dataValues.result
                    }
                    ],
                    transactions
                }
            );

        }
        else if (type == TransactionDateType.MONTH) {

            return successResponse(res, 'Sucessful',
                {
                    // total_credit: summarizeTransactions(transactions_credit, TransactionDateType.DATE_RANGE, diffDays),
                    // total_debit: summarizeTransactions(transactions_debit, TransactionDateType.DATE_RANGE, diffDays),
                    // money_earned: summarizeTransactions(money_earned, TransactionDateType.DATE_RANGE, diffDays),
                    // money_paid: summarizeTransactions(money_paid, TransactionDateType.DATE_RANGE, diffDays),
                    // money_pending: summarizeTransactions(money_pending, TransactionDateType.DATE_RANGE, diffDays),
                    graph: [{
                        name: "Total Money Pending",
                        amount: money_pending[0].dataValues.result
                    },
                    {
                        name: "Total Money Earned",
                        amount: money_earned[0].dataValues.result
                    },
                    {
                        name: "Total Money Paid",
                        amount: money_paid[0].dataValues.result
                    },
                    {
                        name: "Total Debit",
                        amount: transactions_debit[0].dataValues.result
                    },
                    {
                        name: "Total Credit",
                        amount: transactions_credit[0].dataValues.result
                    }
                    ],
                    transactions
                }
            );

        }
        else if (type == TransactionDateType.ALL) {

            const alltransactions_credit = await Transactions.findAll({
                where: {
                    // businessId,
                    type: TransactionType.CREDIT,
                },
                attributes: [[Sequelize.literal('COALESCE(SUM(amount), 0)'), 'result']],
            });






            const money_earned = await Transactions.findAll({
                where: {
                    // businessId,

                    creditType: CreditType.EARNING

                },
                attributes: [[Sequelize.literal('COALESCE(SUM(amount), 0)'), 'result']],
            });



            const money_pending = await Transactions.findAll({
                where: {
                    // businessId,

                    paid: PaymentType.PENDING

                },
                attributes: [[Sequelize.literal('COALESCE(SUM(amount), 0)'), 'result']],
            });


            const money_paid = await Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: {
                    // businessId,

                    creditType: CreditType.WITHDRAWAL

                },
                attributes: [[Sequelize.literal('COALESCE(SUM(amount), 0)'), 'result']],
            });


            const alltransactions_debit = await Transactions.findAll({
                order: [
                    ['id', 'DESC']
                ],
                where: {
                    // businessId,
                    type: TransactionType.DEBIT,
                },
                attributes: [[Sequelize.literal('COALESCE(SUM(amount), 0)'), 'result']],
            });
            const transactions = await Transactions.findAll({
                where: {}, order: [
                    ['id', 'DESC']
                ],
            })
            return successResponse(res, 'Sucessful',
                {
                    // total_credit: summarizeTransactions(alltransactions_credit, TransactionDateType.ALL),
                    // total_debit: summarizeTransactions(alltransactions_debit, TransactionDateType.ALL),
                    // money_earned: summarizeTransactions(money_earned, TransactionDateType.ALL),
                    // money_paid: summarizeTransactions(money_paid, TransactionDateType.ALL),
                    // money_pending: summarizeTransactions(money_pending, TransactionDateType.ALL),
                    // transactions
                    graph: [{
                        name: "Total Money Pending",
                        amount: money_pending[0].dataValues.result
                    },
                    {
                        name: "Total Money Earned",
                        amount: money_earned[0].dataValues.result
                    },
                    {
                        name: "Total Money Paid",
                        amount: money_paid[0].dataValues.result
                    },
                    {
                        name: "Total Debit",
                        amount: alltransactions_debit[0].dataValues.result
                    },
                    {
                        name: "Total Credit",
                        amount: alltransactions_credit[0].dataValues.result
                    }
                    ],
                    transactions
                }
            );

        }
    } catch (error) {
        console.log(error);
        return handleResponse(res, 500, false, `An error occured - ${error}`);
    }





};



export const postTopic = async (req: Request, res: Response) => {
    let { title } = req.body;

    const topic = await Topic.create({
        title
    })
    return successResponse(res, "Successful", topic)

}




export const getTopic = async (req: Request, res: Response) => {
    const topic = await Topic.findAll({
        order: [
            ['id', 'DESC']
        ],
    })
    return successResponse(res, "Successful", topic)

}



export const deleteTopic = async (req: Request, res: Response) => {
    const { id } = req.params;
    const topic = await Topic.findOne(
        {
            where: {
                id
            }
        }
    )
    if (!topic) return errorResponse(res, "Failed", { status: false, message: "Topic not Found" })

    const update = await topic?.destroy()
    return successResponse(res, "Deleted Successfully", update)
};


export const updateTopic = async (req: Request, res: Response) => {
    let { title, id } = req.body;
    const topicOld = await Topic.findOne({ where: { id } })
    if (!topicOld) return successResponse(res, "Topic Not Found")

    const faq = await topicOld?.update({
        title: title ?? topicOld.title,
    })
    return successResponse(res, "Successful", faq)

}
