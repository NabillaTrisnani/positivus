import { PrismaClient } from '../../src/generated/prisma'

export async function seedCaseStudies(prisma: PrismaClient) {
    const data = [
        { text: 'For a local restaurant, we implemented a targeted PPC campaign that resulted in a 50% increase in website traffic and a 25% increase in sales.' },
        { text: 'For a B2B software company, we developed an SEO strategy that resulted in a first page ranking for key keywords and a 200% increase in organic traffic.' },
        { text: 'For a national retail chain, we created a social media marketing campaign that increased followers by 25% and generated a 20% increase in online sales.' },
    ]

    await prisma.caseStudy.createMany({ data, skipDuplicates: true })
    return prisma.caseStudy.findMany()
}