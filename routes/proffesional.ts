// Import packages
import { Router } from 'express';
import { apiIndex, getProfession, getSector, search } from '../controllers';
import { postlocationData } from '../controllers/auth';


const routes = Router();

/*************************************************************************
API CALL START
*************************************************************************/

// INDEX ROUTE TO SHOW API IS WORKING FINE.

routes.get('/', apiIndex);




export default routes;
