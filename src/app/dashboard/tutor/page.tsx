"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Users, DollarSign, CheckCircle, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { tutorService } from "@/services/tutor";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function TutorDashboard() {
  const { user, logout } = useAuth();
  
  // States
  const [profile, setProfile] = useState<any>(null);
  const [tutorData, setTutorData] = useState<any>(null);
  const [masterSchedules, setMasterSchedules] = useState<any[]>([]);
  const [tutorSchedules, setTutorSchedules] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Forms
  const [profileForm, setProfileForm] = useState({
    name: "",
    bio: "",
    hourlyRate: "",
    experience: "",
    qualification: ""
  });
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== "TUTOR") {
      toast.error("Unauthorized access to tutor dashboard.");
      router.push(`/dashboard/${user.role.toLowerCase()}`);
      return;
    }
    if (user) {
      fetchData();
    }
  }, [user, router]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [profileRes, masterSchedRes, tutorSchedRes, sessionsRes] = await Promise.all([
        tutorService.getProfile(),
        tutorService.getMasterSchedules(),
        tutorService.getTutorSchedules(),
        tutorService.getSessions()
      ]);

      const fetchedProfile = profileRes?.data || profileRes;
      setProfile(fetchedProfile);
      
      // Assume the tutor specific data is embedded in the profile response, 
      // or we just use fetchedProfile.tutor directly if it exists.
      const tData = fetchedProfile?.Tutor || fetchedProfile;
      setTutorData(tData);

      if (tData?.id) {
        setProfileForm({
          name: fetchedProfile?.name || "",
          bio: tData?.bio || "",
          hourlyRate: tData?.hourlyRate || "",
          experience: tData?.experience || "",
          qualification: tData?.qualification || ""
        });
      }

      setMasterSchedules(masterSchedRes?.data?.data || masterSchedRes?.data || []);
      setTutorSchedules(tutorSchedRes?.data?.data || tutorSchedRes?.data || []);
      setSessions(sessionsRes?.data?.data || sessionsRes?.data || []);
    } catch (error) {
      console.error("Failed to fetch tutor data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (tutorData?.id) {
        const formData = new FormData();
        if (profileForm.name) formData.append("name", profileForm.name);
        if (profileForm.bio) formData.append("bio", profileForm.bio);
        if (profileForm.qualification) formData.append("qualification", profileForm.qualification);
        if (profileForm.hourlyRate !== "" && !isNaN(Number(profileForm.hourlyRate))) {
          formData.append("hourlyRate", String(Number(profileForm.hourlyRate)));
        }
        if (profileForm.experience !== "" && !isNaN(Number(profileForm.experience))) {
          formData.append("experience", String(Number(profileForm.experience)));
        }
        if (profilePhotoFile) formData.append("file", profilePhotoFile);

        await tutorService.updateProfile(tutorData.id, formData);
        toast.success("Profile updated successfully!");
      }
      setProfilePhotoFile(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSchedule = async (scheduleId: string, isCurrentlySelected: boolean, tutorScheduleId?: string) => {
    try {
      if (isCurrentlySelected) {
        await tutorService.deleteTutorSchedule(scheduleId);
        toast.success("Schedule slot removed.");
      } else {
        await tutorService.createTutorSchedules({ scheduleIds: [scheduleId] });
        toast.success("Schedule slot added.");
      }
      // Refresh schedules
      const tutorSchedRes = await tutorService.getTutorSchedules();
      setTutorSchedules(tutorSchedRes?.data?.data || tutorSchedRes?.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update schedule");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;
  }

  const upcomingSessions = sessions.filter(s => s.status === "SCHEDULED" || s.status === "PENDING");
  const completedSessions = sessions.filter(s => s.status === "COMPLETED");

  // Calculate earnings based on paid sessions
  const totalEarnings = sessions.reduce((acc, curr) => {
    if (curr.paymentStatus === "PAID") {
      const amount = curr.payment?.amount || (curr.tutor?.hourlyRate || tutorData?.hourlyRate || 0);
      return acc + Number(amount);
    }
    return acc;
  }, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <DashboardHeader 
        title="Tutor Dashboard"
        subtitle="Manage your classes, students, and schedule."
        onLogout={logout}
      />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-3xl mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Upcoming Classes"
              value={upcomingSessions.length}
              description=""
              icon={<Calendar className="w-5 h-5" />}
              theme="blue"
            />
            <StatCard
              title="Completed Classes"
              value={completedSessions.length}
              description=""
              icon={<CheckCircle className="w-5 h-5" />}
              theme="green"
            />
            <StatCard
              title="Total Earnings"
              value={`$${totalEarnings}`}
              description=""
              icon={<DollarSign className="w-5 h-5" />}
              theme="purple"
            />
          </div>

        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule">
          <Card className="max-w-4xl">
            <CardHeader>
              <CardTitle>Manage Availability</CardTitle>
              <CardDescription>Select slots from the master schedule to make them available for booking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {masterSchedules.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {masterSchedules.map((schedule) => {
                     // Check if this master schedule is in tutorSchedules
                     const tutorScheduleLink = tutorSchedules.find(ts => ts.scheduleId === schedule.id);
                     const isSelected = !!tutorScheduleLink;
                     const isBooked = tutorScheduleLink?.isBooked || false;

                     return (
                       <div key={schedule.id} className={`p-4 border rounded-lg flex flex-col gap-3 transition-colors ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
                          <div>
                            <p className="font-medium text-foreground">{schedule.startTime ? format(new Date(schedule.startTime), "EEEE, MMM d, yyyy") : "Unknown Date"}</p>
                            <p className="text-sm text-muted-foreground">
                              {schedule.startTime ? format(new Date(schedule.startTime), "p") : ""} - 
                              {schedule.endTime ? format(new Date(schedule.endTime), "p") : ""}
                            </p>
                          </div>
                          
                          <div className="mt-auto pt-2">
                            {isBooked ? (
                              <Badge variant="secondary" className="w-full justify-center">Currently Booked</Badge>
                            ) : (
                              <Button 
                                variant={isSelected ? "destructive" : "outline"}
                                className="w-full"
                                onClick={() => toggleSchedule(schedule.id, isSelected, tutorScheduleLink?.id)}
                              >
                                {isSelected ? "Remove Availability" : "Mark Available"}
                              </Button>
                            )}
                          </div>
                       </div>
                     )
                   })}
                 </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  No master schedules available from the administration.
                </div>
              )}
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
              {sessions.length > 0 ? sessions.map((session) => (
                <div key={session.id} className={`flex flex-col md:flex-row items-center justify-between p-4 border rounded-xl gap-4 border-border ${session.status === 'COMPLETED' ? 'bg-card' : 'bg-muted/30'}`}>
                  <div>
                    <h4 className="font-semibold text-foreground">{session.student?.user?.name || "Unknown Student"}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {session.schedule?.startTime 
                        ? `${format(new Date(session.schedule.startTime), "PP")} at ${format(new Date(session.schedule.startTime), "p")}` 
                        : "Date TBD"}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={
                        session.status === "COMPLETED" ? "default" : 
                        session.status === "CANCELED" ? "destructive" : "secondary"
                      }>
                        {session.status}
                      </Badge>
                      <Badge variant="outline">{session.paymentStatus}</Badge>
                    </div>
                  </div>
                </div>
              )) : (
                 <div className="text-center p-8 text-muted-foreground">
                  No bookings found.
                 </div>
              )}
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
                {/* Profile Photo Upload */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Profile Photo</Label>
                  <div className="flex items-center gap-5">
                    {profilePhotoPreview || tutorData?.profilePhoto ? (
                      <img
                        src={profilePhotoPreview || tutorData?.profilePhoto}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border-2 border-primary/20 shadow"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-dashed border-primary/30 text-primary font-bold text-2xl uppercase">
                        {profileForm.name?.substring(0, 2) || "TU"}
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        id="tutor-photo-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setProfilePhotoFile(file);
                            setProfilePhotoPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('tutor-photo-upload')?.click()}
                      >
                        {profilePhotoFile ? "Change Photo" : "Upload Photo"}
                      </Button>
                      {profilePhotoFile && (
                        <p className="text-xs text-green-600 mt-1 font-medium">{profilePhotoFile.name}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WEBP — max 2MB</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={profileForm.name} 
                    onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="qualification">Highest Qualification</Label>
                    <Input 
                      id="qualification" 
                      value={profileForm.qualification} 
                      onChange={e => setProfileForm({...profileForm, qualification: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input 
                      id="experience" 
                      type="number"
                      value={profileForm.experience} 
                      onChange={e => setProfileForm({...profileForm, experience: e.target.value})} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rate">Hourly Rate ($)</Label>
                    <Input 
                      id="rate" 
                      type="number" 
                      value={profileForm.hourlyRate} 
                      onChange={e => setProfileForm({...profileForm, hourlyRate: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">About Me (Bio)</Label>
                  <Textarea 
                    id="bio" 
                    rows={4} 
                    value={profileForm.bio}
                    onChange={e => setProfileForm({...profileForm, bio: e.target.value})}
                  />
                </div>
                
                <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                  {isSubmitting ? "Saving..." : "Save Public Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>


      </Tabs>

    </div>
  );
}
