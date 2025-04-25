
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-primary to-navy-light text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About North Trust Bank</h1>
            <p className="text-lg md:text-xl">
              A legacy of trust, innovation, and exceptional service.
            </p>
          </div>
        </div>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-8">
                Founded in Chicago, North Trust Bank has been serving our community with integrity 
                and excellence. We combine traditional banking values with modern innovation to 
                provide our customers with the best financial services possible.
              </p>
              
              <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-8">
                To empower our customers' financial success through personalized service, 
                innovative solutions, and unwavering commitment to excellence.
              </p>
              
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="text-gray-600">
                <p className="mb-2">Address: Chicago, Illinois, U.S.</p>
                <p className="mb-2">Phone: +1 (201)-241-3696</p>
                <p>Email: contact@northtrustbank.com</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
