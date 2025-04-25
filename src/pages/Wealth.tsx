
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Wealth = () => {
  const services = [
    {
      title: "Investment Management",
      description: "Professional portfolio management tailored to your goals.",
      buttonText: "Start Investing",
    },
    {
      title: "Retirement Planning",
      description: "Secure your future with our retirement planning expertise.",
      buttonText: "Plan Now",
    },
    {
      title: "Estate Planning",
      description: "Preserve and transfer your wealth effectively.",
      buttonText: "Learn More",
    },
    {
      title: "Private Banking",
      description: "Exclusive banking services for high-net-worth individuals.",
      buttonText: "Contact Us",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-primary to-navy-light text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Wealth Management</h1>
            <p className="text-lg md:text-xl">
              Expert guidance to help you grow and preserve your wealth.
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

export default Wealth;
