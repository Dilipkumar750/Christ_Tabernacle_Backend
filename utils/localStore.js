import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');
const dbFilePath = path.join(dataDir, 'db.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial seed data for offline / fallback mode
const DEFAULT_STORE = {
  admins: [
    {
      _id: 'admin_root_1',
      username: 'admin',
      email: 'admin@christtabernacle.org',
      // bcrypt hash for "admin123"
      password: '$2a$10$wE9mHlU6Vz2V65dDqY8fB.LdQ1P8K/gEw4WjS5m5eXnJ5kK5lG2G6',
      role: 'superadmin',
      createdAt: new Date().toISOString(),
    },
  ],
  heroSlides: [
    {
      _id: 'hero_1',
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
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'hero_2',
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
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'hero_3',
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
      createdAt: new Date().toISOString(),
    },
  ],
  testimonials: [
    {
      _id: 'test_1',
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
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'test_2',
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
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'test_3',
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
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'test_4',
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
      createdAt: new Date().toISOString(),
    },
  ],
  photos: [
    {
      _id: 'photo_1',
      title: 'Modern Sanctuary & Sacred Altar',
      category: 'Sanctuary',
      image: 'https://images.unsplash.com/photo-1548625361-125dd14d18ce?auto=format&fit=crop&w=1200&q=80',
      caption: 'The illuminated cross and main sanctuary altar where Word and worship unite in holy reverence.',
      date: 'October 2026',
      year: '2026',
      isFeatured: true,
      order: 1,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'photo_2',
      title: 'Sunday Morning Worship & Reverence',
      category: 'Worship',
      image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
      caption: 'Believers lifting holy hands in adoration and praise during the Sunday communion service.',
      date: 'September 2026',
      year: '2026',
      isFeatured: true,
      order: 2,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'photo_3',
      title: 'The Holy Sanctuary Altar',
      category: 'Sanctuary',
      image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80',
      caption: "Christ's Tabernacle prayer auditorium adorned for the glory of the Lord, welcoming seekers.",
      date: 'August 2026',
      year: '2026',
      isFeatured: false,
      order: 3,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'photo_4',
      title: 'The Word of God & Morning Devotion',
      category: 'Scripture',
      image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80',
      caption: 'The living Scripture, open on the communion table with the symbol of peace and victory.',
      date: 'August 2026',
      year: '2026',
      isFeatured: false,
      order: 4,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'photo_5',
      title: 'All-Night Fasting Prayer Vigil',
      category: 'Prayer',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
      caption: 'Fervent intercessory prayer during the monthly New Moon and Full Moon prayer vigils.',
      date: 'July 2026',
      year: '2026',
      isFeatured: false,
      order: 5,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'photo_6',
      title: 'Pentecost Harvest & Divine Celebration',
      category: 'Worship',
      image: 'https://images.unsplash.com/photo-1445445290350-18a3b86e0b5b?auto=format&fit=crop&w=1200&q=80',
      caption: 'Joyful congregation lifting praise on Pentecost Sunday.',
      date: 'June 2026',
      year: '2026',
      isFeatured: false,
      order: 6,
      createdAt: '2026-06-15T10:00:00.000Z',
    },
    {
      _id: 'photo_7',
      title: 'Annual Church Convention & Deliverance Night',
      category: 'Events',
      image: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=1200&q=80',
      caption: 'Believers gathered for the annual regional convention in fellowship.',
      date: 'November 2025',
      year: '2025',
      isFeatured: true,
      order: 7,
      createdAt: '2025-11-20T10:00:00.000Z',
    },
    {
      _id: 'photo_8',
      title: 'Water Baptism Service at the Living Waters',
      category: 'Events',
      image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80',
      caption: 'New converts taking their step of faith in holy baptism.',
      date: 'August 2025',
      year: '2025',
      isFeatured: true,
      order: 8,
      createdAt: '2025-08-15T10:00:00.000Z',
    },
    {
      _id: 'photo_9',
      title: 'Easter Resurrection Dawn Gathering',
      category: 'Sanctuary',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      caption: 'Commemorating the glorious resurrection victory of Jesus Christ.',
      date: 'April 2025',
      year: '2025',
      isFeatured: false,
      order: 9,
      createdAt: '2025-04-20T06:00:00.000Z',
    },
    {
      _id: 'photo_10',
      title: 'Youth Revival & Fellowship Night',
      category: 'Worship',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
      caption: 'Next-generation leaders praising God with passion and devotion.',
      date: 'February 2025',
      year: '2025',
      isFeatured: false,
      order: 10,
      createdAt: '2025-02-10T18:00:00.000Z',
    },
    {
      _id: 'photo_11',
      title: 'Thanksgiving & Jubilee Choir Praise',
      category: 'Worship',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      caption: 'Annual choir and orchestral praise night praising the King of kings.',
      date: 'December 2024',
      year: '2024',
      isFeatured: true,
      order: 11,
      createdAt: '2024-12-25T18:00:00.000Z',
    },
    {
      _id: 'photo_12',
      title: 'Kingdom Discipleship Graduation',
      category: 'Events',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
      caption: 'Equipping saints for kingdom service and local leadership.',
      date: 'September 2024',
      year: '2024',
      isFeatured: false,
      order: 12,
      createdAt: '2024-09-18T10:00:00.000Z',
    },
    {
      _id: 'photo_13',
      title: 'Holy Communion & Candlelight Prayer Vigil',
      category: 'Prayer',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
      caption: 'Reverent atmosphere at the Lord\'s table during evening prayer.',
      date: 'July 2024',
      year: '2024',
      isFeatured: false,
      order: 13,
      createdAt: '2024-07-05T20:00:00.000Z',
    },
    {
      _id: 'photo_14',
      title: 'Sanctuary Dedication & Thanksgiving Milestone',
      category: 'Sanctuary',
      image: 'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=80',
      caption: 'Consecrating the prayer hall and altar for generations to come.',
      date: 'November 2023',
      year: '2023',
      isFeatured: true,
      order: 14,
      createdAt: '2023-11-12T10:00:00.000Z',
    },
    {
      _id: 'photo_15',
      title: 'Miracle Crusade & Gospel Tent Mission',
      category: 'Events',
      image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
      caption: 'Open tent crusade proclaiming divine healing and salvation.',
      date: 'August 2023',
      year: '2023',
      isFeatured: false,
      order: 15,
      createdAt: '2023-08-20T17:00:00.000Z',
    },
  ],
  songs: [
    {
      _id: 'song_1',
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
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'song_2',
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
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'song_3',
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
      createdAt: new Date().toISOString(),
    },
  ],
  members: [
    {
      _id: 'mem_1',
      name: 'Sister Hannah Devapiriyam',
      dob: '1992-05-14',
      age: 34,
      gender: 'Female',
      mobile: '+91 98401 23456',
      email: 'hannah.dev@example.com',
      address: 'No. 24, Grace Garden Street, Velachery, Chennai - 600042',
      occupation: 'School Educator',
      bloodGroup: 'B+',
      maritalStatus: 'Married',
      baptized: 'Yes',
      emergencyContact: '+91 98401 65432 (Brother Michael)',
      membershipDate: '2021-04-10',
      status: 'Active',
      notes: 'Active in choir and intercessory prayer fellowship.',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'mem_2',
      name: 'Brother Joshua Ebenezer',
      dob: '1985-11-20',
      age: 40,
      gender: 'Male',
      mobile: '+91 97910 87654',
      email: 'joshua.ebenezer@example.com',
      address: 'Plot 12, Bethel Enclave, Tambaram East, Chennai - 600059',
      occupation: 'Software Engineer',
      bloodGroup: 'O+',
      maritalStatus: 'Married',
      baptized: 'Yes',
      emergencyContact: '+91 97910 87650 (Rachel - Wife)',
      membershipDate: '2020-01-15',
      status: 'Active',
      notes: 'Youth mentor & media ministry volunteer.',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'mem_3',
      name: 'Brother Samuel Vijayakumar',
      dob: '1998-03-08',
      age: 28,
      gender: 'Male',
      mobile: '+91 94440 11223',
      email: 'samuel.vijay@example.com',
      address: 'Flat 3B, Zion Heights, Medavakkam Main Road, Chennai - 600100',
      occupation: 'Civil Engineer',
      bloodGroup: 'A+',
      maritalStatus: 'Single',
      baptized: 'Yes',
      emergencyContact: '+91 94440 11220 (Father)',
      membershipDate: '2023-08-22',
      status: 'Active',
      notes: 'Sound engineering and sanctuary setup volunteer.',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'mem_4',
      name: 'Sister Priscilla Mary',
      dob: '1968-07-25',
      age: 58,
      gender: 'Female',
      mobile: '+91 98844 55667',
      email: '',
      address: 'Old Door No. 15, Altar Lane, Pallikaranai, Chennai - 600100',
      occupation: 'Homemaker',
      bloodGroup: 'AB+',
      maritalStatus: 'Married',
      baptized: 'Yes',
      emergencyContact: '+91 98844 55660 (David - Husband)',
      membershipDate: '2019-10-05',
      status: 'Active',
      notes: 'Women fasting prayer coordinator.',
      createdAt: new Date().toISOString(),
    },
  ],
};

// Check if db.json exists, if not initialize it
if (!fs.existsSync(dbFilePath)) {
  fs.writeFileSync(dbFilePath, JSON.stringify(DEFAULT_STORE, null, 2), 'utf-8');
}

export const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

export const readStore = () => {
  try {
    const raw = fs.readFileSync(dbFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.members) {
      parsed.members = DEFAULT_STORE.members;
      fs.writeFileSync(dbFilePath, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    return parsed;
  } catch (err) {
    return DEFAULT_STORE;
  }
};

export const writeStore = (data) => {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
};
