import { QueryInterface } from 'sequelize';

export = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkInsert('porfolio', [
            {
                title: 'E-Commerce Web Application',
                description: 'Developed a full-stack e-commerce platform with payment integration and user management features.',
                duration: 6,
                date: '2021-06-15',
                file: JSON.stringify([{ filename: 'screenshot1.png', url: '/uploads/screenshot1.png' }, { filename: 'design-doc.pdf', url: '/uploads/design-doc.pdf' }]),
                userId: '4fdfb9dd-3a20-43dd-a387-a811ec6ba2ae',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Data Analytics Dashboard',
                description: 'Built a data analytics dashboard for monitoring KPIs and generating custom reports.',
                duration: 4,
                date: '2022-09-10',
                file: JSON.stringify([{ filename: 'dashboard-view.png', url: '/uploads/dashboard-view.png' }]),
                userId: 'bfe391c2-a354-4e0f-9dd7-3afe6b5cffbd',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Mobile Application for Task Management',
                description: 'Designed and developed a cross-platform mobile app for task scheduling and collaboration.',
                duration: 8,
                date: '2023-03-22',
                file: JSON.stringify([{ filename: 'app-preview.mp4', url: '/uploads/app-preview.mp4' }]),
                userId: 'cea9c359-e0be-44ce-9a21-209d68f63875',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('porfolio', {});
    },
};
