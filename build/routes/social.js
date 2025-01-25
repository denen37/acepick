"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import packages
const express_1 = require("express");
const upload_1 = require("../helpers/upload");
const social_1 = require("../controllers/social");
const routes = (0, express_1.Router)();
/*************************************************************************
API CALL START
*************************************************************************/
// INDEX ROUTE TO SHOW API IS WORKING FINE.
routes.post("/chat-message", upload_1.uploads.array("image"), social_1.postChatMessage);
routes.post("/delete-chat", social_1.deleteChat);
routes.post("/chat", social_1.postChat);
routes.post("/update-chat", social_1.updateChat);
routes.get("/chat", social_1.getUserChat);
routes.get("/chat-message", social_1.getChatMessage);
exports.default = routes;
//# sourceMappingURL=social.js.map