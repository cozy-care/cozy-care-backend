const db = require('../config/database');
const { faker } = require('@faker-js/faker');

const generateThaiName = () => ({
    firstname: faker.helpers.arrayElement([
        'สมชาย', 'สมหญิง', 'วรัญญา', 'จารุวัฒน์', 'ณัฐวุฒิ', 'ศศิธร',
        'กิตติพงษ์', 'อภิชาติ', 'ธนวัฒน์', 'ภานุพงศ์', 'ชัยวัฒน์', 'นรินทร์', 
        'วราภรณ์', 'ปวีณา', 'สุธิดา', 'อรณิชา', 'ธัญญลักษณ์', 'วรินทร์', 
        'พิชญ์', 'ธีรภัทร์', 'พิมพ์ชนก'
    ]),
    lastname: faker.helpers.arrayElement([
        'สวัสดี', 'พงศ์สุวรรณ', 'วัฒนกุล', 'ภัทรศรี', 'บุญญาภา', 
        'จันทร์โอชา', 'วิริยะกุล', 'รัตนาธิเบศร์', 'ศรีสุข', 'อินทรสุข', 
        'วงศ์สุวรรณ', 'ชัยกุล', 'ธนกิจ', 'อัศวิน', 'กิตติศักดิ์', 
        'พฤกษชาติ', 'มหาวงศ์', 'ทองสวัสดิ์', 'ปัญญากุล', 'พิพัฒน์พงศ์'
    ])
});


const generateBangkokAddress = () => ({
    province: 'กรุงเทพมหานคร',
    district: faker.helpers.arrayElement([
        'เขตพระนคร', 'เขตปทุมวัน', 'เขตบางรัก', 'เขตดุสิต', 'เขตสวนหลวง',
        'เขตจตุจักร', 'เขตห้วยขวาง', 'เขตบางกอกใหญ่', 'เขตบางแค', 'เขตสายไหม',
    ]),
    sub_district: faker.helpers.arrayElement([
        'แขวงบางรัก', 'แขวงคลองตัน', 'แขวงลาดพร้าว', 'แขวงบางบอน', 'แขวงบางนา',
        'แขวงดอนเมือง', 'แขวงพญาไท', 'แขวงราษฎร์บูรณะ', 'แขวงจอมทอง', 'แขวงหนองแขม',
    ]),
});


const generateProfile = () => ({
    patient: faker.helpers.arrayElement([
        'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b2xkJTIwcGVyc29ufGVufDB8fDB8fHww',
        'https://plus.unsplash.com/premium_photo-1691003661129-3af2949db30a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8b2xkJTIwcGVyc29ufGVufDB8fDB8fHww',
        'https://plus.unsplash.com/premium_photo-1675674458649-0c667500f3cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8b2xkJTIwcGVyc29ufGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1608649672519-e8797a9560cf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fG9sZCUyMHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1679440415220-0830913ff645?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b2xkJTIwcGVyc29ufGVufDB8fDB8fHww'
    ]),
    caregiver: faker.helpers.arrayElement([
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG51cnNlfGVufDB8fDB8fHww',
        'https://plus.unsplash.com/premium_photo-1681967053996-4275be0191e7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fG51cnNlfGVufDB8fDB8fHww',
        'https://plus.unsplash.com/premium_photo-1682141142889-218debf4f8dc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fG51cnNlfGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fG51cnNlfGVufDB8fDB8fHww',
        'https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fG51cnNlfGVufDB8fDB8fHww'
    ])
});
const generateThaiExpertise = () => faker.helpers.arrayElement(['ดูแลผู้สูงอายุ', 'ดูแลเด็กเล็ก', 'ดูแลผู้ป่วยติดเตียง']);
const generateThaiLanguage = () => faker.helpers.arrayElement(['ไทย', 'อังกฤษ', 'จีน', 'ญี่ปุ่น']);

