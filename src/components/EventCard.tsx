import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Event } from "@/data/eventsData";

interface EventCardProps {
  event: Event;
  onRegister?: (eventId: number) => void;
}

const EventCard = ({ event, onRegister }: EventCardProps) => {
  const registrationProgress = (event.currentParticipants / event.maxParticipants) * 100;
  const spotsLeft = event.maxParticipants - event.currentParticipants;

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="relative overflow-hidden h-48">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge className="bg-accent text-accent-foreground">{event.category}</Badge>
          {event.registrationOpen && (
            <Badge className="bg-primary text-primary-foreground">Open</Badge>
          )}
        </div>
      </div>
      
      <CardHeader>
        <CardTitle className="text-xl">{event.title}</CardTitle>
        <CardDescription className="text-sm text-primary font-medium">
          {event.club}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{event.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{new Date(event.date).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{event.venue}</span>
          </div>
        </div>

        {event.registrationOpen && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {event.currentParticipants}/{event.maxParticipants}
              </span>
              <span className="text-muted-foreground">{spotsLeft} spots left</span>
            </div>
            <Progress value={registrationProgress} className="h-2" />
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {event.registrationOpen ? (
          <Button 
            onClick={() => onRegister?.(event.id)}
            className="w-full"
            disabled={spotsLeft === 0}
          >
            {spotsLeft === 0 ? "Event Full" : "Register Now"}
          </Button>
        ) : (
          <Button variant="secondary" disabled className="w-full">
            Registration Closed
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
