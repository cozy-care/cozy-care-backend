const db = require('../config/database');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

// Helper functions
const generateThaiName = (gender) => {
    const maleFirstNames = ['สมชาย', 'จารุวัฒน์', 'ณัฐวุฒิ', 'กิตติพงษ์', 'ธนวัฒน์', 'ภานุพงศ์', 'ชัยวัฒน์', 'นรินทร์', 'ธีรภัทร์'];
    const femaleFirstNames = ['สมหญิง', 'วรัญญา', 'ศศิธร', 'วราภรณ์', 'ปวีณา', 'สุธิดา', 'อรณิชา', 'ธัญญลักษณ์', 'พิมพ์ชนก'];
    const lastNames = ['สวัสดี', 'พงศ์สุวรรณ', 'วัฒนกุล', 'ภัทรศรี', 'บุญญาภา', 'จันทร์โอชา', 'วิริยะกุล', 'รัตนาธิเบศร์', 'ศรีสุข'];

    return {
        firstname: faker.helpers.arrayElement(gender === 'male' ? maleFirstNames : femaleFirstNames),
        lastname: faker.helpers.arrayElement(lastNames),
    };
};

const generateProfileImage = (gender) => {
    const maleImages = [
        'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b2xkJTIwcGVyc29ufGVufDB8fDB8fHww',
        'https://plus.unsplash.com/premium_photo-1691003661129-3af2949db30a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8b2xkJTIwcGVyc29ufGVufDB8fDB8fHww',
    ];
    const femaleImages = [
        'https://plus.unsplash.com/premium_photo-1675674458649-0c667500f3cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8b2xkJTIwcGVyc29ufGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1608649672519-e8797a9560cf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fG9sZCUyMHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D',
    ];
    return faker.helpers.arrayElement(gender === 'male' ? maleImages : femaleImages);
};

const generateLanguage = () => faker.helpers.arrayElement(['ไทย', 'อังกฤษ', 'จีน']);

// Function to create mock caregivers (male or female)
async function caregiverMockup(count, gender) {
    const mockCaregivers = Array.from({ length: count }, () => {
        const thaiName = generateThaiName(gender);
        const profileImage = generateProfileImage(gender);

        return {
            user: {
                username: faker.internet.username(),
                password: bcrypt.hashSync('1234', 10), // Hash the password
                email: faker.internet.email(),
                role: 'caregiver',
                alias: thaiName.firstname,
                profile_image: profileImage,
            },
            caregiver: {
                firstname: thaiName.firstname,
                middlename: '-', // Set middlename to null
                lastname: thaiName.lastname,
                sex: gender === 'male' ? 'ชาย' : 'หญิง',
                birth_date: faker.date.birthdate({ min: 20, max: 60, mode: 'age' }),
                weight: faker.number.float({ min: 40, max: 100, precision: 0.1 }),
                height: faker.number.float({ min: 150, max: 200, precision: 0.1 }),
                experience: faker.lorem.sentence(),
                study_experience: faker.lorem.sentence(),
                certification_image: faker.image.urlPicsumPhotos(),
                used_language: generateLanguage(),
                is_term: true,
                is_approve: true,
                available_time: faker.date.future().toISOString().split('T')[0], // Generate future date in YYYY-MM-DD format
            },
            caregiverOrder: {
                address: faker.location.streetAddress(),
                geocode: `${faker.location.latitude()},${faker.location.longitude()}`,
                want_client_type: faker.helpers.arrayElement(['ดูแลผู้สูงอายุ', 'ดูแลเด็กเล็ก', 'ดูแลผู้ป่วยติดเตียง', 'พาไปโรงพยาบาล', 'พาไปส่งตามที่ระบุ']),
                payment_type: faker.helpers.arrayElement(['รายวัน', 'รายสัปดาห์', 'รายเดือน', 'รายปี']),
                price: faker.number.int({ min: 500, max: 5000 }),
                more_skill: faker.helpers.arrayElement(['ขับรถได้(มีรถ)', 'ทำอาหาร']),
                start_time: faker.date.future().toISOString(),
                end_time: faker.date.future({ years: 1 }).toISOString(),
            },
        };
    });

    await db.transaction(async (trx) => {
        for (const mockCaregiver of mockCaregivers) {
            const { user, caregiver, caregiverOrder } = mockCaregiver;

            // Insert into Users table
            const [insertedUser] = await trx('Users')
                .insert(user)
                .returning('user_id');
            const user_id = insertedUser.user_id;

            // Insert into Caregiver table
            const [insertedCaregiver] = await trx('Caregiver')
                .insert({ user_id, ...caregiver })
                .returning('caregiver_id');
            const caregiver_id = insertedCaregiver.caregiver_id;

            // Insert into CaregiverOrder table
            await trx('CaregiverOrder').insert({ caregiver_id, ...caregiverOrder });
        }
    });

    return mockCaregivers.length;
}