async function insertMockCaregiversAndPatients(req, res) {
    try {
        const { caregiverCount, patientCount } = req.body;

        if ((!caregiverCount || isNaN(caregiverCount) || caregiverCount <= 0) &&
            (!patientCount || isNaN(patientCount) || patientCount <= 0)) {
            return res.status(400).json({ error: 'Provide positive integer counts for caregivers or patients.' });
        }

        const mockCaregivers = Array.from({ length: caregiverCount || 0 }, () => {
            const thaiName = generateThaiName();
            const bangkokAddress = generateBangkokAddress();
            const profile = generateProfile();

            return {
                user: {
                    username: faker.internet.username(),
                    password: '1234', // Password fixed to "1234"
                    email: faker.internet.email(),
                    role: 'caregiver',
                    alias: thaiName.firstname,
                    profile_image: profile.caregiver,
                },
                caregiver: {
                    firstname: thaiName.firstname,
                    middlename: '-', // Set middlename to null
                    lastname: thaiName.lastname,
                    sex: faker.helpers.arrayElement(['ชาย', 'หญิง']),
                    birth_date: faker.date.birthdate({ min: 20, max: 60, mode: 'age' }),
                    weight: faker.number.float({ min: 40, max: 100, precision: 0.1 }),
                    height: faker.number.float({ min: 150, max: 200, precision: 0.1 }),
                    province: bangkokAddress.province,
                    district: bangkokAddress.district,
                    sub_district: bangkokAddress.sub_district,
                    experience: faker.lorem.sentence(),
                    expert: generateThaiExpertise(),
                    certification_image: faker.image.urlPicsumPhotos(),
                    used_language: generateThaiLanguage(),
                    is_approve: faker.datatype.boolean(),
                    available_time: faker.date.future().toISOString().split('T')[0], // Generate future date in YYYY-MM-DD format
                },
            };
        });

        const mockPatients = Array.from({ length: patientCount || 0 }, () => {
            const thaiName = generateThaiName();
            const bangkokAddress = generateBangkokAddress();
            const profile = generateProfile();

            const profilePatient = profile.patient
            return {
                user: {
                    username: faker.internet.username(),
                    password: '1234', // Password fixed to "1234"
                    email: faker.internet.email(),
                    role: 'patient',
                    alias: thaiName.firstname,
                    profile_image: profilePatient,
                },
                patient: {
                    firstname: thaiName.firstname,
                    middlename: '-', // Set middlename to null
                    lastname: thaiName.lastname,
                    profile_image: profilePatient,
                    sex: faker.helpers.arrayElement(['ชาย', 'หญิง']),
                    birth_date: faker.date.birthdate({ min: 0, max: 100, mode: 'age' }),
                    weight: faker.number.float({ min: 3, max: 150 }),
                    height: faker.number.float({ min: 30, max: 200 }),
                    province: bangkokAddress.province,
                    district: bangkokAddress.district,
                    sub_district: bangkokAddress.sub_district,
                    type: generateThaiExpertise(),
                    con_disease: faker.helpers.arrayElement(['ไม่มี', 'เบาหวาน', 'ความดันโลหิตสูง']),
                    drug_allegry: faker.helpers.arrayElement(['ไม่มี', 'ยาปฏิชีวนะ', 'ยาแก้ปวด']),
                    drug_used: faker.helpers.arrayElement(['ไม่มี', 'ยาเบาหวาน', 'ยาความดัน']),
                    is_bedridden: faker.datatype.boolean(),
                    is_feed: faker.datatype.boolean(),
                    available_time: faker.date.future().toISOString().split('T')[0], // Generate future date in YYYY-MM-DD format
                },
            };
        });

        await db.transaction(async (trx) => {
            for (const mockCaregiver of mockCaregivers) {
                const { user, caregiver } = mockCaregiver;
                const [insertedUser] = await trx('Users')
                    .insert(user)
                    .returning('user_id');
                const user_id = insertedUser.user_id;

                await trx('Caregiver').insert({ user_id, ...caregiver });
            }

            for (const mockPatient of mockPatients) {
                const { user, patient } = mockPatient;
                const [insertedUser] = await trx('Users')
                    .insert(user)
                    .returning('user_id');
                const user_id = insertedUser.user_id;

                const [insertedPatient] = await trx('Patient')
                    .insert({ user_id })
                    .returning('patient_id');
                const patient_id = insertedPatient.patient_id;

                await trx('SubPatient').insert({ patient_id, ...patient });
            }
        });

        return res.status(201).json({
            message: `${mockCaregivers.length} caregivers and ${mockPatients.length} patients inserted successfully.`,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}

module.exports = { insertMockCaregiversAndPatients };
