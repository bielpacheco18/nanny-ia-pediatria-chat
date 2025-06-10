
import Header from "@/components/Header";
import UploadSection from "@/components/UploadSection";

const Upload = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <UploadSection />
      </div>
    </div>
  );
};

export default Upload;
