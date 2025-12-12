import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, Sparkles } from 'lucide-react';

const HomePage = () => {
    const [symptoms, setSymptoms] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleTriage = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Call Backend API
            const res = await fetch('http://localhost:5000/api/triage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symptoms })
            });
            const data = await res.json();

            // Navigate to results with state
            navigate('/results', { state: { triageResult: data, symptoms } });
        } catch (error) {
            alert("Triage service unavailable. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-16 text-center">
            <div className="mb-8 flex justify-center">
                <div className="bg-blue-50 p-3 rounded-2xl inline-flex items-center gap-2 text-blue-700 text-sm font-medium border border-blue-100">
                    <Sparkles className="w-4 h-4" />
                    AI-Powered Patient Routing
                </div>
            </div>

            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                Not sure where to go? <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                    Let AI guide your care.
                </span>
            </h1>

            <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
                Describe your symptoms, and our intelligent system will instantly match you with the right specialist and check real-time availability.
            </p>

            <form onSubmit={handleTriage} className="max-w-2xl mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-400 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-white rounded-xl shadow-2xl p-2 flex items-center border border-gray-100">
                    <Activity className="w-6 h-6 text-gray-400 ml-4" />
                    <input
                        type="text"
                        placeholder="e.g. I have a severe headache and dizziness..."
                        className="w-full p-4 text-lg outline-none text-gray-700 placeholder-gray-400"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 whitespace-nowrap disabled:opacity-70"
                    >
                        {loading ? 'Analyzing...' : 'Find Care'}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                </div>
            </form>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {[
                    { title: "Smart Triage", desc: "Instant analysis of symptoms to find the right department." },
                    { title: "Real-time Booking", desc: "Live view of doctor slots with atomic reservation." },
                    { title: "One-Click Care", desc: "Book doctor, tests, and beds in a single seamless flow." }
                ].map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold mb-4">
                            {i + 1}
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
