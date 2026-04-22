import { Link } from "react-router-dom";
import { ArrowRight, Users, Calendar, Trophy, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClubCard from "@/components/ClubCard";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";

const Home = () => {
  const { clubs, events } = useAppContext();
  const featuredClubs = clubs.filter(club => club.featured).slice(0, 3);
  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/10">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-24 md:py-32 lg:py-48">
        <div className="container mx-auto px-4">
          {/* Decorative background elements */}
          <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 right-10 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          
          <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
            <div className="smooth-in">
              <div className="inline-flex items-center gap-2 bg-secondary/80 backdrop-blur-sm border border-border/50 text-foreground px-5 py-2.5 rounded-full mb-8 shadow-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold tracking-wide uppercase">Welcome to your campus community</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 smooth-in-delay-1 leading-[1.1] text-foreground tracking-tight">
              Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Passion</span>
              <br /> Through Clubs
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-muted-foreground smooth-in-delay-2 max-w-3xl leading-relaxed">
              Join vibrant communities, attend exciting events, and make lasting connections. 
              Your unforgettable college experience starts right here.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 smooth-in-delay-3">
              <Link to="/clubs" className="group">
                <Button size="lg" className="group h-14 px-8 text-lg font-semibold shadow-lg shadow-primary/25">
                  Explore Clubs
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/events" className="group">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold border-border hover:bg-secondary">
                  View Events
                  <Calendar className="ml-2 w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            <div className="group p-8 rounded-2xl card-glass hover:shadow-2xl transition-smooth">
              <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-4xl md:text-5xl font-bold mb-3 text-foreground">{clubs.length}+</h3>
                <p className="text-muted-foreground text-lg">Active Clubs</p>
              </div>
            </div>
            
            <div className="group p-8 rounded-2xl card-glass hover:shadow-2xl transition-smooth">
              <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                  <Calendar className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-4xl md:text-5xl font-bold mb-3 text-foreground">{events.length}+</h3>
                <p className="text-muted-foreground text-lg">Upcoming Events</p>
              </div>
            </div>
            
            <div className="group p-8 rounded-2xl card-glass hover:shadow-2xl transition-smooth">
              <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-4xl md:text-5xl font-bold mb-3 text-foreground">1000+</h3>
                <p className="text-muted-foreground text-lg">Active Members</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Clubs */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-primary text-sm font-semibold mb-2 uppercase tracking-wider">Featured</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">Popular Clubs</h2>
              <p className="text-muted-foreground text-lg">Join our most vibrant communities</p>
            </div>
            <Link to="/clubs" className="hidden md:block group">
              <Button variant="outline" className="group">
                View All
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredClubs.map((club, index) => (
              <div key={club.id} className={`smooth-in-delay-${Math.min(index + 1, 3)}`}>
                <ClubCard club={club} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-accent text-sm font-semibold mb-2 uppercase tracking-wider">Calendar</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">Upcoming Events</h2>
              <p className="text-muted-foreground text-lg">Don't miss out on amazing experiences</p>
            </div>
            <Link to="/events" className="hidden md:block group">
              <Button variant="outline" className="group">
                View All
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {upcomingEvents.map((event, index) => (
              <div key={event.id} className={`smooth-in-delay-${Math.min(index + 1, 3)}`}>
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
