import { QueryInterface } from 'sequelize';

export = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkInsert('profile', [
            {
                fullName: 'John Doe',
                fcmToken: 'fcmToken12345',
                avatar: 'https://example.com/avatar1.jpg',
                verified: 1,
                notified: 0,
                lga: 'Jalingo',
                state: 'Taraba',
                address: '123 Main Street, Jalingo',
                totalHire: 10,
                totalExpense: 50000,
                rate: 4.5,
                totalPendingHire: 2,
                count: 5,
                totalOngoingHire: 1,
                totalCompletedHire: 7,
                totalReview: 6,
                totalJobRejected: 1,
                totalJobCanceled: 0,
                totalDisputes: 1,
                bvn: '12345678901',
                type: 'CLIENT',
                corperate: 0,
                switch: 0,
                store: 0,
                userId: '11fc2ac1-8385-46bf-af8c-8b145981e104',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                fullName: 'Jane Smith',
                fcmToken: 'fcmToken67890',
                avatar: 'https://example.com/avatar2.jpg',
                verified: 1,
                notified: 1,
                lga: 'Wukari',
                state: 'Taraba',
                address: '456 Side Road, Wukari',
                totalHire: 20,
                totalExpense: 100000,
                rate: 4.8,
                totalPendingHire: 1,
                count: 10,
                totalOngoingHire: 2,
                totalCompletedHire: 18,
                totalReview: 15,
                totalJobRejected: 0,
                totalJobCanceled: 1,
                totalDisputes: 0,
                bvn: '98765432109',
                type: 'PROFESSIONAL',
                corperate: 1,
                switch: 0,
                store: 1,
                userId: '6aba4666-4e03-433b-8cb8-aeeac331ca39',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                fullName: 'Michael Johnson',
                fcmToken: 'fcmToken45678',
                avatar: 'https://example.com/avatar3.jpg',
                verified: 1,
                notified: 0,
                lga: 'Sardauna',
                state: 'Taraba',
                address: '789 Hilltop Avenue, Sardauna',
                totalHire: 15,
                totalExpense: 75000,
                rate: 4.7,
                totalPendingHire: 3,
                count: 8,
                totalOngoingHire: 1,
                totalCompletedHire: 12,
                totalReview: 9,
                totalJobRejected: 1,
                totalJobCanceled: 1,
                totalDisputes: 0,
                bvn: '11223344556',
                type: 'CORPERATE',
                corperate: 1,
                switch: 1,
                store: 0,
                userId: '7e84f77d-df1b-442c-8f83-fd67be8286b6',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('profile', {});
    },
};
