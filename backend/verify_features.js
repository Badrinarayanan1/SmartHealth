const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function runVerification() {
    try {
        console.log("Starting Verification...");

        // 1. Login/Create Admin
        // Assuming admin exists or we can register one. For now, let's try to register a temp admin or use existing.
        // Let's rely on manual admin creation if needed, but here let's try to register a new admin just in case "admin2@test.com"
        // Actually, let's just register a user -> doctor flow first as that's new.

        // 1. Admin Login (Mocking or creating)
        // Since I can't easily rely on existing data, let's create a new Admin first via direct DB or route if open.
        // User routes allow register.
        const adminEmail = `admin_${Date.now()}@test.com`;
        const adminPass = '123456';

        console.log(`Creating Admin: ${adminEmail}`);
        const regAdminRes = await axios.post(`${API_URL}/users/register`, {
            name: 'Admin Test',
            email: adminEmail,
            password: adminPass,
            role: 'admin'
        });
        const adminUser = regAdminRes.data;
        // Need to login to get potentially a token if we used JWT (but we aren't using JWT yet, just simple login returning user obj).
        console.log("Admin Computed/Logged In:", adminUser.email);


        // 2. Admin adds a Doctor
        console.log("Admin adding Doctor...");
        const docEmail = `dr_${Date.now()}@test.com`;
        const docPass = '123456';

        const addDocRes = await axios.post(`${API_URL}/doctors`, {
            name: "Dr. Gregory House",
            specialization: "Diagnostic Medicine",
            bio: "Everybody lies.",
            slots: [],
            email: docEmail,
            password: docPass
        });
        const doctor = addDocRes.data;
        console.log(`Doctor Created: ${doctor.name} (ID: ${doctor._id})`);

        // 3. Admin adds a Lab Test
        console.log("Admin adding Lab Test...");
        const addLabRes = await axios.post(`${API_URL}/labs`, {
            name: "Full Body MRI",
            description: "Scan of everything",
            price: 1000
        });
        const lab = addLabRes.data;
        console.log(`Lab Created: ${lab.name} (ID: ${lab._id})`);


        // 4. Doctor Login
        console.log("Doctor Logging in...");
        const docLoginRes = await axios.post(`${API_URL}/users/login`, {
            email: docEmail,
            password: docPass
        });
        const loggedInDoc = docLoginRes.data;
        if (loggedInDoc.role !== 'doctor') throw new Error("Doctor login role mismatch");
        console.log("Doctor Logged In successfully.");


        // 5. Create a Patient
        console.log("Creating Patient...");
        const patEmail = `patient_${Date.now()}@test.com`;
        const patRes = await axios.post(`${API_URL}/users/register`, {
            name: "Marty McFly",
            email: patEmail,
            password: "123"
        });
        const patient = patRes.data;
        console.log(`Patient Created: ${patient.name}`);


        // 6. Doctor Prescribes
        console.log("Doctor Prescribing...");
        await axios.post(`${API_URL}/prescriptions`, {
            doctor: doctor._id, // Using doctor profile ID
            patient: patient._id,
            medicines: [{ name: "Ibuprofen", dosage: "400mg", frequency: "BD", duration: "5 days" }],
            notes: "Take with food"
        });
        console.log("Prescription created.");

        // 7. Doctor Books Lab
        console.log("Doctor Booking Lab...");
        await axios.post(`${API_URL}/labs/book`, {
            doctor: doctor._id,
            patient: patient._id,
            labTest: lab._id
        });
        console.log("Lab booked.");

        // 8. Doctor Bills
        console.log("Doctor creating Bill...");
        await axios.post(`${API_URL}/bills`, {
            doctor: doctor._id, // Optional but good for tracking
            patient: patient._id,
            type: "consultation",
            amount: 150,
            description: "General Checkup"
        });
        console.log("Bill created.");

        console.log("\nVERIFICATION SUCCESSFUL: All flows working.");

    } catch (error) {
        console.error("VERIFICATION FAILED:", error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

runVerification();
