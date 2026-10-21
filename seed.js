import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import HeroSlide from './models/HeroSlide.js';
import Testimonial from './models/Testimonial.js';
import Photo from './models/Photo.js';
import Song from './models/Song.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/christ_tabernacle';

const INITIAL_HERO_SLIDES = [
  {
    title: "Christ's Tabernacle Prayer & Worship Centre",
    subtitle: 'A House of Prayer • A Place of Deliverance • A Centre of Divine Healing',
    tag: 'Established 1991',
    verse: 'Isaiah 56:7',
    actionText: 'Plan a Visit',
    actionLink: '/contact',
    image: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=1920&q=80',
    alt: "Christ's Tabernacle - Prayer & Worship Centre with Holy Bible and Cross at Sunrise",
    order: 1,
    isActive: true,
  },
  {
    title: 'A Place to Worship, Grow & Serve',
    subtitle: '“As for me and my house, we will serve the Lord.” Rooted in Faith, Family & Future.',
    tag: 'Joshua 24:15',
    verse: 'Joshua 24:15',
    actionText: 'Our Mission & Vision',
    actionLink: '/about/mission',
    image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1920&q=80',
    alt: 'A Place to Worship, Grow, Serve - Faith, Family, Future',
    order: 2,
    isActive: true,
  },
  {
    title: 'A Home for Prayer, Worship & Community',
    subtitle: '“For where two or three gather in my name, there am I with them.” Together in His Love.',
    tag: 'Matthew 18:20',
    verse: 'Matthew 18:20',
    actionText: 'Service Schedules',
    actionLink: '/prayers/sunday-services',
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1920&q=80',
    alt: 'A Home for Prayer, Worship & Community - Together in His Love',
    order: 3,
    isActive: true,
  },
];

const INITIAL_TESTIMONIALS = [
  {
    name: 'Sister Hannah D.',
    location: 'Chennai, India',
    category: 'Healing',
    title: 'Miraculous Healing from Chronic Illness',
    story:
      'For three agonizing years, I suffered from severe autoimmune complications and chronic spinal pain that doctors said was irreversible. During the Fasting Prayer service at Christ’s Tabernacle, Pastor anointed me with oil and the believers stood in deep intercession. The fire of the Holy Spirit touched my spine. Today, subsequent scans confirmed total healing. Jesus made me whole!',
    verse: "Jeremiah 30:17 — 'For I will restore health to you and heal you of your wounds, says the LORD.'",
    date: 'August 2026',
    isApproved: true,
    isFeatured: true,
  },
  {
    name: 'Brother Michael R.',
    location: 'Tambaram, Chennai',
    category: 'Deliverance',
    title: 'Set Free from Years of Fear & Nightmares',
    story:
      'I was tormented by oppressive nightmares, crippling panic attacks, and unseen bondages for over a decade. I couldn’t sleep peacefully without heavy medication. When I walked into Christ’s Tabernacle, the presence of God broke every heavy chain. Through the deliverance prayer ministry, the fear completely vanished. I now walk in perfect peace and liberty in Christ!',
    verse: "2 Timothy 1:7 — 'For God has not given us a spirit of fear, but of power and of love and of a sound mind.'",
    date: 'July 2026',
    isApproved: true,
    isFeatured: true,
  },
  {
    name: 'David & Priscilla K.',
    location: 'Pallikaranai, Chennai',
    category: 'Family',
    title: 'Restoration of Our Marriage & Household',
    story:
      'Our marriage was on the verge of legal separation due to irreconcilable bitterness and severe distress. Eva. Glory Devapiriyam and the prayer team counseled us with tears and prevailing prayer. God softened our hearts, broke the spirit of division, and restored our home with supernatural joy and unconditional love. Christ truly saved our family!',
    verse: "Joshua 24:15 — 'As for me and my house, we will serve the LORD.'",
    date: 'June 2026',
    isApproved: true,
    isFeatured: true,
  },
  {
    name: 'Brother Samuel V.',
    location: 'Velachery, Chennai',
    category: 'Breakthrough',
    title: 'Divine Financial Breakthrough & Job Miracle',
    story:
      'After facing sudden unemployment for eight months and mounting debts, our family felt exhausted. During the New Moon all-night prayer vigil, we surrendered our burdens on the altar. Within two weeks, God opened an unexpected door for an international technical role beyond our qualifications. God is faithful to His covenant!',
    verse: "Philippians 4:19 — 'And my God shall supply all your need according to His riches in glory by Christ Jesus.'",
    date: 'May 2026',
    isApproved: true,
    isFeatured: false,
  },
  {
    name: 'Sister Rachel M.',
    location: 'Guindy, Chennai',
    category: 'Healing',
    title: 'Child’s Miracle Recovery from Critical Fever',
    story:
      'My four-year-old son was admitted to the intensive care unit with dangerously high convulsions and unexplained respiratory infection. I called the church prayer helpline in tears. The pastors and prayer warriors immediately raised emergency intercession. Within hours, the fever broke completely, and his oxygen levels stabilized. Doctors called it a miraculous turnaround!',
    verse: "Psalm 103:3 — 'Who forgives all your iniquities, who heals all your diseases.'",
    date: 'April 2026',
    isApproved: true,
    isFeatured: false,
  },
  {
    name: 'Brother Joseph A.',
    location: 'Medavakkam, Chennai',
    category: 'Deliverance',
    title: 'Delivered from Addiction and Given a New Life',
    story:
      'For 14 years, I was bound by severe alcohol and tobacco addictions that ruined my health, career, and self-respect. Numerous rehab attempts failed. One Sunday morning, as the worship team sang praises to Jesus, tears streamed down my face and I fell to my knees. The urge was instantly broken that day. I have been clean and serving in church ever since!',
    verse: "John 8:36 — 'Therefore if the Son makes you free, you shall be free indeed.'",
    date: 'March 2026',
    isApproved: true,
    isFeatured: false,
  },
];

