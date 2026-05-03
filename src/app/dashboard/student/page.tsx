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
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Calendar, Clock, Star, DollarSign, BookOpen, User,
  CreditCard, Eye, Trash2, CheckCircle2, XCircle, AlertTriangle, ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const { user, logout, refreshUser } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile form state
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewSessionId, setReviewSessionId] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  // Session detail modal
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isSessionDetailOpen, setIsSessionDetailOpen] = useState(false);

  // Payment history
  const [payments, setPayments] = useState<any[]>([]);
  const [isPaymentsLoading, setIsPaymentsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "STUDENT") {
      toast.error("Unauthorized access to student dashboard.");
      router.push(`/dashboard/${user.role.toLowerCase()}`);
      return;
    }
    
    const initializeData = async () => {
      if (user) {
        if (!user.Student) {
          await refreshUser();
        }
        setContactNumber(user.Student?.contactNumber || "");
        setAddress(user.Student?.address || "");
        fetchSessions();
      }
    };

    initializeData();
  }, [user, router, refreshUser]);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/sessions");
      if (response.data?.success) {
        const data = response.data.data?.data || response.data.data || [];
        setSessions(data);
      }
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPayments = async () => {
    setIsPaymentsLoading(true);
    try {
      const sessionList = sessions.length > 0 ? sessions : [];
      const paymentResults = await Promise.allSettled(
        sessionList.map((s: any) => api.get(`/payment/${s.id}`))
      );
      const fetched = paymentResults
        .filter((r) => r.status === "fulfilled")
        .map((r: any) => r.value.data?.data)
        .filter(Boolean);
      setPayments(fetched);
    } catch (error) {
      console.error("Failed to fetch payments", error);
    } finally {
      setIsPaymentsLoading(false);
    }
  };

  const handleViewSession = async (sessionId: string) => {
    try {
      const res = await api.get(`/sessions/${sessionId}`);
      if (res.data?.success) {
        setSelectedSession(res.data.data);
        setIsSessionDetailOpen(true);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch session details");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.Student?.id) {
      toast.error("Profile not fully initialized yet.");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("contactNumber", contactNumber);
      formData.append("address", address);
      if (profilePhotoFile) formData.append("file", profilePhotoFile);

      await api.patch(`/students/${user.Student.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile updated successfully!");
      setProfilePhotoFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.Student?.id) return;
    const result = await Swal.fire({
      title: "Delete Your Account?",
      text: "This action is permanent and cannot be undone. All your session data will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete my account",
    });
    if (result.isConfirmed) {
      try {
        await api.delete(`/students/${user.Student.id}`);
        toast.success("Account deleted successfully.");
        logout();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete account");
      }
    }
  };

  const openReviewModal = (sessionId: string) => {
    setReviewSessionId(sessionId);
    setReviewRating(5);
    setReviewComment("");
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.post("/reviews", {
        sessionId: reviewSessionId,
        rating: reviewRating,
        comment: reviewComment,
      });
      if (res.data?.success) {
        toast.success("Review submitted! Thank you.");
        setIsReviewModalOpen(false);
        fetchSessions();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async (sessionId: string) => {
    try {
      const res = await api.post("/payment/create-checkout-session", { sessionId });
      if (res.data?.success && res.data?.data?.url) {
        window.location.href = res.data.data.url;
      } else {
        toast.error("Failed to initiate payment");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to initiate payment");
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      PENDING: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
      SCHEDULED: "bg-primary/10 text-primary",
      CONFIRMED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      COMPLETED: "bg-muted text-muted-foreground",
      CANCELED: "bg-destructive/10 text-destructive",
    };
    return map[status] || "bg-muted text-muted-foreground";
  };

  const getPaymentBadge = (status: string) => {
    return status === "PAID"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
  };

  const upcomingSessions = sessions.filter(
    (s) => s.status === "SCHEDULED" || s.status === "CONFIRMED" || s.status === "PENDING"
  );
  const completedSessions = sessions.filter((s) => s.status === "COMPLETED");
  const uniqueTutors = new Set(sessions.filter((s) => s.tutorId).map((s) => s.tutorId));
  const nextSession = [...upcomingSessions].sort(
    (a, b) => {
      const timeA = a.schedule?.startTime ? new Date(a.schedule.startTime).getTime() : 0;
      const timeB = b.schedule?.startTime ? new Date(b.schedule.startTime).getTime() : 0;
      return timeA - timeB;
    }
  )[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card px-6 py-4 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader 
            title="Student Portal"
            subtitle={`Welcome back, ${user?.name || "Student"}`}
            onLogout={logout}
            userInitials={user?.name?.substring(0, 2).toUpperCase() || "ST"}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-xl mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="payments" onClick={fetchPayments}>Payments</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* ── Overview ── */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Upcoming Sessions"
                value={isLoading ? "—" : upcomingSessions.length}
                description="Scheduled ahead"
                icon={<Calendar className="w-4 h-4 text-primary" />}
                theme="default"
              />
              <StatCard
                title="Completed Sessions"
                value={isLoading ? "—" : completedSessions.length}
                description="All time"
                icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                theme="default"
              />
              <StatCard
                title="Tutors Booked"
                value={isLoading ? "—" : uniqueTutors.size}
                description="Unique tutors"
                icon={<User className="w-4 h-4 text-primary" />}
                theme="default"
              />
            </div>

            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Next Upcoming Session</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-muted-foreground text-center py-4">Loading…</p>
                ) : nextSession ? (
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg uppercase">
                        {nextSession.tutor?.user?.name?.substring(0, 2) || "TU"}
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-lg">{nextSession.tutor?.user?.name || "Tutor"}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {nextSession.schedule?.startTime
                              ? format(new Date(nextSession.schedule.startTime), "PPP")
                              : "TBD"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {nextSession.schedule?.startTime
                              ? format(new Date(nextSession.schedule.startTime), "p")
                              : "TBD"}
                          </span>
                        </div>
                        <span className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full font-medium ${getStatusBadge(nextSession.status)}`}>
                          {nextSession.status}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleViewSession(nextSession.id)} variant="outline" className="gap-2">
                      <Eye className="w-4 h-4" /> View Details
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No upcoming sessions. <a href="/tutors" className="text-primary underline">Browse tutors</a> to book one.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── My Bookings ── */}
          <TabsContent value="bookings">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle>Session History</CardTitle>
                <CardDescription>All your tutoring sessions — past and upcoming.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading sessions…</div>
                ) : sessions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No bookings yet. <a href="/tutors" className="text-primary underline">Find a tutor</a>.
                  </div>
                ) : (
                  <div className="rounded-md border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Tutor</TableHead>
                          <TableHead>Schedule</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sessions.map((session) => (
                          <TableRow key={session.id} className="hover:bg-muted/50 border-border">
                            <TableCell className="font-medium text-foreground">{session.tutor?.user?.name || "Tutor"}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {session.schedule?.startTime
                                ? format(new Date(session.schedule.startTime), "PPP, p")
                                : "TBD"}
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getStatusBadge(session.status)}`}>
                                {session.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getPaymentBadge(session.paymentStatus)}`}>
                                {session.paymentStatus}
                              </span>
                            </TableCell>
                            <TableCell className="text-right space-x-1">
                              <Button size="sm" variant="outline" onClick={() => handleViewSession(session.id)} className="gap-1">
                                <Eye className="w-3.5 h-3.5" /> View
                              </Button>
                              {(session.status === "SCHEDULED" || session.status === "CONFIRMED") && session.paymentStatus === "UNPAID" && (
                                <Button size="sm" onClick={() => handlePayment(session.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1">
                                  <CreditCard className="w-3.5 h-3.5" /> Pay
                                </Button>
                              )}
                              {session.status === "COMPLETED" && !session.review && (
                                <Button size="sm" variant="outline" onClick={() => openReviewModal(session.id)} className="gap-1">
                                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> Review
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Payments ── */}
          <TabsContent value="payments">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" /> Payment History
                </CardTitle>
                <CardDescription>All payments linked to your sessions.</CardDescription>
              </CardHeader>
              <CardContent>
                {isPaymentsLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading payments…</div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No payment records found.</div>
                ) : (
                  <div className="rounded-md border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow key={payment.id} className="hover:bg-muted/50 border-border">
                            <TableCell className="font-mono text-xs text-muted-foreground">{payment.transactionId?.substring(0, 20)}…</TableCell>
                            <TableCell className="font-semibold text-foreground">${payment.amount?.toFixed(2) || "0.00"}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getPaymentBadge(payment.paymentStatus)}`}>
                                {payment.paymentStatus}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {payment.updatedAt ? format(new Date(payment.updatedAt), "PP") : "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Profile ── */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border shadow-sm">
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    {/* Profile Photo */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Profile Photo</Label>
                      <div className="flex items-center gap-4">
                        {profilePhotoPreview || user?.Student?.profilePhoto ? (
                          <img
                            src={(profilePhotoPreview || user?.Student?.profilePhoto) as string}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 shadow-sm"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-dashed border-primary/30 text-primary font-bold text-xl uppercase">
                            {user?.name?.substring(0, 2) || "ST"}
                          </div>
                        )}
                        <div>
                          <input
                            type="file"
                            id="student-photo-upload"
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
                            onClick={() => document.getElementById('student-photo-upload')?.click()}
                          >
                            {profilePhotoFile ? "Change Photo" : "Upload Photo"}
                          </Button>
                          {profilePhotoFile && (
                            <p className="text-xs text-emerald-600 mt-1 font-medium">{profilePhotoFile.name}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WEBP — max 2MB</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input value={user?.name || ""} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" value={user?.email || ""} disabled className="bg-muted" />
                      <p className="text-xs text-muted-foreground">Name and email cannot be changed here.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactNumber">Contact Number</Label>
                      <Input id="contactNumber" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="+1 234 567 8900" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your city, country" />
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving…" : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="bg-card border-destructive/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Danger Zone
                  </CardTitle>
                  <CardDescription>Irreversible and destructive actions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <p className="font-medium text-foreground mb-1">Delete Account</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Permanently remove your account and all associated data from the platform. This action cannot be undone.
                    </p>
                    <Button variant="outline" onClick={handleDeleteAccount} className="border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground gap-2">
                      <Trash2 className="w-4 h-4" /> Delete My Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Session Detail Modal ── */}
      {isSessionDetailOpen && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">Session Details</h3>
                <p className="text-sm text-muted-foreground mt-1 font-mono">{selectedSession.id}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsSessionDetailOpen(false)}>✕</Button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Tutor</span>
                <span className="font-medium text-foreground">{selectedSession.tutor?.user?.name || "—"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Day</span>
                <span className="font-medium text-foreground">{selectedSession.schedule?.dayOfWeek || "—"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Start Time</span>
                <span className="font-medium text-foreground">
                  {selectedSession.schedule?.startTime
                    ? format(new Date(selectedSession.schedule.startTime), "PPP, p")
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Session Status</span>
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getStatusBadge(selectedSession.status)}`}>
                  {selectedSession.status}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Payment Status</span>
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getPaymentBadge(selectedSession.paymentStatus)}`}>
                  {selectedSession.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium text-foreground">${selectedSession.payment?.amount?.toFixed(2) || "0.00"}</span>
              </div>
              {selectedSession.review && (
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Your Review</span>
                  <span className="font-medium text-foreground flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    {selectedSession.review.rating}/5
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-6 justify-end">
              {selectedSession.paymentStatus === "UNPAID" && (selectedSession.status === "SCHEDULED" || selectedSession.status === "CONFIRMED") && (
                <Button onClick={() => { setIsSessionDetailOpen(false); handlePayment(selectedSession.id); }} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1">
                  <CreditCard className="w-4 h-4" /> Pay Now
                </Button>
              )}
              {selectedSession.status === "COMPLETED" && !selectedSession.review && (
                <Button variant="outline" onClick={() => { setIsSessionDetailOpen(false); openReviewModal(selectedSession.id); }} className="gap-1">
                  <Star className="w-4 h-4" /> Leave Review
                </Button>
              )}
              <Button variant="outline" onClick={() => setIsSessionDetailOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Review Modal ── */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Leave a Review</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setReviewRating(star)} className="p-1 transition-transform hover:scale-110 focus:outline-none">
                      <Star className={`w-8 h-8 ${star <= reviewRating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="review-comment">Comment</Label>
                <textarea
                  id="review-comment"
                  className="w-full min-h-[100px] p-3 border border-border bg-background rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none text-sm text-foreground"
                  placeholder="How was your session?"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmitReview} disabled={isSubmitting}>
                {isSubmitting ? "Submitting…" : "Submit Review"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
