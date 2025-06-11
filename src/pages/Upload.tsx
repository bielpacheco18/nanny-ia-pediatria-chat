
import Header from "@/components/Header";
import UploadSection from "@/components/UploadSection";

const Upload = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="py-6 md:py-8">
        <UploadSection />
      </div>
    </div>
  );
};

export default Upload;
