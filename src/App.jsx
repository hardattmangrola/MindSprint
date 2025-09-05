import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="relative h-screen w-screen bg-white">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 
        bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] 
        [background-size:16px_16px] 
        [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
      />

      {/* Main Layout */}
      <div className="relative flex flex-col h-full">
        {/* Navbar at the top, centered */}
        <div className="flex justify-center mt-4">
          <div className="w-auto">
                <Navbar />
          </div>
        </div>

        {/* Foreground Content (fills remaining space, centered) */}
        <div className="flex flex-1 items-center justify-center">
          <h1 className="text-4xl font-bold text-gray-800">
            Hello, User !
          </h1>
        </div>
      </div>
    </div>
  );
};

export default App;
