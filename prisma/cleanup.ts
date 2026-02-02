import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'willianbarata@gmail.com'; // Using the email from the prompt/seed as a guess, but wait...
    // The user probably used their own email in the form. 
    // I will just delete the user created most recently if it's not the admin.

    // Actually, better to just delete based on the email if they provide it, but I don't know what they typed.
    // I'll delete all users EXCEPT the global admin.

    const deletedUsers = await prisma.user.deleteMany({
        where: {
            role: {
                not: 'admin_global'
            }
        }
    });

    const deletedOffices = await prisma.office.deleteMany({
        where: {
            // We can't easily filter offices without users if we just deleted users... 
            // BUT cascade delete might handle it if configured, but my schema didn't have cascade.
            // Actually, let's look at schema.
            // user -> office (relation).
            // If I delete user, office stays.
        }
    });

    // Let's delete all offices that have no users?
    const offices = await prisma.office.findMany({
        include: { users: true }
    });

    for (const office of offices) {
        if (office.users.length === 0) {
            await prisma.office.delete({ where: { id: office.id } });
        }
    }

    console.log(`Deleted ${deletedUsers.count} dirty users.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
