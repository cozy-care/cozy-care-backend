const db = require('../config/database');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const CryptoJS = require("crypto-js");

const encryptPassword = (password) => {
    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    return hashedPassword;
};
// Helper functions
const generateThaiName = (gender) => {
    const maleFirstNames = [
        'สมชาย', 'จารุวัฒน์', 'ณัฐวุฒิ', 'กิตติพงษ์', 'ธนวัฒน์', 
        'ภานุพงศ์', 'ชัยวัฒน์', 'นรินทร์', 'ธีรภัทร์', 'ปรเมศวร์', 
        'อรรถพล', 'วรากร', 'พงศธร', 'ภาสกร', 'ศิรวิทย์'
    ];
    const femaleFirstNames = [
        'สมหญิง', 'วรัญญา', 'ศศิธร', 'วราภรณ์', 'ปวีณา', 
        'สุธิดา', 'อรณิชา', 'ธัญญลักษณ์', 'พิมพ์ชนก', 'กานดา', 
        'อารยา', 'ณัฐธิดา', 'มาลินี', 'อัญชลี', 'พัชรี'
    ];
    const lastNames = [
        'สวัสดี', 'พงศ์สุวรรณ', 'วัฒนกุล', 'ภัทรศรี', 'บุญญาภา', 
        'จันทร์โอชา', 'วิริยะกุล', 'รัตนาธิเบศร์', 'ศรีสุข', 'อินทรโชติ', 
        'เกียรติสุวรรณ', 'วิชัยโย', 'ปุณณภพ', 'ธีระพงศ์', 'รุ่งเรือง'
    ];

    return {
        firstname: faker.helpers.arrayElement(gender === 'male' ? maleFirstNames : femaleFirstNames),
        lastname: faker.helpers.arrayElement(lastNames),
    };
};

const generateProfileImage = (gender) => {
    const maleImages = [
        'https://img.freepik.com/free-photo/confident-young-male-doctor-standing-keeping-hands-hips-healthcare-concept_1262-12642.jpg?semt=ais_hybrid',
        'https://img.freepik.com/free-photo/medium-shot-male-nurse-posing_23-2150796818.jpg?semt=ais_hybrid',
        'https://img.freepik.com/free-photo/confident-young-male-doctor-extending-arm-handshake-friendly-doctor-concept_1262-12641.jpg?semt=ais_hybrid',
    ];
    const femaleImages = [
        'https://img.freepik.com/free-photo/asian-female-doctor-physician-medical-uniform-with-stethoscope-cross-arms-chest-smiling-looking-like-professional-white-background_1258-83205.jpg?semt=ais_hybrid',
        'https://img.freepik.com/free-photo/portrait-beautiful-young-asian-doctor-asian-woman_74190-10516.jpg?semt=ais_hybrid',
        'https://img.freepik.com/free-photo/portrait-smiling-asian-nurse-looking-camera-crossing-arms_554837-111.jpg?semt=ais_hybrid',
    ];
    return faker.helpers.arrayElement(gender === 'male' ? maleImages : femaleImages);
};

const generateClientProfileImage = (gender) => {
    const maleImages = [
        'https://img.freepik.com/free-photo/cheerful-mature-asian-man-thinking_53876-146955.jpg?ga=GA1.1.2101801578.1738766104&semt=ais_hybrid',
        'https://img.freepik.com/free-photo/confident-man-standing-smiling_53876-13974.jpg?ga=GA1.1.2101801578.1738766104&semt=ais_hybrid',
        'https://img.freepik.com/free-photo/senior-handsome-man-wearing-casual-polo-looking-confident-camera-with-smile-with-crossed-arms-hand-raised-chin-thinking-positive_839833-13286.jpg?ga=GA1.1.2101801578.1738766104&semt=ais_hybrid',
    ];
    const femaleImages = [
        'https://img.freepik.com/free-photo/cheerful-old-casual-woman-giving-thumbs-up_53876-22959.jpg?ga=GA1.1.2101801578.1738766104&semt=ais_hybrid',
        'https://img.freepik.com/free-photo/expressive-senior-woman-posing_344912-927.jpg?ga=GA1.1.2101801578.1738766104&semt=ais_hybrid',
        'https://img.freepik.com/free-photo/cheerful-old-casual-asian-woman_53876-26362.jpg?ga=GA1.1.2101801578.1738766104&semt=ais_hybrid',
    ];
    return faker.helpers.arrayElement(gender === 'male' ? maleImages : femaleImages);
};


