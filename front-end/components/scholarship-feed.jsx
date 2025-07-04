"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Bookmark, MapPin, Calendar, GraduationCap, Percent, BookOpen } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ScholarshipFeed({ searchQuery }) {
     const [scholarships, setScholarships] = useState([]);
     const [loading, setLoading] = useState(true);
     const [likedPosts, setLikedPosts] = useState(new Set());
     const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());

     useEffect(() => {
          fetchScholarships();
     }, [searchQuery]);

     const fetchScholarships = async () => {
          try {
               const token = localStorage.getItem("auth_token");
               let url = "http://localhost:8000/api/scholarships";

               if (searchQuery) {
                    url += `?search=${encodeURIComponent(searchQuery)}`;
               }

               const response = await fetch(url, {
                    headers: {
                         Authorization: `Bearer ${token}`,
                         Accept: "application/json",
                    },
               });

               const data = await response.json();
               if (data.scholarships) {
                    setScholarships(data.scholarships);
               }
          } catch (error) {
               console.error("Error fetching scholarships:", error);
          } finally {
               setLoading(false);
          }
     };

     const handleLike = async (scholarshipId) => {
          try {
               const token = localStorage.getItem("auth_token");
               const response = await fetch(`http://localhost:8000/api/scholarships/${scholarshipId}/like`, {
                    method: "POST",
                    headers: {
                         Authorization: `Bearer ${token}`,
                         Accept: "application/json",
                    },
               });

               const data = await response.json();

               // Update local state
               setScholarships((prev) =>
                    prev.map((scholarship) => (scholarship.id === scholarshipId ? { ...scholarship, likes_count: data.likes_count } : scholarship))
               );

               // Toggle liked state
               setLikedPosts((prev) => {
                    const newSet = new Set(prev);
                    if (newSet.has(scholarshipId)) {
                         newSet.delete(scholarshipId);
                    } else {
                         newSet.add(scholarshipId);
                    }
                    return newSet;
               });
          } catch (error) {
               console.error("Error liking scholarship:", error);
          }
     };

     const handleBookmark = async (scholarshipId) => {
          try {
               const token = localStorage.getItem("auth_token");
               const response = await fetch(`http://localhost:8000/api/scholarships/${scholarshipId}/bookmark`, {
                    method: "POST",
                    headers: {
                         Authorization: `Bearer ${token}`,
                         Accept: "application/json",
                    },
               });

               const data = await response.json();

               // Update local state
               setScholarships((prev) =>
                    prev.map((scholarship) =>
                         scholarship.id === scholarshipId ? { ...scholarship, bookmarks_count: data.bookmarks_count } : scholarship
                    )
               );

               // Toggle bookmarked state
               setBookmarkedPosts((prev) => {
                    const newSet = new Set(prev);
                    if (newSet.has(scholarshipId)) {
                         newSet.delete(scholarshipId);
                    } else {
                         newSet.add(scholarshipId);
                    }
                    return newSet;
               });
          } catch (error) {
               console.error("Error bookmarking scholarship:", error);
          }
     };

     const formatDate = (dateString) => {
          return new Date(dateString).toLocaleDateString("en-US", {
               year: "numeric",
               month: "short",
               day: "numeric",
          });
     };

     if (loading) {
          return (
               <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                         <Card key={i} className="animate-pulse">
                              <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                              <CardContent className="p-4">
                                   <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                   <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              </CardContent>
                         </Card>
                    ))}
               </div>
          );
     }

     return (
          <div className="space-y-6">
               {scholarships.map((scholarship) => (
                    <Card key={scholarship.id} className="overflow-hidden">
                         {/* Post Header */}
                         <div className="flex items-center justify-between p-4 border-b">
                              <div className="flex items-center space-x-3">
                                   <Avatar>
                                        <AvatarFallback>SM</AvatarFallback>
                                   </Avatar>
                                   <div>
                                        <p className="font-semibold text-sm">ScholarshipMedia</p>
                                        <p className="text-xs text-gray-500">{formatDate(scholarship.created_at)}</p>
                                   </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                   <Badge variant="secondary" className="text-xs">
                                        {scholarship.type}
                                   </Badge>
                                   <Badge variant="outline" className="text-xs">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {scholarship.country}
                                   </Badge>
                              </div>
                         </div>

                         {/* Scholarship Image */}
                         <div className="relative aspect-square max-h-96 overflow-hidden">
                              <img
                                   src={`http://localhost:8000/storage/${scholarship.image}`}
                                   alt={scholarship.title}
                                   className="w-full h-full object-cover"
                              />
                              <div className="absolute top-4 right-4">
                                   <Badge className="bg-blue-600 text-white">
                                        <Percent className="h-3 w-3 mr-1" />
                                        {scholarship.scholarship_percentage}%
                                   </Badge>
                              </div>
                         </div>

                         {/* Post Actions */}
                         <div className="flex items-center justify-between p-4 border-b">
                              <div className="flex items-center space-x-4">
                                   <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleLike(scholarship.id)}
                                        className={`p-2 ${likedPosts.has(scholarship.id) ? "text-red-500" : "text-gray-600"}`}
                                   >
                                        <Heart className={`h-5 w-5 ${likedPosts.has(scholarship.id) ? "fill-current" : ""}`} />
                                   </Button>
                                   <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleBookmark(scholarship.id)}
                                        className={`p-2 ${bookmarkedPosts.has(scholarship.id) ? "text-blue-500" : "text-gray-600"}`}
                                   >
                                        <Bookmark className={`h-5 w-5 ${bookmarkedPosts.has(scholarship.id) ? "fill-current" : ""}`} />
                                   </Button>
                              </div>
                         </div>

                         {/* Post Content */}
                         <CardContent className="p-4">
                              <div className="space-y-3">
                                   {/* Likes and Bookmarks Count */}
                                   <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <span>{scholarship.likes_count} likes</span>
                                        <span>{scholarship.bookmarks_count} bookmarks</span>
                                   </div>

                                   {/* Title and Description */}
                                   <div>
                                        <h3 className="font-bold text-lg mb-2">{scholarship.title}</h3>
                                        <p className="text-gray-700 text-sm leading-relaxed">{scholarship.description}</p>
                                   </div>

                                   {/* Requirements */}
                                   <div className="bg-gray-50 p-3 rounded-lg">
                                        <div className="flex items-center mb-2">
                                             <GraduationCap className="h-4 w-4 text-blue-600 mr-2" />
                                             <span className="font-medium text-sm">Requirements</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{scholarship.requirements}</p>
                                   </div>

                                   {/* Deadline */}
                                   <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        <span>Deadline: {formatDate(scholarship.application_deadline)}</span>
                                   </div>
                              </div>
                         </CardContent>
                    </Card>
               ))}

               {scholarships.length === 0 && !loading && (
                    <div className="text-center py-12">
                         <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                         <h3 className="text-lg font-medium text-gray-900 mb-2">No scholarships found</h3>
                         <p className="text-gray-500">Try adjusting your search or filters</p>
                    </div>
               )}
          </div>
     );
}
