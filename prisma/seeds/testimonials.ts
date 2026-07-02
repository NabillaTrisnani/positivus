import { PrismaClient } from '../../src/generated/prisma'

export async function seedTestimonials(prisma: PrismaClient) {
    const data = [
        {
            name: 'John Smith',
            position: 'Marketing Director',
            company: 'XYZ Corp',
            testimony: 'We have been working with Positivus for the past year and have seen a significant increase in website traffic and leads as a result of their efforts. The team is professional, responsive, and truly cares about the success of our business. We highly recommend Positivus to any company looking to grow their online presence.',
        },
        {
            name: 'Sarah Johnson',
            position: 'CEO',
            company: 'Bright Solutions',
            testimony: 'Positivus completely transformed our digital marketing strategy. Their data-driven approach helped us identify the right audience and craft messages that actually convert. Within six months, our conversion rate doubled and our brand visibility skyrocketed.',
        },
        {
            name: 'Michael Chen',
            position: 'Founder',
            company: 'Nexa Innovations',
            testimony: 'What sets Positivus apart is their genuine partnership approach. They took the time to understand our business goals before proposing any strategy. The results speak for themselves — a 150% increase in qualified leads within the first quarter.',
        },
        {
            name: 'Emily Rodriguez',
            position: 'Head of Growth',
            company: 'Lumen Digital',
            testimony: 'We tried several agencies before Positivus, and none came close to delivering the same level of results and transparency. Their reporting is clear, their communication is prompt, and they consistently exceed our expectations every single month.',
        },
        {
            name: 'David Williams',
            position: 'Operations Manager',
            company: 'Vertex Industries',
            testimony: 'Working with Positivus has been a game changer for our SEO performance. We went from page three of search results to consistently ranking in the top five for our target keywords. Their expertise and dedication are unmatched.',
        },
    ];

    await prisma.testimonial.createMany({ data, skipDuplicates: true })
    return prisma.testimonial.findMany()
}