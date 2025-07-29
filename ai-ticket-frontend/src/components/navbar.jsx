import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🎫</span>
            </div>
            <span className="text-white font-bold text-lg">AI Ticket Assistant</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              📋 Tickets
            </Link>
            
            {user.role === 'admin' && (
              <Link 
                to="/admin" 
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                👑 Admin
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <p className="text-white text-sm font-medium">{user.email}</p>
                <p className="text-gray-400 text-xs">
                  {user.role === 'admin' ? '👑 Admin' : user.role === 'moderator' ? '🛡️ Moderator' : '👤 User'}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-red-500/30"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-white transition-colors font-medium text-sm"
            >
              📋 Tickets
            </Link>
            
            {user.role === 'admin' && (
              <Link 
                to="/admin" 
                className="text-gray-300 hover:text-white transition-colors font-medium text-sm"
              >
                👑 Admin
              </Link>
            )}
            
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-white text-sm">{user.email}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
