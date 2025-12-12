import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Stethoscope, Star, Clock, Calendar } from 'lucide-react';

const ResultsPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const triageResult = state?.triageResult || { department: 'General Medicine', confidence: 0, source: 'default' };

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                // Fetch doctors matching the suggested department
                const res = await fetch(`http://localhost:5000/api/doctors?department=${triageResult.department}`);
                const data = await res.json();
                setDoctors(data);
            } catch (error) {
                console.error("Failed to load doctors");
            } finally {
                setLoading(false);
            }
        };

        if (triageResult.department) {
            fetchDoctors();
        }
    }, [triageResult.department]);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Analysis Result</h1>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 flex items-start gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                        <Stethoscope className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Recommended: {triageResult.department}</h2>
                        {state?.symptoms && <p className="text-gray-500 mt-1">Based on symptoms: "{state.symptoms}"</p>}
                        <div className="mt-2 flex gap-2">
                            {triageResult.confidence > 0 && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                    Match Confidence: {(triageResult.confidence * 100).toFixed(0)}%
                                </span>
                            )}
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{triageResult.source === 'ai' ? 'AI Model' : 'Keyword Match'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6">Available Specialists</h2>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Finding best doctors...</div>
            ) : doctors.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <p className="text-gray-500">No doctors found in this department currently.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map(doc => (
                        <div key={doc._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{doc.name}</h3>
                                        <p className="text-blue-600 text-sm font-medium">{doc.specialization}</p>
                                    </div>
                                    <div className="bg-yellow-50 px-2 py-1 rounded text-yellow-600 text-xs font-bold flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current" /> 4.9
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm mb-6 line-clamp-2">{doc.bio || "Experienced specialist dedicated to patient care."}</p>

                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" /> Available Today
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" /> Next: 10:00 AM
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(`/book/${doc._id}`)}
                                    className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-black transition"
                                >
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResultsPage;
