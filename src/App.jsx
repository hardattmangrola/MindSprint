import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="relative h-screen w-screen">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>

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
          <h1 className="text-4xl font-bold text-gray-200">
            Hello, User!
          </h1>
        </div>
      </div>
    </div>
  );
};

export default App;
