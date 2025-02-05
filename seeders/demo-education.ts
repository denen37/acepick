import { QueryInterface } from 'sequelize';

export = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkInsert('education', [
            {
                school: 'Taraba State University',
                degreeType: 'B.Sc',
                course: 'Computer Science',
                gradDate: '2020',
                userId: '11fc2ac1-8385-46bf-af8c-8b145981e104',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                school: 'Federal University of Technology Yola',
                degreeType: 'M.Sc',
                course: 'Electrical Engineering',
                gradDate: '2018',
                userId: '6aba4666-4e03-433b-8cb8-aeeac331ca39 ',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                school: 'University of Lagos',
                degreeType: 'Ph.D',
                course: 'Artificial Intelligence',
                gradDate: '2025',
                userId: '7e84f77d-df1b-442c-8f83-fd67be8286b6',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('education', {});
    },
};
