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
exports.socketio = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const configSetup_1 = __importDefault(require("./config/configSetup"));
const db_1 = require("./controllers/db");
const index_1 = __importDefault(require("./routes/index"));
const auth_1 = __importDefault(require("./routes/auth"));
const wallet_1 = __importDefault(require("./routes/wallet"));
const client_1 = __importDefault(require("./routes/client"));
const support_1 = __importDefault(require("./routes/support"));
const market_1 = __importDefault(require("./routes/market"));
const admin_1 = __importDefault(require("./routes/admin"));
const schedule = require('node-schedule');
const social_1 = __importDefault(require("./routes/social"));
const Jobs_1 = require("./models/Jobs");
const Transaction_1 = require("./models/Transaction");
const redis_1 = require("./services/redis");
const Users_1 = require("./models/Users");
const Professional_1 = require("./models/Professional");
const Profile_1 = require("./models/Profile");
const Material_1 = require("./models/Material");
const Sector_1 = require("./models/Sector");
const Dispute_1 = require("./models/Dispute");
const ProffesionalSector_1 = require("./models/ProffesionalSector");
const Profession_1 = require("./models/Profession");
const sequelize_1 = require("sequelize");
const Wallet_1 = require("./models/Wallet");
const app = (0, express_1.default)();
const http = require('http').Server(app);
app.use((0, morgan_1.default)('dev'));
// PARSE JSON
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ENABLE CORS AND START SERVER
app.use((0, cors_1.default)({ origin: true }));
(0, db_1.initDB)();
// app.listen(config.PORT, () => {
// 	console.log(`Server started on port ${config.PORT}`);
// });
//Socket Logic
exports.socketio = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});
let clients = {};
let online = [];
exports.socketio.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("connetetd");
    console.log(socket.id, "has joined");
    socket.on("signin_notification", (id) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log(socket);
        const redis = new redis_1.Redis();
        const cachedUserSocket = yield redis.setData(`notification-${id}`, socket.id);
        //  const cachedUserSocket = await redis.setData(`notification-${id}`, socket.id);
        const notifications = yield Transaction_1.Transactions.findAll({
            order: [
                ['id', 'DESC']
            ],
            where: { userId: id, read: false },
            include: [
                {
                    model: Jobs_1.Jobs, include: [{
                            model: Material_1.Material
                        },
                        {
                            model: Users_1.Users,
                            as: "client",
                            attributes: ["id"],
                            include: [
                                {
                                    model: Profile_1.Profile,
                                    attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                    ],
                                }
                            ]
                        },
                        {
                            model: Users_1.Users,
                            as: "owner",
                            attributes: ["id"],
                            include: [{
                                    model: Professional_1.Professional,
                                    include: [
                                        {
                                            model: Profile_1.Profile,
                                            attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                            ],
                                            include: [
                                                {
                                                    model: ProffesionalSector_1.ProfessionalSector,
                                                    include: [
                                                        { model: Sector_1.Sector },
                                                        { model: Profession_1.Profession },
                                                    ],
                                                }
                                            ]
                                        }
                                    ]
                                }]
                        },
                        { model: Dispute_1.Dispute }]
                }
            ],
            limit: 1
        });
        console.log(notifications);
        socket.emit("notification", notifications);
    }));
    socket.emit("connected", `${socket.id} connected`);
    socket.on("signin", (id) => {
        console.log(id);
        clients[id] = socket;
        console.log(clients);
    });
    socket.on("online", (id) => {
        online.push(id);
        socket.emit(online);
    });
    socket.on("wallet", (data) => __awaiter(void 0, void 0, void 0, function* () {
    }));
    socket.on("notification", (data) => __awaiter(void 0, void 0, void 0, function* () {
    }));
    socket.on("message", (msg) => {
        console.log(msg);
        let targetId = msg.targetId;
        if (clients[targetId])
            clients[targetId].emit("message", msg);
    });
}));
http.listen(configSetup_1.default.PORT, () => {
    console.log(`Server started on port ${configSetup_1.default.PORT}`);
});
// Routes
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
// app.use((req, res, next) => {
//   // If no route handler has sent a response yet, it means no route matched the request URL
//   const err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
// // Error handling middleware
// app.use((err, req, res, next) => {
//   // Set the default status code to 500 if it's not already set
//   const statusCode = err.status || 500;
//   // Send the error response
//   res.status(statusCode).json({
//     error: {
//       message: err.message
//     }
//   });
// });
// app.all('*', isAuthorized);
app.use("/api", index_1.default);
app.use("/api", auth_1.default);
app.use("/api", client_1.default);
app.use("/api", wallet_1.default);
app.use("/api", admin_1.default);
app.use("/api", social_1.default);
app.use("/api", support_1.default);
app.use("/api", market_1.default);
schedule.scheduleJob("0 0 * * *", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const jobs = yield Jobs_1.Jobs.findAll({
            where: {
                mode: Jobs_1.modeType.PHYSICAL,
            }
        });
        for (let value of jobs) {
            if (value.durationUnit == "DAY") {
                if (!value.clientLocationArrival || !value.ownerLocationArrival) {
                }
                else if (Number(value.durationValue) > Number(value.clientLocationArrival.clientLocationArrival.length) &&
                    Number(value.durationValue) > Number(value.ownerLocationArrival.ownerLocationArrival.length)) {
                    console.log("proccessng....");
                    yield value.update({
                        ownerMatchArrival: false, clientMatchArrival: false,
                        currentOwnerLocationArrival: null, currentClientLocationArrival: null
                    });
                }
                else {
                    console.log(Number(value.durationValue) > Number(value.clientLocationArrival.clientLocationArrival.length));
                    console.log(Number(value.durationValue) > Number(value.ownerLocationArrival.ownerLocationArrival.length));
                    console.log(Number(value.clientLocationArrival.clientLocationArrival.length));
                    console.log(Number(value.durationValue));
                }
                if (!value.clientLocationDeparture || !value.ownerLocationDeparture) {
                }
                else if (Number(value.durationValue) > Number(value.clientLocationDeparture.clientLocationDeparture.length) &&
                    Number(value.durationValue) > Number(value.ownerLocationDeparture.ownerLocationDeparture.length)) {
                    yield value.update({
                        clientMatchDeparture: false, ownerMatchDeparture: false, currentOwnerLocationDeparture: null,
                        currentClientLocationDeparture: null
                    });
                }
                else {
                    console.log(Number(value.durationValue) > Number(value.clientLocationArrival.clientLocationArrival.length));
                    console.log(Number(value.durationValue) > Number(value.ownerLocationArrival.ownerLocationArrival.length));
                    console.log(Number(value.clientLocationArrival.clientLocationArrival.length));
                    console.log(Number(value.durationValue));
                }
            }
            else if (value.durationUnit == "WEEK") {
                if (!value.ownerLocationArrival || !value.clientLocationArrival) {
                }
                else if ((Number(value.durationValue) * 7) > Number(value.clientLocationArrival.clientLocationArrival.length) &&
                    (Number(value.durationValue) * 7) > Number(value.ownerLocationArrival.ownerLocationArrival.length)) {
                    yield value.update({
                        ownerMatchArrival: false, clientMatchArrival: false,
                        currentOwnerLocationArrival: null, currentClientLocationArrival: null
                    });
                }
                if (!value.clientLocationDeparture || !value.ownerLocationDeparture) {
                }
                else if ((Number(value.durationValue) * 7) > Number(value.clientLocationDeparture.clientLocationDeparture.length) &&
                    (Number(value.durationValue) * 7) > Number(value.ownerLocationDeparture.ownerLocationDeparture.length)) {
                    yield value.update({
                        clientMatchDeparture: false, ownerMatchDeparture: false, currentOwnerLocationDeparture: null,
                        currentClientLocationDeparture: null
                    });
                }
            }
            else if (value.durationUnit == "MONTH") {
                // Get today's date
                if (!value.clientLocationArrival || !value.ownerLocationArrival) {
                }
                else if (value.clientLocationArrival.clientLocationArrival.length >= 1 && value.ownerLocationArrival.ownerLocationArrival.length >= 1) {
                    let date = new Date(value.clientLocationArrival.clientLocationArrival[0].time.toString());
                    // Get the same date for the next two months
                    var sameDateNextTwoMonths = new Date(date.getFullYear(), date.getMonth() + Number(value.durationValue), date.getDate());
                    // Calculate the difference in milliseconds
                    var timeDifference = sameDateNextTwoMonths.getTime() - date.getTime();
                    // Convert milliseconds to days
                    var daysDifference = timeDifference / (1000 * 60 * 60 * 24);
                    let daysInNumber = Math.round(daysDifference + 1);
                    if (Number(daysInNumber) > Number(value.clientLocationArrival.clientLocationArrival.length) &&
                        Number(daysInNumber) > Number(value.ownerLocationArrival.ownerLocationArrival.length)) {
                        yield value.update({
                            ownerMatchArrival: false, clientMatchArrival: false,
                            currentOwnerLocationArrival: null, currentClientLocationArrival: null
                        });
                    }
                }
                if (!value.clientLocationDeparture || !value.ownerLocationDeparture) {
                }
                else if (value.clientLocationDeparture.clientLocationDeparture.length >= 1 && value.ownerLocationDeparture.ownerLocationDeparture.length >= 1) {
                    let date = value.clientLocationDeparture.clientLocationDeparture[0].time;
                    // Get the same date for the next two months
                    var sameDateNextTwoMonths = new Date(date.getFullYear(), date.getMonth() + Number(value.durationValue), date.getDate());
                    // Calculate the difference in milliseconds
                    var timeDifference = sameDateNextTwoMonths.getTime() - date.getTime();
                    // Convert milliseconds to days
                    var daysDifference = timeDifference / (1000 * 60 * 60 * 24);
                    let daysInNumber = Math.round(daysDifference + 1);
                    if (Number(daysInNumber) > Number(value.clientLocationDeparture.clientLocationDeparture.length) &&
                        Number(daysInNumber) > Number(value.ownerLocationDeparture.ownerLocationDeparture.length)) {
                        yield value.update({
                            ownerMatchArrival: false, clientMatchArrival: false,
                            currentClientLocationArrival: null, currentClientLocationDeparture: null
                        });
                    }
                }
            }
        }
    });
});
schedule.scheduleJob("0 12 * * *", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const currentDate = new Date();
        // Subtract two days from the current date
        currentDate.setDate(currentDate.getDate() - 2);
        const jobs = yield Jobs_1.Jobs.findAll({
            where: {
                paid: true,
                processed: false,
                status: [Jobs_1.JobStatus.CANCEL, Jobs_1.JobStatus.REJECTED],
                createdAt: {
                    [sequelize_1.Op.gte]: currentDate
                }
            }
        });
        for (let invoice of jobs) {
            const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: invoice.userId, type: Wallet_1.WalletType.CLIENT } });
            const walletProvider = yield Wallet_1.Wallet.findOne({ where: { userId: invoice.ownerId, type: Wallet_1.WalletType.PROFESSIONAL } });
            yield (walletUser === null || walletUser === void 0 ? void 0 : walletUser.update({
                transitAmount: (Number(walletUser === null || walletUser === void 0 ? void 0 : walletUser.transitAmount) - Number(invoice === null || invoice === void 0 ? void 0 : invoice.total)),
                amount: (Number(walletUser === null || walletUser === void 0 ? void 0 : walletUser.amount) + Number(invoice === null || invoice === void 0 ? void 0 : invoice.total)),
            }));
            yield Transaction_1.Transactions.create({
                title: "Deposit successful",
                description: `Your deposit of NGN${invoice.total} into your Acepick wallet on job cencelation was successful`,
                type: Transaction_1.TransactionType.CREDIT, amount: invoice === null || invoice === void 0 ? void 0 : invoice.total,
                creditType: Transaction_1.CreditType.FUNDING,
                status: "SUCCESSFUL", userId: invoice === null || invoice === void 0 ? void 0 : invoice.userId, walletId: walletUser === null || walletUser === void 0 ? void 0 : walletUser.id
            });
            yield Transaction_1.Transactions.create({
                title: "Job Canceled",
                description: `The Job "${invoice.title}" has been canceled`,
                type: Transaction_1.TransactionType.JOB,
                creditType: Transaction_1.CreditType.NONE,
                status: "CANCELED", userId: invoice === null || invoice === void 0 ? void 0 : invoice.ownerId,
                walletId: walletProvider === null || walletProvider === void 0 ? void 0 : walletProvider.id, jobId: invoice.id
            });
            yield Transaction_1.Transactions.create({
                title: "Job Canceled",
                description: `The Job "${invoice.title}" has been canceled`,
                type: Transaction_1.TransactionType.JOB,
                creditType: Transaction_1.CreditType.NONE,
                status: "CANCELED", userId: invoice === null || invoice === void 0 ? void 0 : invoice.userId,
                jobId: invoice.id
            });
            yield invoice.update({ processed: true });
            const redis = new redis_1.Redis();
            const cachedUserSocket = yield redis.getData(`notification-${invoice.ownerId}`);
            const socketUser = exports.socketio.sockets.sockets.get(cachedUserSocket);
            if (socketUser) {
                const notificationsUser = yield Transaction_1.Transactions.findAll({
                    order: [
                        ['id', 'DESC']
                    ],
                    where: { userId: invoice.ownerId, read: false },
                    include: [
                        {
                            model: Jobs_1.Jobs, include: [{
                                    model: Material_1.Material
                                },
                                {
                                    model: Users_1.Users,
                                    as: "client",
                                    attributes: ["id"],
                                    include: [
                                        {
                                            model: Profile_1.Profile,
                                            attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                            ],
                                        }
                                    ]
                                },
                                {
                                    model: Users_1.Users,
                                    as: "owner",
                                    attributes: ["id"],
                                    include: [{
                                            model: Professional_1.Professional,
                                            include: [
                                                {
                                                    model: Profile_1.Profile,
                                                    attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                    ],
                                                    include: [
                                                        {
                                                            model: ProffesionalSector_1.ProfessionalSector,
                                                            include: [
                                                                { model: Sector_1.Sector },
                                                                { model: Profession_1.Profession },
                                                            ],
                                                        }
                                                    ]
                                                }
                                            ]
                                        }]
                                },
                                { model: Dispute_1.Dispute }]
                        }
                    ],
                    limit: 1
                });
                socketUser.emit("notification", notificationsUser);
                const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: invoice.ownerId, type: Wallet_1.WalletType.PROFESSIONAL } });
                socketUser.emit("wallet", walletUser);
            }
            const cachedOwnerSocket = yield redis.getData(`notification-${invoice.userId}`);
            const socketOwner = exports.socketio.sockets.sockets.get(cachedOwnerSocket);
            if (socketOwner) {
                const notificationsOnwer = yield Transaction_1.Transactions.findAll({
                    order: [
                        ['id', 'DESC']
                    ],
                    where: { userId: invoice.userId, read: false },
                    include: [
                        {
                            model: Jobs_1.Jobs, include: [{
                                    model: Material_1.Material
                                },
                                {
                                    model: Users_1.Users,
                                    as: "client",
                                    attributes: ["id"],
                                    include: [
                                        {
                                            model: Profile_1.Profile,
                                            attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                            ],
                                        }
                                    ]
                                },
                                {
                                    model: Users_1.Users,
                                    as: "owner",
                                    attributes: ["id"],
                                    include: [{
                                            model: Professional_1.Professional,
                                            include: [
                                                {
                                                    model: Profile_1.Profile,
                                                    attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                                                    ],
                                                    include: [
                                                        {
                                                            model: ProffesionalSector_1.ProfessionalSector,
                                                            include: [
                                                                { model: Sector_1.Sector },
                                                                { model: Profession_1.Profession },
                                                            ],
                                                        }
                                                    ]
                                                }
                                            ]
                                        }]
                                },
                                { model: Dispute_1.Dispute }]
                        }
                    ],
                    limit: 1
                });
                socketOwner.emit("notification", notificationsOnwer);
                const walletUser = yield Wallet_1.Wallet.findOne({ where: { userId: invoice.userId, type: Wallet_1.WalletType.CLIENT } });
                socketOwner.emit("wallet", walletUser);
            }
        }
    });
});
//# sourceMappingURL=app.js.map