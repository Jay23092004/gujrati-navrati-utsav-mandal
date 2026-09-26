import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Sourced from the supplied Navratri Games Schedule. Times are approximate
// slots ("After Aarti" / "Afternoon") — adjust startTime/endTime once exact
// clock times are finalized.
const events = [
  { title: "Musical Chair", slug: "musical-chair", eventDate: "2026-10-11", startTime: "After Aarti", ageGroup: "Kids, Ladies & Gents", registrationFee: 100, description: "Chairs are placed in a circle, one less than the number of players. Music plays and everyone walks around the chairs. When the music stops, everyone rushes to sit. Whoever doesn't get a chair is out. One chair is removed each round until one person remains." },
  { title: "Chess", slug: "chess", eventDate: "2026-10-11", startTime: "After Aarti", ageGroup: "Under 13 & Above 13", registrationFee: 100, description: "Two players play one match at a time. Normal chess rules apply. The winner moves to the next round, and the loser is out." },
  { title: "Aarti Thali Decoration", slug: "aarti-thali-decoration", eventDate: "2026-10-12", startTime: "Afternoon", ageGroup: "Age 13-18 & Above 18", registrationFee: 100, description: "Bring your own plain thali and decoration items. Decorate it within the given time to make it look festive and beautiful." },
  { title: "Tambola", slug: "tambola", eventDate: "2026-10-12", startTime: "After Aarti", ageGroup: "Above 13", registrationFee: 100, description: "You get a ticket with numbers on it. Numbers are called out one by one. Cross off numbers on your ticket as they're called. The first person to complete a pattern shouts it out and wins." },
  { title: "Drawing Competition", slug: "drawing-competition", eventDate: "2026-10-13", startTime: "Afternoon", ageGroup: "Age 8-13, 13-18 & Above 18", registrationFee: 100, description: "A topic will be given on the spot. You have to draw or sketch based on that topic within the given time." },
  { title: "Treasure Hunt", slug: "treasure-hunt", eventDate: "2026-10-13", startTime: "After Aarti", ageGroup: "13 & Above", registrationFee: 100, description: "You'll get your first clue. Solve it to find the next clue, hidden somewhere around the mandap. Keep solving clues one by one until you reach the final treasure." },
  { title: "Snooker", slug: "snooker", eventDate: "2026-10-14", startTime: "Afternoon", ageGroup: "Under 18 & Above 18", registrationFee: 100, description: "Two players play one match. Normal snooker rules apply. The winner moves ahead, and the loser is out." },
  { title: "Antakshari", slug: "antakshari", eventDate: "2026-10-14", startTime: "After Aarti", ageGroup: "Open for All", registrationFee: 100, description: "Teams compete across different rounds, including a song round where teams take turns singing." },
  { title: "GNUM Creative Mystery Box", slug: "gnum-creative-mystery-box", eventDate: "2026-10-15", startTime: "Afternoon", ageGroup: "Open for All", registrationFee: 100, description: "Every player gets a sealed box with craft materials inside. Once the theme is announced, you have 45 minutes to create something using only what's in your box." },
  { title: "GNUM Quiz Battle", slug: "gnum-quiz-battle", eventDate: "2026-10-15", startTime: "After Aarti", ageGroup: "Age 8-13, 13-18 & Above 18", registrationFee: 100, description: "Questions will be asked one by one. Answer by raising your hand first." },
  { title: "Badminton", slug: "badminton", eventDate: "2026-10-16", startTime: "Afternoon", ageGroup: "Age 8-13, 13-18 & Above 18", registrationFee: 100, description: "Singles knockout matches. Normal badminton rules apply. Winner moves to the next round." },
  { title: "Free Fire Mobile Tournament", slug: "free-fire-mobile-tournament", eventDate: "2026-10-16", startTime: "After Aarti", ageGroup: "Open for All", registrationFee: 100, description: "Players/teams compete in a mobile game match on a fixed map, following the format announced on the day." },
  { title: "Cricket", slug: "cricket", eventDate: "2026-10-17", startTime: "Afternoon", ageGroup: "Open (Single Person Entry)", registrationFee: 200, description: "Ground cricket, knockout format. Fixed number of overs per match." },
  { title: "Gujjus Got Talent", slug: "gujjus-got-talent", eventDate: "2026-10-17", startTime: "After Aarti", ageGroup: "Age 8-13, 13-18 & Above 18", registrationFee: 100, description: "Show off any talent - singing, dancing, comedy, anything - on stage within the given time." },
  { title: "Maha Ashtami", slug: "maha-ashtami", eventDate: "2026-10-18", startTime: "", ageGroup: "Open for All", registrationFee: 0, description: "No games on this day - full focus on Ashtami celebrations.", registrationEnabled: false },
  { title: "Fancy Dress", slug: "fancy-dress", eventDate: "2026-10-19", startTime: "After Aarti", ageGroup: "Age 8-13, 13-18 & Above 18", registrationFee: 100, description: "Come dressed in a costume of your choice and walk around the mandap, saying a line about your costume." },
  { title: "Debate", slug: "debate", eventDate: "2026-10-20", startTime: "After Aarti", ageGroup: "Open for All", registrationFee: 100, description: 'Topic: "Success - Hard Work or Luck?" Each participant speaks for a fixed time, arguing their point of view.' }
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD must be set in the environment before seeding. " +
      "See .env.example. Never hard-code these values."
    );
  }

  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.admin.create({
      data: { name: "Super Admin", email: adminEmail, passwordHash, role: "SUPER_ADMIN", status: "ACTIVE" }
    });
    console.log(`Created initial Super Admin: ${adminEmail}. Log in and change this password immediately.`);
  } else {
    console.log("Initial admin already exists, skipping.");
  }

  for (const [i, e] of events.entries()) {
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: {},
      create: {
        title: e.title,
        slug: e.slug,
        description: e.description,
        ageGroup: e.ageGroup,
        registrationFee: e.registrationFee,
        eventDate: new Date(e.eventDate),
        startTime: e.startTime || undefined,
        venue: "Mandap Ground",
        registrationEnabled: e.registrationEnabled ?? true,
        status: "PUBLISHED",
        displayOrder: i
      }
    });
  }
  console.log(`Seeded ${events.length} events from the games schedule.`);

  await prisma.websiteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: "Navratri Utsav",
      heroTitle: "Navratri Utsav",
      heroSubtitle: "Nine nights of Garba, games and community celebration",
      venue: "Mandap Ground",
      footerText: `Rights to change any game rules rest solely with the Games Committee. © ${new Date().getFullYear()} Navratri Utsav Mandal.`
    }
  });
  console.log("Seeded website settings.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
