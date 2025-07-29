import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/navbar";

export default function TicketDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/tickets/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setTicket(data.ticket);
        } else {
          alert(data.message || "Failed to fetch ticket");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading ticket details...</p>
        </div>
      </div>
    );

  if (!ticket)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <p className="text-white text-xl mb-2">Ticket not found</p>
          <p className="text-gray-400">The ticket you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'in_progress': case 'in progress': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'closed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            🎫 Ticket Details
          </h1>
          <p className="text-gray-300">Comprehensive ticket information and status</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Ticket Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 border-b border-white/10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 break-words">
                    {ticket.title}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(ticket.status)}`}>
                      📊 {ticket.status || 'Open'}
                    </span>
                    {ticket.priority && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(ticket.priority)}`}>
                        🔥 {ticket.priority}
                      </span>
                    )}
                  </div>
                </div>

                {ticket.createdAt && (
                  <div className="text-right">
                    <p className="text-gray-300 text-sm">Created</p>
                    <p className="text-white font-medium">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(ticket.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                    📝
                  </span>
                  Description
                </h3>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {ticket.description}
                  </p>
                </div>
              </div>

              {/* Metadata Grid */}
              {(ticket.status || ticket.assignedTo || ticket.relatedSkills?.length > 0 || ticket.helpfulNotes) && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Assignment Info */}
                  {ticket.assignedTo && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <span className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mr-2">
                          👤
                        </span>
                        Assignment
                      </h4>
                      <div className="space-y-2">
                        <p className="text-gray-300">
                          <span className="text-gray-400">Assigned to:</span>
                          <span className="ml-2 font-medium text-white">
                            {ticket.assignedTo?.email}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {ticket.relatedSkills?.length > 0 && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <span className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center mr-2">
                          🛠️
                        </span>
                        Related Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {ticket.relatedSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg text-sm font-medium border border-purple-500/30"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Helpful Notes */}
              {ticket.helpfulNotes && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center mr-2">
                      💡
                    </span>
                    AI Analysis & Helpful Notes
                  </h4>
                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown className="text-gray-300">
                        {ticket.helpfulNotes}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => window.history.back()}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 border border-white/20"
            >
              ← Back to Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}