const INITIAL_PHOTOS = [
  {
    title: 'Modern Sanctuary & Sacred Altar',
    category: 'Sanctuary',
    image: 'https://images.unsplash.com/photo-1548625361-125dd14d18ce?auto=format&fit=crop&w=1200&q=80',
    caption: 'The illuminated cross and main sanctuary altar where Word and worship unite in holy reverence.',
    date: 'October 2026',
    isFeatured: true,
    order: 1,
  },
  {
    title: 'Sunday Morning Worship & Reverence',
    category: 'Worship',
    image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
    caption: 'Believers lifting holy hands in adoration and praise during the Sunday communion service.',
    date: 'September 2026',
    isFeatured: true,
    order: 2,
  },
  {
    title: 'The Holy Sanctuary Altar',
    category: 'Sanctuary',
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80',
    caption: "Christ's Tabernacle prayer auditorium adorned for the glory of the Lord, welcoming seekers.",
    date: 'August 2026',
    isFeatured: false,
    order: 3,
  },
  {
    title: 'The Word of God & Morning Devotion',
    category: 'Scripture',
    image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80',
    caption: 'The living Scripture, open on the communion table with the symbol of peace and victory.',
    date: 'August 2026',
    isFeatured: false,
    order: 4,
  },
  {
    title: 'All-Night Fasting Prayer Vigil',
    category: 'Prayer',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    caption: 'Fervent intercessory prayer during the monthly New Moon and Full Moon prayer vigils.',
    date: 'July 2026',
    isFeatured: false,
    order: 5,
  },
];