// Function to create mock clients (male or female)
async function clientMockup(count, gender) {
    const mockClients = Array.from({ length: count }, () => {
        const thaiName = generateThaiName(gender);
        const profileImage = generateProfileImage(gender);

        return {
            user: {
                username: faker.internet.username(),
                password: bcrypt.hashSync('1234', 10), // Hash the password
                email: faker.internet.email(),
                role: 'client',
                alias: thaiName.firstname,
                profile_image: profileImage,
            },
            subClient: {
                firstname: thaiName.firstname,
                middlename: '-', // Set middlename to null
                lastname: thaiName.lastname,
                profile_image: profileImage,
                sex: gender === 'male' ? 'ชาย' : 'หญิง',
                birth_date: faker.date.birthdate({ min: 0, max: 100, mode: 'age' }),
                weight: faker.number.float({ min: 3, max: 150 }),
                height: faker.number.float({ min: 30, max: 200 }),
                client_type: faker.helpers.arrayElement(['ผู้ป่วยติดเตียง', 'ผู้สูงอายุ']),
                phy_con: faker.helpers.arrayElement(['ปกติ(เดินได้ กินได้)', 'เดินไม่ค่อยได้(กินได้ ต้องช่วยพยุง)', 'เดินไม่ได้(กินได้ นั่งรถเข็น)', 'ติดเตียง(ต้องฟีดอาหาร ดูดเสมหะ)']),
                con_dis: faker.helpers.arrayElement(['ไม่มี', 'เบาหวาน', 'ความดันโลหิตสูง']),
                drug_all: faker.helpers.arrayElement(['ไม่มี', 'ยาปฏิชีวนะ', 'ยาแก้ปวด']),
                drug_used: faker.helpers.arrayElement(['ไม่มี', 'ยาเบาหวาน', 'ยาความดัน']),
                is_term: true,
                available_time: faker.date.future().toISOString().split('T')[0], // Generate future date in YYYY-MM-DD format
            },
            clientOrder: {
                address: faker.location.streetAddress(),
                geocode: `${faker.location.latitude()},${faker.location.longitude()}`,
                want_language: faker.helpers.arrayElement(['ไทย', 'อังกฤษ', 'จีน']),
                payment_type: faker.helpers.arrayElement(['รายวัน', 'รายสัปดาห์', 'รายเดือน', 'รายปี']),
                price: faker.number.int({ min: 500, max: 5000 }),
                want_ext_skill: faker.helpers.arrayElement(['ขับรถได้(มีรถ)', 'ทำอาหารได้']),
                more_addition: faker.helpers.arrayElement(['มีที่พักให้', 'มีมื้ออาหาร']),
                start_time: faker.date.future().toISOString(),
                end_time: faker.date.future({ years: 1 }).toISOString(),
            },
        };
    });

    await db.transaction(async (trx) => {
        for (const mockClient of mockClients) {
            const { user, subClient, clientOrder } = mockClient;

            // Insert into Users table
            const [insertedUser] = await trx('Users')
                .insert(user)
                .returning('user_id');
            const user_id = insertedUser.user_id;

            // Insert into Client table (linking user_id to client_id)
            const [insertedClient] = await trx('Client')
                .insert({ user_id })
                .returning('client_id');
            const client_id = insertedClient.client_id;

            // Insert into SubClient table (now referencing client_id)
            const [insertedSubClient] = await trx('SubClient')
                .insert({ client_id, ...subClient })
                .returning('sub_client_id');
            const sub_client_id = insertedSubClient.sub_client_id;

            // Insert into ClientOrder table
            await trx('ClientOrder').insert({ sub_client_id, ...clientOrder });
        }
    });

    return mockClients.length;
}

module.exports = { caregiverMockup, clientMockup };