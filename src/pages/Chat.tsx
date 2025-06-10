
import Header from "@/components/Header";
import ChatInterface from "@/components/ChatInterface";

const Chat = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 h-[calc(100vh-120px)]">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Chat;
