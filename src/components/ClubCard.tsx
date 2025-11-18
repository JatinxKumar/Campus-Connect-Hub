import { Users, UserCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Club } from "@/data/clubsData";

interface ClubCardProps {
  club: Club;
  onJoin?: (clubId: number) => void;
}

const ClubCard = ({ club, onJoin }: ClubCardProps) => {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="relative overflow-hidden h-48">
        <img
          src={club.image}
          alt={club.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary text-primary-foreground">{club.category}</Badge>
        </div>
      </div>
      
      <CardHeader>
        <CardTitle className="text-xl">{club.name}</CardTitle>
        <CardDescription>{club.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{club.members} Members</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <UserCircle className="w-4 h-4" />
          <span>{club.coordinator}</span>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onJoin?.(club.id)}
          className="w-full"
        >
          Join Club
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClubCard;
