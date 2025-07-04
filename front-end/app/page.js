"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { BookOpen, LogOut, Plus, Search, Filter } from "lucide-react";
import ScholarshipFeed from "@/components/scholarship-feed";
import CreateScholarshipModal from "@/components/create-scholarship-modal";
import SearchFilters from "@/components/search-filters";

export default function HomePage() {
     const [user, setUser] = useState(null);
     const [loading, setLoading] = useState(true);
     const [showCreateModal, setShowCreateModal] = useState(false);
     const [showFilters, setShowFilters] = useState(false);
     const [searchQuery, setSearchQuery] = useState("");
     const router = useRouter();

     useEffect(() => {
          const token = localStorage.getItem("auth_token");
          const userData = localStorage.getItem("user_data");

          if (!token || !userData) {
               router.push("/login");
               return;
          }

          try {
               setUser(JSON.parse(userData));
          } catch (error) {
               console.error("Error parsing user data:", error);
               router.push("/login");
          } finally {
               setLoading(false);
          }
     }, [router]);

     const handleLogout = () => {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user_data");
          router.push("/login");
     };

     const getInitials = (name) => {
          return name
               .split(" ")
               .map((n) => n[0])
               .join("")
               .toUpperCase();
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

     return (
          <div className="min-h-screen bg-gray-50">
               {/* Header */}
               <header className="bg-white shadow-sm border-b sticky top-0 z-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="flex justify-between items-center h-16">
                              <div className="flex items-center space-x-3">
                                   <BookOpen className="h-8 w-8 text-blue-600" />
                                   <h1 className="text-xl font-bold text-gray-900">ScholarshipMedia</h1>
                              </div>

                              {/* Search Bar */}
                              <div className="hidden md:flex flex-1 max-w-md mx-8">
                                   <div className="relative w-full">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                             placeholder="Search scholarships..."
                                             value={searchQuery}
                                             onChange={(e) => setSearchQuery(e.target.value)}
                                             className="pl-10"
                                        />
                                   </div>
                              </div>

                              <div className="flex items-center space-x-4">
                                   <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} className="hidden md:flex">
                                        <Filter className="h-4 w-4 mr-2" />
                                        Filters
                                   </Button>
                                   <Button variant="default" size="sm" onClick={() => setShowCreateModal(true)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Post
                                   </Button>
                                   <Avatar className="cursor-pointer">
                                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                   </Avatar>
                                   <Button variant="outline" size="sm" onClick={handleLogout}>
                                        <LogOut className="h-4 w-4" />
                                   </Button>
                              </div>
                         </div>

                         {/* Mobile Search */}
                         <div className="md:hidden pb-4">
                              <div className="relative">
                                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                   <Input
                                        placeholder="Search scholarships..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                   />
                              </div>
                         </div>
                    </div>
               </header>

               {/* Main Content */}
               <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Filters */}
                    {showFilters && (
                         <div className="mb-6">
                              <SearchFilters onFiltersChange={(filters) => console.log(filters)} />
                         </div>
                    )}

                    {/* Scholarship Feed */}
                    <ScholarshipFeed searchQuery={searchQuery} />
               </main>

               {/* Create Scholarship Modal */}
               <CreateScholarshipModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                         setShowCreateModal(false);
                         // Refresh feed
                         window.location.reload();
                    }}
               />
          </div>
     );
}
