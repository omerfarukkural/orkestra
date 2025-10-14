require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./backend/models/User');
const Application = require('./backend/models/Application');
const LifeLog = require('./backend/models/LifeLog');
const Transaction = require('./backend/models/Transaction');
const Routine = require('./backend/models/Routine');

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Create test user
    const user = await User.findOneAndUpdate(
      { email: 'test@orkestra.com' },
      {
        name: 'Test User',
        email: 'test@orkestra.com',
        role: 'admin',
        settings: {
          theme: 'light',
          notifications: true,
          autoSync: true
        }
      },
      { upsert: true, new: true }
    );
    console.log('✅ User created:', user.email);

    // Create sample applications
    const apps = [
      {
        name: 'Password Manager',
        subdomain: 'password.bitebimuv.org',
        rootDirectory: '/home/bitebim2/password',
        url: 'http://password.bitebimuv.org',
        description: 'Güvenli şifre yönetim sistemi',
        status: 'active',
        technologies: ['Node.js', 'MongoDB', 'React'],
        daysToComplete: 15,
        startDate: new Date('2024-09-01'),
        completionDate: new Date('2024-09-15')
      },
      {
        name: 'Social Media Manager',
        subdomain: 'sosyalmedya.bitebimuv.org',
        rootDirectory: '/home/bitebim2/sosyalmedya',
        url: 'http://sosyalmedya.bitebimuv.org',
        description: 'Sosyal medya yönetim platformu',
        status: 'active',
        technologies: ['React', 'Express', 'PostgreSQL'],
        daysToComplete: 30,
        currentPhase: 'Deployment'
      },
      {
        name: 'AI Assistant',
        subdomain: 'yz.bitebimuv.org',
        rootDirectory: '/home/bitebim2/yz',
        url: 'http://yz.bitebimuv.org',
        description: 'Yapay zeka destekli asistan',
        status: 'development',
        technologies: ['Python', 'Flask', 'OpenAI'],
        daysToComplete: 45,
        currentPhase: 'Development',
        phases: [
          { name: 'Planning', status: 'completed', progress: 100 },
          { name: 'Development', status: 'in-progress', progress: 60 },
          { name: 'Testing', status: 'planned', progress: 0 }
        ]
      }
    ];

    for (const appData of apps) {
      await Application.findOneAndUpdate(
        { subdomain: appData.subdomain, user: user._id },
        { ...appData, user: user._id },
        { upsert: true, new: true }
      );
    }
    console.log(`✅ ${apps.length} applications created`);

    // Create sample transactions
    const transactions = [
      { type: 'income', amount: 15000, category: 'Maaş', description: 'Aylık maaş', currency: 'TRY' },
      { type: 'income', amount: 5000, category: 'Freelance', description: 'Proje geliri', currency: 'TRY' },
      { type: 'expense', amount: 3000, category: 'Kira', description: 'Ev kirası', currency: 'TRY' },
      { type: 'expense', amount: 1500, category: 'Market', description: 'Aylık market', currency: 'TRY' },
      { type: 'expense', amount: 500, category: 'Ulaşım', description: 'Toplu taşıma', currency: 'TRY' },
      { type: 'expense', amount: 200, category: 'İnternet', description: 'İnternet faturası', currency: 'TRY' }
    ];

    for (const txData of transactions) {
      await Transaction.create({ ...txData, user: user._id });
    }
    console.log(`✅ ${transactions.length} transactions created`);

    // Create sample life logs
    const logs = [
      {
        type: 'achievement',
        title: 'Orkestra Projesi Tamamlandı!',
        description: 'Full-stack uygulama başarıyla deploy edildi',
        category: 'Coding',
        tags: ['achievement', 'coding', 'milestone']
      },
      {
        type: 'activity',
        title: 'Yeni Özellik Ekledim',
        description: 'AI entegrasyonu tamamlandı',
        category: 'Development',
        tags: ['ai', 'feature', 'development']
      },
      {
        type: 'note',
        title: 'Proje Notları',
        description: 'Gelecek sprint için fikirler',
        category: 'Planning',
        tags: ['planning', 'ideas']
      }
    ];

    for (const logData of logs) {
      await LifeLog.create({ ...logData, user: user._id });
    }
    console.log(`✅ ${logs.length} life logs created`);

    // Create sample routines
    const routines = [
      {
        name: 'Sabah Rutini',
        description: 'Günlük sabah rutini',
        type: 'daily',
        schedule: { time: '07:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
        tasks: [
          { name: 'Uyan', order: 1, duration: 5 },
          { name: 'Egzersiz', order: 2, duration: 30 },
          { name: 'Kahvaltı', order: 3, duration: 20 }
        ],
        category: 'Health',
        active: true,
        streak: 5
      },
      {
        name: 'Coding Session',
        description: 'Günlük kod yazma zamanı',
        type: 'daily',
        schedule: { time: '09:00' },
        tasks: [
          { name: 'Code Review', order: 1, duration: 30 },
          { name: 'Feature Development', order: 2, duration: 120 },
          { name: 'Testing', order: 3, duration: 60 }
        ],
        category: 'Work',
        active: true,
        streak: 12
      }
    ];

    for (const routineData of routines) {
      await Routine.create({ ...routineData, user: user._id });
    }
    console.log(`✅ ${routines.length} routines created`);

    console.log('\n🎉 Seed data completed successfully!');
    console.log('📧 Test user: test@orkestra.com');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
