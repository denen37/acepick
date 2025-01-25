





// Import packages
import { Router } from 'express';
import { apiIndex, getProfession, getSector, search } from '../controllers';
import { postlocationData } from '../controllers/auth';
import { uploads } from '../helpers/upload';
import { deleteChat, getChatMessage, getUserChat, postChat, postChatMessage, updateChat } from '../controllers/social';


const routes = Router();

/*************************************************************************
API CALL START
*************************************************************************/

// INDEX ROUTE TO SHOW API IS WORKING FINE.



routes.post("/chat-message", uploads.array("image"), postChatMessage)
routes.post("/delete-chat",  deleteChat)
routes.post("/chat",  postChat)
routes.post("/update-chat",  updateChat)
routes.get("/chat", getUserChat)
routes.get("/chat-message", getChatMessage)




export default routes;
