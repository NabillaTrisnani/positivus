import { PrismaClient } from '../../src/generated/prisma'

export async function seedSocialMedia(prisma: PrismaClient) {
    const data = [
        { link: 'https://linkedin.com/company/positivus', platform: 'LinkedIn' },
        { link: 'https://facebook.com/positivus', platform: 'Facebook' },
        { link: 'https://twitter.com/positivus', platform: 'Twitter' },
    ]

    await prisma.socialMedia.createMany({ data, skipDuplicates: true })
    return prisma.socialMedia.findMany()
}