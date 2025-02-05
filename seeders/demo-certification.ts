import { QueryInterface } from 'sequelize';

export = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkInsert('certification', [
            {
                title: 'Certified JavaScript Developer',
                companyIssue: 'Tech Certifiers Ltd.',
                date: '2021-05-15',
                userId: 'a44be52f-1408-4408-ba65-f43aae83aebb',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Advanced Data Science Certification',
                companyIssue: 'Data Academy',
                date: '2022-07-20',
                userId: '7ecba0d6-bee7-448d-9667-df59afc0e0c0',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Cloud Computing Specialist',
                companyIssue: 'Cloud Masters Inc.',
                date: '2023-01-10',
                userId: 'f12f88d5-f1fa-4dc7-a98b-f5c8d87e76aa',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('certification', {});
    },
};
