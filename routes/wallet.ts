// Import packages
import { Router } from 'express';
import { apiIndex, getProfession, getSector } from '../controllers';
import { addBank, bankNameQuery, deleteBank, emailToken, fundWallet, getBank, getBanks, getLatestTransaction, getTransactions, getUserTransaction, getWallet, resetPin, setPin, updateTransaction, webhookPost, withdraw } from '../controllers/wallet';
import { getEarningSummary } from '../controllers/auth';


const routes = Router();

/*************************************************************************
API CALL START
*************************************************************************/

// INDEX ROUTE TO SHOW API IS WORKING FINE.
routes.get('/wallet', getWallet);
routes.get('/trans', getLatestTransaction)
routes.get('/banks', getBank)
routes.post('/fund-wallet', fundWallet)
routes.post("/set-pin", setPin)
routes.post("/reset-pin", resetPin)
routes.post("/bank-name-query", bankNameQuery)
routes.post("/send-token", emailToken)
routes.post("/withdrawal", withdraw)
routes.post("/webhook", webhookPost)
routes.get("/booking-history", getTransactions)
routes.get("/earning-summary", getEarningSummary)

routes.get("/user-bank", getBanks)
routes.post("/delete-bank", deleteBank)
routes.post("/create-bank", addBank)
routes.post("/update-bank", addBank)
routes.get("/notification", getUserTransaction)
routes.post("/read-notification", updateTransaction)










export default routes;
