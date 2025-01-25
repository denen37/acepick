"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import packages
const express_1 = require("express");
const controllers_1 = require("../controllers");
const auth_1 = require("../controllers/auth");
const upload_1 = require("../helpers/upload");
const routes = (0, express_1.Router)();
/*************************************************************************
API CALL START
*************************************************************************/
// INDEX ROUTE TO SHOW API IS WORKING FINE.
routes.get('/sector', controllers_1.getSector);
routes.get('/profession', controllers_1.getProfession);
routes.get('/search', controllers_1.search);
routes.get('/', controllers_1.apiIndex);
routes.post('/fileupload', upload_1.uploads.array("file"), controllers_1.uploadFiles);
routes.get('/testN', controllers_1.testN);
routes.post("/location", auth_1.postlocationData);
exports.default = routes;
//# sourceMappingURL=index.js.map