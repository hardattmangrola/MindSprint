import Navbar from "./components/Navbar";
import Spline from "@splinetool/react-spline";

const App = () => {
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

        {/* Foreground Content (fills remaining space, centered) */}
        <div className="flex flex-1 items-center justify-center">
          <h1 className="text-4xl font-bold text-gray-200 drop-shadow-lg">
            Hello, User!
          </h1>
        </div>
      </div>
    </div>
  );
};

export default App;
