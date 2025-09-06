import { useState } from "react";
import Navbar from "./components/Navbar";
import Spline from "@splinetool/react-spline";
import Chat from "./components/chat";
import Wellness from "./components/wellness";
import Mindfulness from "./components/mindfullness";

const App = () => {
  const [showChat, setShowChat] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  const handleCloseChat = () => {
    setShowChat(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
            <Navbar onPageChange={handlePageChange} currentPage={currentPage} />
          </div>
        </div>
      </div>

      {/* Page Content */}
      {currentPage === 'home' && (
        <div className="flex flex-1 items-center justify-center h-full pt-16">
          <h1 className="text-4xl font-bold text-gray-200 drop-shadow-lg">
            Hello, User!
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