const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuItem = require('./models/MenuItem');
const Table = require('./models/Table');
const Order = require('./models/Order');
const User = require('./models/User');
const Category = require('./models/Category');
const QRCode = require('qrcode');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await MenuItem.deleteMany();
        await Table.deleteMany();
        await Order.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();
        console.log('Cleared existing data.');

        // Seed Admin User
        await User.create({
            name: 'Adarsh Inamdar',
            email: 'admin@restaurant.com',
            password: 'password123',
            role: 'Admin'
        });
        console.log('Seeded Admin User: admin@restaurant.com / password123');

        // Seed Tables
        const initialTables = [
            { tableNumber: 1, capacity: 2, status: 'Free' },
            { tableNumber: 2, capacity: 4, status: 'Free' },
            { tableNumber: 3, capacity: 4, status: 'Free' },
            { tableNumber: 4, capacity: 6, status: 'Free' },
            { tableNumber: 5, capacity: 8, status: 'Free' }
        ];

        const insertedTables = await Table.insertMany(initialTables);
        
        // Now update each table with its QR code containing the REAL _id
        for (let table of insertedTables) {
            const qrContent = `http://localhost:5173/?tableId=${table._id}`;
            table.qrCode = await QRCode.toDataURL(qrContent);
            await table.save();
        }
        
        console.log(`Seeded ${insertedTables.length} tables with verified QR codes.`);

        // Seed Categories
        const categories = await Category.insertMany([
            { name: 'Starters', order: 1 },
            { name: 'Main Course', order: 2 },
            { name: 'Desserts', order: 3 },
            { name: 'Beverages', order: 4 },
            { name: 'Fast Food', order: 5 }
        ]);
        console.log(`Seeded ${categories.length} categories.`);

        // Seed Menu Items
        await MenuItem.insertMany([
            {
                name: 'Paneer Tikka',
                price: 250,
                category: 'Starters',
                description: 'Grilled cottage cheese marinated in spices.',
                imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=500&auto=format&fit=crop',
                enableTimer: true,
                preparationTime: 15
            },
            {
                name: 'Butter Chicken',
                price: 350,
                category: 'Main Course',
                description: 'Creamy tomato-based chicken curry.',
                imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=500&auto=format&fit=crop',
                enableTimer: true,
                preparationTime: 20
            },
            {
                name: 'Garlic Naan',
                price: 60,
                category: 'Breads',
                description: 'Soft leavened bread with garlic and butter.',
                imageUrl: 'https://images.unsplash.com/photo-1626074353765-4a75a5b5020c?q=80&w=500&auto=format&fit=crop',
                enableTimer: false
            },
            {
                name: 'Gulab Jamun',
                price: 120,
                category: 'Desserts',
                description: 'Deep-fried milk dumplings in sugar syrup.',
                imageUrl: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=500&auto=format&fit=crop',
                enableTimer: false
            },
            {
                name: 'Mango Lassi',
                price: 90,
                category: 'Beverages',
                description: 'Sweet mango-flavored yogurt drink.',
                imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=500&auto=format&fit=crop',
                enableTimer: false
            }
        ]);
        console.log('Seeded menu items.');

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error seeding data: ${error.message}`);
        process.exit(1);
    }
};

seedData();
