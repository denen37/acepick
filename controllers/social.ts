import { Request, Response } from 'express';
import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { upload_cloud } from '../helpers/upload';
import { Chats } from '../models/Chats';
import { errorResponse, successResponse } from '../helpers/utility';
import { ChatMessage } from '../models/ChatMessage';
import { sendToken } from '../services/notification';
import { Ticket } from '../models/Ticket';
import { Dispute, DisputeStatus } from '../models/Dispute';
import { JobStatus, Jobs } from '../models/Jobs';
import { Users } from '../models/Users';
import { LanLog } from '../models/LanLog';
import { Professional } from '../models/Professional';
import { Profile } from '../models/Profile';
import { Op } from 'sequelize';
import { ProfessionalSector } from '../models/ProffesionalSector';
import { Sector } from '../models/Sector';
import { Profession } from '../models/Profession';
import { CreditType, Transactions, TransactionType } from '../models/Transaction';
import { Wallet, WalletType } from '../models/Wallet';





export const postChatMessage = async (req: Request, res: Response) => {

    let { chatId, message } = req.body;

    const getChat = await Chats.findOne({ where: { id: chatId } });
    if (!getChat) return successResponse(res, "Chat Not Found");

    if (req.files) {
        //     // Read content from the file
        let uploadedImageurl = []
        for (var file of req.files as any) {
            // upload image here
            const result = await upload_cloud(file.path.replace(/ /g, "_"));
            uploadedImageurl.push(result.secure_url)

        }
        try {
            const insertData = {
                image: uploadedImageurl[0],
                message, chatId: Number(chatId),
                userId: getChat.userId,
                recieverId: getChat.recieverId,
            }
            const createChatMessage = await ChatMessage.create(insertData);
            await sendToken(getChat.recieverId, "Message", message)
            if (createChatMessage) return successResponse(res, "Created Successfully", createChatMessage);
            return errorResponse(res, "Failed Creating Chat Message");

        } catch (error) {
            console.log(error);
            return errorResponse(res, `An error occurred - ${error}`);
        }
    }
    else {
        try {
            const insertData = {
                message, chatId: Number(chatId),
                userId: getChat.userId,
                recieverId: getChat.recieverId,

            }
            const createChatMessage = await ChatMessage.create(insertData);
            await sendToken(getChat.recieverId, "Message", message)
            if (createChatMessage) return successResponse(res, "Created Successfully", createChatMessage);
            return errorResponse(res, "Failed Creating Chat Message");

        } catch (error) {
            console.log(error);
            return errorResponse(res, `An error occurred - ${error}`);
        }
    }


}





export const postChat = async (req: Request, res: Response) => {
    let { recieverId, lastMessage } = req.body;
    const { id } = req.user;
    try {
        const insertData = {
            userId: id,
            recieverId,
            lastMessage
        }
        console.log(insertData)
        const createChat = await Chats.create(insertData);
        if (createChat) return successResponse(res, "Created Successfully", createChat);
        return errorResponse(res, "Failed Creating Chat");

    } catch (error) {
        console.log(error);
        return errorResponse(res, `An error occurred - ${error}`);
    }
}




export const getChatMessage = async (req: Request, res: Response) => {
    let { chatId } = req.query;
    const { id } = req.user;
    try {
        const getChatMessages = await ChatMessage.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: {
                chatId,
                userId: id
            }
        });
        if (getChatMessages) return successResponse(res, "Fetched Successfully", getChatMessages);
        return errorResponse(res, "Chat Messages Does not exist");

    } catch (error) {
        console.log(error);
        return errorResponse(res, `An error occurred - ${error}`);
    }
}



export const deleteChat = async (req: Request, res: Response) => {

    let { chatId } = req.query;

    try {
        const getChat = await Chats.findOne({ where: { id: chatId } })
        if (!getChat) return errorResponse(res, "Chat does not exist");
        await getChat?.destroy()
        return successResponse(res, "Chat Deleted");
    } catch (error) {
        console.log(error);
        return errorResponse(res, `An error occurred - ${error}`);
    }
}





export const getUserChat = async (req: Request, res: Response) => {

    const { id } = req.user;

    try {

        const getChats = await Chats.findAll({
            where: { userId: id },
            order: [
                ['id', 'DESC']
            ],
        });
        if (getChats) return successResponse(res, "Fetched Successfully", getChats);
        return errorResponse(res, "Chat Does not exist");


    } catch (error) {
        console.log(error);
        return errorResponse(res, `An error occurred - ${error}`);
    }
}








export const updateChat = async (req: Request, res: Response) => {

    let { status, lastMessage, chatId } = req.body;
    // const { id } = req.user;
    const chats = await Chats.findOne({ where: { id: chatId } })

    if (!chats) return successResponse(res, "No Chat Found");
    try {
        const insertData = {
            status: status ?? chats?.status,
            lastMessage: lastMessage ?? chats?.lastMessage,
        }
        const updateChat = await chats.update(insertData);
        if (updateChat) return successResponse(res, "Updated Successfully", updateChat);
        return errorResponse(res, "Failed Updating Chat");
    } catch (error) {
        console.log(error);
        return errorResponse(res, `An error occurred - ${error}`);
    }

}





