import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config/configSetup';

import { initDB } from './controllers/db';
import index from './routes/index';
import auth from './routes/auth';
import wallet from "./routes/wallet";
import client from "./routes/client";
import support from "./routes/support";
import market from "./routes/market";
import admin from "./routes/admin";

const schedule = require('node-schedule');
import social from "./routes/social";
import { isAuthorized } from './middlewares/authorise';
import { JobStatus, Jobs, modeType } from './models/Jobs';
import { CreditType, TransactionType, Transactions } from './models/Transaction';
import { Redis } from './services/redis';
import { Users } from './models/Users';
import { Professional } from './models/Professional';
import { Profile } from './models/Profile';
import { Material } from './models/Material';
import { Sector } from './models/Sector';
import { Dispute } from './models/Dispute';
import { ProfessionalSector } from './models/ProffesionalSector';
import { Profession } from './models/Profession';
import { Op } from 'sequelize';
import { Wallet, WalletType } from './models/Wallet';
import { errorHandling } from './middlewares/error';



const app: Application = express();

const http = require('http').Server(app);

app.use(morgan('dev'));

// PARSE JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ENABLE CORS AND START SERVER
app.use(cors({ origin: true }));
initDB();
// app.listen(config.PORT, () => {
// 	console.log(`Server started on port ${config.PORT}`);
// });

//Socket Logic
export const socketio = require('socket.io')(http, {
  cors: {
    origin: "*"
  }
})

let clients: any = {};
let online: any = [];

socketio.on("connection", async (socket: any) => {
  console.log("connetetd");
  console.log(socket.id, "has joined");


  socket.on("signin_notification", async (id: any) => {
    // console.log(socket);
    const redis = new Redis();
    const cachedUserSocket = await redis.setData(`notification-${id}`, socket.id);
    //  const cachedUserSocket = await redis.setData(`notification-${id}`, socket.id);
    const notifications = await Transactions.findAll({
      order: [
        ['id', 'DESC']
      ],
      where: { userId: id, read: false },
      include: [
        {
          model: Jobs, include: [{
            model: Material
          },
          {
            model: Users,
            as: "client",
            attributes: ["id"],
            include: [
              {
                model: Profile,
                attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                ],
              }
            ]
          },
          {
            model: Users,
            as: "owner",
            attributes: ["id"],
            include: [{
              model: Professional,
              include: [
                {
                  model: Profile,
                  attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                  ],
                  include: [
                    {
                      model: ProfessionalSector,
                      include: [
                        { model: Sector },
                        { model: Profession },
                      ],

                    }
                  ]
                }
              ]

            }]
          },
          { model: Dispute }]
        }
      ],
      limit: 1

    });
    console.log(notifications)


    socket.emit("notification", notifications)
  });



  socket.emit("connected", `${socket.id} connected`)


  socket.on("signin", (id: any) => {
    console.log(id);
    clients[id] = socket;
    console.log(clients);
  });


  socket.on("online", (id: any) => {
    online.push(id);
    socket.emit(online)
  });


  socket.on("wallet", async (data: any) => {

  });



  socket.on("notification", async (data: any) => {

  });



  socket.on("message", (msg: any) => {
    console.log(msg);
    let targetId = msg.targetId;
    if (clients[targetId]) clients[targetId].emit("message", msg);
  });
});


