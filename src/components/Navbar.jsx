import { RiRobot2Line } from "react-icons/ri";
import { FaRegSmileBeam } from "react-icons/fa";
import { GiMeditation } from "react-icons/gi";
import { FiUser, FiMenu } from "react-icons/fi";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
        <nav
            className="fixed top-4 left-1/2 transform -translate-x-1/2 
            bg-white/90 backdrop-blur-md rounded-full shadow-md 
            px-6 py-2 flex items-center justify-center gap-8 w-auto transition-all z-50"
        >


      
      {/* Logo */}
      <div className="flex items-center text-black font-bold text-xl cursor-pointer hover:text-yellow-500 transition">
        <RiRobot2Line className="mr-2 text-2xl" />
        MindSprint
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
        <a href="#" className="hover:text-yellow-500 flex items-center space-x-1">
          <FaRegSmileBeam />
          <span>Wellness</span>
        </a>
        <a href="#" className="hover:text-yellow-500 flex items-center space-x-1">
          <GiMeditation />
          <span>Mindfulness</span>
        </a>
        <a href="#" className="hover:text-yellow-500 flex items-center space-x-1">
          <RiRobot2Line />
          <span>AI Chat</span>
        </a>
      </div>

      {/* Right Side */}
      <div className="hidden md:flex items-center space-x-4">
        <button className="text-sm px-3 py-1 rounded-full bg-black text-white hover:bg-yellow-500 hover:text-black transition">
          Get Started
        </button>
        <FiUser className="text-xl text-gray-700 cursor-pointer hover:text-yellow-500" />
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-2xl text-gray-700 hover:text-yellow-500"
      >
        <FiMenu />
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-14 left-0 w-full bg-white rounded-lg shadow-md py-4 flex flex-col items-center space-y-4 md:hidden">
          <a href="#" className="hover:text-yellow-500">Wellness</a>
          <a href="#" className="hover:text-yellow-500">Mindfulness</a>
          <a href="#" className="hover:text-yellow-500">AI Chat</a>
          <button className="text-sm px-4 py-2 rounded-full bg-black text-white hover:bg-yellow-500 hover:text-black transition">
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
