import { QueryInterface } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkInsert('users', [
            {
                id: uuidv4(),
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
                id: uuidv4(),
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
                id: uuidv4(),
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
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('users', {}, {});
    },
};
