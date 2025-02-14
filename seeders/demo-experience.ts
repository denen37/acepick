import { QueryInterface } from 'sequelize';

export = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkInsert('experience', [
            {
                postHeld: 'Software Engineer',
                workPlace: 'Tech Innovators Inc.',
                startDate: '2020-01-15',
                endDate: '2022-06-30',
                userId: '4fdfb9dd-3a20-43dd-a387-a811ec6ba2ae',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                postHeld: 'Data Scientist',
                workPlace: 'Creative Solutions Ltd.',
                startDate: '2018-03-01',
                endDate: '2021-12-31',
                userId: 'bfe391c2-a354-4e0f-9dd7-3afe6b5cffbd',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                postHeld: 'Project Manager',
                workPlace: 'Future Enterprises Corp.',
                startDate: '2019-05-10',
                endDate: '2023-08-15',
                userId: 'cea9c359-e0be-44ce-9a21-209d68f63875',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('experience', {});
    },
};