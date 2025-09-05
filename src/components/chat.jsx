const Chat = () => {   
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <span className="font-semibold">MindSprint Bot</span>
        <span className="text-xs opacity-80">Active Now</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/70">
        <div className="flex justify-start">
          <div className="max-w-[70%] px-3 py-2 rounded-lg bg-gray-100 text-gray-900">
            Hey Bill, nice to meet you!
          </div>
        </div>
        <div className="flex justify-end">
          <div className="max-w-[70%] px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-black text-white">
            Nice to meet you too, How can I help you?
          </div>
        </div>
        <div className="flex justify-start">
          <div className="max-w-[70%] px-3 py-2 rounded-lg bg-gray-100 text-gray-900">
            I am interested to know more about your prices and services.
          </div>
        </div>
        <div className="flex justify-end">
          <div className="max-w-[70%] px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            Sure, check here 👉 https://ayroui.com/pricing
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="flex items-center p-2 border-t bg-white">
        <input
          type="text"
          placeholder="Type something..."
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button className="ml-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
