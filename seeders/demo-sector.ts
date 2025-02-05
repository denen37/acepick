import { QueryInterface } from 'sequelize';

export = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkInsert('sector', [
            {
                title: 'Information Technology',
                image: 'https://example.com/images/it_sector.jpg',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Healthcare',
                image: 'https://example.com/images/healthcare_sector.jpg',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Finance',
                image: 'https://example.com/images/finance_sector.jpg',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Construction',
                image: 'https://example.com/images/construction_sector.jpg',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Education',
                image: 'https://example.com/images/education_sector.jpg',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('sector', {});
    },
};
