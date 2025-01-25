// Import packages
import { Sequelize } from 'sequelize-typescript';

// Import configs
import config from '../config/configSetup';
import { Users } from '../models/Users';
import { Verify } from '../models/Verify';
import { Profession } from '../models/Profession';
import { Professional } from '../models/Professional';
import { Profile } from '../models/Profile';
import { Sector } from '../models/Sector';
import { Wallet } from '../models/Wallet';
import { LanLog } from '../models/LanLog';
import { Admin } from '../models/Admin';
import { Invite } from '../models/Invite';
import { Corperate } from '../models/Cooperation';
import { Favourite } from '../models/Favourites';
import { Jobs } from '../models/Jobs';
import { Dispute } from '../models/Dispute';
import { VoiceRecord } from '../models/VoiceRecording';
import { Product } from '../models/Products';
import { MarketPlace } from '../models/Market';
import { Category } from '../models/Category';
import { Faq } from '../models/Faq';
import { Tos } from '../models/Tos';
import { Ticket } from '../models/Ticket';
import { TicketMessage } from '../models/TicketMessage';
import { Transactions } from '../models/Transaction';
import { Announcement } from '../models/Announcement';
import { Material } from '../models/Material';
import { Review } from '../models/Review';
import { Education } from '../models/Education';
import { Porfolio } from '../models/Porfolio';
import { Experience } from '../models/Experience';
import { Certification } from '../models/Certification';
import { AdminTransaction } from '../models/AdminTransaction';
import { Banks } from '../models/Bank';
import { Topic } from '../models/Topic';
import { ProfessionalSector } from '../models/ProffesionalSector';
import { Blocked } from '../models/Block';
import { Report } from '../models/Report';
import { ReviewMarket } from '../models/ReviewMarket';
import { MarketFavourite } from '../models/MarketFavourite';

// // Import models
// import {


// } from './models';


const sequelize = new Sequelize(config.DBNAME, config.DBUSERNAME, config.DBPASSWORD, {
	host: config.DBHOST,
	port: config.DBPORT,
	dialect: 'mysql',
	logging: false,
	dialectOptions: {
		// ssl: { require: true, rejectUnauthorized: false },
		ssl: false,
	},
	models: [
		Users,
		Verify,
		Corperate,
		Profession,
		Wallet,
		Material,
		Certification,
		Education,
		Porfolio,
		AdminTransaction,
		Experience,
		Product,
		MarketPlace,
		Announcement,
		Category,
		Transactions,
		VoiceRecord,
		Ticket,
		Review,
		TicketMessage,
		Professional,
		Invite,
		Favourite,
		Faq,
		Topic,
		Tos,
		Profile,
		Jobs,
		ProfessionalSector,
		Dispute,
		LanLog,
		Banks,
		Admin,
		Sector,
		Report,
		Blocked,
		MarketFavourite,
		ReviewMarket
	],
});

const initDB = async () => {
	await sequelize.authenticate();
	await sequelize
		// .sync({})
		.sync({ alter: true })
		.then(async () => {
			console.log('Database connected!');
		})
		.catch(function (err: any) {
			console.log(err, 'Something went wrong with the Database Update!');
		});
};
export { sequelize, initDB };
