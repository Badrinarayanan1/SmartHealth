import { useState, useEffect } from 'react';
import { Plus, Save, Clock, Trash, Users, Stethoscope, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [newDoc, setNewDoc] = useState({ name: '', specialization: '', bio: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [slotTimes, setSlotTimes] = useState({}); // { [doctorId]: "2023-10-27T10:00" }

    const [users, setUsers] = useState([]);
    const [labs, setLabs] = useState([]);
    const [newLab, setNewLab] = useState({ name: '', price: '', description: '' });
    const [activeTab, setActiveTab] = useState('doctors'); // 'doctors' | 'patients' | 'labs'
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        refreshDoctors();
        refreshUsers();
    }, [user, navigate]);

    const refreshDoctors = () => {
        fetch('http://localhost:5000/api/doctors')
            .then(res => res.json())
            .then(data => setDoctors(data));
    };

    const refreshUsers = () => {
        fetch('http://localhost:5000/api/users')
            .then(res => res.json())
            .then(data => setUsers(data));
    };

    const refreshLabs = () => {
        fetch('http://localhost:5000/api/labs')
            .then(res => res.json())
            .then(data => setLabs(data));
    };

    useEffect(() => {
        if (activeTab === 'labs') refreshLabs();
    }, [activeTab]);



    const handleCreateDoctor = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/doctors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newDoc, slots: [] })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create doctor");

            setNewDoc({ name: '', specialization: '', bio: '', email: '', password: '' });
            refreshDoctors();
            alert("Doctor created successfully!");
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateLab = async (e) => {
        e.preventDefault();
        setLoading(true);
        await fetch('http://localhost:5000/api/labs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newLab)
        });
        setNewLab({ name: '', price: '', description: '' });
        setLoading(false);
        refreshLabs();
    };

    const handleSlotTimeChange = (doctorId, value) => {
        setSlotTimes(prev => ({
            ...prev,
            [doctorId]: value
        }));
    };

    const addSlot = async (doctorId) => {
        const timeStr = slotTimes[doctorId];
        if (!timeStr) {
            alert("Please select a time first.");
            return;
        }

        const date = new Date(timeStr);
        // Validate date (optional, but good UX)
        if (isNaN(date.getTime())) {
            alert("Invalid date selected.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/doctors/${doctorId}/slots`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ time: date.toISOString() })
            });

            if (!res.ok) throw new Error("Failed to add slot");

            // Clear input after success
            setSlotTimes(prev => ({ ...prev, [doctorId]: '' }));
            refreshDoctors();
        } catch (error) {
            console.error(error);
            alert("Error adding slot");
        }
    };

    const handleDeleteSlot = async (doctorId, slotId) => {
        if (!confirm("Are you sure you want to delete this slot?")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/doctors/${doctorId}/slots/${slotId}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error("Failed to delete slot");
            refreshDoctors();
        } catch (error) {
            console.error(error);
            alert("Error deleting slot");
        }
    };

    const handleDeleteDoctor = async (doctorId) => {
        if (!confirm("Are you sure you want to delete this doctor? This action cannot be undone.")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/doctors/${doctorId}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error("Failed to delete doctor");
            refreshDoctors();
        } catch (error) {
            console.error(error);
            alert("Error deleting doctor");
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div className="flex bg-white p-1 rounded-lg border border-gray-200">
                    <button
                        onClick={() => setActiveTab('doctors')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'doctors' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        <Stethoscope className="w-4 h-4" /> Doctors
                    </button>
                    <button
                        onClick={() => setActiveTab('patients')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'patients' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        <Users className="w-4 h-4" /> Patients
                    </button>
                    <button
                        onClick={() => setActiveTab('labs')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'labs' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        <Activity className="w-4 h-4" /> Labs
                    </button>
                </div>
            </div>

            {activeTab === 'doctors' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ... Doctor Create Form & List ... */}

                    {/* Create Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-blue-600" /> Add New Specalist
                            </h2>
                            <form onSubmit={handleCreateDoctor} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                                        value={newDoc.name}
                                        onChange={e => setNewDoc({ ...newDoc, name: e.target.value })}
                                        placeholder="Dr. Start"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                                        value={newDoc.email}
                                        onChange={e => setNewDoc({ ...newDoc, email: e.target.value })}
                                        placeholder="doctor@example.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        type="password"
                                        className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                                        value={newDoc.password}
                                        onChange={e => setNewDoc({ ...newDoc, password: e.target.value })}
                                        placeholder="******"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <select
                                        className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                                        value={newDoc.specialization}
                                        onChange={e => setNewDoc({ ...newDoc, specialization: e.target.value })}
                                        required
                                    >
                                        <option value="">Select...</option>
                                        <option value="Cardiology">Cardiology</option>
                                        <option value="Orthopedics">Orthopedics</option>
                                        <option value="Neurology">Neurology</option>
                                        <option value="General Medicine">General Medicine</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                    <textarea
                                        className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                                        value={newDoc.bio}
                                        onChange={e => setNewDoc({ ...newDoc, bio: e.target.value })}
                                        placeholder="Short description..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                                >
                                    {loading ? 'Creating...' : 'Create Doctor'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* List */}
                    <div className="lg:col-span-2 space-y-4">
                        {doctors.map(doc => (
                            <div key={doc._id} className="bg-white p-5 rounded-xl border border-gray-100 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-gray-900">{doc.name}</h3>
                                            <span className="text-sm px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">{doc.specialization}</span>
                                            <button
                                                onClick={() => handleDeleteDoctor(doc._id)}
                                                className="ml-2 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                                                title="Delete Doctor"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {doc.slots.map((slot, i) => (
                                                <div key={i} className={`flex items-center gap-1 text-xs px-2 py-1 rounded border ${slot.isBooked ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                                    <span>
                                                        {new Date(slot.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        {new Date(slot.time).toLocaleDateString() !== new Date().toLocaleDateString() &&
                                                            ` (${new Date(slot.time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})`}
                                                    </span>
                                                    <button
                                                        onClick={() => handleDeleteSlot(doc._id, slot._id)}
                                                        className="ml-1 p-0.5 hover:bg-red-100 rounded text-red-500 hover:text-red-700 transition"
                                                        title="Delete Slot"
                                                    >
                                                        <Trash className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            {doc.slots.length === 0 && <span className="text-xs text-gray-400 italic">No slots added</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                                    <input
                                        type="datetime-local"
                                        className="p-1.5 border border-gray-200 rounded text-sm outline-none focus:border-blue-500"
                                        value={slotTimes[doc._id] || ''}
                                        onChange={(e) => handleSlotTimeChange(doc._id, e.target.value)}
                                    />
                                    <button
                                        onClick={() => addSlot(doc._id)}
                                        className="text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-1 transition border border-gray-200"
                                    >
                                        <Plus className="w-3 h-3" /> Add Slot
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : activeTab === 'labs' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-blue-600" /> Add Lab Test
                            </h2>
                            <form onSubmit={handleCreateLab} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
                                    <input className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500" value={newLab.name} onChange={e => setNewLab({ ...newLab, name: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                    <input type="number" className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500" value={newLab.price} onChange={e => setNewLab({ ...newLab, price: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500" value={newLab.description} onChange={e => setNewLab({ ...newLab, description: e.target.value })} />
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">{loading ? 'Creating...' : 'Add Test'}</button>
                            </form>
                        </div>
                    </div>
                    <div className="lg:col-span-2 space-y-4">
                        {labs.map(lab => (
                            <div key={lab._id} className="bg-white p-5 rounded-xl border border-gray-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-gray-900">{lab.name}</h3>
                                    <p className="text-sm text-gray-500">{lab.description}</p>
                                    <span className="font-semibold text-blue-600">${lab.price}</span>
                                </div>
                                <div className="text-xs text-gray-400">ID: {lab._id}</div>
                            </div>
                        ))}
                        {labs.length === 0 && <div className="text-center text-gray-500 py-8">No labs added yet.</div>}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold">Registered Patients</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100/50">
                                {users.filter(u => u.role === 'user').map(u => (
                                    <tr key={u._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">Patient</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">Active</td>
                                    </tr>
                                ))}
                                {users.filter(u => u.role === 'user').length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-400 italic">No patients found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default AdminDashboard;
