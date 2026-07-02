import cloudinary from '@/lib/cloudinary'
import { PrismaClient } from '../../src/generated/prisma'
import path from 'path'

async function uploadPhoto(filename: string) {
    const filePath = path.join(process.cwd(), 'public', 'illustration', filename)
    const publicId = filename.replace(/\.[^/.]+$/, '')

    const result = await cloudinary.uploader.upload(filePath, {
        folder: 'service-illustrations',
        public_id: publicId,
        overwrite: true,
    })

    return result.secure_url
}

export async function seedServices(prisma: PrismaClient) {
    const rawData = [
        {
            cardBackground: 'gray',
            headerText: 'Search engine optimization',
            headerTextColor: 'black',
            headerBackgroundColor: 'green',
            buttonIconColor: 'green',
            buttonFontColor: 'black',
            serviceIllustration: 'illustration-1.svg',
        },
        {
            cardBackground: 'green',
            headerText: 'Pay-per-click advertising',
            headerTextColor: 'black',
            headerBackgroundColor: 'gray',
            buttonIconColor: 'green',
            buttonFontColor: 'black',
            serviceIllustration: 'illustration-2.svg',
        },
        {
            cardBackground: 'black',
            headerText: 'Social Media Marketing',
            headerTextColor: 'black',
            headerBackgroundColor: 'gray',
            buttonIconColor: 'black',
            buttonFontColor: 'gray',
            serviceIllustration: 'illustration-3.svg',
        },
        {
            cardBackground: 'gray',
            headerText: 'Email Marketing',
            headerTextColor: 'black',
            headerBackgroundColor: 'green',
            buttonIconColor: 'green',
            buttonFontColor: 'black',
            serviceIllustration: 'illustration-4.svg',
        },
        {
            cardBackground: 'green',
            headerText: 'Content Creation',
            headerTextColor: 'black',
            headerBackgroundColor: 'gray',
            buttonIconColor: 'green',
            buttonFontColor: 'black',
            serviceIllustration: 'illustration-5.svg',
        },
        {
            cardBackground: 'black',
            headerText: 'Social Media Marketing',
            headerTextColor: 'black',
            headerBackgroundColor: 'green',
            buttonIconColor: 'black',
            buttonFontColor: 'gray',
            serviceIllustration: 'illustration-6.svg',
        },
    ]

    // upload semua foto dulu (paralel), baru resolve ke URL
    const data = await Promise.all(
        rawData.map(async (item) => ({
            ...item,
            serviceIllustration: await uploadPhoto(item.serviceIllustration),
        }))
    )

    await prisma.service.createMany({ data, skipDuplicates: true })
    return prisma.service.findMany()
}