# SmartCare - Healthcare Management System

A comprehensive MERN stack application for managing hospital operations, featuring role-based access for Admins, Doctors, and Patients.

## 🚀 Features

### 🛡️ Admin
*   **Doctor Management**: Create and manage doctor profiles (linked to secure user accounts).
*   **Lab Management**: Add and update available lab tests and prices.
*   **Dashboard**: Overview of system users and doctors.

### 👨‍⚕️ Doctor
*   **Dedicated Dashboard**: Quick access to patients and daily tasks.
*   **Patient Management**: Search and view detailed patient records.
*   **Clinical Actions**:
    *   💊 **Prescribe**: specific medicines with dosage and instructions.
    *   🧪 **Book Labs**: Order lab tests for patients directly.
    *   🧾 **Billing**: Generate bills for consultations, procedures, or pharmacy.

### 👤 Patient
*   **Appointment Booking**: Browse doctors and book slots.
*   **Medical Records**: A unified view of:
    *   Appointment History
    *   Prescriptions
    *   Lab Test Reports & Status
    *   Bills & Payments

## 🛠️ Tech Stack

*   **Frontend**: React.js, Tailwind CSS, Lucide React (Icons), React Router DOM.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (Mongoose ODM).

## 🏃‍♂️ Local Setup Instructions

### Prerequisites
*   Node.js installed.
*   MongoDB connection string (local or Atlas).

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```
Start the server:
```bash
node server.js
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Start the development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to view the app.

## 🔑 Default/Test Credentials
*(If you used the verification scripts)*
*   **Admin**: Role must be set manually in DB or via seed script.
*   **Doctor**: Created via Admin Dashboard.
*   **Patient**: Sign up via the standard registration page.
