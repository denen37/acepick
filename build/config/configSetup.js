"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const getConfig = () => {
    return {
        NODE_ENV: process.env.NODE_ENV,
        PORT: Number(process.env.PORT),
        EXPO_ACCESS_TOKEN: process.env.EXPO_ACCESS_TOKEN,
        SSL: true,
        JWTSECRET: process.env.JWTSECRET,
        FLW_PUBLIC_KEY: process.env.FLW_PUBLIC_KEY,
        FLW_SECRET_KEY: process.env.FLW_SECRET_KEY,
        JWT_EXPIRY_TIME: process.env.JWT_EXPIRY_TIME,
        DBNAME: process.env.DBNAME,
        DBUSERNAME: process.env.DBUSERNAME,
        DBPASSWORD: process.env.DBPASSWORD,
        DBHOST: process.env.DBHOST,
        DBPORT: Number(process.env.DBPORT),
        DBDIALECT: process.env.DBDIALECT,
        PAYSTACK_SECRET: process.env.PAYSTACK_SECRET,
        MAIL_FROM: process.env.MAIL_FROM,
        SUPPORT_MAIL: process.env.SUPPORT_MAIL,
        SUPPORT_PHONE: process.env.SUPPORT_PHONE,
        MAIL_FROM_NAME: process.env.MAIL_FROM_NAME,
        RESEND: process.env.RESEND,
        LOGO: process.env.LOGO,
        WEBSITE: process.env.WEBSITE,
        BASE_API_URL: process.env.BASE_API_URL,
        REDIS_INSTANCE_URL: process.env.REDIS_INSTANCE_URL,
        PUBLIC_ROUTES: [
            '/api',
            '/',
            '/api/send-otp',
            '/api/register',
            '/api/verify-otp',
            '/api/webhook',
            '/api/change-password',
            '/api/delete-users',
            '/api/admin/send-otp',
            '/api/login',
            '/api/testN',
            '/api/sector',
            '/api/fileupload',
            '/api/profession',
            '/api/admin/send-invites',
            '/api/admin/get-invite',
            '/api/admin/reset-password',
            '/api/admin/update-invite',
            '/api/admin/check-email',
            "/api/admin/register",
            "/api/admin/login",
        ],
        BUSINESS_PUBLIC_ROUTES: [],
    };
};
const getSanitzedConfig = (config) => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in .env`);
        }
    }
    return config;
};
const config = getConfig();
const sanitizedConfig = getSanitzedConfig(config);
exports.default = sanitizedConfig;
//# sourceMappingURL=configSetup.js.map