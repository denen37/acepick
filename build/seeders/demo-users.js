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
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
module.exports = {
    up: (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.bulkInsert('users', [
            {
                id: (0, uuid_1.v4)(),
                email: 'user1@example.com',
                password: 'hashed_password_1', // Replace with actual hashed passwords
                setPin: 1,
                fcmToken: 'sample_token_1',
                phone: '1234567890',
                status: 'ACTIVE',
                state: 'STEP_TWO',
                locationId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: (0, uuid_1.v4)(),
                email: 'user2@example.com',
                password: 'hashed_password_2', // Replace with actual hashed passwords
                setPin: 0,
                fcmToken: null,
                phone: '0987654321',
                status: 'INACTIVE',
                state: 'STEP_ONE',
                locationId: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: (0, uuid_1.v4)(),
                email: 'user3@example.com',
                password: 'hashed_password_3', // Replace with actual hashed passwords
                setPin: 1,
                fcmToken: 'sample_token_3',
                phone: '5555555555',
                status: 'SUSPENDED',
                state: 'VERIFIED',
                locationId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    }),
    down: (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.bulkDelete('users', {}, {});
    }),
};
//# sourceMappingURL=demo-users.js.map