
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const QuickLinks = () => {
  const links = [
    {
      title: "Personal Banking",
      description: "Checking, savings, and credit cards for your daily needs",
      buttonText: "Learn More",
    },
    {
      title: "Business Solutions",
      description: "Comprehensive banking solutions for your business",
      buttonText: "Explore Options",
    },
    {
      title: "Wealth Management",
      description: "Expert guidance for your investment portfolio",
      buttonText: "Get Started",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-primary mb-12 text-center">
          Banking Made Simple
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {links.map((link) => (
            <Card key={link.title} className="p-6">
              <h3 className="text-xl font-semibold mb-3">{link.title}</h3>
              <p className="text-gray-600 mb-4">{link.description}</p>
              <Button className="bg-primary hover:bg-primary-hover w-full">
                {link.buttonText}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickLinks;
