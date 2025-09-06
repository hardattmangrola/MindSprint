import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Spline from "@splinetool/react-spline";
import Chat from "./components/chat";
import Wellness from "./components/wellness";
import Mindfulness from "./components/mindfullness";
import Login from "./Login";


const App = () => {
  const [showChat, setShowChat] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleCloseChat = () => {
    setShowChat(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Handle successful login
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setCurrentPage('home');
  };


  // Show loading screen
  if (loading) {
    return (
      <div className="relative h-screen w-screen overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 -z-20 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-20 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>

      {/* Spline Background */}
      <div className="absolute inset-0 -z-10">
        <Spline scene="https://prod.spline.design/tIFQ1NG8DRCjU1Wd/scene.splinecode" />
      </div>

      {/* YouTube-style Navbar Container */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/70 to-transparent py-3">
        <div className="flex justify-center items-center w-full px-4">
          <div className="w-full max-w-3xl">
            <Navbar 
              onPageChange={handlePageChange} 
              currentPage={currentPage} 
              onChatClick={() => setShowChat(!showChat)}
              user={user}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>

      {/* Page Content */}
      {currentPage === 'home' && (
        <div className="flex flex-1 items-center justify-center h-full pt-16">
          <h1 className="text-4xl font-bold text-gray-200 drop-shadow-lg">
            Hello, {user?.name || 'User'}!
          </h1>
        </div>
      )}
      
      {currentPage === 'wellness' && <Wellness />}
      {currentPage === 'mindfulness' && <Mindfulness />}

      {/* Floating Chat Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-500
                    text-white shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition z-50"
      >
        💬
      </button>

      {/* Chat Widget */}
      {showChat && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] z-50">
          <Chat onClose={handleCloseChat} />
        </div>
      )}
    </div>
  );
};

export default App;