"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Video, Users, DollarSign, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export default function TutorDashboard() {
  const { user, logout } = useAuth();

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Tutor profile updated successfully!");
  };

  const handleSaveSchedule = () => {
    toast.success("Availability schedule saved!");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tutor Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your classes, students, and schedule.</p>
        </div>
        <Button onClick={() => logout()} variant="outline" className="border-gray-300">
          Log out
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-blue-50 border-blue-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-900 text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Classes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-600">5</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-900 text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Active Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-green-600">12</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-purple-900 text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Monthly Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-purple-600">$840</p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Your Next Class</h2>
          <Card>
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">
                  EC
                </div>
                <div>
                  <h3 className="font-bold text-lg">Emily Chen</h3>
                  <p className="text-gray-600">Calculus 101 - Exam Prep</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Today</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 04:00 PM</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <Button variant="outline" className="w-full md:w-auto gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Message
                </Button>
                <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 gap-2">
                  <Video className="w-4 h-4" />
                  Start Class
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Manage Availability</CardTitle>
              <CardDescription>Set your standard weekly available hours for students to book.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {['Monday', 'Wednesday', 'Friday'].map((day) => (
                <div key={day} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                  <div className="w-32 font-semibold text-gray-900">{day}</div>
                  <div className="flex items-center gap-4">
                    <Input type="time" defaultValue="09:00" className="w-32" />
                    <span className="text-gray-500">to</span>
                    <Input type="time" defaultValue="17:00" className="w-32" />
                  </div>
                </div>
              ))}
              <Button onClick={handleSaveSchedule} className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                Save Schedule
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Student Bookings</CardTitle>
              <CardDescription>Review and manage all your upcoming and past classes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upcoming Session */}
              <div className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-xl gap-4 bg-gray-50">
                <div>
                  <h4 className="font-semibold">Emily Chen - Calculus 101</h4>
                  <p className="text-sm text-gray-500 mt-1">Today at 04:00 PM</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Upcoming</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Reschedule</Button>
                  <Button size="sm" className="bg-blue-600 gap-1"><Video className="w-3 h-3" /> Start Class</Button>
                </div>
              </div>

              {/* Past Session */}
              <div className="flex flex-col md:flex-row items-center justify-between p-4 border rounded-xl gap-4">
                <div>
                  <h4 className="font-semibold">David Smith - Algebra Basics</h4>
                  <p className="text-sm text-gray-500 mt-1">Yesterday at 02:00 PM</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Completed</span>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Follow Up
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Public Profile Settings</CardTitle>
              <CardDescription>Update how you appear to students in the directory.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Sarah" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Jenkins" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Primary Subject</Label>
                    <Input id="subject" defaultValue="Advanced Mathematics" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rate">Hourly Rate ($)</Label>
                    <Input id="rate" type="number" defaultValue="45" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">About Me (Bio)</Label>
                  <Textarea 
                    id="bio" 
                    rows={4} 
                    defaultValue="I am a former university professor with a Ph.D. in Applied Mathematics. I specialize in making complex mathematical concepts accessible and intuitive."
                  />
                </div>
                
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                  Save Public Profile
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
