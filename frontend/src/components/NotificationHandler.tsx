import { useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { toast } from "sonner";
import { Bell } from "lucide-react";

const NotificationHandler = () => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleEventCreated = (data: { message: string; event: any }) => {
      toast(data.message, {
        description: `Happening on ${new Date(data.event.date).toLocaleDateString()}`,
        icon: <Bell className="h-4 w-4 text-primary" />,
      });
    };

    const handleEventUpdated = (data: { message: string; event: any }) => {
      toast(data.message, {
        description: "Details have been updated.",
        icon: <Bell className="h-4 w-4 text-blue-500" />,
      });
    };

    socket.on("eventCreated", handleEventCreated);
    socket.on("eventUpdated", handleEventUpdated);

    return () => {
      socket.off("eventCreated", handleEventCreated);
      socket.off("eventUpdated", handleEventUpdated);
    };
  }, [socket]);

  return null; // This component doesn't render anything itself
};

export default NotificationHandler;
