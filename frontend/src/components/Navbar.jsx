import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope, User, ShieldCheck, LogOut, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
                    <Stethoscope className="w-8 h-8" />
                    <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                        SmartCare
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/" className="text-gray-600 hover:text-primary transition">Home</Link>
                    <Link to="/admin" className="text-gray-600 hover:text-primary transition">Admin</Link>

                    {user ? (
                        <div className="flex items-center gap-4">
                            {user.role === 'user' && (
                                <Link to="/my-bookings" className="text-gray-600 hover:text-primary transition flex items-center gap-1">
                                    <Calendar className="w-4 h-4" /> My Bookings
                                </Link>
                            )}
                            {user.role === 'doctor' && (
                                <Link to="/doctor" className="text-gray-600 hover:text-primary transition flex items-center gap-1">
                                    <Stethoscope className="w-4 h-4" /> Dashboard
                                </Link>
                            )}
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                <span className="text-sm font-medium text-gray-900">{user.name}</span>
                                {user.role === 'admin' && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">Admin</span>}
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-400 hover:text-red-600 transition"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                to="/login"
                                className="px-4 py-2 text-gray-700 hover:text-primary font-medium transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-primary text-white px-5 py-2 rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 font-medium"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
