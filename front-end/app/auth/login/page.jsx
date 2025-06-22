"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [showPassword, setShowPassword] = useState(false);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState("");
     const router = useRouter();

     const handleSubmit = async (e) => {
          e.preventDefault();
          setLoading(true);
          setError("");

          try {
               const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                         Accept: "application/json",
                    },
                    body: JSON.stringify({
                         email,
                         password,
                    }),
               });

               const data = await response.json();

               if (response.ok && data.status === "success") {
                    // Store token and user data
                    localStorage.setItem("auth_token", data.token);
                    localStorage.setItem("user_data", JSON.stringify(data.user));

                    // Redirect to homepage
                    router.push("/");
               } else {
                    setError(data.message || "Login failed. Please check your credentials.");
               }
          } catch (error) {
               setError("Network error. Please try again.");
               console.error("Login error:", error);
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
               <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1 text-center">
                         <div className="flex justify-center mb-4">
                              <BookOpen className="h-12 w-12 text-blue-600" />
                         </div>
                         <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                         <CardDescription>Sign in to your ScholarshipMedia account</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <form onSubmit={handleSubmit} className="space-y-4">
                              {error && (
                                   <Alert variant="destructive">
                                        <AlertDescription>{error}</AlertDescription>
                                   </Alert>
                              )}

                              <div className="space-y-2">
                                   <Label htmlFor="email">Email</Label>
                                   <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                   />
                              </div>

                              <div className="space-y-2">
                                   <Label htmlFor="password">Password</Label>
                                   <div className="relative">
                                        <Input
                                             id="password"
                                             type={showPassword ? "text" : "password"}
                                             placeholder="Enter your password"
                                             value={password}
                                             onChange={(e) => setPassword(e.target.value)}
                                             required
                                        />
                                        <Button
                                             type="button"
                                             variant="ghost"
                                             size="sm"
                                             className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                             onClick={() => setShowPassword(!showPassword)}
                                        >
                                             {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                   </div>
                              </div>

                              <Button type="submit" className="w-full" disabled={loading}>
                                   {loading ? "Signing in..." : "Sign In"}
                              </Button>
                         </form>

                         <div className="mt-6 text-center text-sm">
                              <span className="text-gray-600">{"Don't have an account? "}</span>
                              <Link href="/register" className="text-blue-600 hover:underline font-medium">
                                   Sign up
                              </Link>
                         </div>
                    </CardContent>
               </Card>
          </div>
     );
}
