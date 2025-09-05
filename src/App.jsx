import { useState } from "react";
import Navbar from "./components/Navbar";
import Spline from "@splinetool/react-spline";
import Chat from "./components/chat";

const App = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-20 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>

      {/* Spline Background */}
      <div className="absolute inset-0 -z-10">
        <Spline scene="https://prod.spline.design/tIFQ1NG8DRCjU1Wd/scene.splinecode" />
      </div>

      {/* Main Layout */}
      <div className="relative flex flex-col h-full">
        {/* Navbar at the top, centered */}
        <div className="flex justify-center mt-4">
          <div className="w-auto">
            <Navbar />
          </div>
        </div>

        {/* Foreground Content */}
        <div className="flex flex-1 items-center justify-center">
          <h1 className="text-4xl font-bold text-gray-200 drop-shadow-lg">
            Hello, User!
          </h1>
        </div>
      </div>

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
        <div className="fixed bottom-24 right-6 w-96 h-[500px] 
          shadow-2xl rounded-xl overflow-hidden border border-gray-700 
          bg-gradient-to-b from-white via-purple-100 to-pink-100 z-50">
          <Chat />
        </div>
      )}
    </div>
  );
};

export default App;
