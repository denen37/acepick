
// Import packages
import { Router } from 'express';
import { apiIndex, getProfession, getSector, search } from '../controllers';
import { postlocationData, sendDisputeMessage } from '../controllers/auth';
import { uploads } from '../helpers/upload';
import { createDispute, deleteChat, deleteDisputes, getChatMessage, getUserChat, getUserDisputes, postChat, postChatMessage, postTicket, updateChat, updateDisputeStatus, updateTicket } from '../controllers/social';
import { postTicketMessage } from '../controllers/client';
import { deleteTicket, deleteTicketMesaage, getAllDisputes, getAllTicket, getTicketMessage, getUserTicket } from '../controllers/admin/adminUserManagement';
import { getFaq, getTos } from '../controllers/admin/adminManagement';



const routes = Router();

/*************************************************************************
API CALL START
*************************************************************************/

// INDEX ROUTE TO SHOW API IS WORKING FINE.




routes.post("/ticket-message", uploads.array("image"), postTicketMessage)
routes.post("/delete-ticket",  deleteTicket)
routes.post("/delete-ticket-message",  deleteTicketMesaage)
routes.post("/ticket",  postTicket)
routes.post("/update-ticket", updateTicket)
routes.get("/all-ticket", getAllTicket)
routes.get("/ticket", getUserTicket)
routes.get("/ticket-message", getTicketMessage)
routes.get("/all-tos", getTos)
routes.get("/all-faq", getFaq)



routes.get("/user-disputes", getUserDisputes)
routes.post("/dispute",  deleteDisputes)
routes.post("/create-dispute",  createDispute)
routes.post("/update-dispute",  updateDisputeStatus)





export default routes;
