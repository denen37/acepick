import { QueryInterface } from 'sequelize';

export = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkInsert('education', [
            {
                school: 'Taraba State University',
                degreeType: 'B.Sc',
                course: 'Computer Science',
                gradDate: '2020',
                userId: '4fdfb9dd-3a20-43dd-a387-a811ec6ba2ae',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                school: 'Federal University of Technology Yola',
                degreeType: 'M.Sc',
                course: 'Electrical Engineering',
                gradDate: '2018',
                userId: 'bfe391c2-a354-4e0f-9dd7-3afe6b5cffbd ',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                school: 'University of Lagos',
                degreeType: 'Ph.D',
                course: 'Artificial Intelligence',
                gradDate: '2025',
                userId: 'cea9c359-e0be-44ce-9a21-209d68f63875',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('education', {});
    },
};
