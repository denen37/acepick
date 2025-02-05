import { QueryInterface } from 'sequelize';

export = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkInsert('education', [
            {
                school: 'Taraba State University',
                degreeType: 'B.Sc',
                course: 'Computer Science',
                gradDate: '2020',
                userId: 'a44be52f-1408-4408-ba65-f43aae83aebb',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                school: 'Federal University of Technology Yola',
                degreeType: 'M.Sc',
                course: 'Electrical Engineering',
                gradDate: '2018',
                userId: '7ecba0d6-bee7-448d-9667-df59afc0e0c0',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                school: 'University of Lagos',
                degreeType: 'Ph.D',
                course: 'Artificial Intelligence',
                gradDate: '2025',
                userId: 'f12f88d5-f1fa-4dc7-a98b-f5c8d87e76aa',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('education', {});
    },
};
