import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function Tickets() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      });
      const data = await res.json();
      setTickets(data || []);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setForm({ title: "", description: "" });
        fetchTickets(); // Refresh list
      } else {
        alert(data.error || data.message || "Ticket creation failed");
      }
    } catch (err) {
      alert("Error creating ticket");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🎫 <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Ticket Assistant
            </span>
          </h1>
          <p className="text-gray-300 text-lg">Intelligent Support Ticket Management System</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Create Ticket Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                <span className="text-white text-xl">📝</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Create New Ticket</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Ticket Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter a descriptive title for your issue..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Provide detailed information about your issue..."
                  rows="4"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  required
                ></textarea>
              </div>

              <button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "🚀 Submit Ticket"
                )}
              </button>
            </form>
          </div>

          {/* Tickets List Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-white text-xl">📋</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Your Tickets</h2>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="text-white text-sm font-medium">{tickets.length} tickets</span>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              {tickets.map((ticket) => (
                <Link
                  key={ticket._id}
                  className="block bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
                  to={`/tickets/${ticket._id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                      {ticket.title}
                    </h3>
                    <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg text-xs font-medium ml-2 whitespace-nowrap">
                      {ticket.status || 'Open'}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {ticket.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-blue-300 group-hover:text-blue-200 font-medium">
                      View Details →
                    </span>
                  </div>
                </Link>
              ))}

              {tickets.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">📝</span>
                  </div>
                  <p className="text-gray-300 text-lg mb-2">No tickets yet</p>
                  <p className="text-gray-400 text-sm">Create your first support ticket to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}