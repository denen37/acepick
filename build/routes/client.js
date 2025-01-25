"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import packages
const express_1 = require("express");
const controllers_1 = require("../controllers");
const client_1 = require("../controllers/client");
const upload_1 = require("../helpers/upload");
const wallet_1 = require("../controllers/wallet");
const market_1 = require("../controllers/market");
const routes = (0, express_1.Router)();
/*************************************************************************
API CALL START
*************************************************************************/
// INDEX ROUTE TO SHOW API IS WORKING FINE.
routes.get('/', controllers_1.apiIndex);
routes.post('/favourite', client_1.addFavourite);
routes.post('/delete-favourite', client_1.deleteFavourite);
routes.get('/favourite', client_1.getFavourite);
routes.get('/delete-all-favourite', client_1.deleteAllFavourite);
routes.get("/states", client_1.getStates);
routes.post("/record", upload_1.uploads.single("file"), client_1.uploadRecording);
routes.post("/delete-record", client_1.deleteRecording);
routes.post("/delete-all-record", client_1.deleteAllRecording);
routes.get("/record", client_1.getRecording);
routes.get("/user-jobs", client_1.getUserJobs);
routes.get("/profile-jobs", client_1.getProfileJobs);
routes.post("/delete-job", client_1.deleteJob);
routes.get("/get-job", client_1.getSingleJob);
routes.post("/update-invoice-seen", client_1.updateJobSeen);
routes.get("/check-invoice-seen", client_1.checkJobSeen);
routes.post("/update-invoice-approve", client_1.updateJobApproved);
routes.get("/check-invoice-approve", client_1.checkJobApprove);
routes.post("/match-job-location", client_1.matchLocation);
routes.post("/create-job", client_1.createJob);
routes.post("/update-job", client_1.updateJob);
routes.post("/update-material", client_1.updateMaterial);
routes.get("/provider-jobs", client_1.getProviderJobs);
routes.post("/review", client_1.createReview);
routes.get('/review', client_1.getReview);
routes.post("/update-job-status", wallet_1.updateInvoiceStatus);
routes.post("/pay-job", wallet_1.payInvoice);
routes.post("/pay-job-card", wallet_1.payInvoiceCard);
routes.post("/delete-education", client_1.deleteEducation);
routes.post("/create-education", client_1.createEducation);
routes.post("/update-education", client_1.updateEducation);
routes.post("/delete-porfolio", client_1.deletePorfolio);
routes.post("/create-porfolio", client_1.createPorfolio);
routes.post("/update-porfolio", client_1.updatePorfolio);
routes.post("/delete-prof-sector", client_1.deleteProfSector);
routes.post("/create-prof-sector", client_1.createProfSector);
routes.post("/update-prof-sector", client_1.updateProfSector);
routes.get("/get-prof-sector", client_1.getProfSector);
routes.post("/delete-experience", client_1.deleteExperience);
routes.post("/create-experience", client_1.createExperience);
routes.post("/update-experience", client_1.updateExperience);
routes.post("/delete-certification", client_1.deleteCertification);
routes.post("/create-certification", client_1.createCertification);
routes.post("/update-certification", client_1.updateCertification);
routes.post("/block", client_1.createBlock);
routes.post("/unblock", client_1.unBlock);
routes.post("/report", client_1.createReport);
routes.get("/category", market_1.fetchCategory);
routes.get("/get-block", client_1.fetchAllBlock);
routes.get("/get-report", client_1.fetchAllReport);
exports.default = routes;
//# sourceMappingURL=client.js.map