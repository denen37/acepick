import { QueryInterface } from 'sequelize';

export = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkInsert('certification', [
            {
                title: 'Certified JavaScript Developer',
                companyIssue: 'Tech Certifiers Ltd.',
                date: '2021-05-15',
                userId: '11fc2ac1-8385-46bf-af8c-8b145981e104 ',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Advanced Data Science Certification',
                companyIssue: 'Data Academy',
                date: '2022-07-20',
                userId: '6aba4666-4e03-433b-8cb8-aeeac331ca39',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Cloud Computing Specialist',
                companyIssue: 'Cloud Masters Inc.',
                date: '2023-01-10',
                userId: '7e84f77d-df1b-442c-8f83-fd67be8286b6',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('certification', {});
    },
};
