import { useState, useEffect } from 'react';
import { Search, Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DoctorDashboard = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'doctor') {
            navigate('/login');
            return;
        }
    }, [user, navigate]);

    useEffect(() => {
        fetch('http://localhost:5000/api/users')
            .then(res => res.json())
            .then(data => {
                // Filter for patients only (role 'user')
                const onlyPatients = data.filter(u => u.role === 'user');
                setPatients(onlyPatients);
            })
            .catch(err => console.error("Error fetching patients:", err));
    }, []);

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8">Doctor Dashboard</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" /> My Patients
                    </h2>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 w-full sm:w-64"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {filteredPatients.map(patient => (
                        <div
                            key={patient._id}
                            onClick={() => navigate(`/doctor/patient/${patient._id}`)}
                            className="p-4 hover:bg-gray-50 flex items-center justify-between cursor-pointer transition group"
                        >
                            <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">{patient.name}</h3>
                                <p className="text-sm text-gray-500">{patient.email}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition" />
                        </div>
                    ))}
                    {filteredPatients.length === 0 && (
                        <div className="p-8 text-center text-gray-400">
                            No patients found matching your search.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
