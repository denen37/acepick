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
                userId: '4fdfb9dd-3a20-43dd-a387-a811ec6ba2ae',
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
                userId: 'bfe391c2-a354-4e0f-9dd7-3afe6b5cffbd',
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
                userId: 'cea9c359-e0be-44ce-9a21-209d68f63875',
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
