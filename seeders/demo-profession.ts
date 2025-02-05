import { QueryInterface } from 'sequelize';

export = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkInsert('profession', [
            {
                title: 'Software Developer',
                image: 'https://example.com/software-developer.png',
                sectorId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Data Analyst',
                image: 'https://example.com/data-analyst.png',
                sectorId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Doctor',
                image: 'https://example.com/doctor.png',
                sectorId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Nurse',
                image: 'https://example.com/nurse.png',
                sectorId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Financial Analyst',
                image: 'https://example.com/financial-analyst.png',
                sectorId: 3,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Accountant',
                image: 'https://example.com/accountant.png',
                sectorId: 3,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('profession', {});
    },
};
