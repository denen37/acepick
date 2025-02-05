import { QueryInterface } from 'sequelize';

export = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkInsert('experience', [
            {
                postHeld: 'Software Engineer',
                workPlace: 'Tech Innovators Inc.',
                startDate: '2020-01-15',
                endDate: '2022-06-30',
                userId: '11fc2ac1-8385-46bf-af8c-8b145981e104',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                postHeld: 'Data Scientist',
                workPlace: 'Creative Solutions Ltd.',
                startDate: '2018-03-01',
                endDate: '2021-12-31',
                userId: '6aba4666-4e03-433b-8cb8-aeeac331ca39',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                postHeld: 'Project Manager',
                workPlace: 'Future Enterprises Corp.',
                startDate: '2019-05-10',
                endDate: '2023-08-15',
                userId: '7e84f77d-df1b-442c-8f83-fd67be8286b6',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('experience', {});
    },
};