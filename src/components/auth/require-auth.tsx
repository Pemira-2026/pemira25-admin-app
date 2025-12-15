"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
     const { user, loading } = useAuth();
     const router = useRouter();

     useEffect(() => {
          if (!loading && !user) {
               router.push("/login");
          }
     }, [user, loading, router]);

     if (loading) {
          return (
               <div className="flex h-screen w-full bg-muted/40">
                    {/* Sidebar Skeleton */}
                    <div className="hidden md:flex w-64 flex-col border-r bg-background pt-4 px-4 space-y-6">
                         <div className="flex items-center gap-3 px-2">
                              <Skeleton className="h-8 w-8 rounded-full" />
                              <div className="space-y-1">
                                   <Skeleton className="h-4 w-24" />
                                   <Skeleton className="h-3 w-16" />
                              </div>
                         </div>
                         <div className="space-y-2">
                              {[1, 2, 3, 4, 5].map((i) => (
                                   <Skeleton key={i} className="h-10 w-full rounded-md" />
                              ))}
                         </div>
                    </div>

                    {/* Main Content Skeleton */}
                    <div className="flex-1 flex flex-col">
                         <div className="h-14 border-b bg-background flex items-center px-6 justify-between">
                              <Skeleton className="h-5 w-32" />
                              <Skeleton className="h-8 w-8 rounded-full" />
                         </div>
                         <div className="flex-1 p-6 space-y-6 overflow-hidden">
                              <div className="flex justify-between items-center">
                                   <div className="space-y-2">
                                        <Skeleton className="h-8 w-48" />
                                        <Skeleton className="h-4 w-64" />
                                   </div>
                                   <Skeleton className="h-9 w-32" />
                              </div>
                              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                   {[1, 2, 3].map((i) => (
                                        <div key={i} className="rounded-xl border bg-card text-card-foreground shadow-sm h-48 p-6 space-y-4">
                                             <Skeleton className="h-24 w-full rounded-md" />
                                             <div className="space-y-2">
                                                  <Skeleton className="h-4 w-3/4" />
                                                  <Skeleton className="h-4 w-1/2" />
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         </div>
                    </div>
               </div>
          );
     }

     if (!user) {
          return null; // Will redirect via useEffect
     }

     return <>{children}</>;
}
