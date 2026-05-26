const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from backend root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Doctor = require('../models/Doctor');

const doctors = [
  {
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    experience: 12,
    fees: 150,
    image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=0D8ABC&color=fff&size=200',
    available: true,
    education: 'MD, Cardiology — Harvard Medical School',
    address: '45 Heart Lane, Boston, MA',
    about:
      'Dr. Sarah Johnson is a board-certified cardiologist with 12 years of experience diagnosing and treating a wide range of cardiovascular conditions. She specializes in preventive cardiology, heart failure management, and interventional procedures. Dr. Johnson is known for her compassionate patient care and commitment to educating patients about heart health and lifestyle modifications.',
  },
  {
    name: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    experience: 8,
    fees: 180,
    image: 'https://ui-avatars.com/api/?name=Michael+Chen&background=2563EB&color=fff&size=200',
    available: true,
    education: 'MD, Neurology — Johns Hopkins University',
    address: '12 Neuro Blvd, Baltimore, MD',
    about:
      'Dr. Michael Chen is a highly skilled neurologist with 8 years of clinical experience in diagnosing and managing complex neurological disorders including epilepsy, migraines, Parkinson\'s disease, and multiple sclerosis. He employs a patient-centered approach and keeps abreast of the latest advancements in neurological research to provide the most effective treatment plans.',
  },
  {
    name: 'Dr. Emily Williams',
    specialty: 'Pediatrician',
    experience: 6,
    fees: 100,
    image: 'https://ui-avatars.com/api/?name=Emily+Williams&background=7C3AED&color=fff&size=200',
    available: true,
    education: 'MD, Pediatrics — Stanford University School of Medicine',
    address: '88 Kids Care Ave, Palo Alto, CA',
    about:
      'Dr. Emily Williams is a dedicated pediatrician with 6 years of experience caring for children from newborns to adolescents. She provides comprehensive well-child visits, vaccinations, developmental screenings, and treatment for acute and chronic childhood illnesses. Dr. Williams creates a warm, child-friendly environment to put young patients and their families at ease.',
  },
  {
    name: 'Dr. James Brown',
    specialty: 'Orthopedic Surgeon',
    experience: 15,
    fees: 200,
    image: 'https://ui-avatars.com/api/?name=James+Brown&background=059669&color=fff&size=200',
    available: true,
    education: 'MD, Orthopedic Surgery — Mayo Clinic Alix School of Medicine',
    address: '300 Bone & Joint Center, Rochester, MN',
    about:
      'Dr. James Brown is an experienced orthopedic surgeon with 15 years of expertise in joint replacement, sports medicine, spine surgery, and fracture care. He has performed over 3,000 surgical procedures and is renowned for his precision and excellent patient outcomes. Dr. Brown is passionate about restoring mobility and improving quality of life for his patients.',
  },
  {
    name: 'Dr. Priya Patel',
    specialty: 'Dermatologist',
    experience: 9,
    fees: 120,
    image: 'https://ui-avatars.com/api/?name=Priya+Patel&background=D97706&color=fff&size=200',
    available: true,
    education: 'MD, Dermatology — University of Pennsylvania Perelman School of Medicine',
    address: '55 Skin Health Pkwy, Philadelphia, PA',
    about:
      'Dr. Priya Patel is a board-certified dermatologist with 9 years of experience treating medical, surgical, and cosmetic skin conditions. Her expertise spans acne, eczema, psoriasis, skin cancer screening, Botox, and laser treatments. She believes in a holistic approach to skin health, combining evidence-based medicine with personalized skincare regimens.',
  },
  {
    name: 'Dr. Robert Davis',
    specialty: 'Psychiatrist',
    experience: 11,
    fees: 160,
    image: 'https://ui-avatars.com/api/?name=Robert+Davis&background=DC2626&color=fff&size=200',
    available: true,
    education: 'MD, Psychiatry — Columbia University Vagelos College of Physicians and Surgeons',
    address: '200 Mental Wellness Dr, New York, NY',
    about:
      'Dr. Robert Davis is a compassionate psychiatrist with 11 years of experience in diagnosing and treating a full spectrum of mental health conditions, including depression, anxiety, bipolar disorder, PTSD, and schizophrenia. He integrates psychotherapy, medication management, and lifestyle interventions to create individualized treatment plans that support long-term mental wellness.',
  },
  {
    name: 'Dr. Linda Martinez',
    specialty: 'Gynecologist',
    experience: 14,
    fees: 140,
    image: 'https://ui-avatars.com/api/?name=Linda+Martinez&background=DB2777&color=fff&size=200',
    available: true,
    education: 'MD, Obstetrics & Gynecology — UCLA David Geffen School of Medicine',
    address: '77 Women\'s Health Center, Los Angeles, CA',
    about:
      'Dr. Linda Martinez is a highly experienced OB-GYN with 14 years dedicated to women\'s health across all life stages. She provides comprehensive gynecological care including routine exams, prenatal care, minimally invasive surgeries, and management of conditions like endometriosis, PCOS, and menopause. Dr. Martinez is deeply committed to empowering women through education and compassionate care.',
  },
  {
    name: 'Dr. David Wilson',
    specialty: 'ENT Specialist',
    experience: 7,
    fees: 110,
    image: 'https://ui-avatars.com/api/?name=David+Wilson&background=0891B2&color=fff&size=200',
    available: true,
    education: 'MD, Otolaryngology — Vanderbilt University School of Medicine',
    address: '33 ENT Specialists Blvd, Nashville, TN',
    about:
      'Dr. David Wilson is a skilled ENT (Ear, Nose, and Throat) specialist with 7 years of experience treating conditions affecting the head and neck. His expertise includes sinusitis, hearing loss, tinnitus, sleep apnea, thyroid disorders, and head & neck tumors. Dr. Wilson uses state-of-the-art diagnostic and surgical techniques to ensure the best possible outcomes for his patients.',
  },
  {
    name: 'Dr. Aisha Khan',
    specialty: 'Endocrinologist',
    experience: 10,
    fees: 155,
    image: 'https://ui-avatars.com/api/?name=Aisha+Khan&background=4F46E5&color=fff&size=200',
    available: true,
    education: 'MD, Endocrinology — University of Chicago Pritzker School of Medicine',
    address: '99 Hormone Health Ct, Chicago, IL',
    about:
      'Dr. Aisha Khan is a dedicated endocrinologist with 10 years of experience managing hormonal and metabolic disorders including diabetes, thyroid disease, osteoporosis, polycystic ovary syndrome, and adrenal conditions. She takes an evidence-based, patient-first approach and works closely with patients to develop tailored management strategies that fit their lifestyles and health goals.',
  },
  {
    name: 'Dr. Thomas Lee',
    specialty: 'Gastroenterologist',
    experience: 13,
    fees: 170,
    image: 'https://ui-avatars.com/api/?name=Thomas+Lee&background=166534&color=fff&size=200',
    available: true,
    education: 'MD, Gastroenterology — University of Michigan Medical School',
    address: '500 Digestive Health Way, Ann Arbor, MI',
    about:
      'Dr. Thomas Lee is a seasoned gastroenterologist with 13 years of experience in diagnosing and treating disorders of the digestive system, including IBS, Crohn\'s disease, ulcerative colitis, liver disease, and colorectal cancer. He is proficient in endoscopic procedures and colonoscopies. Dr. Lee is committed to delivering thorough, compassionate care and educating patients on maintaining optimal digestive health.',
  },
];

const seedDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined. Please check your .env file.');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // Clear existing data
    console.log('Clearing existing Users and Doctors...');
    await User.deleteMany({});
    await Doctor.deleteMany({});
    console.log('Collections cleared.');

    // Create admin user
    console.log('Creating admin user...');
    const adminUser = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@healthbook.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'admin',
    });
    console.log(`Admin user created: ${adminUser.email}`);

    // Create doctors
    console.log('Seeding 10 doctors...');
    const createdDoctors = await Doctor.insertMany(doctors);
    console.log(`${createdDoctors.length} doctors seeded successfully.`);

    console.log('\n✅ Database seeded successfully!');
    console.log(`   Admin Email:    ${adminUser.email}`);
    console.log(`   Admin Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
    console.log(`   Doctors seeded: ${createdDoctors.length}`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