const generateLanguage = () => faker.helpers.arrayElement(['ไทย', 'อังกฤษ', 'จีน']);
const generatePrice = () => faker.helpers.arrayElement(['800', '1600', '3000', '5000']);
const generateExp = () => faker.helpers.arrayElement(['5 ปี', '3 ปี', '6 ปี', '10 ปี']);
const generateStuExp = () => faker.helpers.arrayElement(['หลักสูตรอบรมการดูแลผู้สูงอายุ', 'ปริญญาตรีพยาบาลศาสตร์']);
// Generate random geocode within Bangkok
const generateBangkokGeocode = () => {
    const lat = faker.number.float({ min: 13.65, max: 13.90, precision: 0.0001 }); // Latitude range for Bangkok
    const lon = faker.number.float({ min: 100.40, max: 100.75, precision: 0.0001 }); // Longitude range for Bangkok
    return `${lat},${lon}`;
};

// Function to create mock caregivers (male or female)
async function caregiverMockup(count, gender) {
    const mockCaregivers = Array.from({ length: count }, () => {
        const thaiName = generateThaiName(gender);
        const profileImage = generateProfileImage(gender);
        const startTime = faker.date.future().toISOString();
        const endTime = new Date(new Date(startTime).setMonth(new Date(startTime).getMonth() + faker.number.int({ min: 1, max: 3 }))).toISOString();
        const password = encryptPassword('1234');
        return {
            user: {
                username: faker.internet.username(),
                password: bcrypt.hashSync(password, 10), // Hash the password
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
                weight: faker.number.float({ min: 40, max: 100, precision: 1 }),
                height: faker.number.float({ min: 150, max: 200, precision: 1 }),
                experience: generateExp(),
                study_experience: generateStuExp(),
                certification_image: faker.image.urlPicsumPhotos(),
                used_language: generateLanguage(),
                is_term: true,
                is_approve: true,
            },
            caregiverOrder: {
                address: faker.location.streetAddress(),
                geocode: generateBangkokGeocode(), // Use Bangkok geocode
                want_client_type: faker.helpers.arrayElement(['ดูแลผู้สูงอายุ', 'ดูแลเด็กเล็ก', 'ดูแลผู้ป่วยติดเตียง', 'พาไปโรงพยาบาล', 'พาไปส่งตามที่ระบุ']),
                payment_type: faker.helpers.arrayElement(['วัน', 'สัปดาห์', 'เดือน', 'ปี']),
                price: generatePrice(),
                more_skill: faker.helpers.arrayElement(['ขับรถได้(มีรถ)', 'ทำอาหาร']),
                start_time: startTime,
                end_time: endTime,
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
        const profileImage = generateClientProfileImage(gender);
        const startTime = faker.date.future().toISOString();
        const endTime = new Date(new Date(startTime).setMonth(new Date(startTime).getMonth() + faker.number.int({ min: 1, max: 3 }))).toISOString();
        const password = encryptPassword('1234');

        return {
            user: {
                username: faker.internet.username(),
                password: bcrypt.hashSync(password, 10), // Hash the password
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
            },
            clientOrder: {
                address: faker.location.streetAddress(),
                geocode: generateBangkokGeocode(),
                want_language: faker.helpers.arrayElement(['ไทย', 'อังกฤษ', 'จีน']),
                payment_type: faker.helpers.arrayElement(['รายวัน', 'รายสัปดาห์', 'รายเดือน', 'รายปี']),
                price: faker.number.int({ min: 500, max: 5000 }),
                want_ext_skill: faker.helpers.arrayElement(['ขับรถได้(มีรถ)', 'ทำอาหารได้']),
                more_addition: faker.helpers.arrayElement(['มีที่พักให้', 'มีมื้ออาหาร']),
                start_time: startTime,
                end_time: endTime,
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