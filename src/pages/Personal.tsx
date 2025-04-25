
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Personal = () => {
  const services = [
    {
      title: "Checking Accounts",
      description: "Manage your daily finances with our flexible checking account options.",
      buttonText: "Open Account",
    },
    {
      title: "Savings Accounts",
      description: "Build your savings with competitive interest rates.",
      buttonText: "Start Saving",
    },
    {
      title: "Credit Cards",
      description: "Enjoy rewards and benefits with our range of credit cards.",
      buttonText: "Apply Now",
    },
    {
      title: "Mortgages",
      description: "Find the right mortgage solution for your home buying needs.",
      buttonText: "Learn More",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-primary to-navy-light text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Personal Banking</h1>
            <p className="text-lg md:text-xl">
              Banking solutions designed for your personal financial journey.
            </p>
          </div>
        </div>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service) => (
                <Card key={service.title} className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Button className="bg-primary hover:bg-primary-hover">
                    {service.buttonText}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Personal;
