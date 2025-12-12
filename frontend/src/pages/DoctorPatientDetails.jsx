import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Activity, DollarSign, Plus, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DoctorPatientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth(); // Doctor info if needed

    const [patient, setPatient] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [bills, setBills] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [labs, setLabs] = useState([]); // Available labs for dropdown

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'doctor') {
            navigate('/login');
            return;
        }
    }, [currentUser, navigate]);

    const [activeTab, setActiveTab] = useState('prescription'); // 'prescription' | 'lab' | 'bill'

    // Forms
    const [newPrescription, setNewPrescription] = useState({ medicines: [], notes: '', currentMed: { name: '', dosage: '', frequency: '' } });
    const [newBill, setNewBill] = useState({ description: '', amount: '', type: 'consultation' });
    const [selectedLabId, setSelectedLabId] = useState('');

    useEffect(() => {
        fetchData();
        fetchLabs();
    }, [id]);

    const fetchData = async () => {
        try {
            const [uRes, pRes, bRes, kRes] = await Promise.all([
                fetch(`http://localhost:5000/api/users/${id}`),
                fetch(`http://localhost:5000/api/prescriptions/patient/${id}`),
                fetch(`http://localhost:5000/api/bills/patient/${id}`),
                fetch(`http://localhost:5000/api/labs/bookings/${id}`)
            ]);

            setPatient(await uRes.json());
            setPrescriptions(await pRes.json());
            setBills(await bRes.json());
            setBookings(await kRes.json());
        } catch (err) {
            console.error(err);
        }
    };

    const fetchLabs = async () => {
        const res = await fetch('http://localhost:5000/api/labs');
        setLabs(await res.json());
    };

    const addMedicine = () => {
        if (!newPrescription.currentMed.name) return;
        setNewPrescription({
            ...newPrescription,
            medicines: [...newPrescription.medicines, newPrescription.currentMed],
            currentMed: { name: '', dosage: '', frequency: '' }
        });
    };

    const handlePrescribe = async () => {
        await fetch('http://localhost:5000/api/prescriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                doctor: currentUser._id, // Assume backend handles checking or we pass it
                patient: id,
                medicines: newPrescription.medicines,
                notes: newPrescription.notes
            })
        });
        setNewPrescription({ medicines: [], notes: '', currentMed: { name: '', dosage: '', frequency: '' } });
        fetchData();
    };

    const handleBill = async () => {
        await fetch('http://localhost:5000/api/bills', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                doctor: currentUser._id,
                patient: id,
                ...newBill
            })
        });
        setNewBill({ description: '', amount: '', type: 'consultation' });
        fetchData();
    };

    const handleBookLab = async () => {
        if (!selectedLabId) return;
        await fetch('http://localhost:5000/api/labs/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                doctor: currentUser._id,
                patient: id,
                labTest: selectedLabId
            })
        });
        setSelectedLabId('');
        fetchData();
    };

    if (!patient) return <div className="p-8 text-center">Loading patient data...</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Patient Info & History */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{patient.name}</h1>
                    <p className="text-gray-500">{patient.email}</p>
                    <div className="mt-4 flex gap-2">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">Patient</span>
                        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">Active</span>
                    </div>
                </div>

                {/* History Tabs/Sections */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="border-b border-gray-100 flex">
                        <button className="flex-1 p-3 text-sm font-medium hover:bg-gray-50 text-center border-r border-gray-100">Prescriptions</button>
                        <button className="flex-1 p-3 text-sm font-medium hover:bg-gray-50 text-center border-r border-gray-100">Lab Reports</button>
                        <button className="flex-1 p-3 text-sm font-medium hover:bg-gray-50 text-center">Bills</button>
                    </div>
                    <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                        <h3 className="font-bold text-gray-900 border-b pb-2">Recent Record</h3>
                        {/* Display list based on what's fetched. For MVP showing all briefly */}

                        <div className="space-y-4">
                            {prescriptions.map(p => (
                                <div key={p._id} className="p-3 bg-gray-50 rounded-lg text-sm">
                                    <div className="font-bold text-blue-600 mb-1">Prescribed on {new Date(p.date).toLocaleDateString()}</div>
                                    <ul className="list-disc pl-5 text-gray-700">
                                        {p.medicines.map((m, i) => <li key={i}>{m.name} - {m.dosage} ({m.frequency})</li>)}
                                    </ul>
                                </div>
                            ))}
                            {bookings.map(b => (
                                <div key={b._id} className="p-3 bg-purple-50 rounded-lg text-sm flex justify-between">
                                    <span className="font-semibold text-purple-700">Lab: {b.labTest?.name}</span>
                                    <span className="text-gray-500">{new Date(b.date).toLocaleDateString()}</span>
                                </div>
                            ))}
                            {bills.map(b => (
                                <div key={b._id} className="p-3 bg-green-50 rounded-lg text-sm flex justify-between">
                                    <span className="font-semibold text-green-700">Bill: ${b.amount} ({b.type})</span>
                                    <span className="text-gray-500">{b.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Col: Actions */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-4">
                    <h2 className="text-lg font-bold mb-4">Actions</h2>

                    <div className="flex gap-2 mb-6">
                        <button onClick={() => setActiveTab('prescription')} className={`flex-1 py-2 text-xs font-semibold rounded ${activeTab === 'prescription' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Prescribe</button>
                        <button onClick={() => setActiveTab('lab')} className={`flex-1 py-2 text-xs font-semibold rounded ${activeTab === 'lab' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Lab</button>
                        <button onClick={() => setActiveTab('bill')} className={`flex-1 py-2 text-xs font-semibold rounded ${activeTab === 'bill' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Bill</button>
                    </div>

                    {activeTab === 'prescription' && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <input className="p-2 border rounded text-sm w-full font-medium" placeholder="Medicine Name" value={newPrescription.currentMed.name} onChange={e => setNewPrescription({ ...newPrescription, currentMed: { ...newPrescription.currentMed, name: e.target.value } })} />
                                <input className="p-2 border rounded text-sm w-full" placeholder="Dosage (e.g. 500mg)" value={newPrescription.currentMed.dosage} onChange={e => setNewPrescription({ ...newPrescription, currentMed: { ...newPrescription.currentMed, dosage: e.target.value } })} />
                            </div>
                            <input className="p-2 border rounded text-sm w-full" placeholder="Frequency (e.g. 1-0-1)" value={newPrescription.currentMed.frequency} onChange={e => setNewPrescription({ ...newPrescription, currentMed: { ...newPrescription.currentMed, frequency: e.target.value } })} />
                            <button onClick={addMedicine} className="w-full py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded">Add Drug</button>

                            {newPrescription.medicines.length > 0 && (
                                <div className="bg-blue-50 p-2 rounded text-xs space-y-1">
                                    {newPrescription.medicines.map((m, i) => <div key={i} className="flex justify-between"><span>{m.name}</span> <span className="text-gray-500">{m.frequency}</span></div>)}
                                </div>
                            )}
                            <textarea className="w-full p-2 border rounded text-sm h-20" placeholder="Notes..." value={newPrescription.notes} onChange={e => setNewPrescription({ ...newPrescription, notes: e.target.value })} />
                            <button onClick={handlePrescribe} className="w-full py-2 bg-blue-600 text-white rounded font-semibold text-sm">Save Prescription</button>
                        </div>
                    )}

                    {activeTab === 'lab' && (
                        <div className="space-y-4">
                            <select className="w-full p-2 border rounded text-sm" value={selectedLabId} onChange={e => setSelectedLabId(e.target.value)}>
                                <option value="">Select Lab Test</option>
                                {labs.map(l => <option key={l._id} value={l._id}>{l.name} (${l.price})</option>)}
                            </select>
                            <button onClick={handleBookLab} className="w-full py-2 bg-purple-600 text-white rounded font-semibold text-sm">Book Lab Test</button>
                        </div>
                    )}

                    {activeTab === 'bill' && (
                        <div className="space-y-3">
                            <select className="w-full p-2 border rounded text-sm" value={newBill.type} onChange={e => setNewBill({ ...newBill, type: e.target.value })}>
                                <option value="consultation">Consultation</option>
                                <option value="lab">Lab Charge</option>
                                <option value="pharmacy">Pharmacy</option>
                            </select>
                            <input className="w-full p-2 border rounded text-sm" placeholder="Description" value={newBill.description} onChange={e => setNewBill({ ...newBill, description: e.target.value })} />
                            <input type="number" className="w-full p-2 border rounded text-sm" placeholder="Amount ($)" value={newBill.amount} onChange={e => setNewBill({ ...newBill, amount: e.target.value })} />
                            <button onClick={handleBill} className="w-full py-2 bg-green-600 text-white rounded font-semibold text-sm">Generate Bill</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorPatientDetails;
