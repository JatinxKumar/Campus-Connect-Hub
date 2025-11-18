import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { events } from "@/data/eventsData";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter } from "lucide-react";

const Events = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showOnlyOpen, setShowOnlyOpen] = useState(false);

  const categories = ["All", ...new Set(events.map(event => event.category))];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.club.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    const matchesOpen = !showOnlyOpen || event.registrationOpen;
    return matchesSearch && matchesCategory && matchesOpen;
  });

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
      
      {/* Header */}
      <section className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Events Calendar</h1>
          <p className="text-lg text-accent-foreground/90 max-w-2xl">
            Stay updated with the latest events, workshops, competitions, and performances happening across campus.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-secondary/20 sticky top-16 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant={showOnlyOpen ? "default" : "outline"}
                onClick={() => setShowOnlyOpen(!showOnlyOpen)}
                className="md:w-auto"
              >
                <Filter className="w-4 h-4 mr-2" />
                Open Registration Only
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 flex-1">
        <div className="container mx-auto px-4">
          {filteredEvents.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-6">
                Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} onRegister={handleRegisterEvent} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => { 
                setSearchTerm(""); 
                setSelectedCategory("All");
                setShowOnlyOpen(false);
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;
