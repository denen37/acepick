// Import packages
import { Router } from 'express';
import { apiIndex, getProfession, getSector, search } from '../controllers';
import { postlocationData } from '../controllers/auth';
import { addFavourite, createBlock, createCertification, createEducation, createExperience, createJob, createPorfolio, createProfSector, createReport, createReview, deleteAllFavourite, deleteAllRecording, deleteCertification, deleteEducation, deleteExperience, deleteFavourite, deleteJob, deletePorfolio, deleteProfSector, deleteRecording, fetchAllBlock, fetchAllReport, getFavourite, getProfSector, getProfileJobs, getProviderJobs, getRecording, getReview, getSingleJob, getStates, getUserJobs, matchLocation, unBlock, updateCertification, updateEducation, updateExperience, updateJob, updateMaterial, updatePorfolio, updateProfSector, uploadRecording, checkJobSeen, updateJobSeen, checkJobApprove, updateJobApproved } from '../controllers/client';
import { uploads } from '../helpers/upload';
import { payInvoice, payInvoiceCard, updateInvoiceStatus } from '../controllers/wallet';
import { fetchCategory } from '../controllers/market';


const routes = Router();

/*************************************************************************
API CALL START
*************************************************************************/

// INDEX ROUTE TO SHOW API IS WORKING FINE.

routes.get('/', apiIndex);
routes.post('/favourite', addFavourite);
routes.post('/delete-favourite', deleteFavourite);
routes.get('/favourite', getFavourite);
routes.get('/delete-all-favourite', deleteAllFavourite)
routes.get("/states", getStates)
routes.post("/record", uploads.single("file"), uploadRecording)
routes.post("/delete-record", deleteRecording)
routes.post("/delete-all-record", deleteAllRecording)
routes.get("/record", getRecording)


routes.get("/user-jobs", getUserJobs)
routes.get("/profile-jobs", getProfileJobs)
routes.post("/delete-job", deleteJob)
routes.get("/get-job", getSingleJob)

routes.post("/update-invoice-seen", updateJobSeen)
routes.get("/check-invoice-seen", checkJobSeen)
routes.post("/update-invoice-approve", updateJobApproved)
routes.get("/check-invoice-approve", checkJobApprove)
routes.post("/match-job-location", matchLocation)

routes.post("/create-job", createJob)
routes.post("/update-job", updateJob)
routes.post("/update-material", updateMaterial)
routes.get("/provider-jobs", getProviderJobs)
routes.post("/review", createReview)
routes.get('/review', getReview)
routes.post("/update-job-status", updateInvoiceStatus)
routes.post("/pay-job", payInvoice)
routes.post("/pay-job-card", payInvoiceCard)



routes.post("/delete-education", deleteEducation)
routes.post("/create-education", createEducation)
routes.post("/update-education", updateEducation)


routes.post("/delete-porfolio", deletePorfolio)
routes.post("/create-porfolio", createPorfolio)
routes.post("/update-porfolio", updatePorfolio)


routes.post("/delete-prof-sector", deleteProfSector)
routes.post("/create-prof-sector", createProfSector)
routes.post("/update-prof-sector", updateProfSector)
routes.get("/get-prof-sector", getProfSector)




routes.post("/delete-experience", deleteExperience)
routes.post("/create-experience", createExperience)
routes.post("/update-experience", updateExperience)



routes.post("/delete-certification", deleteCertification)
routes.post("/create-certification", createCertification)
routes.post("/update-certification", updateCertification)




routes.post("/block", createBlock)
routes.post("/unblock", unBlock)
routes.post("/report", createReport)
routes.get("/category", fetchCategory)
routes.get("/get-block", fetchAllBlock)
routes.get("/get-report", fetchAllReport)





export default routes;
