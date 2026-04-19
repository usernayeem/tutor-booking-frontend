"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, DollarSign, BookOpen, Calendar, CheckCircle2, XCircle, Search } from "lucide-react";
import { toast } from "sonner";
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

  const handleAction = (action: string) => {
    toast.success(`Action '${action}' executed successfully!`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-600 mt-1">System overview and management dashboard.</p>
        </div>
        <Button onClick={() => logout()} variant="outline" className="border-gray-300">
          Log out
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-3xl mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="schedule">Master Schedule</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-600 text-sm font-medium flex items-center justify-between">
                  Total Users
                  <Users className="w-4 h-4 text-gray-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">12,450</p>
                <p className="text-sm text-green-600 mt-1">+12% from last month</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-600 text-sm font-medium flex items-center justify-between">
                  Total Revenue
                  <DollarSign className="w-4 h-4 text-gray-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">$45,231</p>
                <p className="text-sm text-green-600 mt-1">+8% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-600 text-sm font-medium flex items-center justify-between">
                  Active Subjects
                  <BookOpen className="w-4 h-4 text-gray-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">42</p>
                <p className="text-sm text-gray-500 mt-1">3 pending approval</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-600 text-sm font-medium flex items-center justify-between">
                  Classes Today
                  <Calendar className="w-4 h-4 text-gray-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-gray-900">184</p>
                <p className="text-sm text-blue-600 mt-1">24 currently live</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View, approve, and manage tutors and students.</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input placeholder="Search users..." className="pl-9" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: "Dr. Sarah Jenkins", role: "Tutor", status: "Active", date: "Oct 12, 2023" },
                      { name: "John Doe", role: "Student", status: "Active", date: "Nov 05, 2023" },
                      { name: "Emily Chen", role: "Tutor", status: "Pending", date: "Today" },
                      { name: "Michael Chang", role: "Student", status: "Suspended", date: "Aug 20, 2023" },
                    ].map((u, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell>{u.role}</TableCell>
                        <TableCell>
                          <Badge variant={u.status === "Active" ? "default" : u.status === "Pending" ? "secondary" : "destructive"}>
                            {u.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500">{u.date}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleAction("Edit User")}>Edit</Button>
                          {u.status === "Pending" && (
                            <Button size="sm" className="bg-green-600" onClick={() => handleAction("Approve Tutor")}>Approve</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects">
          <Card className="max-w-4xl">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>Subject Management</CardTitle>
                <CardDescription>Add or remove subjects available for tutoring.</CardDescription>
              </div>
              <Button onClick={() => handleAction("Add New Subject")}>+ Add Subject</Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Advanced Mathematics", "Physics", "Chemistry", "Spanish Language", "Computer Science", "Biology", "English Literature"].map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <span className="font-medium">{subject}</span>
                    <div className="flex gap-2 text-gray-500">
                      <Button variant="ghost" size="icon" onClick={() => handleAction("Edit Subject")}>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleAction("Delete Subject")}>
                        <XCircle className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Master Schedule Tab */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Master Schedule</CardTitle>
              <CardDescription>Overview of all bookings across the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-12 text-center text-gray-500 border-2 border-dashed rounded-xl">
                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Global Calendar View</h3>
                <p className="mt-2">This module would display a full-screen calendar view of all platform sessions.</p>
                <Button className="mt-4" onClick={() => handleAction("Export Schedule Data")}>Export Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
