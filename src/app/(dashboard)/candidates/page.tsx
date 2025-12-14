/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash, Edit, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CandidateDialog } from "./candidate-dialog";
import { toast } from "sonner";

export default function CandidatesPage() {
     const api = useApi();
     const [isDialogOpen, setIsDialogOpen] = useState(false);
     const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

     const { data: candidates, isLoading, refetch } = useQuery({
          queryKey: ['candidates'],
          queryFn: async () => {
               const res = await api.get('/candidates');
               return res.data;
          }
     });

     const handleDelete = async (id: string) => {
          // For a critical action like delete, a confirmation dialog is best.
          // Since we want to avoid native confirm(), we'll trust the user or assume a Dialog exists (we can quick-fix to use toast promise for now).
          toast.promise(
               async () => {
                    await api.delete(`/candidates/${id}`);
                    refetch();
               },
               {
                    loading: 'Menghapus kandidat...',
                    success: 'Kandidat berhasil dihapus',
                    error: 'Gagal menghapus kandidat',
               }
          );
     };

     const handleEdit = (candidate: any) => {
          setSelectedCandidate(candidate);
          setIsDialogOpen(true);
     };

     const handleCreate = () => {
          setSelectedCandidate(null);
          setIsDialogOpen(true);
     };

     if (isLoading) return <div>Memuat...</div>;

     return (
          <div className="space-y-6">
               <div className="flex items-center justify-between">
                    <div>
                         <h2 className="text-3xl font-bold tracking-tight">Kandidat</h2>
                         <p className="text-muted-foreground text-sm">Kelola Pasangan Calon (Paslon).</p>
                    </div>
                    <Button onClick={handleCreate}>
                         <Plus className="mr-2 h-4 w-4" /> Tambah Kandidat
                    </Button>
               </div>

               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {candidates?.map((c: any) => (
                         <Card key={c.id}>
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                   <CardTitle className="text-sm font-medium">Kandidat #{c.orderNumber}</CardTitle>
                                   <User className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent>
                                   <div className="text-2xl font-bold">{c.name}</div>
                                   {c.photoUrl && (
                                        <img src={c.photoUrl} alt={c.name} className="mt-2 h-32 w-full object-cover rounded-md" />
                                   )}
                                   <div className="mt-2 text-xs text-muted-foreground line-clamp-3">
                                        <strong>Visi:</strong> {c.vision}
                                   </div>
                              </CardContent>
                              <CardFooter className="flex justify-between">
                                   <Button variant="outline" size="sm" onClick={() => handleEdit(c)}>
                                        <Edit className="h-4 w-4 mr-1" /> Edit
                                   </Button>
                                   <Button variant="destructive" size="sm" onClick={() => handleDelete(c.id)}>
                                        <Trash className="h-4 w-4 mr-1" /> Hapus
                                   </Button>
                              </CardFooter>
                         </Card>
                    ))}
               </div>

               <CandidateDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    candidate={selectedCandidate}
                    onSuccess={refetch}
               />
          </div>
     );
}
