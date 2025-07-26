import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import ATSCenter from '../models/ATSCenter.js';
import VisualTest from '../models/VisualTest.js';
import FunctionalTest from '../models/FunctionalTest.js';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  }
};

const formatDate = (date) => {
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}${mm}${yyyy}`;
};

const seed = async () => {
  await connectDB();

  try {
    // Clear all previous data
    await Promise.all([
      User.deleteMany(),
      Vehicle.deleteMany(),
      ATSCenter.deleteMany(),
      VisualTest.deleteMany(),
      FunctionalTest.deleteMany(),
    ]);

    // Create ATS Center
    const atsCenter = await ATSCenter.create({
      name: 'Bangalore ATS Center 01',
      code: 'BLR01',
      latitude: 12.9716,
      longitude: 77.5946,
      ipWhitelist: [],
    });

    // Admin
    await User.create({
      name: 'Admin BLR',
      email: 'admin@blr.com',
      password: 'admin123',
      role: 'ATS_ADMIN',
      atsCenter: atsCenter._id,
    });

    // Technicians
    const technicians = [];
    for (let i = 1; i <= 3; i++) {
      const tech = await User.create({
        name: `Technician ${i}`,
        email: `tech${i}@blr.com`,
        password: 'tech12345',
        role: 'TECHNICIAN',
        atsCenter: atsCenter._id,
      });
      technicians.push(tech);
    }

    // Seed 30 vehicles
    const today = new Date();
    const dateStr = formatDate(today);
    const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'APPROVED'];

    for (let i = 1; i <= 30; i++) {
      const regnNo = `KA01AA${1000 + i}`;
      const bookingId = `${atsCenter.code}-${dateStr}-${String(i).padStart(4, '0')}`;
      const status = statuses[i % statuses.length];
      const createdAt = new Date(today.getTime() - i * 100000);

      const vehicle = await Vehicle.create({
        regnNo,
        bookingId,
        engineNo: `ENG${3000 + i}`,
        chassisNo: `CHS${4000 + i}`,
        atsCenter: atsCenter._id,
        status,
        laneEntryTime: createdAt,
        createdAt,
      });

      // VISUAL TEST SETUP
      if (i % 3 === 0) {
        // Every 3rd: no visual test → pending
      } else if (i % 3 === 1) {
        // Completed visual test
        await VisualTest.create({
          bookingId,
          vehicle: vehicle._id,
          rule189_8a: "P",
          rule189_8b: "P",
          rule189_9a: "F",
          rule189_10: "P",
          rule189_11a: "NA",
          isCompleted: true,
        });
      } else {
        // Incomplete visual test
        await VisualTest.create({
          bookingId,
          vehicle: vehicle._id,
          rule189_8a: "P",
          rule189_8b: "NA",
          isCompleted: false,
        });
      }

      // FUNCTIONAL TEST SETUP
      if (i % 4 === 0) {
        await FunctionalTest.create({
          bookingId,
          vehicle: vehicle._id,
          rule189_37: (Math.random() * 3).toFixed(2),
          rule189_4: (Math.random() * 2).toFixed(2),
          isCompleted: true,
        });
      } else if (i % 5 === 0) {
        await FunctionalTest.create({
          bookingId,
          vehicle: vehicle._id,
          rule189_37: "NA",
          rule189_4: "NA",
          isCompleted: false,
        });
      }
    }

    console.log('✅ Seeded 30 vehicles with mixed visual and functional test data.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
