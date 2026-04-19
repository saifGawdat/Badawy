/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const seedDataPath = path.join(__dirname, 'seed-data.json');
  if (!fs.existsSync(seedDataPath)) {
    console.error('❌ seed-data.json not found. Run export script first or ensure the file is in prisma directory.');
    return;
  }

  const data = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

  console.log('🌱 Mirroring Production Data to Local DB...');

  // 1. Users (Upsert to keep passwords)
  for (const u of data.users) {
    await prisma.user.upsert({
      where: { username: u.username },
      update: { password: u.password, createdAt: new Date(u.createdAt) },
      create: { username: u.username, password: u.password, createdAt: new Date(u.createdAt) },
    });
  }
  console.log(`✅ Synced ${data.users.length} users`);

  // 2. Clear collection-based tables to ensure exact mirror
  console.log('🧹 Clearing existing collections...');
  await prisma.blogPost.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.beforeAfter.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.heroSlide.deleteMany();
  await prisma.item.deleteMany();
  await prisma.aboutSection.deleteMany();

  // 3. HeroSlides
  for (const h of data.heroSlides) {
    await prisma.heroSlide.create({
      data: {
        id: h.id, // Keep IDs for consistency across team
        title: h.title,
        titleAr: h.titleAr || '',
        subtitle: h.subtitle,
        subtitleAr: h.subtitleAr || '',
        ctaText: h.ctaText || 'Read More',
        ctaTextAr: h.ctaTextAr || '',
        imageUrl: h.imageUrl,
        createdAt: new Date(h.createdAt),
      }
    });
  }
  console.log(`✅ Seeded ${data.heroSlides.length} hero slides`);

  // 4. AboutSections
  for (const ab of data.aboutSections) {
    await prisma.aboutSection.create({
      data: {
        id: ab.id,
        imageUrl: ab.imageUrl,
        quoteEn: ab.quoteEn || '',
        quoteAr: ab.quoteAr || '',
        drNameEn: ab.drNameEn || '',
        drNameAr: ab.drNameAr || '',
        drTitleEn: ab.drTitleEn || '',
        drTitleAr: ab.drTitleAr || '',
        stat1Value: ab.stat1Value || '',
        stat1LabelEn: ab.stat1LabelEn || '',
        stat1LabelAr: ab.stat1LabelAr || '',
        stat2Value: ab.stat2Value || '',
        stat2LabelEn: ab.stat2LabelEn || '',
        stat2LabelAr: ab.stat2LabelAr || '',
        updatedAt: new Date(ab.updatedAt),
      }
    });
  }
  console.log(`✅ Seeded ${data.aboutSections.length} about sections`);

  // 5. Items (Services)
  for (const i of data.items) {
    await prisma.item.create({
      data: {
        id: i.id,
        title: i.title,
        titleAr: i.titleAr || '',
        description: i.description,
        descriptionAr: i.descriptionAr || '',
        imageUrl: i.imageUrl,
        createdAt: new Date(i.createdAt),
      }
    });
  }
  console.log(`✅ Seeded ${data.items.length} items`);

  // 6. BeforeAfters
  for (const ba of data.beforeAfters) {
    await prisma.beforeAfter.create({
      data: {
        id: ba.id,
        title: ba.title,
        titleAr: ba.titleAr || '',
        beforeImageUrl: ba.beforeImageUrl,
        afterImageUrl: ba.afterImageUrl,
        createdAt: new Date(ba.createdAt),
      }
    });
  }
  console.log(`✅ Seeded ${data.beforeAfters.length} before/after entries`);

  // 7. BlogPosts
  for (const p of data.blogPosts) {
    await prisma.blogPost.create({
      data: {
        id: p.id,
        title: p.title,
        titleAr: p.titleAr || '',
        slug: p.slug,
        excerpt: p.excerpt,
        excerptAr: p.excerptAr || '',
        content: p.content,
        contentAr: p.contentAr || '',
        featuredImage: p.featuredImage,
        published: p.published,
        publishedAt: p.publishedAt ? new Date(p.publishedAt) : null,
        metaTitle: p.metaTitle || '',
        metaDescription: p.metaDescription || '',
        readingTimeMinutes: p.readingTimeMinutes || 1,
        createdAt: new Date(p.createdAt),
      }
    });
  }
  if (data.blogPosts.length > 0) console.log(`✅ Seeded ${data.blogPosts.length} blog posts`);

  // 8. SiteSettings
  if (data.siteSettings.length > 0) {
    const s = data.siteSettings[0];
    await prisma.siteSettings.upsert({
      where: { id: 'singleton-settings' },
      update: {
        phone: s.phone,
        whatsappPhone: s.whatsappPhone,
        location: s.location,
        locationAr: s.locationAr || '',
        facebookUrl: s.facebookUrl,
        instagramUrl: s.instagramUrl,
      },
      create: {
        id: 'singleton-settings',
        phone: s.phone,
        whatsappPhone: s.whatsappPhone,
        location: s.location,
        locationAr: s.locationAr || '',
        facebookUrl: s.facebookUrl,
        instagramUrl: s.instagramUrl,
      }
    });
    console.log(`✅ Synced site settings`);
  }

  // 9. Comments & Appointments (Optional but included for full mirror)
  for (const c of data.comments) {
    await prisma.comment.create({
      data: {
        id: c.id,
        username: c.username,
        description: c.description,
        descriptionAr: c.descriptionAr || '',
        profilePhoto: c.profilePhoto,
        createdAt: new Date(c.createdAt),
      }
    });
  }
  for (const a of data.appointments) {
    await prisma.appointment.create({
      data: {
        id: a.id,
        fullName: a.fullName,
        email: a.email,
        phone: a.phone,
        procedure: a.procedure,
        message: a.message || '',
        status: a.status || 'new',
        createdAt: new Date(a.createdAt),
      }
    });
  }

  console.log('🚀 Exact mirror seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
