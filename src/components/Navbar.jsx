import { RiRobot2Line } from "react-icons/ri";
import { FaRegSmileBeam } from "react-icons/fa";
import { GiMeditation } from "react-icons/gi";
import { FiUser, FiMenu } from "react-icons/fi";
import { useState } from "react";

const Navbar = ({ onChatClick, onPageChange, currentPage, user, onLogout }) => {  // ✅ Accept props
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="bg-white/90 backdrop-blur-md rounded-full shadow-md 
      px-6 py-2 flex items-center justify-center gap-6 w-auto transition-all"
    >
      {/* Logo */}
      <div className="flex items-center text-black font-bold text-xl cursor-pointer hover:text-[#6363ee] transition">
        <RiRobot2Line className="mr-2 text-2xl" />
        MindSprint
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center space-x-4 text-gray-700 font-medium">
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
            onChatClick();
          }}
          className="hover:text-[#6363ee] flex items-center space-x-1"
        >
          <RiRobot2Line />
          <span>AI Chat</span>
        </button>
      </div>

      {/* Right Side */}
      <div className="hidden md:flex items-center space-x-3">
        {user && (
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-700 whitespace-nowrap">
              Welcome, <span className="font-semibold">{user.name}</span>
            </div>
            <button 
              onClick={onLogout}
              className="text-sm px-3 py-1 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition"
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
        <div className="absolute top-12 left-0 w-full bg-white rounded-lg shadow-md py-3 flex flex-col items-center space-y-3 md:hidden">
          <button onClick={() => onPageChange('wellness')} className="hover:text-[#6363ee] text-sm">Wellness</button>
          <button onClick={() => onPageChange('mindfulness')} className="hover:text-[#6363ee] text-sm">Mindfulness</button>
          <button onClick={onChatClick} className="hover:text-[#6363ee] text-sm">AI Chat</button>
          {user && (
            <>
              <div className="text-sm text-gray-700 border-t pt-2 whitespace-nowrap">
                Welcome, <span className="font-semibold">{user.name}</span>
              </div>
              <button 
                onClick={onLogout}
                className="text-sm px-4 py-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition"
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
