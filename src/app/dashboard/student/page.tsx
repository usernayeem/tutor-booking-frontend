"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Video, Star } from "lucide-react";
import { toast } from "sonner";

export default function StudentDashboard() {
  const { user, logout } = useAuth();

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  const handleLeaveReview = () => {
    toast.success("Review submitted! Thank you for your feedback.");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name || "Student"}!</p>
        </div>
        <Button onClick={() => logout()} variant="outline" className="border-gray-300">
          Log out
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-blue-50 border-blue-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-900 text-lg">Upcoming Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-600">2</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-900 text-lg">Completed Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-green-600">14</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-purple-900 text-lg">Favorite Tutors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-purple-600">3</p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Next Upcoming Session</h2>
          <Card>
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">
                  SJ
                </div>
                <div>
                  <h3 className="font-bold text-lg">Dr. Sarah Jenkins</h3>
                  <p className="text-gray-600">Advanced Mathematics</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Tomorrow</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 10:00 AM</span>
                  </div>
                </div>
              </div>
              <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 gap-2">
                <Video className="w-4 h-4" />
                Join Video Call
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Bookings Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Session History</CardTitle>
              <CardDescription>View your upcoming and past tutoring sessions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upcoming Session */}
              <div className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-xl gap-4 bg-gray-50">
                <div>
                  <h4 className="font-semibold">Dr. Sarah Jenkins - Advanced Mathematics</h4>
                  <p className="text-sm text-gray-500 mt-1">Tomorrow at 10:00 AM</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Upcoming</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Reschedule</Button>
                  <Button size="sm" className="bg-blue-600">Join Call</Button>
                </div>
              </div>

              {/* Past Session */}
              <div className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-xl gap-4">
                <div>
                  <h4 className="font-semibold">Elena Rodriguez - Spanish Language</h4>
                  <p className="text-sm text-gray-500 mt-1">Oct 12, 2023 at 03:00 PM</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Completed</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLeaveReview} className="gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  Leave Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Profile Tab */}
        <TabsContent value="profile">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your personal information and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email || "student@example.com"} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education">Education Level</Label>
                  <Input id="education" defaultValue="High School" />
                </div>
                <Button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
