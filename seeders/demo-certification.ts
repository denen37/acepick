import { QueryInterface } from 'sequelize';

export = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkInsert('certification', [
            {
                title: 'Certified JavaScript Developer',
                companyIssue: 'Tech Certifiers Ltd.',
                date: '2021-05-15',
                userId: '4fdfb9dd-3a20-43dd-a387-a811ec6ba2ae',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Advanced Data Science Certification',
                companyIssue: 'Data Academy',
                date: '2022-07-20',
                userId: 'bfe391c2-a354-4e0f-9dd7-3afe6b5cffbd',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Cloud Computing Specialist',
                companyIssue: 'Cloud Masters Inc.',
                date: '2023-01-10',
                userId: 'cea9c359-e0be-44ce-9a21-209d68f63875',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('certification', {});
    },
};
