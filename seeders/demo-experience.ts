import { QueryInterface } from 'sequelize';

export = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkInsert('experience', [
            {
                postHeld: 'Software Engineer',
                workPlace: 'Tech Innovators Inc.',
                startDate: '2020-01-15',
                endDate: '2022-06-30',
                userId: 'a44be52f-1408-4408-ba65-f43aae83aebb',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                postHeld: 'Data Scientist',
                workPlace: 'Creative Solutions Ltd.',
                startDate: '2018-03-01',
                endDate: '2021-12-31',
                userId: '7ecba0d6-bee7-448d-9667-df59afc0e0c0',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                postHeld: 'Project Manager',
                workPlace: 'Future Enterprises Corp.',
                startDate: '2019-05-10',
                endDate: '2023-08-15',
                userId: 'f12f88d5-f1fa-4dc7-a98b-f5c8d87e76aa',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('experience', {});
    },
};