"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import packages
const express_1 = require("express");
const market_1 = require("../controllers/market");
const routes = (0, express_1.Router)();
/*************************************************************************
API CALL START
*************************************************************************/
// INDEX ROUTE TO SHOW API IS WORKING FINE.
routes.get('/search-market', market_1.sortMarketPlace);
routes.get('/get-marketfavourite', market_1.getMarketFavourite);
routes.post('/create-marketfavourite', market_1.addMarketFavourite);
routes.post('/delete-marketfavourite', market_1.deleteMarketFavourite);
routes.get('/delete-all-marketfavourite', market_1.deleteAllMarketFavourite);
routes.post('/create-market', market_1.createMarketPlace);
routes.post('/create-product', market_1.createProduct);
routes.get('/get-market', market_1.fetchSingleStore);
routes.get('/user-market', market_1.fetchUserStore);
routes.get('/get-products', market_1.fetchStoreProduct);
routes.get('/user-products', market_1.fetchUserProduct);
routes.post('/delete-product', market_1.deleteProduct);
routes.post('/update-product', market_1.updateProduct);
routes.post('/create-market-review', market_1.createReview);
routes.post('/update-market', market_1.updateMarketPlace);
routes.post('/get-category', market_1.fetchCategory);
exports.default = routes;
//# sourceMappingURL=market.js.map