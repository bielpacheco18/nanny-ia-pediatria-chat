
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";

const Chat = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 overflow-hidden">
        <div className="h-full">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Chat;
