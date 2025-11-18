import { Link } from "react-router-dom";
import { ArrowRight, Users, Calendar, Trophy } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClubCard from "@/components/ClubCard";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { clubs } from "@/data/clubsData";
import { events } from "@/data/eventsData";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const { toast } = useToast();
  const featuredClubs = clubs.filter(club => club.featured).slice(0, 3);
  const upcomingEvents = events.slice(0, 3);

  const handleJoinClub = (clubId: number) => {
    const club = clubs.find(c => c.id === clubId);
    toast({
      title: "Join Request Sent!",
      description: `Your request to join ${club?.name} has been submitted.`,
    });
  };

  const handleRegisterEvent = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    toast({
      title: "Registration Successful!",
      description: `You've registered for ${event?.title}.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-in slide-in-from-bottom-4 duration-700">
              Discover Your Passion Through Clubs
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 animate-in slide-in-from-bottom-5 duration-700">
              Join vibrant communities, attend exciting events, and make lasting connections. 
              Your college experience starts here at ClubHub.
            </p>
            <div className="flex flex-wrap gap-4 animate-in slide-in-from-bottom-6 duration-700">
              <Link to="/clubs">
                <Button size="lg" variant="secondary" className="group">
                  Explore Clubs
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/events">
                <Button size="lg" variant="outline" className="bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground">
                  View Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary-foreground/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{clubs.length}+</h3>
              <p className="text-muted-foreground">Active Clubs</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
                <Calendar className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{events.length}+</h3>
              <p className="text-muted-foreground">Upcoming Events</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-2">1000+</h3>
              <p className="text-muted-foreground">Active Members</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Clubs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Clubs</h2>
              <p className="text-muted-foreground">Join our most popular communities</p>
            </div>
            <Link to="/clubs">
              <Button variant="outline" className="group">
                View All
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredClubs.map((club) => (
              <ClubCard key={club.id} club={club} onJoin={handleJoinClub} />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
              <p className="text-muted-foreground">Don't miss out on these exciting opportunities</p>
            </div>
            <Link to="/events">
              <Button variant="outline" className="group">
                View All
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} onRegister={handleRegisterEvent} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
