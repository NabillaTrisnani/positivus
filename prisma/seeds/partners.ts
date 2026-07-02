import cloudinary from '@/lib/cloudinary'
import { PrismaClient } from '../../src/generated/prisma'
import path from 'path'

async function uploadPhoto(filename: string) {
    const filePath = path.join(process.cwd(), 'public', 'partner', filename)
    const publicId = filename.replace(/\.[^/.]+$/, '')

    const result = await cloudinary.uploader.upload(filePath, {
        folder: 'partner-logo',
        public_id: publicId,
        overwrite: true,
    })

    return result.secure_url
}

export async function seedPartners(prisma: PrismaClient) {
    const rawData = [
        {
            name: 'Amazon',
            logo: 'amazon.svg',
        },
        {
            name: 'Dribbble',
            logo: 'dribbble.svg',
        },
        {
            name: 'Hubspot',
            logo: 'hubspot.svg',
        },
        {
            name: 'Notion',
            logo: 'notion.svg',
        },
        {
            name: 'Netflix',
            logo: 'netflix.svg',
        },
        {
            name: 'Zoom',
            logo: 'zoom.svg',
        },
    ]

    // upload semua foto dulu (paralel), baru resolve ke URL
    const data = await Promise.all(
        rawData.map(async (item) => ({
            ...item,
            logo: await uploadPhoto(item.logo),
        }))
    )

    await prisma.partner.createMany({ data, skipDuplicates: true })
    return prisma.partner.findMany()
}