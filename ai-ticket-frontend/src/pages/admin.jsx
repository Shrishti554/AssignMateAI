import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/navbar";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ role: "", skills: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/get-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
        setFilteredUsers(data);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Error fetching users", err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEditClick = (user) => {
    setEditingUser(user.email);
    setFormData({
      role: user.role,
      skills: user.skills?.join(", "),
    });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/update-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: editingUser,
            role: formData.role,
            skills: formData.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.error(data.error || "Failed to update user");
        return;
      }

      setEditingUser(null);
      setFormData({ role: "", skills: "" });
      fetchUsers();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter((user) => user.email.toLowerCase().includes(query))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <span className="text-3xl">👑</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Admin Dashboard
          </h1>
          <p className="text-gray-300 text-lg">Manage users, roles, and system permissions</p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Search Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl mb-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-300">🔍</span>
              </div>
              <h2 className="text-xl font-bold text-white">Search Users</h2>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search users by email address..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Users Grid */}
          <div className="grid gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-lg font-bold">
                        {user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{user.email}</h3>
                      <div className="flex items-center mt-1">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === 'admin' ? 'bg-red-500/20 text-red-300' :
                          user.role === 'moderator' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {user.role === 'admin' ? '👑' : user.role === 'moderator' ? '🛡️' : '👤'} {user.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {editingUser !== user.email && (
                    <button
                      onClick={() => handleEditClick(user)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      ✏️ Edit
                    </button>
                  )}
                </div>

                {/* Skills Display */}
                <div className="mb-4">
                  <h4 className="text-gray-300 font-medium mb-2">Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skills && user.skills.length > 0 ? (
                      user.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg text-sm font-medium">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm italic">No skills assigned</span>
                    )}
                  </div>
                </div>

                {/* Edit Form */}
                {editingUser === user.email && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h4 className="text-white font-semibold mb-4">Edit User Details</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Role</label>
                        <select
                          value={formData.role}
                          onChange={(e) =>
                            setFormData({ ...formData, role: e.target.value })
                          }
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="user" className="bg-gray-800">👤 User</option>
                          <option value="moderator" className="bg-gray-800">🛡️ Moderator</option>
                          <option value="admin" className="bg-gray-800">👑 Admin</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Skills</label>
                        <input
                          type="text"
                          placeholder="Enter comma-separated skills (e.g., Python, JavaScript, AI)"
                          value={formData.skills}
                          onChange={(e) =>
                            setFormData({ ...formData, skills: e.target.value })
                          }
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleUpdate}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                        >
                          ✅ Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setEditingUser(null);
                            setFormData({ role: "", skills: "" });
                          }}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">👥</span>
                </div>
                <p className="text-gray-300 text-lg mb-2">No users found</p>
                <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}