
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-primary to-navy-light text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to North Trust Bank
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Experience banking excellence with personalized solutions for all your
            financial needs.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-accent hover:bg-accent-hover text-primary font-semibold">
              Open an Account
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
