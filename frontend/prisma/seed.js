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
  const exportPath = path.join(__dirname, '../../backend/scripts/export.json');
  if (!fs.existsSync(exportPath)) {
    console.error('❌ export.json not found. Run backend export script first.');
    return;
  }

  const data = JSON.parse(fs.readFileSync(exportPath, 'utf8'));

  console.log('🌱 Seeding PostgreSQL via Adapter...');

  // Users
  for (const u of data.users) {
    await prisma.user.upsert({
      where: { username: u.username },
      update: { password: u.password, createdAt: new Date(u.createdAt) },
      create: { username: u.username, password: u.password, createdAt: new Date(u.createdAt) },
    });
  }
  console.log(`✅ Seeded ${data.users.length} users`);

  // BlogPosts
  for (const p of data.blogPosts) {
    await prisma.blogPost.create({
      data: {
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
  console.log(`✅ Seeded ${data.blogPosts.length} blog posts`);

  // Appointments
  for (const a of data.appointments) {
    await prisma.appointment.create({
      data: {
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
  console.log(`✅ Seeded ${data.appointments.length} appointments`);

  // BeforeAfters
  for (const ba of data.beforeAfters) {
    await prisma.beforeAfter.create({
      data: {
        title: ba.title,
        titleAr: ba.titleAr || '',
        beforeImageUrl: ba.beforeImageUrl,
        afterImageUrl: ba.afterImageUrl,
        createdAt: new Date(ba.createdAt),
      }
    });
  }
  console.log(`✅ Seeded ${data.beforeAfters.length} before/after entries`);

  // Comments
  for (const c of data.comments) {
    await prisma.comment.create({
      data: {
        username: c.username,
        description: c.description,
        descriptionAr: c.descriptionAr || '',
        profilePhoto: c.profilePhoto,
        createdAt: new Date(c.createdAt),
      }
    });
  }
  console.log(`✅ Seeded ${data.comments.length} comments`);

  // HeroSlides
  for (const h of data.heroSlides) {
    await prisma.heroSlide.create({
      data: {
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

  // Items
  for (const i of data.items) {
    await prisma.item.create({
      data: {
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

  // SiteSettings
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
    console.log(`✅ Seeded site settings`);
  }

  // Visits
  for (const v of data.visits) {
    await prisma.visit.create({
      data: {
        ip: v.ip,
        userAgent: v.userAgent || '',
        path: v.path || '/',
        createdAt: new Date(v.createdAt),
      }
    });
  }
  console.log(`✅ Seeded ${data.visits.length} visits`);

  console.log('🚀 Seeding complete.');
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
