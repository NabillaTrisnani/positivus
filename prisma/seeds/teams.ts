import cloudinary from '@/lib/cloudinary'
import { PrismaClient } from '../../src/generated/prisma'
import path from 'path'

async function uploadPhoto(filename: string) {
    const filePath = path.join(process.cwd(), 'public', 'team', filename)
    const publicId = filename.replace(/\.[^/.]+$/, '')

    const result = await cloudinary.uploader.upload(filePath, {
        folder: 'team-photos',
        public_id: publicId,
        overwrite: true,
    })

    return result.secure_url
}

export async function seedTeams(prisma: PrismaClient) {
    const rawData = [
        {
            name: 'John Smith',
            position: 'CEO and Founder',
            description: '10+ years of experience in digital marketing. Expertise in SEO, PPC, and content strategy',
            linkedin: 'https://linkedin.com/in/john-smith',
            photo: 'john-smith.png',
        },
        {
            name: 'Jane Doe',
            position: 'Director of Operations',
            description: '7+ years of experience in project management and team leadership. Strong organizational and communication skills',
            linkedin: 'https://linkedin.com/in/jane-doe',
            photo: 'jane-doe.png',
        },
        {
            name: 'Michael Brown',
            position: 'Senior SEO Specialist',
            description: '5+ years of experience in SEO and content creation. Proficient in keyword research and on-page optimization',
            linkedin: 'https://linkedin.com/in/michael-brown',
            photo: 'michael-brown.png',
        },
        {
            name: 'Emily Johnson',
            position: 'PPC Manager',
            description: '3+ years of experience in paid search advertising. Skilled in campaign management and performance analysis',
            linkedin: 'https://linkedin.com/in/emily-johnson',
            photo: 'emily-johnson.png',
        },
        {
            name: 'Brian Williams',
            position: 'Social Media Specialist',
            description: '4+ years of experience in social media marketing. Proficient in creating and scheduling content, analyzing metrics, and building engagement',
            linkedin: 'https://linkedin.com/in/brian-williams',
            photo: 'brian-williams.png',
        },
        {
            name: 'Sarah Kim',
            position: 'Content Creator',
            description: '2+ years of experience in writing and editing. Skilled in creating compelling, SEO-optimized content for various industries',
            linkedin: 'https://linkedin.com/in/sarah-kim',
            photo: 'sarah-kim.png',
        },
    ]

    // upload semua foto dulu (paralel), baru resolve ke URL
    const data = await Promise.all(
        rawData.map(async (item) => ({
            ...item,
            photo: await uploadPhoto(item.photo),
        }))
    )

    await prisma.team.createMany({ data, skipDuplicates: true })
    return prisma.team.findMany()
}