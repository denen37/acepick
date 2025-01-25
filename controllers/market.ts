import { convertHttpToHttps, errorResponse, getDistanceFromLatLonInKm, successResponse, successResponseFalse } from "../helpers/utility";
import { Request, Response } from 'express';
import { Users } from "../models/Users";
import { Op } from "sequelize";
import { MarketPlace } from "../models/Market";
import { Wallet, WalletType } from "../models/Wallet";
import { Profile } from "../models/Profile";
import { Product } from "../models/Products";
import { Category } from "../models/Category";
import { ReviewMarket } from "../models/ReviewMarket";
import { LanLog } from "../models/LanLog";
import { FavouriteType, MarketFavourite } from "../models/MarketFavourite";



export const sortMarketPlace = async (req: Request, res: Response) => {

    const { status, value, lat, long, } = req.query;
    // const { id } = req.user;
    let newProduct: any = [];
    let newMarket: any = [];

    try {

        const queryParams: any = {

        };


        if (status) {
            queryParams.status = status;
        }


        if (value) {
            const getMarketPlace = await MarketPlace.findAll({
                where: {
                    ...queryParams, [Op.or]: [
                        { name: { [Op.like]: `%${value}%` } },


                    ]
                },
                include: [{
                    model: Users,
                    attributes: ["email", "phone", "status"],
                    include: [{ model: LanLog }],
                }, { model: Profile },
                { model: Category },],
            });


            const getProduct = await Product.findAll({
                where: {
                    ...queryParams, [Op.or]: [
                        { name: { [Op.like]: `%${value}%` } },
                        // { description: { [Op.like]: `%${value}%` } },
                        // { tags: { [Op.like]: `%${value}%` } }
                    ]
                },
                include: [{
                    model: Users,
                    attributes: ["email", "phone", "status"],
                    include: [{ model: LanLog }],
                }],
            });



            getProduct.forEach((e: any) => {


                if (e.dataValues.user.dataValues.location) {

                    let value = getDistanceFromLatLonInKm(e.dataValues.user.dataValues.location.dataValues.lantitude,
                        e.dataValues.user.dataValues.location.dataValues.longitude,
                        lat,
                        long
                    );

                    if (lat == "" || !lat || long == "" || !long) {
                        newProduct.push(e)
                    } else {
                        if (value <= 500) {
                            newProduct.push(e)
                        }
                    }
                }
            })



            getMarketPlace.forEach((e: any) => {
                if (e.dataValues.user.dataValues.location) {

                    let value = getDistanceFromLatLonInKm(e.dataValues.user.dataValues.location.dataValues.lantitude,
                        e.dataValues.user.dataValues.location.dataValues.longitude,
                        lat,
                        long
                    );

                    if (lat == "" || !lat || long == "" || !long) {
                        newMarket.push(e)
                    } else {
                        if (value <= 500) {
                            newMarket.push(e)
                        }
                    }
                }
            })


            return successResponse(res, "Fetched Successfully", { store: newMarket, product: newProduct });
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
                    }, { model: LanLog }]
                },

                { model: Profile },
                { model: Category },
                ],
            });



            const getProduct = await Product.findAll({
                where: {
                    ...queryParams
                },
                include: [{
                    model: Users,
                    attributes: ["email", "phone", "status"],
                    include: [{ model: LanLog }],
                }],
            });




            getProduct.forEach((e: any) => {
                if (e.dataValues.user.dataValues.location) {

                    let value = getDistanceFromLatLonInKm(e.dataValues.user.dataValues.location.dataValues.lantitude,
                        e.dataValues.user.dataValues.location.dataValues.longitude,
                        lat,
                        long
                    );

                    if (lat == "" || !lat || long == "" || !long) {
                        newProduct.push(e)
                    } else {
                        if (value <= 500) {
                            newProduct.push(e)
                        }
                    }
                }

            })

            getMarketPlace.forEach((e: any) => {
                if (e.dataValues.user.dataValues.location) {

                    let value = getDistanceFromLatLonInKm(e.dataValues.user.dataValues.location.dataValues.lantitude,
                        e.dataValues.user.dataValues.location.dataValues.longitude,
                        lat,
                        long
                    );

                    if (lat == "" || !lat || long == "" || !long) {
                        newMarket.push(e)
                    } else {
                        if (value <= 500) {
                            newMarket.push(e)
                        }
                    }
                }

            })

            return successResponse(res, "Fetched Successfully", { store: newMarket, product: newProduct });
        }

    } catch (error) {
        console.log(error);
        return errorResponse(res, `An error occurred - ${error}`);
    }
}




