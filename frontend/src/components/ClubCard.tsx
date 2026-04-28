import { Users, UserCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Club } from "@/data/clubsData";

interface ClubCardProps {
  club: Club;
}

const ClubCard = ({ club }: ClubCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden group hover-lift h-full flex flex-col">
      <div className="relative overflow-hidden h-52 bg-gradient-to-br from-primary/20 to-accent/20">
        <img
          src={club.image}
          alt={club.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-primary text-primary-foreground font-semibold shadow-lg">{club.category}</Badge>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-xl md:text-2xl group-hover:text-primary transition-colors">{club.name}</CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-2">{club.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-grow">
        <div className="flex items-center gap-3 text-sm bg-secondary/30 rounded-lg p-3">
          <div className="inline-flex items-center justify-center w-8 h-8 bg-primary/20 rounded-full">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <span className="text-foreground font-medium">{club.members} Members</span>
        </div>
        <div className="flex items-center gap-3 text-sm bg-secondary/30 rounded-lg p-3">
          <div className="inline-flex items-center justify-center w-8 h-8 bg-accent/20 rounded-full">
            <UserCircle className="w-4 h-4 text-accent" />
          </div>
          <span className="text-foreground font-medium">{club.coordinator}</span>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => navigate(`/clubs/${club.id}/join`)}
          className="w-full group/btn font-semibold"
        >
          Join Club
          <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClubCard;
