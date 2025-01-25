import { Router } from "express";
import { uploads } from "../helpers/upload";
import { assignRole, changePassword, checkEmail, deleteAdmin, deleteInvite, getAdminDetails, getAllAdmin,
     getInvite, getUserInvite, register, sendInvite, updateAdminOnlineStatus, updateInvite, updateProfile, updateStatus, userRoles } from "../controllers/admin/adminAuth";
import { createFaq, createTos, dashboardUserSummary, deleteAnnoncement, deleteFaq, deleteProfession, deleteSector, deleteTopic, deleteTos, getAnnoncement, getFaq, getTopic, getTos, getWalletTransaction, postProfession, postSector, postTopic, sendAnnoncement, sendVerification, sortVerificationUsers, updateFaq, updateProfession, updateSector, updateTopic, updateTos } from "../controllers/admin/adminManagement";
import { adminLogin, resetPassword, sendDisputeMessage, sendOtp } from "../controllers/auth";
import { deleteDisputes, deleteRecording, deleteTicket, deleteTicketMesaage, deleteUser, getAllDisputes, getAllTicket, getAllUsers, getJobs, getSingleDisputes, getTicketMessage, getUserTicket, postTicket, postTicketMessage, sortUsers, updateDisputeStatus, updateTicket, updateUserStatus, userProfile } from "../controllers/admin/adminUserManagement";
import { createCategory, deleteMarket, sortMarketPlace, updateMarketPlaceStatus } from "../controllers/admin/adminMarketManagement";
import { getProfession, getSector } from "../controllers";


const routes = Router();


routes.post('/admin/sector',  postSector);
routes.get('/admin/sector', getSector);
routes.get('/admin/profession', getProfession);
routes.post('/admin/profession', postProfession);
routes.post('/admin/delete-sector',  deleteSector);
routes.post('/admin/delete-profession', deleteProfession);
routes.post('/admin/update-profession',  updateProfession);
routes.post('/admin/update-sector',  updateSector);
routes.post('/admin/register',  register);
routes.post('/admin/assign-role',  assignRole);
routes.post('/admin/update-status',  updateStatus);
routes.post('/admin/delete-admin',  deleteAdmin);
routes.post('/admin/admin-role',  userRoles);
// routes.post('/admin/update-status',  updateAdminStatus);
routes.post('/admin/update-online-status',  updateAdminOnlineStatus);
routes.get('/admin/all-users',  getAllUsers);
routes.get('/admin/all-admins',  getAllAdmin);
routes.get('/admin/admin-details',  getAdminDetails);

routes.get('/admin/all-invites',  getInvite);
routes.get('/admin/get-invite',  getUserInvite);
routes.post('/admin/send-otp', sendOtp);
routes.post('/admin/change-password', resetPassword);
routes.get('/admin/sort-user', sortUsers);
routes.get('/admin/sort-marketplace', sortMarketPlace);
routes.post('/admin/update-marketplace', updateMarketPlaceStatus);
routes.post('/admin/delete-marketplace', deleteMarket);
routes.get('/admin/profile-details', userProfile);
routes.post('/admin/update-user', updateUserStatus);





routes.get('/admin/check-email',  checkEmail);
routes.get('/admin/dashboard-summary', dashboardUserSummary);
routes.post('/admin/transaction-dashboard', getWalletTransaction);
routes.post('/admin/update-details', updateProfile);
routes.post('/admin/send-announcement', sendAnnoncement);
routes.post('/admin/send-verification', sendVerification);
routes.get('/admin/sort-verification-users', sortVerificationUsers);
routes.get('/admin/announcement', getAnnoncement);
routes.post('/admin/delete-announcement', deleteAnnoncement);
routes.post('/admin/send-invite', sendInvite);
routes.post('/admin/login', adminLogin);
routes.post('/admin/reset-password', changePassword);
routes.post('/admin/delete-invite', deleteInvite);
routes.post('/admin/delete-record', deleteRecording);
routes.post('/admin/delete-user', deleteUser);
routes.post('/admin/update-invite', updateInvite);
routes.post('/admin/category', createCategory);




routes.post("/admin/sector", postSector)
routes.post("/admin/profession",uploads.single("image"), postProfession)
// routes.get("/admin/transaction-dashboard", getTransactionDashboard )
routes.get("/admin/all-tos", getTos)
routes.post("/admin/delete-tos",  deleteTos)
routes.post("/admin/update-tos",  updateTos)
routes.get("/admin/all-faq", getFaq)
routes.post("/admin/delete-faq",  deleteFaq)
routes.post("/admin/update-faq",  updateFaq)
routes.post("/admin/create-tos",  createTos)
routes.post("/admin/create-faq",  createFaq)
routes.get("/admin/all-disputes", getAllDisputes)
routes.get("/admin/single-dispute", getSingleDisputes)
routes.post("/admin/dispute",  deleteDisputes)
routes.post("/admin/update-dispute",  updateDisputeStatus)
routes.post("/admin/send-dispute-message",  sendDisputeMessage)
routes.get("/admin/jobs", getJobs)


routes.post("/admin/ticket-message", uploads.array("image"), postTicketMessage)
routes.post("/admin/delete-ticket",  deleteTicket)
routes.post("/admin/delete-ticket-message",  deleteTicketMesaage)
routes.post("/admin/ticket", uploads.array("image"), postTicket)
routes.post("/admin/update-ticket", uploads.array("image"), updateTicket)
routes.get("/admin/all-ticket", getAllTicket)
routes.get("/admin/ticket", getUserTicket)
routes.get("/admin/ticket-message", getTicketMessage)


routes.get("/admin/all-topic", getTopic)
routes.get("/all-topic", getTopic)
routes.post("/admin/delete-topic",  deleteTopic)
routes.post("/admin/update-topic",  updateTopic)
routes.post("/admin/create-topic",  postTopic)



export default routes;