const INITIAL_SONGS = [
  {
    title: 'En Uyirana Yesuvae (என் உயிரான இயேசுவே)',
    language: 'Tamil',
    theme: 'Adoration & Surrender',
    key: 'D Major',
    tempo: 'Slow / Reverent',
    lyrics: `[பல்லவி]
என் உயிரான இயேசுவே
என் உயிருள்ள நாளெல்லாம்
உம்மை புகழ்ந்து பாடுவேன்
உம்மையே போற்றி துதிப்பேன்

[சரணம் 1]
என்னை தாங்கும் கன்மலையே
என்னை காக்கும் புகலிடமே
காரிருள் சூழ்ந்த வேளையிலும்
என் தீபமாய் வந்தவரே

[சரணம் 2]
தாயினும் மேலாய் அன்பு கூர்ந்து
தழும்புகளால் என்னை சுகமாக்கினீர்
ஜீவனை எனக்காய் ஈந்தவரே
ஜீவனுள்ள தேவா ஸ்தோத்திரம்`,
    audioUrl: '',
    youtubeUrl: 'https://www.youtube.com/watch?v=kYI9Fj9-X3I',
    author: "Pr. Gersson Edinbaro • Christ's Tabernacle",
    uploadDate: '2 weeks ago',
    views: '184K views',
    duration: '06:45',
    order: 1,
    isActive: true,
  },
  {
    title: 'Amazing Grace (My Chains Are Gone)',
    language: 'English',
    theme: 'Deliverance & Grace',
    key: 'G Major',
    tempo: 'Moderately Slow',
    lyrics: `[Verse 1]
Amazing grace! How sweet the sound
That saved a wretch like me!
I once was lost, but now am found;
Was blind, but now I see.

[Chorus]
My chains are gone, I've been set free!
My God, my Savior has ransomed me!
And like a flood His mercy reigns,
Unending love, amazing grace!

[Verse 2]
'Twas grace that taught my heart to fear,
And grace my fears relieved;
How precious did that grace appear
The hour I first believed!

[Verse 3]
The Lord has promised good to me,
His Word my hope secures;
He will my shield and portion be
As long as life endures.`,
    audioUrl: '',
    youtubeUrl: 'https://www.youtube.com/watch?v=Jbe7OruLk8I',
    author: "Christ's Tabernacle Worship Choir",
    uploadDate: '1 month ago',
    views: '92K views',
    duration: '05:02',
    order: 2,
    isActive: true,
  },
  {
    title: 'Ummai Allamal Enaku Yaar Undu (உம்மை அல்லாமல் எனக்கு யார் உண்டு)',
    language: 'Tamil',
    theme: 'Faith & Devotion',
    key: 'E Minor',
    tempo: 'Worship / Slow',
    lyrics: `[பல்லவி]
உம்மை அல்லாமல் எனக்கு யார் உண்டு
பரலோகத்தில் உம்மைத் தவிர
பூலோகத்தில் எனக்கு விருப்பம் இல்லை
இயேசுவே என் அடைக்கலமே

[சரணம் 1]
என் உடலும் என் உள்ளமும் அழிந்துபோனாலும்
என் இதயத்தின் கன்மலை தேவனே
என்றென்றைக்கும் என் சுதந்திரம் நீரே
உம் பாதம் பணிகிறேன் இயேசுவே`,
    audioUrl: '',
    youtubeUrl: 'https://www.youtube.com/watch?v=1F9yV9YtC2Q',
    author: 'Eva. Glory Devapiriyam & CT Worship',
    uploadDate: '2 months ago',
    views: '128K views',
    duration: '07:18',
    order: 3,
    isActive: true,
  },
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    // 1. Seed Super Admin
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const admin = new Admin({
        username: 'admin',
        email: 'admin@christtabernacle.org',
        password: process.env.ADMIN_DEFAULT_PASSWORD || 'admin123',
        role: 'superadmin',
      });
      await admin.save();
      console.log('✅ Default Admin created: username="admin", password="admin123"');
    } else {
      console.log('ℹ️ Admin user already exists.');
    }

    // 2. Seed Hero Slides
    const heroCount = await HeroSlide.countDocuments();
    if (heroCount === 0) {
      await HeroSlide.insertMany(INITIAL_HERO_SLIDES);
      console.log(`✅ Seeded ${INITIAL_HERO_SLIDES.length} Hero Slides.`);
    }

    // 3. Seed Testimonials
    const testCount = await Testimonial.countDocuments();
    if (testCount === 0) {
      await Testimonial.insertMany(INITIAL_TESTIMONIALS);
      console.log(`✅ Seeded ${INITIAL_TESTIMONIALS.length} Testimonials.`);
    }

    // 4. Seed Photos
    const photoCount = await Photo.countDocuments();
    if (photoCount === 0) {
      await Photo.insertMany(INITIAL_PHOTOS);
      console.log(`✅ Seeded ${INITIAL_PHOTOS.length} Gallery Photos.`);
    }

    // 5. Seed Songs
    const songCount = await Song.countDocuments();
    if (songCount === 0) {
      await Song.insertMany(INITIAL_SONGS);
      console.log(`✅ Seeded ${INITIAL_SONGS.length} Worship Songs & Lyrics.`);
    }

    console.log('\n🎉 Database seeding completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
}

seedDatabase();
