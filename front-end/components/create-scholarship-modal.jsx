"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X } from "lucide-react";

export default function CreateScholarshipModal({ isOpen, onClose, onSuccess }) {
     const [formData, setFormData] = useState({
          title: "",
          description: "",
          type: "",
          country: "",
          scholarship_percentage: "",
          requirements: "",
          application_deadline: "",
     });
     const [image, setImage] = useState(null);
     const [imagePreview, setImagePreview] = useState(null);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState("");

     const handleInputChange = (field, value) => {
          setFormData((prev) => ({ ...prev, [field]: value }));
     };

     const handleImageChange = (e) => {
          const file = e.target.files?.[0];
          if (file) {
               if (file.size > 2 * 1024 * 1024) {
                    // 2MB limit
                    setError("Image size must be less than 2MB");
                    return;
               }
               setImage(file);
               const reader = new FileReader();
               reader.onload = () => setImagePreview(reader.result);
               reader.readAsDataURL(file);
               setError("");
          }
     };

     const removeImage = () => {
          setImage(null);
          setImagePreview(null);
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          setLoading(true);
          setError("");

          try {
               const token = localStorage.getItem("auth_token");
               const formDataToSend = new FormData();

               // Append all form fields
               Object.entries(formData).forEach(([key, value]) => {
                    formDataToSend.append(key, value);
               });

               if (image) {
                    formDataToSend.append("image", image);
               }

               const response = await fetch("http://localhost:8000/api/scholarships", {
                    method: "POST",
                    headers: {
                         Authorization: `Bearer ${token}`,
                         Accept: "application/json",
                    },
                    body: formDataToSend,
               });

               const data = await response.json();

               if (response.ok) {
                    onSuccess();
                    // Reset form
                    setFormData({
                         title: "",
                         description: "",
                         type: "",
                         country: "",
                         scholarship_percentage: "",
                         requirements: "",
                         application_deadline: "",
                    });
                    setImage(null);
                    setImagePreview(null);
               } else {
                    setError(data.message || "Failed to create scholarship");
               }
          } catch (error) {
               setError("Network error. Please try again.");
               console.error("Error creating scholarship:", error);
          } finally {
               setLoading(false);
          }
     };

     return (
          <Dialog open={isOpen} onOpenChange={onClose}>
               <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                         <DialogTitle>Create New Scholarship</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                         {error && (
                              <Alert variant="destructive">
                                   <AlertDescription>{error}</AlertDescription>
                              </Alert>
                         )}

                         {/* Image Upload */}
                         <div className="space-y-2">
                              <Label>Scholarship Image</Label>
                              {imagePreview ? (
                                   <div className="relative">
                                        <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                                        <Button
                                             type="button"
                                             variant="destructive"
                                             size="sm"
                                             className="absolute top-2 right-2"
                                             onClick={removeImage}
                                        >
                                             <X className="h-4 w-4" />
                                        </Button>
                                   </div>
                              ) : (
                                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600 mb-2">Upload scholarship image</p>
                                        <Input type="file" accept="image/*" onChange={handleImageChange} className="max-w-xs mx-auto" />
                                        <p className="text-xs text-gray-500 mt-1">Max size: 2MB</p>
                                   </div>
                              )}
                         </div>

                         {/* Title */}
                         <div className="space-y-2">
                              <Label htmlFor="title">Title</Label>
                              <Input
                                   id="title"
                                   value={formData.title}
                                   onChange={(e) => handleInputChange("title", e.target.value)}
                                   placeholder="Enter scholarship title"
                                   required
                              />
                         </div>

                         {/* Description */}
                         <div className="space-y-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                   id="description"
                                   value={formData.description}
                                   onChange={(e) => handleInputChange("description", e.target.value)}
                                   placeholder="Enter scholarship description"
                                   rows={4}
                                   required
                              />
                         </div>

                         {/* Type and Country */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                   <Label htmlFor="type">Type</Label>
                                   <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                                        <SelectTrigger>
                                             <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="local">Local</SelectItem>
                                             <SelectItem value="abroad">Abroad</SelectItem>
                                             <SelectItem value="online">Online</SelectItem>
                                        </SelectContent>
                                   </Select>
                              </div>

                              <div className="space-y-2">
                                   <Label htmlFor="country">Country</Label>
                                   <Input
                                        id="country"
                                        value={formData.country}
                                        onChange={(e) => handleInputChange("country", e.target.value)}
                                        placeholder="Enter country"
                                        required
                                   />
                              </div>
                         </div>

                         {/* Scholarship Percentage */}
                         <div className="space-y-2">
                              <Label htmlFor="scholarship_percentage">Scholarship Percentage</Label>
                              <Input
                                   id="scholarship_percentage"
                                   value={formData.scholarship_percentage}
                                   onChange={(e) => handleInputChange("scholarship_percentage", e.target.value)}
                                   placeholder="Enter percentage (e.g., 100)"
                                   required
                              />
                         </div>

                         {/* Requirements */}
                         <div className="space-y-2">
                              <Label htmlFor="requirements">Requirements</Label>
                              <Textarea
                                   id="requirements"
                                   value={formData.requirements}
                                   onChange={(e) => handleInputChange("requirements", e.target.value)}
                                   placeholder="Enter scholarship requirements"
                                   rows={3}
                                   required
                              />
                         </div>

                         {/* Application Deadline */}
                         <div className="space-y-2">
                              <Label htmlFor="application_deadline">Application Deadline</Label>
                              <Input
                                   id="application_deadline"
                                   type="datetime-local"
                                   value={formData.application_deadline}
                                   onChange={(e) => handleInputChange("application_deadline", e.target.value)}
                                   required
                              />
                         </div>

                         {/* Submit Button */}
                         <div className="flex justify-end space-x-2 pt-4">
                              <Button type="button" variant="outline" onClick={onClose}>
                                   Cancel
                              </Button>
                              <Button type="submit" disabled={loading}>
                                   {loading ? "Creating..." : "Create Scholarship"}
                              </Button>
                         </div>
                    </form>
               </DialogContent>
          </Dialog>
     );
}
