// Import packages
import { Router } from 'express';
import { apiIndex, getProfession, getSector, search } from '../controllers';
import { postlocationData } from '../controllers/auth';
import {
    addMarketFavourite, createMarketPlace, createProduct, createReview,
    deleteAllMarketFavourite,
    deleteMarketFavourite,
    deleteProduct,
    fetchCategory,
    fetchSingleStore, fetchStoreProduct, fetchUserProduct, fetchUserStore, getMarketFavourite, sortMarketPlace, updateMarketPlace, updateProduct
} from '../controllers/market';
import { deleteFavourite } from '../controllers/client';


const routes = Router();

/*************************************************************************
API CALL START
*************************************************************************/

// INDEX ROUTE TO SHOW API IS WORKING FINE.
routes.get('/search-market', sortMarketPlace);
routes.get('/get-marketfavourite', getMarketFavourite);
routes.post('/create-marketfavourite', addMarketFavourite);
routes.post('/delete-marketfavourite', deleteMarketFavourite);
routes.get('/delete-all-marketfavourite', deleteAllMarketFavourite);
routes.post('/create-market', createMarketPlace);
routes.post('/create-product', createProduct);
routes.get('/get-market', fetchSingleStore);
routes.get('/user-market', fetchUserStore);
routes.get('/get-products', fetchStoreProduct);
routes.get('/user-products', fetchUserProduct);
routes.post('/delete-product', deleteProduct);
routes.post('/update-product', updateProduct);
routes.post('/create-market-review', createReview);
routes.post('/update-market', updateMarketPlace);
routes.post('/get-category', fetchCategory);







export default routes;
