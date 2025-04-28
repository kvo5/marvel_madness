import { PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker'; // Using faker for some variety

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // --- Clear existing data (optional, as migrate reset handles this) ---
  // console.log('Deleting existing data...');
  // await prisma.post.deleteMany();
  // await prisma.follow.deleteMany();
  // await prisma.like.deleteMany();
  // await prisma.savedPosts.deleteMany();
  // await prisma.user.deleteMany(); // Be careful with deleting users if using Clerk IDs

  // --- Create Users ---
  console.log('Creating users...');
  const user1 = await prisma.user.upsert({
    where: { id: 'user_seed_1' }, // Using predictable IDs for seeding
    update: {},
    create: {
      id: 'user_seed_1',
      email: 'rivalsfan1@example.com',
      username: 'IronLegion',
      displayName: 'Iron Legionnaire',
      bio: 'Just trying to climb the ranks in Marvel Rivals. Maining Iron Man!',
      location: 'Stark Tower',
      role: Role.DUELIST,
      rank: 'GOLD I',
      img: null, // No image
      cover: null, // No cover
    },
  });

  const user2 = await prisma.user.upsert({
    where: { id: 'user_seed_2' },
    update: {},
    create: {
      id: 'user_seed_2',
      email: 'rivalsfan2@example.com',
      username: 'WebHeadWins',
      displayName: 'WebHead',
      bio: 'Spider-Man main reporting for duty! Loving the mobility in Marvel Rivals.',
      location: 'Queens',
      role: Role.STRATEGIST,
      rank: 'PLATINUM III',
      img: null,
      cover: null,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { id: 'user_seed_3' },
    update: {},
    create: {
      id: 'user_seed_3',
      email: 'rivalsfan3@example.com',
      username: 'MagicMayhem',
      displayName: 'Scarlet Witch Stan',
      bio: 'Chaos Magic FTW! Marvel Rivals is amazing. Need tips for Magik.',
      location: 'Westview',
      role: Role.VANGUARD, // Example role
      rank: 'DIAMOND II',
      img: null,
      cover: null,
    },
  });

   const user4 = await prisma.user.upsert({
    where: { id: 'user_seed_4' },
    update: {},
    create: {
      id: 'user_seed_4',
      email: 'rivalsfan4@example.com',
      username: 'HulkSmashMeta',
      displayName: 'GammaGamer',
      bio: 'Hulk is surprisingly tactical in Rivals. Loving the environmental destruction.',
      location: 'Gamma Base',
      role: Role.VANGUARD,
      rank: 'SILVER IV',
      img: null,
      cover: null,
    },
  });


  console.log('Users created.');

  // --- Create Posts (Text Only) ---
  console.log('Creating posts...');

  await prisma.post.createMany({
    data: [
      // User 1 Posts
      { userId: user1.id, desc: "Iron Man's unibeam feels so satisfying to land! Anyone else agree?" },
      { userId: user1.id, desc: "Need a good support duo for Iron Man. Any suggestions? Maybe Doctor Strange?" },
      { userId: user1.id, desc: "Just hit Gold rank! The grind is real. #MarvelRivals" },

      // User 2 Posts
      { userId: user2.id, desc: "The map verticality in Marvel Rivals is insane! Perfect for Spider-Man." },
      { userId: user2.id, desc: "Trying to master the web-swing combos. Any tips from other Spidey players?" },
      { userId: user2.id, desc: "Is Peni Parker actually viable? Seems tricky to use effectively." },
      { userId: user2.id, desc: "Platinum rank achieved! Let's go! Aiming for Diamond next season." },

      // User 3 Posts
      { userId: user3.id, desc: "Magik's portals are game-changing for objective control. So much potential!" },
      { userId: user3.id, desc: "Who do you think is the most underrated hero in the current meta?" },
      { userId: user3.id, desc: "Really hoping they add more magic users soon. Maybe Wanda?" },
      { userId: user3.id, desc: "Diamond! Finally! Scarlet Witch carried me hard." },

       // User 4 Posts
      { userId: user4.id, desc: "People underestimate Hulk's leap. Great for initiating or escaping." },
      { userId: user4.id, desc: "What's the best way to counter a good Loki player? Those illusions are tough." },
      { userId: user4.id, desc: "The Yggsgard map is pure chaos, I love it!" },
    ],
  });

  console.log('Posts created.');

  // --- Create Follows (Example) ---
  console.log('Creating follows...');
  await prisma.follow.createMany({
    data: [
      { followerId: user1.id, followingId: user2.id },
      { followerId: user2.id, followingId: user1.id },
      { followerId: user2.id, followingId: user3.id },
      { followerId: user3.id, followingId: user1.id },
      { followerId: user4.id, followingId: user1.id },
    ],
    skipDuplicates: true, // Avoid errors if follows already exist
  });
  console.log('Follows created.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });