import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, User, FileText, Activity, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [bills, setBills] = useState([]);
    const [labBookings, setLabBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'labs' | 'prescriptions' | 'bills'

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const userId = user._id || user.id;
                const [bRes, pRes, blRes, lRes] = await Promise.all([
                    fetch(`http://localhost:5000/api/book/user/${userId}`),
                    fetch(`http://localhost:5000/api/prescriptions/patient/${userId}`),
                    fetch(`http://localhost:5000/api/bills/patient/${userId}`),
                    fetch(`http://localhost:5000/api/labs/bookings/${userId}`)
                ]);

                setBookings(await bRes.json());
                setPrescriptions(await pRes.json());
                setBills(await blRes.json());
                setLabBookings(await lRes.json());
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    if (loading) return <div className="text-center py-12">Loading records...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-600" /> My Medical Records
            </h1>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-2 mb-8 border-b border-gray-200 pb-1">
                <button
                    onClick={() => setActiveTab('appointments')}
                    className={`px-4 py-2 font-medium text-sm rounded-t-lg transition ${activeTab === 'appointments' ? 'bg-white border text-blue-600 border-b-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Appointments
                </button>
                <button
                    onClick={() => setActiveTab('labs')}
                    className={`px-4 py-2 font-medium text-sm rounded-t-lg transition ${activeTab === 'labs' ? 'bg-white border text-blue-600 border-b-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Lab Tests
                </button>
                <button
                    onClick={() => setActiveTab('prescriptions')}
                    className={`px-4 py-2 font-medium text-sm rounded-t-lg transition ${activeTab === 'prescriptions' ? 'bg-white border text-blue-600 border-b-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Prescriptions
                </button>
                <button
                    onClick={() => setActiveTab('bills')}
                    className={`px-4 py-2 font-medium text-sm rounded-t-lg transition ${activeTab === 'bills' ? 'bg-white border text-blue-600 border-b-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Bills
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

                {activeTab === 'appointments' && (
                    <div className="space-y-4">
                        {bookings.length === 0 && <p className="text-gray-500 italic text-center py-4">No appointments found.</p>}
                        {bookings.map(booking => (
                            <div key={booking._id} className="p-4 border border-gray-100 rounded-lg flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Dr. {booking.doctor?.name}</h3>
                                        <p className="text-blue-600 text-xs font-semibold">{booking.doctor?.specialization}</p>
                                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(booking.slotTime).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(booking.slotTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{booking.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'labs' && (
                    <div className="space-y-4">
                        {labBookings.length === 0 && <p className="text-gray-500 italic text-center py-4">No lab tests found.</p>}
                        {labBookings.map(l => (
                            <div key={l._id} className="p-4 border border-gray-100 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{l.labTest?.name}</h3>
                                        <p className="text-gray-500 text-xs">{new Date(l.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-sm font-medium text-gray-600">{l.status}</div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'prescriptions' && (
                    <div className="space-y-4">
                        {prescriptions.length === 0 && <p className="text-gray-500 italic text-center py-4">No prescriptions found.</p>}
                        {prescriptions.map(p => (
                            <div key={p._id} className="p-4 border border-gray-100 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    <span className="font-bold text-gray-900">{new Date(p.date).toLocaleDateString()}</span>
                                    <span className="text-xs text-gray-400">Dr. {p.doctor?.name}</span>
                                </div>
                                <ul className="list-disc pl-8 text-sm space-y-1">
                                    {p.medicines.map((m, i) => <li key={i}><span className="font-medium">{m.name}</span> - {m.dosage} ({m.frequency})</li>)}
                                </ul>
                                {p.notes && <p className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded">Note: {p.notes}</p>}
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'bills' && (
                    <div className="space-y-4">
                        {bills.length === 0 && <p className="text-gray-500 italic text-center py-4">No bills found.</p>}
                        {bills.map(b => (
                            <div key={b._id} className="p-4 border border-gray-100 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{b.description}</h3>
                                        <p className="text-xs text-gray-500 uppercase">{b.type}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-gray-900">${b.amount}</div>
                                    <div className="text-xs text-orange-500 font-medium">{b.status}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default MyBookingsPage;
