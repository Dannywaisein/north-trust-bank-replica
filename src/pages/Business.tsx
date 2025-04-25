
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Business = () => {
  const solutions = [
    {
      title: "Business Accounts",
      description: "Tailored checking and savings accounts for your business needs.",
      buttonText: "Open Account",
    },
    {
      title: "Business Lending",
      description: "Flexible financing solutions to help your business grow.",
      buttonText: "Apply Now",
    },
    {
      title: "Merchant Services",
      description: "Accept payments and manage transactions efficiently.",
      buttonText: "Get Started",
    },
    {
      title: "Treasury Management",
      description: "Optimize your cash flow and manage liquidity effectively.",
      buttonText: "Learn More",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-primary to-navy-light text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Business Solutions</h1>
            <p className="text-lg md:text-xl">
              Comprehensive banking solutions to help your business thrive.
            </p>
          </div>
        </div>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              {solutions.map((solution) => (
                <Card key={solution.title} className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{solution.title}</h3>
                  <p className="text-gray-600 mb-4">{solution.description}</p>
                  <Button className="bg-primary hover:bg-primary-hover">
                    {solution.buttonText}
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

export default Business;