export const createMarketPlace = async (req: Request, res: Response) => {
    let { avatar, name, description, tags, state, lga, address, phone, facebook, instagram, productPhotos, categoryId } = req.body;
    let { id } = req.user;
    const user = await Users.findOne({ where: { id } });
    const profile = await Profile.findOne({ where: { userId: id } });
    const marketPlace = await MarketPlace.findOne({ where: { userId: id } });
    if (marketPlace) return errorResponse(res, "Failed", { status: false, message: "Market Place Already Exist" })
    const files:string[] = []
    for(let value of productPhotos){
        files.push(convertHttpToHttps(value))
    }
    const marketPlaceCreate = await MarketPlace.create({
        photo: convertHttpToHttps(avatar), name, description, tags, state, lga, address, phone, facebook,
        instagram, file: files, userId: id, profileId: profile!.id, categoryId
    })
    await profile?.update({ store: true })
    return successResponse(res, "Successful", marketPlaceCreate)
}





export const createProduct = async (req: Request, res: Response) => {
    let { name, description, tags, price, productImage, categoryId } = req.body;

    let { id } = req.user;
    const user = await Users.findOne({ where: { id } });
    const profile = await Profile.findOne({ where: { userId: id } });
    const marketPlace = await MarketPlace.findOne({ where: { userId: id } });
    if (!marketPlace) return successResponse(res, "Not Found")
    const files:string[] = []
    for(let value of productImage){
        files.push(convertHttpToHttps(value))
     }
    const productCreate = await Product.create({
        name, description, tags, price, file: files, userId: id, marketPlaceId: marketPlace!.id, profileId: profile!.id, categoryId
    })
    return successResponse(res, "Successful", productCreate)
}



export const fetchSingleStore = async (req: Request, res: Response) => {
    let { id } = req.query;
    const marketPlace = await MarketPlace.findOne({
        where: { id }, include: [{
            model: Users,
            attributes: ["email", "phone", "status"],
            include: [{ model: LanLog }],
        }, { model: Profile },
        { model: Category },],
    });
    if (!marketPlace) return successResponse(res, "Store Not Found",)
    return successResponse(res, "Successful", marketPlace)
}



export const fetchUserStore = async (req: Request, res: Response) => {
    let { id } = req.user;
    const marketPlace = await MarketPlace.findOne({
        where: { userId: id },
        include: [{
            model: Users,
            attributes: ["email", "phone", "status"],
            include: [{ model: LanLog }],
        }, { model: Profile },
        { model: Category },],
    });
    if (!marketPlace) return successResponse(res, "Store Not Found",)
    return successResponse(res, "Successful", marketPlace)
}





export const fetchCategory = async (req: Request, res: Response) => {
    const category = await Category.findAll({});
    return successResponse(res, "Successful", category)
}





export const fetchStoreProduct = async (req: Request, res: Response) => {
    let { id } = req.query;
    const products = await Product.findAll({
        where: { userId: id }, include: [{
            model: Users,
            attributes: ["email", "phone", "status"],
            include: [{ model: LanLog }],
        }],
    });
    return successResponse(res, "Successful", products)
}






export const fetchUserProduct = async (req: Request, res: Response) => {
    let { id } = req.user;
    const products = await Product.findAll({
        where: { userId: id }, include: [{
            model: Users,
            attributes: ["email", "phone", "status"],
            include: [{ model: LanLog }],
        }],
    });
    return successResponse(res, "Successful", products)
}






export const createReview = async (req: Request, res: Response) => {
    let { review, marketPlaceId, rate } = req.body;
    let { id } = req.user;
    const marketPlace = await MarketPlace.findOne({ where: { id: marketPlaceId } })
    if (!marketPlace) return successResponse(res, "Market Place not found")
    const reviews = await ReviewMarket?.create({
        review,
        rate: rate,
        marketPlaceId: marketPlace?.id,
        userId: id,
        marketPlaceUserId: marketPlace?.userId,
    })
    if (Number(marketPlace?.rate) == 0) {
        await marketPlace.update({ rate })
        return successResponse(res, "Successful", reviews)
    } else {
        let mean = (Number((marketPlace?.rate + rate)) / 2)
        await marketPlace.update({ rate: mean })
        return successResponse(res, "Successful", reviews)
    }
}