http.listen(config.PORT, () => {
  console.log(`Server started on port ${config.PORT}`);
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
app.use("/api", index);
app.use("/api", auth);
app.use("/api", client);
app.use("/api", wallet);
app.use("/api", admin);
app.use("/api", social);
app.use("/api", support);
app.use("/api", market);




schedule.scheduleJob("0 0 * * *", async function () {
  const jobs = await Jobs.findAll({
    where: {
      mode: modeType.PHYSICAL,

    }
  })

  for (let value of jobs) {
    if (value.durationUnit == "DAY") {

      if (!value.clientLocationArrival || !value.ownerLocationArrival) {

      }
      else if (Number(value.durationValue) > Number(value.clientLocationArrival.clientLocationArrival.length) &&
        Number(value.durationValue) > Number(value.ownerLocationArrival.ownerLocationArrival.length)) {
        console.log("proccessng....")
        await value.update({
          ownerMatchArrival: false, clientMatchArrival: false,
          currentOwnerLocationArrival: null, currentClientLocationArrival: null
        });
      } else {
        console.log(Number(value.durationValue) > Number(value.clientLocationArrival.clientLocationArrival.length));
        console.log(Number(value.durationValue) > Number(value.ownerLocationArrival.ownerLocationArrival.length));
        console.log(Number(value.clientLocationArrival.clientLocationArrival.length));
        console.log(Number(value.durationValue));
      }

      if (!value.clientLocationDeparture || !value.ownerLocationDeparture) {

      }
      else if (Number(value.durationValue) > Number(value.clientLocationDeparture.clientLocationDeparture.length) &&
        Number(value.durationValue) > Number(value.ownerLocationDeparture.ownerLocationDeparture.length)) {
        await value.update({
          clientMatchDeparture: false, ownerMatchDeparture: false, currentOwnerLocationDeparture: null,
          currentClientLocationDeparture: null
        });
      } else {
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
        await value.update({
          ownerMatchArrival: false, clientMatchArrival: false,
          currentOwnerLocationArrival: null, currentClientLocationArrival: null
        });
      }

      if (!value.clientLocationDeparture || !value.ownerLocationDeparture) {

      }
      else if ((Number(value.durationValue) * 7) > Number(value.clientLocationDeparture.clientLocationDeparture.length) &&
        (Number(value.durationValue) * 7) > Number(value.ownerLocationDeparture.ownerLocationDeparture.length)) {
        await value.update({
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

        let date: Date = new Date(value.clientLocationArrival.clientLocationArrival[0].time.toString());
        // Get the same date for the next two months
        var sameDateNextTwoMonths = new Date(date.getFullYear(), date.getMonth() + Number(value.durationValue), date.getDate());
        // Calculate the difference in milliseconds
        var timeDifference = sameDateNextTwoMonths.getTime() - date.getTime();

        // Convert milliseconds to days
        var daysDifference = timeDifference / (1000 * 60 * 60 * 24);

        let daysInNumber = Math.round(daysDifference + 1)
        if (Number(daysInNumber) > Number(value.clientLocationArrival.clientLocationArrival.length) &&
          Number(daysInNumber) > Number(value.ownerLocationArrival.ownerLocationArrival.length)) {
          await value.update({
            ownerMatchArrival: false, clientMatchArrival: false,
            currentOwnerLocationArrival: null, currentClientLocationArrival: null
          });
        }
      }

      if (!value.clientLocationDeparture || !value.ownerLocationDeparture) {

      }
      else if (value.clientLocationDeparture.clientLocationDeparture.length >= 1 && value.ownerLocationDeparture.ownerLocationDeparture.length >= 1) {
        let date: Date = value.clientLocationDeparture.clientLocationDeparture[0].time;
        // Get the same date for the next two months
        var sameDateNextTwoMonths = new Date(date.getFullYear(), date.getMonth() + Number(value.durationValue), date.getDate());
        // Calculate the difference in milliseconds
        var timeDifference = sameDateNextTwoMonths.getTime() - date.getTime();

        // Convert milliseconds to days
        var daysDifference = timeDifference / (1000 * 60 * 60 * 24);

        let daysInNumber = Math.round(daysDifference + 1)
        if (Number(daysInNumber) > Number(value.clientLocationDeparture.clientLocationDeparture.length) &&
          Number(daysInNumber) > Number(value.ownerLocationDeparture.ownerLocationDeparture.length)) {
          await value.update({
            ownerMatchArrival: false, clientMatchArrival: false,
            currentClientLocationArrival: null, currentClientLocationDeparture: null
          });
        }
      }
    }
  }
});



schedule.scheduleJob("0 12 * * *", async function () {
  const currentDate = new Date();
  // Subtract two days from the current date
  currentDate.setDate(currentDate.getDate() - 2);

  const jobs = await Jobs.findAll({
    where: {
      paid: true,
      processed: false,
      status: [JobStatus.CANCEL, JobStatus.REJECTED],
      createdAt: {
        [Op.gte]: currentDate
      }
    }
  })

  for (let invoice of jobs) {
    const walletUser = await Wallet.findOne({ where: { userId: invoice.userId, type: WalletType.CLIENT } })
    const walletProvider = await Wallet.findOne({ where: { userId: invoice.ownerId, type: WalletType.PROFESSIONAL } })

    await walletUser?.update({
      transitAmount: (Number(walletUser?.transitAmount) - Number(invoice?.total)),
      amount: (Number(walletUser?.amount) + Number(invoice?.total)),
    })
    await Transactions.create({
      title: "Deposit successful",
      description: `Your deposit of NGN${invoice.total} into your Acepick wallet on job cencelation was successful`,
      type: TransactionType.CREDIT, amount: invoice?.total,
      creditType: CreditType.FUNDING,
      status: "SUCCESSFUL", userId: invoice?.userId, walletId: walletUser?.id
    });
    await Transactions.create({
      title: "Job Canceled",
      description: `The Job "${invoice.title}" has been canceled`,
      type: TransactionType.JOB,
      creditType: CreditType.NONE,
      status: "CANCELED", userId: invoice?.ownerId,
      walletId: walletProvider?.id, jobId: invoice.id
    });

    await Transactions.create({
      title: "Job Canceled",
      description: `The Job "${invoice.title}" has been canceled`,
      type: TransactionType.JOB,
      creditType: CreditType.NONE,
      status: "CANCELED", userId: invoice?.userId,
      jobId: invoice.id
    });

    await invoice.update({ processed: true })

    const redis = new Redis();
    const cachedUserSocket: any = await redis.getData(`notification-${invoice.ownerId}`)
    const socketUser = socketio.sockets.sockets.get(cachedUserSocket);
    if (socketUser) {
      const notificationsUser = await Transactions.findAll({
        order: [
          ['id', 'DESC']
        ],
        where: { userId: invoice.ownerId, read: false },
        include: [
          {
            model: Jobs, include: [{
              model: Material
            },
            {
              model: Users,
              as: "client",
              attributes: ["id"],
              include: [
                {
                  model: Profile,
                  attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                  ],
                }
              ]
            },
            {
              model: Users,
              as: "owner",
              attributes: ["id"],
              include: [{
                model: Professional,
                include: [
                  {
                    model: Profile,
                    attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                    ],
                    include: [
                      {
                        model: ProfessionalSector,
                        include: [
                          { model: Sector },
                          { model: Profession },
                        ],

                      }
                    ]
                  }
                ]

              }]
            },
            { model: Dispute }]
          }
        ],
        limit: 1

      });
      socketUser.emit("notification", notificationsUser)

      const walletUser = await Wallet.findOne({ where: { userId: invoice!.ownerId, type: WalletType.PROFESSIONAL } })


      socketUser.emit("wallet", walletUser)
    }


    const cachedOwnerSocket: any = await redis.getData(`notification-${invoice.userId}`)
    const socketOwner = socketio.sockets.sockets.get(cachedOwnerSocket);
    if (socketOwner) {
      const notificationsOnwer = await Transactions.findAll({
        order: [
          ['id', 'DESC']
        ],
        where: { userId: invoice.userId, read: false },
        include: [
          {
            model: Jobs, include: [{
              model: Material
            },
            {
              model: Users,
              as: "client",
              attributes: ["id"],
              include: [
                {
                  model: Profile,
                  attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                  ],
                }
              ]
            },
            {
              model: Users,
              as: "owner",
              attributes: ["id"],
              include: [{
                model: Professional,
                include: [
                  {
                    model: Profile,
                    attributes: ["fullName", "avatar", "verified", "lga", "state", "address"
                    ],
                    include: [
                      {
                        model: ProfessionalSector,
                        include: [
                          { model: Sector },
                          { model: Profession },
                        ],

                      }
                    ]
                  }
                ]

              }]
            },
            { model: Dispute }]
          }
        ],
        limit: 1

      });
      socketOwner.emit("notification", notificationsOnwer)

      const walletUser = await Wallet.findOne({ where: { userId: invoice!.userId, type: WalletType.CLIENT } })


      socketOwner.emit("wallet", walletUser)
    }
  }


})
