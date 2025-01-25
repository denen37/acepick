"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import packages
const express_1 = require("express");
const upload_1 = require("../helpers/upload");
const social_1 = require("../controllers/social");
const client_1 = require("../controllers/client");
const adminUserManagement_1 = require("../controllers/admin/adminUserManagement");
const adminManagement_1 = require("../controllers/admin/adminManagement");
const routes = (0, express_1.Router)();
/*************************************************************************
API CALL START
*************************************************************************/
// INDEX ROUTE TO SHOW API IS WORKING FINE.
routes.post("/ticket-message", upload_1.uploads.array("image"), client_1.postTicketMessage);
routes.post("/delete-ticket", adminUserManagement_1.deleteTicket);
routes.post("/delete-ticket-message", adminUserManagement_1.deleteTicketMesaage);
routes.post("/ticket", social_1.postTicket);
routes.post("/update-ticket", social_1.updateTicket);
routes.get("/all-ticket", adminUserManagement_1.getAllTicket);
routes.get("/ticket", adminUserManagement_1.getUserTicket);
routes.get("/ticket-message", adminUserManagement_1.getTicketMessage);
routes.get("/all-tos", adminManagement_1.getTos);
routes.get("/all-faq", adminManagement_1.getFaq);
routes.get("/user-disputes", social_1.getUserDisputes);
routes.post("/dispute", social_1.deleteDisputes);
routes.post("/create-dispute", social_1.createDispute);
routes.post("/update-dispute", social_1.updateDisputeStatus);
exports.default = routes;
//# sourceMappingURL=support.js.map