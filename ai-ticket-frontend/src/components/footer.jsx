export default function Footer() {
  return (
    <footer className="bg-white/5 backdrop-blur-lg border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">🎫</span>
              </div>
              <span className="text-white font-bold text-lg">AI Ticket Assistant</span>
            </div>
            <p className="text-gray-400 text-sm">
              Intelligent support ticket management powered by AI
            </p>
          </div>

          {/* Features */}
          <div className="text-center">
            <h3 className="text-white font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>🤖 AI-Powered Ticket Analysis</li>
              <li>🎯 Smart Assignment System</li>
              <li>📊 Real-time Status Tracking</li>
              <li>👥 Role-based Access Control</li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="text-center md:text-right">
            <h3 className="text-white font-semibold mb-4">Built With</h3>
            <div className="flex flex-wrap justify-center md:justify-end gap-2">
              <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">React</span>
              <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">Node.js</span>
              <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">MongoDB</span>
              <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs">AI/ML</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 AI Ticket Assistant. Built for educational purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
