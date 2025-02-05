import { QueryInterface } from 'sequelize';

export = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkInsert('corperate', [
            {
                nameOfOrg: 'Tech Innovators Inc.',
                phone: '123-456-7890',
                address: '123 Innovation Drive, Jalingo',
                state: 'Taraba',
                lga: 'Jalingo',
                regNum: 'REG-12345',
                noOfEmployees: '50',
                userId: 'a44be52f-1408-4408-ba65-f43aae83aebb',
                profileId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                nameOfOrg: 'Creative Solutions Ltd.',
                phone: '987-654-3210',
                address: '456 Main Street, Wukari',
                state: 'Taraba',
                lga: 'Wukari',
                regNum: 'REG-67890',
                noOfEmployees: '100',
                userId: '7ecba0d6-bee7-448d-9667-df59afc0e0c0',
                profileId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                nameOfOrg: 'Future Enterprises Corp.',
                phone: '555-987-6543',
                address: '789 Business Avenue, Sardauna',
                state: 'Taraba',
                lga: 'Sardauna',
                regNum: 'REG-11223',
                noOfEmployees: '75',
                userId: 'f12f88d5-f1fa-4dc7-a98b-f5c8d87e76aa',
                profileId: 3,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('corperate', {});
    },
};
