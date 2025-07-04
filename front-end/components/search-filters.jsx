"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SearchFilters({ onFiltersChange }) {
     const [filters, setFilters] = useState({
          country: "all",
          type: "all",
     });

     const handleFilterChange = (key, value) => {
          const newFilters = { ...filters, [key]: value };
          setFilters(newFilters);
          onFiltersChange(newFilters);
     };

     const clearFilters = () => {
          setFilters({ country: "all", type: "all" });
          onFiltersChange({});
     };

     return (
          <Card>
               <CardContent className="p-4">
                    <div className="flex flex-wrap items-end gap-4">
                         <div className="space-y-2">
                              <Label>Country</Label>
                              <Select value={filters.country} onValueChange={(value) => handleFilterChange("country", value)}>
                                   <SelectTrigger className="w-40">
                                        <SelectValue placeholder="All Countries" />
                                   </SelectTrigger>
                                   <SelectContent>
                                        <SelectItem value="all">All Countries</SelectItem>
                                        <SelectItem value="Japan">Japan</SelectItem>
                                        <SelectItem value="Korea">Korea</SelectItem>
                                        <SelectItem value="USA">USA</SelectItem>
                                        <SelectItem value="UK">UK</SelectItem>
                                        <SelectItem value="Canada">Canada</SelectItem>
                                        <SelectItem value="Australia">Australia</SelectItem>
                                   </SelectContent>
                              </Select>
                         </div>

                         <div className="space-y-2">
                              <Label>Type</Label>
                              <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                                   <SelectTrigger className="w-32">
                                        <SelectValue placeholder="All Types" />
                                   </SelectTrigger>
                                   <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="local">Local</SelectItem>
                                        <SelectItem value="abroad">Abroad</SelectItem>
                                        <SelectItem value="online">Online</SelectItem>
                                   </SelectContent>
                              </Select>
                         </div>

                         <Button variant="outline" onClick={clearFilters}>
                              Clear Filters
                         </Button>
                    </div>
               </CardContent>
          </Card>
     );
}
