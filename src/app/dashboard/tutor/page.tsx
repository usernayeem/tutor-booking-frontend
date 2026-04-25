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
import { Calendar, Clock, Video, Users, DollarSign, MessageCircle, CheckCircle, Eye, Star, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
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
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isSessionDetailOpen, setIsSessionDetailOpen] = useState(false);
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
        try {
          const reviewsRes = await tutorService.getReviews(tData.id);
          setReviews(reviewsRes?.data || []);
        } catch (err) {
          console.error("Failed to fetch reviews", err);
        }
      }

      setProfileForm({
        name: fetchedProfile?.name || "",
        bio: tData?.bio || "",
        hourlyRate: tData?.hourlyRate || "",
        experience: tData?.experience || "",
        qualification: tData?.qualification || ""
      });

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

  const updateSession = async (sessionId: string, status: string) => {
    if (status === "CANCELED") {
      const result = await Swal.fire({
        title: "Cancel this class?",
        text: "Are you sure you want to cancel this booking? The student will be notified.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, cancel it",
      });
      if (!result.isConfirmed) return;
    }

    try {
      await tutorService.updateSessionStatus(sessionId, status);
      toast.success(`Session marked as ${status.toLowerCase()}`);
      
      // Refresh sessions
      const sessionsRes = await tutorService.getSessions();
      setSessions(sessionsRes?.data?.data || sessionsRes?.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update session");
    }
  };

  const handleViewSession = async (sessionId: string) => {
    try {
      const res = await tutorService.getSessionById(sessionId);
      if (res.data) {
        setSelectedSession(res.data);
        setIsSessionDetailOpen(true);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch session details");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  const upcomingSessions = sessions.filter(s => s.status === "SCHEDULED" || s.status === "PENDING");
  const completedSessions = sessions.filter(s => s.status === "COMPLETED");
  const nextSession = upcomingSessions.length > 0 ? upcomingSessions[0] : null;

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
        <TabsList className="grid w-full grid-cols-5 max-w-3xl mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
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

          <h2 className="text-xl font-semibold mt-8 mb-4">Your Next Class</h2>
          {nextSession ? (
            <Card>
              <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl uppercase">
                    {nextSession.student?.user?.name?.substring(0, 2) || "ST"}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{nextSession.student?.user?.name || "Student"}</h3>
                    <p className="text-gray-600">Booking Reference: #{nextSession.id?.substring(0, 6)}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        {nextSession.schedule?.startTime ? format(new Date(nextSession.schedule.startTime), "PP") : "Scheduled"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> 
                        {nextSession.schedule?.startTime ? format(new Date(nextSession.schedule.startTime), "p") : "TBD"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <Button variant="outline" onClick={() => handleViewSession(nextSession.id)} className="w-full md:w-auto gap-2">
                    <Eye className="w-4 h-4" />
                    Details
                  </Button>
                  <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 gap-2">
                    <Video className="w-4 h-4" />
                    Join Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
             <div className="p-6 border rounded-lg bg-gray-50 text-gray-500 text-center">
               No upcoming classes scheduled.
             </div>
          )}
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
                       <div key={schedule.id} className={`p-4 border rounded-lg flex flex-col gap-3 transition-colors ${isSelected ? 'border-blue-500 bg-blue-50' : 'bg-white'}`}>
                          <div>
                            <p className="font-medium">{schedule.startTime ? format(new Date(schedule.startTime), "EEEE, MMM d, yyyy") : "Unknown Date"}</p>
                            <p className="text-sm text-gray-500">
                              {schedule.startTime ? format(new Date(schedule.startTime), "p") : ""} - 
                              {schedule.endTime ? format(new Date(schedule.endTime), "p") : ""}
                            </p>
                          </div>
                          
                          <div className="mt-auto pt-2">
                            {isBooked ? (
                              <Badge variant="secondary" className="w-full justify-center">Currently Booked</Badge>
                            ) : (
                              <Button 
                                variant={isSelected ? "default" : "outline"}
                                className={`w-full ${isSelected ? "bg-red-50 hover:bg-red-100 hover:text-red-700 text-red-600 border-red-200" : ""}`}
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
                <div className="text-center p-8 text-gray-500">
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
                <div key={session.id} className={`flex flex-col md:flex-row items-center justify-between p-4 border rounded-xl gap-4 ${session.status === 'COMPLETED' ? 'bg-white' : 'bg-gray-50'}`}>
                  <div>
                    <h4 className="font-semibold">{session.student?.user?.name || "Unknown Student"}</h4>
                    <p className="text-sm text-gray-500 mt-1">
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
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleViewSession(session.id)}>
                      <Eye className="w-3.5 h-3.5 mr-1" /> View
                    </Button>
                    {session.status !== "COMPLETED" && session.status !== "CANCELED" && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => updateSession(session.id, "CANCELED")}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => updateSession(session.id, "COMPLETED")}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" /> Mark Done
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )) : (
                 <div className="text-center p-8 text-gray-500">
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
                        className="w-20 h-20 rounded-full object-cover border-2 border-blue-200 shadow"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center border-2 border-dashed border-blue-300 text-blue-400 font-bold text-2xl uppercase">
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
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP — max 2MB</p>
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
                
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
                  {isSubmitting ? "Saving..." : "Save Public Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Student Reviews</CardTitle>
              <CardDescription>See what your students are saying about your classes.</CardDescription>
            </CardHeader>
            <CardContent>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 border rounded-xl bg-white shadow-sm flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{review.student?.user?.name || "Anonymous Student"}</h4>
                        <div className="flex items-center text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment || "No comment provided."}</p>
                      <p className="text-xs text-gray-400 mt-2">{format(new Date(review.createdAt), "PPP")}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  You do not have any reviews yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Session Details Modal */}
      {isSessionDetailOpen && selectedSession && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">Class Details</h2>
              <button onClick={() => setIsSessionDetailOpen(false)} className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant={
                    selectedSession.status === "COMPLETED" ? "default" : 
                    selectedSession.status === "CANCELED" ? "destructive" : "secondary"
                  } className="mb-2">
                    {selectedSession.status}
                  </Badge>
                  <h3 className="text-xl font-bold">{selectedSession.student?.user?.name || "Unknown Student"}</h3>
                  <p className="text-gray-600">{selectedSession.student?.user?.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Reference</p>
                  <p className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">#{selectedSession.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                  <p className="font-medium">
                    {selectedSession.schedule?.startDate ? format(new Date(selectedSession.schedule.startDate), "PPP") : "TBD"}
                  </p>
                  <p className="text-sm">{selectedSession.schedule?.startTime || "TBD"} - {selectedSession.schedule?.endTime || "TBD"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                  <Badge variant={selectedSession.paymentStatus === "PAID" ? "default" : "outline"}>
                    {selectedSession.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <Button variant="outline" onClick={() => setIsSessionDetailOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
