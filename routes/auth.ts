




// Import packages
import { Router } from 'express';
import { apiIndex } from '../controllers';
import { ProfAccountInfo, accountInfo, accountSingleInfo, changePassword, corperateReg, deleteUsers, login, passwordChange, register, registerStepThree, registerStepTwo, sendOtp, swithAccount, updateFcmToken, updateProfessional, updateProfile, verifyBvnDetail, verifyOtp } from '../controllers/auth';
import { uploads } from '../helpers/upload';
import { sendEmailResend } from '../services/sms';
import { templateData } from '../config/template';


const routes = Router();

/*************************************************************************
API CALL START
*************************************************************************/

// INDEX ROUTE TO SHOW API IS WORKING FINE.
routes.post('/send-otp', sendOtp);
routes.get('/profile', accountInfo);
routes.get('/switch', swithAccount);
routes.get('/profile/:id', accountSingleInfo)
routes.post('/update-profile', updateProfile);
routes.post('/update-professional', updateProfessional);
routes.get('/professional/profile', ProfAccountInfo);
routes.post('/corperate', ProfAccountInfo);
routes.post('/register', register);
routes.post('/register-steptwo', registerStepTwo);
routes.post('/prof-register-stepthree', registerStepThree);
routes.post('/corperate-register', corperateReg);
routes.post('/login', login);
routes.post('/password-change', passwordChange);
routes.post('/change-password', changePassword);
routes.post('/verify-otp', verifyOtp);
routes.post('/update-fcm-token', updateFcmToken)
routes.post("/verify-bvn", verifyBvnDetail)
routes.get("/delete-users", deleteUsers)
// routes.get("/createCat", createCat)

routes.get('/send-email', async (req, res) => {
    try {
        const response = await sendEmailResend('awardenen@gmail.com', 'Wecome to Acepick',
            templateData('<h1>Hi, Welcome to Acepick</h1>', 'Denen'), 'Denen')

        return {
            status: response?.status,
            message: response?.message
        };
    } catch (error) {
        return {
            status: 500,
            message: error
        };
    }
})



export default routes;
