"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Users, Award, TrendingUp, LogOut } from "lucide-react";

export default function HomePage() {
     const [user, setUser] = useState(null);
     const [loading, setLoading] = useState(true);
     const router = useRouter();

     useEffect(() => {
          const token = localStorage.getItem("auth_token");
          const userData = localStorage.getItem("user_data");

          if (!token || !userData) {
               router.push("/auth/login");
               return;
          }

          try {
               setUser(JSON.parse(userData));
          } catch (error) {
               console.error("Error parsing user data:", error);
               router.push("/auth/login");
          } finally {
               setLoading(false);
          }
     }, [router]);

     const handleLogout = () => {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user_data");
          router.push("/auth/login");
     };

     if (loading) {
          return (
               <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
               </div>
          );
     }

     if (!user) {
          return null;
     }

     const getInitials = (name) => {
          return name
               .split(" ")
               .map((n) => n[0])
               .join("")
               .toUpperCase();
     };

     return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
               {/* Header */}
               <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="flex justify-between items-center h-16">
                              <div className="flex items-center space-x-3">
                                   <BookOpen className="h-8 w-8 text-blue-600" />
                                   <h1 className="text-xl font-bold text-gray-900">ScholarshipMedia</h1>
                              </div>
                              <div className="flex items-center space-x-4">
                                   <Avatar>
                                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                   </Avatar>
                                   <div className="hidden sm:block">
                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                   </div>
                                   <Button variant="outline" size="sm" onClick={handleLogout}>
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                   </Button>
                              </div>
                         </div>
                    </div>
               </header>

               {/* Main Content */}
               <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                         <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name.split(" ")[0]}!</h2>
                         <p className="text-gray-600">Discover scholarship opportunities and manage your applications</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                         <Card>
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                   <CardTitle className="text-sm font-medium">Available Scholarships</CardTitle>
                                   <Award className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                   <div className="text-2xl font-bold">1,234</div>
                                   <p className="text-xs text-muted-foreground">+20% from last month</p>
                              </CardContent>
                         </Card>

                         <Card>
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                   <CardTitle className="text-sm font-medium">Applications Submitted</CardTitle>
                                   <TrendingUp className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                   <div className="text-2xl font-bold">12</div>
                                   <p className="text-xs text-muted-foreground">+3 this week</p>
                              </CardContent>
                         </Card>

                         <Card>
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                   <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                                   <Award className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                   <div className="text-2xl font-bold">75%</div>
                                   <p className="text-xs text-muted-foreground">Above average</p>
                              </CardContent>
                         </Card>

                         <Card>
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                   <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                                   <Users className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                   <div className="text-2xl font-bold">45,231</div>
                                   <p className="text-xs text-muted-foreground">+1,234 new users</p>
                              </CardContent>
                         </Card>
                    </div>

                    {/* User Profile Card */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                         <Card className="lg:col-span-1">
                              <CardHeader>
                                   <CardTitle>Profile Information</CardTitle>
                                   <CardDescription>Your account details</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   <div className="flex items-center space-x-4">
                                        <Avatar className="h-16 w-16">
                                             <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                             <h3 className="font-semibold text-lg">{user.name}</h3>
                                             <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                   </div>
                                   <div className="space-y-2">
                                        <div>
                                             <label className="text-sm font-medium text-gray-500">Member Since</label>
                                             <p className="text-sm">{new Date(user.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                             <label className="text-sm font-medium text-gray-500">Email Status</label>
                                             <p className="text-sm">
                                                  {user.email_verified_at ? (
                                                       <span className="text-green-600">Verified</span>
                                                  ) : (
                                                       <span className="text-orange-600">Unverified</span>
                                                  )}
                                             </p>
                                        </div>
                                        <div>
                                             <label className="text-sm font-medium text-gray-500">User ID</label>
                                             <p className="text-sm">#{user.id}</p>
                                        </div>
                                   </div>
                              </CardContent>
                         </Card>

                         <Card className="lg:col-span-2">
                              <CardHeader>
                                   <CardTitle>Recent Activity</CardTitle>
                                   <CardDescription>Your latest scholarship activities</CardDescription>
                              </CardHeader>
                              <CardContent>
                                   <div className="space-y-4">
                                        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                                             <Award className="h-5 w-5 text-blue-600" />
                                             <div>
                                                  <p className="text-sm font-medium">Applied to Merit Scholarship</p>
                                                  <p className="text-xs text-gray-500">2 hours ago</p>
                                             </div>
                                        </div>
                                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                             <TrendingUp className="h-5 w-5 text-green-600" />
                                             <div>
                                                  <p className="text-sm font-medium">Profile completion increased to 85%</p>
                                                  <p className="text-xs text-gray-500">1 day ago</p>
                                             </div>
                                        </div>
                                        <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                                             <BookOpen className="h-5 w-5 text-purple-600" />
                                             <div>
                                                  <p className="text-sm font-medium">New scholarship recommendations available</p>
                                                  <p className="text-xs text-gray-500">3 days ago</p>
                                             </div>
                                        </div>
                                   </div>
                              </CardContent>
                         </Card>
                    </div>
               </main>
          </div>
     );
}
