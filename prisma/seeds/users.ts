import { PrismaClient } from '../../src/generated/prisma'

export async function seedUsers(prisma: PrismaClient) {
    const data = [
        { email: 'admin@positivus.com', password: '123456' },
    ]

    await prisma.user.createMany({ data, skipDuplicates: true })
    return prisma.user.findMany()
}