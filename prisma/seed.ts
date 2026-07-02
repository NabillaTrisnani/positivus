import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";
import { seedSocialMedia } from "./seeds/social";
import { seedUsers } from "./seeds/users";
import { seedTestimonials } from "./seeds/testimonials";
import { seedCaseStudies } from "./seeds/casestudy";
import { seedWorkingProcesses } from "./seeds/workingprocess";
import { seedServices } from "./seeds/services";
import { seedPartners } from "./seeds/partners";
import { seedTeams } from "./seeds/teams";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {

    const partner = await seedPartners(prisma);
    console.log(`✅ ${partner.length} partners seeded`);

    const service = await seedServices(prisma);
    console.log(`✅ ${service.length} services seeded`);

    const casestudy = await seedCaseStudies(prisma);
    console.log(`✅ ${casestudy.length} case studies seeded`);

    const workingprocess = await seedWorkingProcesses(prisma);
    console.log(`✅ ${workingprocess.length} working processes seeded`);

    const team = await seedTeams(prisma);
    console.log(`✅ ${team.length} teams seeded`);

    const testimonials = await seedTestimonials(prisma);
    console.log(`✅ ${testimonials.length} testimonials seeded`);

    const social = await seedSocialMedia(prisma);
    console.log(`✅ ${social.length} social media links seeded`);

    const users = await seedUsers(prisma);
    console.log(`✅ ${users.length} users seeded`);

    console.log('Seeding done ✅')

}
main()
    .then(async () => {
        await prisma.$disconnect();
        await pool.end();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        await pool.end();
        process.exit(1);
    });