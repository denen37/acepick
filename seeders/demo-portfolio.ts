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
                userId: 'a44be52f-1408-4408-ba65-f43aae83aebb',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Data Analytics Dashboard',
                description: 'Built a data analytics dashboard for monitoring KPIs and generating custom reports.',
                duration: 4,
                date: '2022-09-10',
                file: JSON.stringify([{ filename: 'dashboard-view.png', url: '/uploads/dashboard-view.png' }]),
                userId: '7ecba0d6-bee7-448d-9667-df59afc0e0c0',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                title: 'Mobile Application for Task Management',
                description: 'Designed and developed a cross-platform mobile app for task scheduling and collaboration.',
                duration: 8,
                date: '2023-03-22',
                file: JSON.stringify([{ filename: 'app-preview.mp4', url: '/uploads/app-preview.mp4' }]),
                userId: 'f12f88d5-f1fa-4dc7-a98b-f5c8d87e76aa',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('porfolio', {});
    },
};
