import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';

const BookingPage = () => {
    const { doctorId } = useParams();
    const { user, login } = useAuth();
    const { saveBooking } = useBooking();
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [bookingStatus, setBookingStatus] = useState('idle'); // idle, processing, success, error
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetch(`http://localhost:5000/api/doctors?id=${doctorId}`) // Note: API needs to support ID fetch or filter
            .then(res => res.json())
            .then(data => {
                // Since our API endpoint /api/doctors returns array, we filter locally or update API.
                // Optimally update API, but for speed filtering locally since we fetch all usually? 
                // Wait, /api/doctors?department=X filters. Let's just fetch all and find (Inefficient but works for MVP)
                // OR better: we will make the API support ID fetch later. 
                // For now, let's assume get by ID works or we filter from list.
                const doc = data.find(d => d._id === doctorId);
                setDoctor(doc);
            });
    }, [doctorId]);

    const handleBook = async () => {
        if (!user) {
            alert("Please login to book an appointment");
            navigate('/login');
            return;
        }

        if (!selectedSlot) return;

        setBookingStatus('processing');
        setErrorMsg('');

        try {
            const res = await fetch('http://localhost:5000/api/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctorId,
                    slotTime: selectedSlot.time,
                    userId: user?._id || "guest",
                    symptoms: "Booked via Direct Selection"
                })
            });

            const data = await res.json();

            if (res.ok && data.status === 'CONFIRMED') {
                setBookingStatus('success');
                saveBooking(data);
                // Refresh slots
                fetch(`http://localhost:5000/api/doctors`)
                    .then(r => r.json())
                    .then(d => setDoctor(d.find(x => x._id === doctorId)));
            } else {
                setBookingStatus('error');
                setErrorMsg(data.message || "Slot unavailable");
            }
        } catch (err) {
            setBookingStatus('error');
            setErrorMsg("Network error. Please try again.");
        }
    };

    if (!doctor) return <div className="p-8 text-center">Loading specialist details...</div>;

    // Filter available slots
    const availableSlots = doctor.slots.filter(s => !s.isBooked);

    if (bookingStatus === 'success') {
        return (
            <div className="max-w-xl mx-auto mt-12 text-center">
                <div className="bg-green-50 p-8 rounded-3xl mb-6">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                    <p className="text-gray-600">Your appointment has been successfully scheduled.</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-left">
                    <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-4">Confirmation Details</p>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Doctor</span>
                            <span className="font-semibold">{doctor.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Specialization</span>
                            <span className="font-semibold">{doctor.specialization}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Time</span>
                            <span className="font-semibold text-primary">
                                {new Date(selectedSlot.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                </div>
                <button onClick={() => navigate('/')} className="mt-8 text-blue-600 font-medium hover:underline">Return Home</button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Doctor Info */}
            <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                    <h1 className="text-2xl font-bold mb-1">{doctor.name}</h1>
                    <p className="text-blue-600 font-medium mb-4">{doctor.specialization}</p>
                    <p className="text-gray-500 text-sm mb-6">{doctor.bio || "Top-rated specialist."}</p>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Clock className="w-4 h-4" /> 20 min consultation
                    </div>
                </div>
            </div>

            {/* Slots */}
            <div className="md:col-span-2">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        Select a Time
                    </h2>

                    {bookingStatus === 'error' && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            {errorMsg}
                        </div>
                    )}

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {availableSlots.length === 0 ? (
                            <div className="col-span-full text-center text-gray-500 py-8">
                                No slots available for this doctor.
                            </div>
                        ) : availableSlots.map((slot, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedSlot(slot)}
                                className={`p-3 rounded-xl text-sm font-medium transition border ${selectedSlot === slot
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30'
                                    : 'bg-gray-50 text-gray-700 border-transparent hover:bg-gray-100'
                                    }`}
                            >
                                {new Date(slot.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <button
                            onClick={handleBook}
                            disabled={!selectedSlot || bookingStatus === 'processing'}
                            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {bookingStatus === 'processing' ? 'Confirming...' : 'Confirm Booking'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