export const updateTicket = async (req: Request, res: Response) => {

    let { topic, status, ticketId, message } = req.body;
    // const { id } = req.user;
    const ticket = await Ticket.findOne({ where: { id: ticketId } })

    if (!ticket) return successResponse(res, "No Ticket Found");
    try {
        const insertData = {
            name: topic ?? ticket?.name, status: status ?? ticket?.status,
            image: ticket?.image,
            lastMessage: ticket?.lastMessage??"",
            description: message ?? ticket?.description,
        }
        const updateTicket = await ticket.update(insertData);
        // wallet?.update({balance: })
        if (updateTicket) return successResponse(res, "Updated Successfully", updateTicket);
        return errorResponse(res, "Failed Updating Ticket");

    } catch (error) {
        console.log(error);
        return errorResponse(res, `An error occurred - ${error}`);
    }
}


export const postTicket = async (req: Request, res: Response) => {

    let { topic, message } = req.body;
    let { id } = req.user;
    try {
        const insertData = {
            userId: req.user ? req.user.id : id,
            adminId: req.user ? 1 : req.admin.id,
            name: topic, description: message, lastMessage: ""
        }
        console.log(insertData)
        const createTicket = await Ticket.create(insertData);
        if (createTicket) return successResponse(res, "Created Successfully", createTicket);
        return errorResponse(res, "Failed Creating Ticket");

    } catch (error) {
        console.log(error);
        return errorResponse(res, `An error occurred - ${error}`);
    }
}








export const updateDisputeStatus = async (req: Request, res: Response) => {
    const { status, id } = req.body;
    const dispute = await Dispute.findOne(
        {
            where: {
                id
            }
        }
    )
    if (!dispute) return errorResponse(res, "Failed", { status: false, message: "Dispute Not Found" })
    const update = await dispute?.update({ status })
    if (status == DisputeStatus.RESOLVED) {
        const job = await Jobs.findOne({ where: { id: dispute.jobId } })
        await job?.update({
            status: JobStatus.COMPLETED
        })

    } else {
        return successResponse(res, "Successful", update)
    }

};





export const createDispute = async (req: Request, res: Response) => {
    const { jobId, cause } = req.body;
    const { id } = req.user
    const job = await Jobs.findOne({ where: { id: jobId } })
    const dispute = await Dispute.create(
        {
            cause, url: "", jobId, reporterId: id, partnerId: job?.userId == id ? job?.ownerId : job?.userId
        }
    )
    const walletProvider = await Wallet.findOne({ where: { userId: job?.ownerId, type: WalletType.PROFESSIONAL } })

    await Transactions.create({
        title: "Dispute Filed",
        description: `Dispute filed for “${job!.title}” was successful`,
        type: TransactionType.JOB,
        creditType: CreditType.NONE,
        status: "SUCCESSFUL", userId: job?.ownerId,
        walletId: walletProvider?.id, jobId: job!.id
      });
  
      await Transactions.create({
        title: "Dispute Filed",
        description: `A dispute has been filed for “${job!.title}”. The money paid is locked until dispute is resolved.`,
        type: TransactionType.JOB,
        creditType: CreditType.NONE,
        status: "SUCCESSFUL", userId: job?.userId,
        jobId: job!.id
      });
    await job?.update({
        status: JobStatus.DISPUTED
    })
    return successResponse(res, "Successful", dispute)
};




export const getUserDisputes = async (req: Request, res: Response) => {
    const { id } = req.user;
    const { status } = req.query

    if (!status) {
        const disputes = await Dispute.findAll({
            where: {
                [Op.or]: [
                    { reporterId: id },
                    { partnerId: id },
                ],
            },
            include: [
                {
                    model: Users, attributes: ["email", "id"], as: 'reporter',
                    include: [{ model: Professional },
                    {
                        model: Profile, include: [{
                            model: ProfessionalSector, include: [
                                { model: Sector, attributes: ["title"] },
                                { model: Profession, attributes: ["title"] }
                            ]
                        },]
                    }]
                },
                {
                    model: Users, attributes: ["email", "id"], as: 'partner', include: [{ model: Professional },

                    {
                        model: Profile, include: [{
                            model: ProfessionalSector, include: [
                                { model: Sector, attributes: ["title"] },
                                { model: Profession, attributes: ["title"] }
                            ]
                        },]
                    }]
                },
                { model: Jobs }
            ],
            order: [
                ['id', 'DESC']
            ],
        })
        return successResponse(res, "Successful", disputes)
    } else {
        const disputes = await Dispute.findAll({
            where: {
                [Op.or]: [
                    { reporterId: id },
                    { partnerId: id },
                ],
                status
            },
            include: [
                {
                    model: Users,
                    attributes: ["email", "id"], as: 'reporter',
                    include: [
                        { model: Professional },

                        {
                            model: Profile, include: [{
                                model: ProfessionalSector, include: [
                                    { model: Sector, attributes: ["title"] },
                                    { model: Profession, attributes: ["title"] }
                                ]
                            },]
                        }
                    ]
                },
                {
                    model: Users, attributes: ["email", "id"], as: 'partner', include: [{ model: Professional },
                    {
                        model: Profile, include: [{
                            model: ProfessionalSector, include: [
                                { model: Sector, attributes: ["title"] },
                                { model: Profession, attributes: ["title"] }
                            ]
                        },]
                    },

                    ]
                },
                { model: Jobs }
            ],
            order: [
                ['id', 'DESC']
            ],
        })
        return successResponse(res, "Successful", disputes)
    }

};



export const deleteDisputes = async (req: Request, res: Response) => {
    const { id } = req.query;
    const dispute = await Dispute.findOne(
        {
            where: {
                id
            }
        }
    )
    if (!dispute) return errorResponse(res, "Failed", { status: false, message: "dispute not Found" })

    const update = await dispute?.destroy()
    return successResponse(res, "Deleted Successfully", update)
};
