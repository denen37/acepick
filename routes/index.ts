// Import packages
import { Router } from 'express';
import { apiIndex, getProfession, getSector, search, testN, uploadFiles } from '../controllers';
import { postlocationData } from '../controllers/auth';
import { uploads } from '../helpers/upload';



const routes = Router();

/*************************************************************************
API CALL START
*************************************************************************/

// INDEX ROUTE TO SHOW API IS WORKING FINE.
routes.get('/sector', getSector);
routes.get('/profession', getProfession);
routes.get('/search', search);
routes.get('/', apiIndex);
routes.post('/fileupload', uploads.array("file"), uploadFiles);
routes.get('/testN', testN)
routes.post("/location", postlocationData)


export default routes;
