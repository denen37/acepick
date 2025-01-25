

import { Request, Response } from 'express';
import { upload_cloud } from '../../helpers/upload';
import { Sector } from '../../models/Sector';
import { errorResponse, successResponse } from '../../helpers/utility';
import { Profession } from '../../models/Profession';
import { Users } from '../../models/Users';
import { Op } from 'sequelize';
import { Profile, ProfileType } from '../../models/Profile';
import { Professional } from '../../models/Professional';
import { Wallet, WalletType } from '../../models/Wallet';
import { Corperate } from '../../models/Cooperation';
import { Jobs } from '../../models/Jobs';
import { VoiceRecord } from '../../models/VoiceRecording';
import { MarketPlace } from '../../models/Market';
import { Category } from '../../models/Category';








export const sortMarketPlace = async (req: Request, res: Response) => {

	const { status, search } = req.query;
	// const { id } = req.user;

	try {

		const queryParams: any = {

		};


		if (status) {
			queryParams.status = status;
		}


		if (search) {
			const getMarketPlace = await MarketPlace.findAll({
				where: {
					...queryParams, [Op.or]: [
						{ name: { [Op.like]: `%${search}%` } },


					]
				},
				include: [{
					model: Users,
					attributes: ["email", "phone", "status"],
				}],
			});

			if (getMarketPlace) return successResponse(res, "Fetched Successfully", getMarketPlace);
			return errorResponse(res, "Failed fetching Users");
		} else {
			const getMarketPlace = await MarketPlace.findAll({
				order: [
					['id', 'DESC']
				],
				where: queryParams,
				include: [{
					model: Users,
					where: queryParams,
					attributes: ["email", "phone", "status"],
					include: [{
						model: Wallet,
						where: {
							type: WalletType.PROFESSIONAL
						},
						attributes: ["amount"]
					}]
				}],
			});

			if (getMarketPlace) return successResponse(res, "Fetched Successfully", getMarketPlace);
			return errorResponse(res, "Failed fetching Users");
		}





	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occurred - ${error}`);
	}
}




export const updateMarketPlaceStatus = async (req: Request, res: Response) => {
	const { status, id } = req.body;
	const market = await MarketPlace.findOne(
		{
			where: {
				id
			}
		}
	)
	if (!market) return errorResponse(res, "Failed", { status: false, message: "Market Place Not Found" })
	const update = await market?.update({ status })
	return successResponse(res, "Successful", update)
};



export const deleteMarket = async (req: Request, res: Response) => {
	const { id } = req.body;
	const market = await MarketPlace.findOne(
		{
			where: {
				id
			}
		}
	)
	if (!market) return errorResponse(res, "Failed", { status: false, message: "market not Found" })

	const update = await market?.destroy()
	return successResponse(res, "Deleted Successfully", update)
};


export const createCategory = async (req: Request, res: Response) => {
	const { title } = req.body;
	const category = await Category.create(
		{ title }
	)
	return successResponse(res, "Created Successfully", category)
}