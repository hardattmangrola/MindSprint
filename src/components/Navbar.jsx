import { RiRobot2Line } from "react-icons/ri";
import { FaRegSmileBeam } from "react-icons/fa";
import { GiMeditation } from "react-icons/gi";
import { FiUser, FiMenu } from "react-icons/fi";
import { useState } from "react";

const Navbar = ({ onChatClick, onPageChange, currentPage, user, onLogout }) => {  // ✅ Accept props
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="fixed top-4 left-1/2 transform -translate-x-1/2 
      bg-white/90 backdrop-blur-md rounded-full shadow-md 
      px-6 py-2 flex items-center justify-center gap-8 w-auto transition-all z-50"
    >
      {/* Logo */}
      <div className="flex items-center text-black font-bold text-xl cursor-pointer hover:text-[#6363ee] transition">
        <RiRobot2Line className="mr-2 text-2xl" />
        MindSprint
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
        <button 
          onClick={() => onPageChange('wellness')}
          className={`hover:text-[#6363ee] flex items-center space-x-1 ${currentPage === 'wellness' ? 'text-[#6363ee]' : ''}`}
        >
          <FaRegSmileBeam />
          <span>Wellness</span>
        </button>
        <button 
          onClick={() => onPageChange('mindfulness')}
          className={`hover:text-[#6363ee] flex items-center space-x-1 ${currentPage === 'mindfulness' ? 'text-[#6363ee]' : ''}`}
        >
          <GiMeditation />
          <span>Mindfulness</span>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            onChatClick();  // ✅ Works now
          }}
          className="hover:text-[#6363ee] flex items-center space-x-1"
        >
          <RiRobot2Line />
          <span>AI Chat</span>
        </button>
      </div>

      {/* Right Side */}
      <div className="hidden md:flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-700">
              Welcome, <span className="font-semibold">{user.name}</span>
            </div>
            <button 
              onClick={onLogout}
              className="text-sm px-3 py-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}
        <FiUser className="text-xl text-gray-700 cursor-pointer hover:text-[#6363ee]" />
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-2xl text-gray-700 hover:text-[#6363ee]"
      >
        <FiMenu />
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-14 left-0 w-full bg-white rounded-lg shadow-md py-4 flex flex-col items-center space-y-4 md:hidden">
          <button onClick={() => onPageChange('wellness')} className="hover:text-[#6363ee]">Wellness</button>
          <button onClick={() => onPageChange('mindfulness')} className="hover:text-[#6363ee]">Mindfulness</button>
          <button onClick={onChatClick} className="hover:text-[#6363ee]">AI Chat</button>
          {user && (
            <>
              <div className="text-sm text-gray-700 border-t pt-2">
                Welcome, <span className="font-semibold">{user.name}</span>
              </div>
              <button 
                onClick={onLogout}
                className="text-sm px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
