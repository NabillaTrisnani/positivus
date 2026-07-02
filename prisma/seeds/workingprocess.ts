import { PrismaClient } from '../../src/generated/prisma'

export async function seedWorkingProcesses(prisma: PrismaClient) {
    const data = [
        {
            title: 'Consultation',
            description: 'During the initial consultation, we will discuss your business goals and objectives, target audience, and current marketing efforts. This will allow us to understand your needs and tailor our services to best fit your requirements.'
        },
        {
            title: 'Research and Strategy Development',
            description: 'After the consultation, we will conduct research on your industry, competitors, and target audience. Based on this research, we will develop a comprehensive marketing strategy that outlines the tactics and channels we will use to achieve your goals.'
        },
        {
            title: 'Implementation',
            description: 'Once the strategy is finalized, we will begin implementing the planned marketing initiatives across the selected channels. This may include creating content, setting up campaigns, and launching promotional activities.'
        },
        {
            title: 'Monitoring and Optimization',
            description: 'Throughout the campaign, we will monitor performance metrics and make data-driven adjustments to optimize results. This ensures that your marketing efforts are delivering the best possible return on investment.'
        },
        {
            title: 'Reporting and Communication',
            description: 'We will provide regular reports and updates on the performance of your marketing campaigns, ensuring transparency and keeping you informed of the results.'
        },
        {
            title: 'Continual Improvement',
            description: 'We will continuously review and improve our services to ensure that we are providing the best possible experience for our clients. This may involve updating our marketing strategies, refining our content, or exploring new channels to reach your target audience.'
        }
    ]

    await prisma.workingProcess.createMany({ data, skipDuplicates: true })
    return prisma.workingProcess.findMany()
}