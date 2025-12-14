/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileUp, Search, RefreshCw, Mail, CheckCircle2, Trash2 } from "lucide-react";
import { ImportModal } from "./import-modal";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

export default function StudentsPage() {
     const [search, setSearch] = useState("");
     const [isImportOpen, setIsImportOpen] = useState(false);
     const api = useApi();
     const { user } = useAuth();

     // React Query for Students
     const { data, isLoading, refetch } = useQuery({
          queryKey: ['students', search],
          queryFn: async () => {
               const res = await api.get(`/students?search=${search}`);
               return res.data;
          }
     });

     const handleResendOtp = async (nim: string) => {
          toast.promise(api.post('/auth/manual-otp', { identifier: nim }), {
               loading: 'Mengirim OTP...',
               success: 'OTP berhasil dikirim!',
               error: (err) => `Gagal pengiriman: ${err.response?.data?.message || "Unknown error"}`,
          });
     };

     const handleMarkAttendance = async (nim: string) => {
          toast.promise(
               async () => {
                    await api.post('/students/mark-attendance', { nim });
                    refetch();
               },
               {
                    loading: 'Menandai kehadiran...',
                    success: `Mahasiswa ${nim} ditandai sudah memilih!`,
                    error: (err) => `Gagal: ${err.response?.data?.message || "Error"}`,
               }
          );
     };

     const handleDeleteStudent = async (id: string, name: string) => {
          if (!confirm(`Apakah Anda yakin ingin menghapus data mahasiswa "${name}"? Data ini masih bisa dipulihkan oleh administrator database (Soft Delete).`)) return;

          toast.promise(
               async () => {
                    await api.delete(`/students/${id}`);
                    refetch();
               },
               {
                    loading: 'Menghapus data...',
                    success: 'Data mahasiswa berhasil dihapus (Soft Delete)',
                    error: 'Gagal menghapus data'
               }
          );
     };

     const students = data?.data || [];
     const isSuperAdmin = user?.role === 'super_admin';

     return (
          <div className="space-y-6">
               <div className="flex items-center justify-between">
                    <div>
                         <h2 className="text-3xl font-bold tracking-tight">Mahasiswa</h2>
                         <p className="text-muted-foreground text-sm">Kelola data pemilih dan monitor status voting.</p>
                    </div>
                    <Button onClick={() => setIsImportOpen(true)} className="gap-2">
                         <FileUp className="h-4 w-4" />
                         Import Excel
                    </Button>
               </div>

               <div className="flex items-center gap-2 max-w-sm">
                    <div className="relative flex-1">
                         <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                         <Input
                              placeholder="Cari nama atau NIM..."
                              className="pl-8"
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                         />
                    </div>
                    <Button variant="outline" size="icon" onClick={() => refetch()}>
                         <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
               </div>

               <div className="border rounded-lg bg-card overflow-x-auto">
                    <Table>
                         <TableHeader>
                              <TableRow>
                                   <TableHead>NIM</TableHead>
                                   <TableHead>Nama</TableHead>
                                   <TableHead>Email</TableHead>
                                   <TableHead>Status</TableHead>
                                   <TableHead className="text-right">Aksi</TableHead>
                              </TableRow>
                         </TableHeader>
                         <TableBody>
                              {students.map((student: any) => (
                                   <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.nim}</TableCell>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>{student.email}</TableCell>
                                        <TableCell>
                                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.hasVoted
                                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                  }`}>
                                                  {student.hasVoted ? "Sudah Memilih" : "Belum Memilih"}
                                             </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                             <div className="flex items-center justify-end gap-1">
                                                  {!student.hasVoted && (
                                                       <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => handleResendOtp(student.nim)}
                                                            title="Kirim Ulang OTP"
                                                       >
                                                            <Mail className="h-4 w-4" />
                                                       </Button>
                                                  )}
                                                  {!student.hasVoted && (
                                                       <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                            onClick={() => handleMarkAttendance(student.nim)}
                                                            title="Tandai Hadir (Offline)"
                                                       >
                                                            <CheckCircle2 className="h-4 w-4" />
                                                       </Button>
                                                  )}
                                                  {isSuperAdmin && (
                                                       <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDeleteStudent(student.id, student.name)}
                                                            title="Hapus Data (Soft Delete)"
                                                       >
                                                            <Trash2 className="h-4 w-4" />
                                                       </Button>
                                                  )}
                                             </div>
                                        </TableCell>
                                   </TableRow>
                              ))}
                         </TableBody>
                    </Table>
               </div>

               <ImportModal open={isImportOpen} onOpenChange={setIsImportOpen} />
          </div>
     );
}
