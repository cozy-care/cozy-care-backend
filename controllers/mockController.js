const db = require('../config/database');
const { faker } = require('@faker-js/faker');

const generateThaiName = () => ({
    firstname: faker.helpers.arrayElement(['สมชาย', 'สมหญิง', 'วรัญญา', 'จารุวัฒน์', 'ณัฐวุฒิ', 'ศศิธร']),
    lastname: faker.helpers.arrayElement(['สวัสดี', 'พงศ์สุวรรณ', 'วัฒนกุล', 'ภัทรศรี', 'บุญญาภา']),
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

            return {
                user: {
                    username: faker.internet.username(),
                    password: '1234', // Password fixed to "1234"
                    email: faker.internet.email(),
                    role: 'caregiver',
                    alias: thaiName.firstname,
                    profile_image: faker.image.avatar()
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
                    certification_image: faker.image.avatar(),
                    used_language: generateThaiLanguage(),
                    is_approve: faker.datatype.boolean(),
                    available_time: faker.date.future().toISOString().split('T')[0], // Generate future date in YYYY-MM-DD format
                },
            };
        });

        const mockPatients = Array.from({ length: patientCount || 0 }, () => {
            const thaiName = generateThaiName();
            const bangkokAddress = generateBangkokAddress();

            return {
                user: {
                    username: faker.internet.username(),
                    password: '1234', // Password fixed to "1234"
                    email: faker.internet.email(),
                    role: 'patient',
                    alias: thaiName.firstname,
                    profile_image: faker.image.avatar()
                },
                patient: {
                    firstname: thaiName.firstname,
                    middlename: '-', // Set middlename to null
                    lastname: thaiName.lastname,
                    profile_image: faker.image.avatar(),
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
