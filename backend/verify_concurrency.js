const fetch = require('node-fetch');

// CONFIG
const API_URL = 'http://localhost:5000/api';
const DOCTOR_ID = 'PLACEHOLDER_DOCTOR_ID'; // REPLACE AFTER RUNNING
const SLOT_TIME = '2025-12-12T10:00:00.000Z'; // REPLACE WITH ACTUAL SLOT

async function testConcurrency() {
    console.log("🚀 Starting Concurrency Test...");

    // Simulate 10 users trying to book the SAME slot at the SAME time
    const requests = Array.from({ length: 10 }, (_, i) => {
        return fetch(`${API_URL}/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                doctorId: DOCTOR_ID,
                slotTime: SLOT_TIME,
                userId: `user_${i}`,
                symptoms: "Stress Test"
            })
        });
    });

    const responses = await Promise.all(requests);
    const results = await Promise.all(responses.map(r => r.json()));

    let successCount = 0;
    let failCount = 0;

    results.forEach((res, i) => {
        if (res.status === 'CONFIRMED') {
            console.log(`✅ User ${i}: SUCCESS`);
            successCount++;
        } else {
            console.log(`❌ User ${i}: FAILED (${res.message})`);
            failCount++;
        }
    });

    console.log(`\n📊 SUMMARY:`);
    console.log(`Success: ${successCount} (Should be 1)`);
    console.log(`Failed: ${failCount} (Should be 9)`);
}

// Check if run directly
if (require.main === module) {
    if (DOCTOR_ID === 'PLACEHOLDER_DOCTOR_ID') {
        console.log("⚠️ Please update DOCTOR_ID and SLOT_TIME in script before running.");
    } else {
        testConcurrency();
    }
}