export const addMarketFavourite = async (req: Request, res: Response) => {
    const { type } = req.body;
    const { id } = req.user;
    if (type == "MARKETPLACE") {
        const marketPlace = await MarketPlace.findOne({ where: { id: req.body.id } })
        const favourite = await MarketFavourite.findOne({ where: { marketPlaceId: marketPlace?.id, favouriteOwnerId: id } })

        if (favourite) {
            await favourite.destroy();
            return successResponse(res, "Successful", favourite)
        } else {
            const fav = await MarketFavourite.create({ favouriteOwnerId: id, marketPlaceId: marketPlace?.id, userId: marketPlace?.userId, type: FavouriteType.STORE })
            return successResponse(res, "Successful", fav)
        }
    } else {
        const product = await Product.findOne({ where: { id: req.body.id } })
        const favourite = await MarketFavourite.findOne({ where: { productId: product?.id, favouriteOwnerId: id } })
        if (favourite) {
            await favourite.destroy();
            return successResponse(res, "Successful", favourite)
        } else {
            const fav = await MarketFavourite.create({ favouriteOwnerId: id, productId: product?.id, userId: product?.userId, type: FavouriteType.PRODUCT })
            return successResponse(res, "Successful", fav)
        }
    }
};



export const updateProduct = async (req: Request, res: Response) => {
    let { name, description, tags, price, productImage, categoryId, productId } = req.body;

    let { id } = req.user;
    const oldProduct = await Product.findOne({ where: { id: productId } })
    if (!oldProduct) return errorResponse(res, "Product not Found")
    const product = await oldProduct?.update({
        name: name ?? oldProduct.name,
        description: description ?? oldProduct.description,
        tags: tags ?? oldProduct.tags,
        price: price ?? oldProduct.price,
        file: productImage ?? oldProduct.file,
        categoryId: categoryId ?? oldProduct.categoryId,
    })
    return successResponse(res, "Successful", product)
}





export const updateMarketPlace = async (req: Request, res: Response) => {
    let { avatar, name, description, tags, state, lga, address, phone, facebook, instagram, productPhotos, categoryId } = req.body;
    let { id } = req.user;
    const oldMarketPlace = await MarketPlace.findOne({ where: { userId: id } })
    if (!oldMarketPlace) return errorResponse(res, "Market not Found")
    const marketPlace = await oldMarketPlace?.update({
        photo: avatar ?? oldMarketPlace!.photo,
        name: name ?? oldMarketPlace.name,
        description: description ?? oldMarketPlace.description,
        tags: tags ?? oldMarketPlace.tags,
        state: state ?? oldMarketPlace.state,
        lga: lga ?? oldMarketPlace.lga,
        address: address ?? oldMarketPlace.address,
        phone: phone ?? oldMarketPlace.phone,
        facebook: facebook ?? oldMarketPlace.facebook,
        instagram: instagram ?? oldMarketPlace.instagram,
        file: productPhotos ?? oldMarketPlace.file,
        categoryId: categoryId ?? oldMarketPlace.categoryId
    })
    return successResponse(res, "Successful", marketPlace)
}



export const deleteMarketFavourite = async (req: Request, res: Response) => {
    const { favouriteId } = req.body;
    const { id } = req.user
    const fav = await MarketFavourite.findOne({ where: { id: favouriteId } })
    if (!fav) return errorResponse(res, "Favourite Not Found")
    await fav?.destroy()
    return successResponse(res, "Successful")
};



export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.body;
    if (id) {
        const product = await Product.findOne({ where: { id } })
        if (!product) return errorResponse(res, "Product Not Found")
        await product?.destroy()
        return successResponse(res, "Successful")
    } else {
        return successResponseFalse(res, "Please pass an id")
    }
};



export const deleteAllMarketFavourite = async (req: Request, res: Response) => {
    const { id } = req.user
    const favourite = await MarketFavourite.findAll({ where: { favouriteOwnerId: id } })
    let index = 0
    for (let value of favourite) {
        await value.destroy()
        index++
    }
    if (index == favourite.length) {
        return successResponse(res, "Successful")
    }
}


export const getMarketFavourite = async (req: Request, res: Response) => {
    const { id } = req.user;
    const product = await MarketFavourite.findAll({
        where: { favouriteOwnerId: id, type: FavouriteType.PRODUCT },
        order: [
            ['id', 'DESC']
        ],
        include: [
            {
                model: Product,
                include: [{
                    model: Users,
                    attributes: ["email", "phone", "status"],
                    include: [{ model: LanLog }],
                }],
            },

        ]
    })


    const store = await MarketFavourite.findAll({
        order: [
            ['id', 'DESC']
        ],
        where: { favouriteOwnerId: id, type: FavouriteType.STORE },
        include: [
            {
                model: MarketPlace,

                include: [{
                    model: Users,
                    attributes: ["email", "phone", "status"],
                    include: [{ model: LanLog }],
                }, { model: Profile },
                { model: Category },],
            }
        ]
    })
    return successResponse(res, "Successful", { product, store })
};
