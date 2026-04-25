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
import { Users, DollarSign, BookOpen, Calendar, CheckCircle2, XCircle, Search, PlusCircle, Download, Eye, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/services/admin";
import api from "@/services/api";
import { format } from "date-fns";
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [usersMeta, setUsersMeta] = useState<any>(null);
  const [scheduleMeta, setScheduleMeta] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSchedulePage, setCurrentSchedulePage] = useState(1);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isSessionDetailOpen, setIsSessionDetailOpen] = useState(false);
  const router = useRouter();
  
  // States for toggling views
  const [isCreatingTutor, setIsCreatingTutor] = useState(false);
  const [isCreatingSubject, setIsCreatingSubject] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  
  // Forms
  const [tutorForm, setTutorForm] = useState({
    name: "", email: "", password: "", contactNumber: "", 
    hourlyRate: "", experience: "", qualification: "", subjectIds: [] as string[]
  });

  const [subjectForm, setSubjectForm] = useState({
    name: "", description: ""
  });
  const [subjectIconFile, setSubjectIconFile] = useState<File | null>(null);
  const [subjectIconPreview, setSubjectIconPreview] = useState<string | null>(null);

  const [editUserForm, setEditUserForm] = useState({
    name: "", contactNumber: "", hourlyRate: "", experience: "", qualification: "",
    status: "", createdAt: "", address: "", gender: ""
  });

  const [scheduleForm, setScheduleForm] = useState({
    startDate: "", endDate: "", startTime: "", endTime: ""
  });

  useEffect(() => {
    if (user && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      toast.error("Unauthorized access to admin dashboard.");
      router.push(`/dashboard/${user.role.toLowerCase()}`);
      return;
    }
    if (user) {
      fetchData();
    }
  }, [currentPage, currentSchedulePage, user, router]);

  const fetchData = async () => {
    try {
      // Pass large limits for tutors/students to ensure entity matching works across pages
      const [subjectsRes, tutorsRes, studentsRes, usersRes, schedulesRes, sessionsRes, statsRes] = await Promise.all([
        adminService.getSubjects(),
        api.get('/tutors?limit=1000'),
        api.get('/students?limit=1000'),
        adminService.getAllUsers(currentPage, 10),
        adminService.getSchedules(currentSchedulePage, 10),
        adminService.getSessions(),
        adminService.getDashboardStats()
      ]);

      const fetchedSubjects = subjectsRes?.data?.data || subjectsRes?.data || [];
      const fetchedTutors = tutorsRes?.data?.data || tutorsRes?.data || [];
      const fetchedStudents = studentsRes?.data?.data || studentsRes?.data || [];
      const allUsers = usersRes?.data?.data || usersRes?.data || [];

      setSubjects(fetchedSubjects);
      setStats(statsRes?.data || null);
      setUsersMeta(usersRes?.data?.meta || usersRes?.meta || null);
      
      const enhancedUsers = allUsers.map((user: any) => {
        if (user.role === 'TUTOR') {
            const tutorData = fetchedTutors.find((t: any) => t.userId === user.id);
            return { ...user, entityId: tutorData?.id, entityData: tutorData };
        } else if (user.role === 'STUDENT') {
            const studentData = fetchedStudents.find((s: any) => s.userId === user.id);
            return { ...user, entityId: studentData?.id, entityData: studentData };
        }
        return user;
      });

      setUsersList(enhancedUsers);
      setSchedules(schedulesRes?.data || []);
      setScheduleMeta(schedulesRes?.meta || null);
      setSessions(sessionsRes?.data || []);
      setStats(statsRes?.data || null);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    }
  };

  const handleCreateTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tutorForm.subjectIds.length === 0) {
      toast.error("Please select at least one subject.");
      return;
    }
    setIsSubmitting(true);
    try {
      await adminService.createTutor({
        password: tutorForm.password || "password123",
        tutor: {
          name: tutorForm.name, email: tutorForm.email, contactNumber: tutorForm.contactNumber,
          hourlyRate: Number(tutorForm.hourlyRate), experience: Number(tutorForm.experience), qualification: tutorForm.qualification,
        },
        subjectIds: tutorForm.subjectIds
      });
      toast.success("Tutor created successfully!");
      setIsCreatingTutor(false);
      setTutorForm({
        name: "", email: "", password: "", contactNumber: "", 
        hourlyRate: "", experience: "", qualification: "", subjectIds: []
      });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create tutor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", subjectForm.name);
      if (subjectForm.description) formData.append("description", subjectForm.description);
      if (subjectIconFile) formData.append("file", subjectIconFile);
      
      await adminService.createSubject(formData);
      toast.success("Subject created successfully!");
      setIsCreatingSubject(false);
      setSubjectForm({ name: "", description: "" });
      setSubjectIconFile(null);
      setSubjectIconPreview(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create subject");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this subject deletion!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await adminService.deleteSubject(id);
        Swal.fire(
          'Deleted!',
          'The subject has been deleted.',
          'success'
        );
        fetchData();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete subject");
      }
    }
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setEditUserForm({
      name: user.name || "",
      contactNumber: user.entityData?.contactNumber || "",
      hourlyRate: user.entityData?.hourlyRate || "",
      experience: user.entityData?.experience || "",
      qualification: user.entityData?.qualification || "",
      status: user.status || "ACTIVE",
      createdAt: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : "",
      address: user.entityData?.address || "",
      gender: user.entityData?.gender || ""
    });
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Update Base User (status, join date)
      if (editUserForm.status && editUserForm.status !== editingUser.status) {
        await adminService.updateUserStatus(editingUser.id, { status: editUserForm.status });
      }

      const userPayload: any = {};
      if (editUserForm.createdAt) userPayload.createdAt = new Date(editUserForm.createdAt).toISOString();
      if (Object.keys(userPayload).length > 0) {
        await adminService.updateUser(editingUser.id, userPayload);
      }

      // 2. Update Role specific details
      if (editingUser.role === "TUTOR") {
        const payload: any = {};
        if (editUserForm.contactNumber) payload.contactNumber = editUserForm.contactNumber;
        if (editUserForm.hourlyRate) payload.hourlyRate = Number(editUserForm.hourlyRate);
        if (editUserForm.experience) payload.experience = Number(editUserForm.experience);
        if (editUserForm.qualification) payload.qualification = editUserForm.qualification;
        
        await adminService.updateTutor(editingUser.entityId, payload);
      } else if (editingUser.role === "STUDENT") {
        const payload: any = {};
        if (editUserForm.contactNumber) payload.contactNumber = editUserForm.contactNumber;
        if (editUserForm.address) payload.address = editUserForm.address;
        if (editUserForm.gender) payload.gender = editUserForm.gender;

        await adminService.updateStudent(editingUser.entityId, payload);
      }
      toast.success("User updated successfully!");
      setEditingUser(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (user: any) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will soft-delete the user!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        if (user.role === 'TUTOR') {
          await adminService.deleteTutor(user.entityId);
        } else if (user.role === 'STUDENT') {
          await adminService.deleteStudent(user.entityId);
        }
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
        fetchData();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await adminService.createSchedules(scheduleForm);
      toast.success("Schedules created successfully!");
      setScheduleForm({ startDate: "", endDate: "", startTime: "", endTime: "" });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create schedules");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this schedule deletion!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await adminService.deleteSchedule(id);
        Swal.fire(
          'Deleted!',
          'The schedule has been deleted.',
          'success'
        );
        fetchData();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete schedule");
      }
    }
  };

  const handleUpdateSessionStatus = async (id: string, status: string) => {
    try {
      await adminService.updateSessionStatus(id, { status });
      toast.success("Session status updated!");
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update session");
    }
  };

  const handleViewSession = async (sessionId: string) => {
    try {
      const res = await adminService.getSessionById(sessionId);
      if (res.data) {
        setSelectedSession(res.data);
        setIsSessionDetailOpen(true);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch session details");
    }
  };

  const handleSubjectToggle = (subjectId: string) => {
    setTutorForm(prev => ({
      ...prev,
      subjectIds: prev.subjectIds.includes(subjectId) 
        ? prev.subjectIds.filter(id => id !== subjectId)
        : [...prev.subjectIds, subjectId]
    }));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Platform Master Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Total Users: ${usersList.length} | Tutors: ${usersList.filter(u => u.role === "TUTOR").length} | Active Subjects: ${subjects.length}`, 14, 22);
    
    const tableColumn = ["Name", "Email", "Role", "Status", "Joined"];
    const tableRows: any[] = [];

    usersList.forEach(user => {
      const userData = [
        user.name,
        user.email,
        user.role,
        user.status || "ACTIVE",
        user.createdAt ? format(new Date(user.createdAt), "PP") : "N/A"
      ];
      tableRows.push(userData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
    });
    
    doc.save(`Platform_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    toast.success("Report exported successfully!");
  };

  // Filtered users for search
  const filteredUsers = usersList.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <DashboardHeader 
        title="Admin Portal"
        subtitle="System overview and management dashboard."
        onLogout={logout}
      />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 max-w-4xl mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="schedule">Master Schedule</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={usersMeta?.total || usersList.length}
              description="Active platform users"
              icon={<Users className="w-4 h-4 text-gray-400" />}
            />
            <StatCard
              title="Total Tutors"
              value={stats?.totalTutors || 0}
              description="Approved tutors"
              icon={<Users className="w-4 h-4 text-gray-400" />}
            />
            <StatCard
              title="Active Subjects"
              value={subjects.length}
              description="Live in system"
              icon={<BookOpen className="w-4 h-4 text-gray-400" />}
            />
            <StatCard
              title="Master Classes"
              value={stats?.totalSessions || 0}
              description="Total sessions"
              icon={<Calendar className="w-4 h-4 text-gray-400" />}
            />
            <StatCard
              title="Total Revenue"
              value={`$${stats?.totalRevenue || 0}`}
              description="Platform earnings"
              icon={<DollarSign className="w-4 h-4 text-gray-400" />}
            />
          </div>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users">
          {isCreatingTutor ? (
             <Card>
               <CardHeader className="flex flex-row justify-between items-center">
                 <div>
                   <CardTitle>Create New Tutor</CardTitle>
                   <CardDescription>Register a brand new tutor account in the system.</CardDescription>
                 </div>
                  <Button variant="outline" onClick={() => {
                    setIsCreatingTutor(false);
                    setTutorForm({
                      name: "", email: "", password: "", contactNumber: "", 
                      hourlyRate: "", experience: "", qualification: "", subjectIds: []
                    });
                  }}>Cancel</Button>
               </CardHeader>
               <CardContent>
                 <form onSubmit={handleCreateTutor} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input required value={tutorForm.name} onChange={e => setTutorForm({...tutorForm, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" required value={tutorForm.email} onChange={e => setTutorForm({...tutorForm, email: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Password</Label>
                        <Input type="password" required value={tutorForm.password} onChange={e => setTutorForm({...tutorForm, password: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact Number</Label>
                        <Input required value={tutorForm.contactNumber} onChange={e => setTutorForm({...tutorForm, contactNumber: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Hourly Rate ($)</Label>
                        <Input type="number" required value={tutorForm.hourlyRate} onChange={e => setTutorForm({...tutorForm, hourlyRate: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Years of Experience</Label>
                        <Input type="number" required value={tutorForm.experience} onChange={e => setTutorForm({...tutorForm, experience: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Highest Qualification</Label>
                      <Input required value={tutorForm.qualification} onChange={e => setTutorForm({...tutorForm, qualification: e.target.value})} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Assigned Subjects</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border p-4 rounded-md">
                         {subjects.length > 0 ? subjects.map(subject => (
                            <div key={subject.id} className="flex items-center space-x-2">
                              <input 
                                type="checkbox" 
                                id={subject.id}
                                checked={tutorForm.subjectIds.includes(subject.id)}
                                onChange={() => handleSubjectToggle(subject.id)}
                                className="rounded border-gray-300"
                              />
                              <Label htmlFor={subject.id} className="text-sm font-normal">{subject.name}</Label>
                            </div>
                         )) : (
                            <p className="text-sm text-gray-500">No subjects found. Please add subjects first.</p>
                         )}
                      </div>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
                      {isSubmitting ? "Creating..." : "Create Tutor Account"}
                    </Button>
                 </form>
               </CardContent>
             </Card>
          ) : editingUser ? (
             <Card>
               <CardHeader className="flex flex-row justify-between items-center bg-gray-50 border-b">
                 <div>
                   <CardTitle>Edit {editingUser.role === "TUTOR" ? "Tutor" : "Student"}</CardTitle>
                   <CardDescription>Update profile details for {editingUser.name}</CardDescription>
                 </div>
                 <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
               </CardHeader>
               <CardContent className="pt-6">
                 <form onSubmit={handleEditUser} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Base User Fields */}
                      <div className="space-y-2">
                        <Label>Account Status</Label>
                        <select 
                          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={editUserForm.status} 
                          onChange={e => setEditUserForm({...editUserForm, status: e.target.value})}
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="BLOCKED">BLOCKED</option>
                          <option value="PENDING">PENDING</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label>Join Date</Label>
                        <Input type="date" value={editUserForm.createdAt} onChange={e => setEditUserForm({...editUserForm, createdAt: e.target.value})} />
                      </div>

                      <div className="space-y-2">
                        <Label>Contact Number</Label>
                        <Input value={editUserForm.contactNumber} onChange={e => setEditUserForm({...editUserForm, contactNumber: e.target.value})} />
                      </div>
                      
                      {editingUser.role === "TUTOR" && (
                        <>
                          <div className="space-y-2">
                            <Label>Hourly Rate ($)</Label>
                            <Input type="number" value={editUserForm.hourlyRate} onChange={e => setEditUserForm({...editUserForm, hourlyRate: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <Label>Years of Experience</Label>
                            <Input type="number" value={editUserForm.experience} onChange={e => setEditUserForm({...editUserForm, experience: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <Label>Highest Qualification</Label>
                            <Input value={editUserForm.qualification} onChange={e => setEditUserForm({...editUserForm, qualification: e.target.value})} />
                          </div>
                        </>
                      )}

                      {editingUser.role === "STUDENT" && (
                        <>
                           <div className="space-y-2">
                            <Label>Address</Label>
                            <Input value={editUserForm.address} onChange={e => setEditUserForm({...editUserForm, address: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <Label>Gender</Label>
                            <select 
                              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              value={editUserForm.gender} 
                              onChange={e => setEditUserForm({...editUserForm, gender: e.target.value})}
                            >
                              <option value="">Select...</option>
                              <option value="MALE">MALE</option>
                              <option value="FEMALE">FEMALE</option>
                              <option value="OTHER">OTHER</option>
                            </select>
                          </div>
                        </>
                      )}
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                 </form>
               </CardContent>
             </Card>
          ) : (
            <Card>
              <CardHeader className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>View, approve, and manage tutors and students.</CardDescription>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input 
                      placeholder="Search users..." 
                      className="pl-9" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button onClick={() => setIsCreatingTutor(true)} className="gap-2 shrink-0">
                    <PlusCircle className="w-4 h-4" /> Create Tutor
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((u, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{u.name}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>{u.role}</TableCell>
                          <TableCell>
                            <Badge variant={u.status === "ACTIVE" ? "default" : "secondary"}>
                              {u.status || "ACTIVE"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-500">{u.createdAt ? format(new Date(u.createdAt), "PP") : "N/A"}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="outline" size="sm" onClick={() => openEditModal(u)}>Edit</Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(u)} className="text-red-500 hover:text-red-700 hover:bg-red-50">Delete</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredUsers.length === 0 && (
                     <div className="p-8 text-center text-gray-500">
                       {searchQuery ? "No users found matching your search." : "Loading users..."}
                     </div>
                  )}
                  {/* Pagination Controls */}
                  {usersMeta && usersMeta.totalPages > 1 && !searchQuery && (
                    <div className="flex items-center justify-between px-4 py-3 border-t">
                      <div className="text-sm text-gray-500">
                        Showing page {usersMeta.page} of {usersMeta.totalPages}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.min(usersMeta.totalPages, p + 1))}
                          disabled={currentPage === usersMeta.totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects">
          {isCreatingSubject ? (
            <Card className="max-w-4xl">
              <CardHeader className="flex flex-row justify-between items-center">
                 <div>
                   <CardTitle>Create New Subject</CardTitle>
                   <CardDescription>Add a new subject to the platform for tutoring.</CardDescription>
                 </div>
                 <Button variant="outline" onClick={() => { setIsCreatingSubject(false); setSubjectIconFile(null); setSubjectIconPreview(null); }}>Cancel</Button>
               </CardHeader>
               <CardContent>
                 <form onSubmit={handleCreateSubject} className="space-y-4">
                     <div className="space-y-2">
                       <Label>Subject Name</Label>
                       <Input required placeholder="e.g. Advanced Calculus" value={subjectForm.name} onChange={e => setSubjectForm({...subjectForm, name: e.target.value})} />
                     </div>
                     <div className="space-y-2">
                       <Label>Description (Optional)</Label>
                       <Input placeholder="Short description" value={subjectForm.description} onChange={e => setSubjectForm({...subjectForm, description: e.target.value})} />
                     </div>
                     <div className="space-y-2">
                       <Label className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Subject Icon (Optional)</Label>
                       <div className="flex items-center gap-4">
                         {subjectIconPreview ? (
                           <div className="relative w-16 h-16 rounded-lg border-2 border-blue-200 overflow-hidden bg-blue-50 flex items-center justify-center">
                             <img src={subjectIconPreview} alt="Icon preview" className="w-full h-full object-cover" />
                           </div>
                         ) : (
                           <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                             <ImageIcon className="w-6 h-6 text-gray-400" />
                           </div>
                         )}
                         <div className="flex-1">
                           <label className="flex flex-col items-start gap-1 cursor-pointer">
                             <span className="text-sm text-gray-500">Upload an icon image (PNG, JPG, SVG — max 2MB)</span>
                             <input
                               type="file"
                               id="subject-icon-upload-admin"
                               accept="image/*"
                               className="hidden"
                               onChange={(e) => {
                                 const file = e.target.files?.[0];
                                 if (file) {
                                   setSubjectIconFile(file);
                                   setSubjectIconPreview(URL.createObjectURL(file));
                                 }
                               }}
                             />
                             <Button
                               type="button"
                               variant="outline"
                               size="sm"
                               onClick={() => document.getElementById('subject-icon-upload-admin')?.click()}
                             >
                               {subjectIconFile ? "Change Image" : "Choose Image"}
                             </Button>
                             {subjectIconFile && (
                               <span className="text-xs text-green-600 font-medium">{subjectIconFile.name}</span>
                             )}
                           </label>
                         </div>
                       </div>
                     </div>
                     <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                       {isSubmitting ? "Adding..." : "Add Subject"}
                     </Button>
                  </form>
               </CardContent>
            </Card>
          ) : (
            <Card className="max-w-4xl">
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle>Subject Management</CardTitle>
                  <CardDescription>Add or remove subjects available for tutoring.</CardDescription>
                </div>
                <Button onClick={() => setIsCreatingSubject(true)}>+ Add Subject</Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjects.length > 0 ? subjects.map((subject) => (
                    <div key={subject.id} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        {subject.iconUrl ? (
                          <img src={subject.iconUrl} alt={subject.name} className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center border border-blue-200">
                            <BookOpen className="w-5 h-5 text-blue-400" />
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-gray-800">{subject.name}</span>
                          {subject.description && <p className="text-xs text-gray-500 mt-0.5">{subject.description}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2 text-gray-500">
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteSubject(subject.id)} className="hover:bg-red-50">
                          <XCircle className="w-5 h-5 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500 p-4">No subjects found. Add one to get started!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Master Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Master Schedules</CardTitle>
              <CardDescription>Generate available time slots for tutors to select.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateSchedule} className="flex flex-col md:flex-row gap-4 items-end">
                <div className="space-y-2 flex-1">
                  <Label>Start Date</Label>
                  <Input type="date" required value={scheduleForm.startDate} onChange={e => setScheduleForm({...scheduleForm, startDate: e.target.value})} />
                </div>
                <div className="space-y-2 flex-1">
                  <Label>End Date</Label>
                  <Input type="date" required value={scheduleForm.endDate} onChange={e => setScheduleForm({...scheduleForm, endDate: e.target.value})} />
                </div>
                <div className="space-y-2 flex-1">
                  <Label>Start Time</Label>
                  <Input type="time" required value={scheduleForm.startTime} onChange={e => setScheduleForm({...scheduleForm, startTime: e.target.value})} />
                </div>
                <div className="space-y-2 flex-1">
                  <Label>End Time</Label>
                  <Input type="time" required value={scheduleForm.endTime} onChange={e => setScheduleForm({...scheduleForm, endTime: e.target.value})} />
                </div>
                <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                  {isSubmitting ? "Creating..." : "Generate Slots"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>Master Schedule</CardTitle>
                <CardDescription>View and manage all generated schedule slots.</CardDescription>
              </div>
              <Button variant="outline" className="gap-2" onClick={exportToPDF}>
                <Download className="w-4 h-4" /> Export Report
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedules.map((schedule, i) => (
                      <TableRow key={schedule.id || i}>
                        <TableCell>{schedule.startTime ? format(new Date(schedule.startTime), "PP") : "N/A"}</TableCell>
                        <TableCell>{schedule.startTime ? format(new Date(schedule.startTime), "p") : schedule.startTime}</TableCell>
                        <TableCell>{schedule.endTime ? format(new Date(schedule.endTime), "p") : schedule.endTime}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteSchedule(schedule.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {schedules.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center p-8 text-gray-500">No schedules found. Generate some above.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {scheduleMeta && scheduleMeta.totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">
                    Showing page {scheduleMeta.page} of {scheduleMeta.totalPages} ({scheduleMeta.total} total schedules)
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={currentSchedulePage === 1}
                      onClick={() => setCurrentSchedulePage(prev => Math.max(prev - 1, 1))}
                    >
                      Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={currentSchedulePage === scheduleMeta.totalPages}
                      onClick={() => setCurrentSchedulePage(prev => prev + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Sessions Management</CardTitle>
              <CardDescription>View all platform bookings and manage their status.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Session ID</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Tutor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.map((session, i) => (
                      <TableRow key={session.id || i}>
                        <TableCell className="font-mono text-xs">{session.id.substring(0,8)}...</TableCell>
                        <TableCell>{session.student?.name || 'Unknown'}</TableCell>
                        <TableCell>{session.tutor?.name || 'Unknown'}</TableCell>
                        <TableCell>
                          <Badge variant={session.status === 'COMPLETED' ? 'default' : session.status === 'CANCELED' ? 'destructive' : 'secondary'}>
                            {session.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mr-2"
                            onClick={() => handleViewSession(session.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" /> View
                          </Button>
                          <select 
                            className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs"
                            value={session.status}
                            onChange={(e) => handleUpdateSessionStatus(session.id, e.target.value)}
                          >
                            <option value="SCHEDULED">SCHEDULED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELED">CANCELED</option>
                          </select>
                        </TableCell>
                      </TableRow>
                    ))}
                    {sessions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center p-8 text-gray-500">No sessions found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
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
