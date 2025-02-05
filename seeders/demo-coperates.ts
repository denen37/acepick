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
                userId: '11fc2ac1-8385-46bf-af8c-8b145981e104',
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
                userId: '6aba4666-4e03-433b-8cb8-aeeac331ca39',
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
                userId: '7e84f77d-df1b-442c-8f83-fd67be8286b6',
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
