"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = exports.sequelize = void 0;
// Import packages
const sequelize_typescript_1 = require("sequelize-typescript");
// Import configs
const configSetup_1 = __importDefault(require("../config/configSetup"));
const Users_1 = require("../models/Users");
const Verify_1 = require("../models/Verify");
const Profession_1 = require("../models/Profession");
const Professional_1 = require("../models/Professional");
const Profile_1 = require("../models/Profile");
const Sector_1 = require("../models/Sector");
const Wallet_1 = require("../models/Wallet");
const LanLog_1 = require("../models/LanLog");
const Admin_1 = require("../models/Admin");
const Invite_1 = require("../models/Invite");
const Cooperation_1 = require("../models/Cooperation");
const Favourites_1 = require("../models/Favourites");
const Jobs_1 = require("../models/Jobs");
const Dispute_1 = require("../models/Dispute");
const VoiceRecording_1 = require("../models/VoiceRecording");
const Products_1 = require("../models/Products");
const Market_1 = require("../models/Market");
const Category_1 = require("../models/Category");
const Faq_1 = require("../models/Faq");
const Tos_1 = require("../models/Tos");
const Ticket_1 = require("../models/Ticket");
const TicketMessage_1 = require("../models/TicketMessage");
const Transaction_1 = require("../models/Transaction");
const Announcement_1 = require("../models/Announcement");
const Material_1 = require("../models/Material");
const Review_1 = require("../models/Review");
const Education_1 = require("../models/Education");
const Porfolio_1 = require("../models/Porfolio");
const Experience_1 = require("../models/Experience");
const Certification_1 = require("../models/Certification");
const AdminTransaction_1 = require("../models/AdminTransaction");
const Bank_1 = require("../models/Bank");
const Topic_1 = require("../models/Topic");
const ProffesionalSector_1 = require("../models/ProffesionalSector");
const Block_1 = require("../models/Block");
const Report_1 = require("../models/Report");
const ReviewMarket_1 = require("../models/ReviewMarket");
const MarketFavourite_1 = require("../models/MarketFavourite");
// // Import models
// import {
// } from './models';
const sequelize = new sequelize_typescript_1.Sequelize(configSetup_1.default.DBNAME, configSetup_1.default.DBUSERNAME, configSetup_1.default.DBPASSWORD, {
    host: configSetup_1.default.DBHOST,
    port: configSetup_1.default.DBPORT,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
        // ssl: { require: true, rejectUnauthorized: false },
        ssl: false,
    },
    models: [
        Users_1.Users,
        Verify_1.Verify,
        Cooperation_1.Corperate,
        Profession_1.Profession,
        Wallet_1.Wallet,
        Material_1.Material,
        Certification_1.Certification,
        Education_1.Education,
        Porfolio_1.Porfolio,
        AdminTransaction_1.AdminTransaction,
        Experience_1.Experience,
        Products_1.Product,
        Market_1.MarketPlace,
        Announcement_1.Announcement,
        Category_1.Category,
        Transaction_1.Transactions,
        VoiceRecording_1.VoiceRecord,
        Ticket_1.Ticket,
        Review_1.Review,
        TicketMessage_1.TicketMessage,
        Professional_1.Professional,
        Invite_1.Invite,
        Favourites_1.Favourite,
        Faq_1.Faq,
        Topic_1.Topic,
        Tos_1.Tos,
        Profile_1.Profile,
        Jobs_1.Jobs,
        ProffesionalSector_1.ProfessionalSector,
        Dispute_1.Dispute,
        LanLog_1.LanLog,
        Bank_1.Banks,
        Admin_1.Admin,
        Sector_1.Sector,
        Report_1.Report,
        Block_1.Blocked,
        MarketFavourite_1.MarketFavourite,
        ReviewMarket_1.ReviewMarket
    ],
});
exports.sequelize = sequelize;
const initDB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield sequelize.authenticate();
    yield sequelize
        // .sync({})
        .sync({ alter: true })
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Database connected!');
    }))
        .catch(function (err) {
        console.log(err, 'Something went wrong with the Database Update!');
    });
});
exports.initDB = initDB;
//# sourceMappingURL=db.js.map