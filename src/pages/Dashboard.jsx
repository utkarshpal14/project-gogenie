import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Compass, CalendarCheck, Plus } from "lucide-react";
import { Link } from "react-router-dom";

// Mock trip data
const mockTrips = [
  {
    id: "1",
    destination: "Paris, France",
    dateStart: "2025-05-12",
    dateEnd: "2025-05-18",
    created: "2025-04-20",
    status: "upcoming",
    coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop"
  },
  {
    id: "2",
    destination: "Tokyo, Japan",
    dateStart: "2025-07-10",
    dateEnd: "2025-07-20",
    created: "2025-04-15",
    status: "upcoming",
    coverImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1974&auto=format&fit=crop"
  },
  {
    id: "3",
    destination: "New York, USA",
    dateStart: "2025-03-05",
    dateEnd: "2025-03-10",
    created: "2025-02-20",
    status: "completed",
    coverImage: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop"
  }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const filteredTrips = mockTrips.filter(trip => trip.status === activeTab);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Trips</h1>

      <div className="flex justify-between items-center mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        <Link to="/plan-trip">
          <Button className="bg-goginie-primary hover:bg-goginie-secondary">
            <Plus className="mr-2 h-4 w-4" /> Plan New Trip
          </Button>
        </Link>
      </div>

      {filteredTrips.length === 0 && (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-3">
              <Compass className="h-8 w-8 text-goginie-primary" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">No {activeTab} trips</h3>
            <p className="mt-2 text-center text-muted-foreground max-w-md">
              {activeTab === "upcoming"
                ? "You don't have any upcoming trips planned. Start planning your next adventure!"
                : activeTab === "ongoing"
                ? "You don't have any trips in progress. Your ongoing trips will appear here."
                : "You don't have any completed trips. Once you complete a trip, it will appear here."}
            </p>
            {activeTab === "upcoming" && (
              <Link to="/plan-trip" className="mt-6">
                <Button className="bg-goginie-primary hover:bg-goginie-secondary">
                  <Plus className="mr-2 h-4 w-4" /> Plan New Trip
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {filteredTrips.map((trip) => (
          <Link to={`/trips/${trip.id}`} key={trip.id}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div
                className="h-40 relative bg-cover bg-center"
                style={{ backgroundImage: `url(${trip.coverImage})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-4 text-white">
                  <h3 className="font-semibold text-lg">{trip.destination}</h3>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-goginie-gray text-sm">
                    <CalendarCheck className="h-4 w-4 mr-1" />
                    <span>
                      {formatDate(trip.dateStart)} - {formatDate(trip.dateEnd)}
                    </span>
                  </div>
                  <div className="flex items-center text-goginie-gray text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      {Math.max(
                        1,
                        Math.round(
                          (new Date(trip.dateEnd).getTime() -
                            new Date(trip.dateStart).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      )}{" "}
                      days
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
