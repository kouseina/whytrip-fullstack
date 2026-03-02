const db = require('../config/db');

const seedDestinations = async () => {
    const destinations = [
        {
            name: 'Uluwatu Temple',
            location: 'Badung, Bali',
            province: 'Bali',
            type: 'Wisata Religi',
            description: 'Pura luhur yang terletak di atas tebing curam menghadap Samudra Hindia.',
            image_url: 'assets/img/1.png',
            price: 50000
        },
        {
            name: 'Tanah Lot',
            location: 'Tabanan, Bali',
            province: 'Bali',
            type: 'Wisata Pantai',
            description: 'Pura yang terletak di atas bongkahan batu karang di tengah pantai.',
            image_url: 'assets/img/2.png',
            price: 60000
        },
        {
            name: 'Candi Borobudur',
            location: 'Magelang, Jawa Tengah',
            province: 'Jawa Tengah',
            type: 'Wisata Religi',
            description: 'Candi Buddha terbesar di dunia yang dibangun pada abad ke-9.',
            image_url: 'assets/img/3.png',
            price: 50000
        },
        {
            name: 'Raja Ampat',
            location: 'Kepulauan Raja Ampat',
            province: 'Papua',
            type: 'Wisata Alam',
            description: 'Gugusan kepulauan eksotis dengan keanekaragaman hayati bawah laut yang memukau.',
            image_url: 'assets/img/1.png', // Reusing images for now based on your UI
            price: 150000
        }
    ];

    try {
        // Clear existing data (optional, but good for testing)
        // await db.query('DELETE FROM destinations');

        // Insert new data
        for (const dest of destinations) {
            await db.query(
                'INSERT INTO destinations (name, location, province, type, description, image_url, price) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                [dest.name, dest.location, dest.province, dest.type, dest.description, dest.image_url, dest.price]
            );
        }
        console.log('Dummy destinations seeded successfully!');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        process.exit(0);
    }
};

seedDestinations();
