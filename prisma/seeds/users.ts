import bcrypt from "bcryptjs";
import { PrismaClient } from '../../src/generated/prisma'

export async function seedUsers(prisma: PrismaClient) {
    const hashedPassword = await bcrypt.hash("123456", 10);

    const data = [
        { email: 'admin@positivus.com', password: hashedPassword },
    ]

    await prisma.user.createMany({ data, skipDuplicates: true })
    return prisma.user.findMany()
}