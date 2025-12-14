/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export default function CommitteePage() {
     const api = useApi();
     const [isAddOpen, setIsAddOpen] = useState(false);
     const [searchQuery, setSearchQuery] = useState("");
     const [searchResults, setSearchResults] = useState<any[]>([]);

     // Password Dialog State
     const [isPasswordOpen, setIsPasswordOpen] = useState(false);
     const [selectedUser, setSelectedUser] = useState<any>(null);
     const [password, setPassword] = useState("");

     const { data: users, isLoading, refetch } = useQuery({
          queryKey: ['committee-users'],
          queryFn: async () => {
               const res = await api.get('/admin/users');
               // Filter only admins/panitia
               return res.data.filter((u: any) => u.role !== 'voter'); // Show only non-voters
          }
     });

     const handleSearch = async () => {
          if (!searchQuery) return;
          try {
               const res = await api.get(`/students?search=${searchQuery}`);
               setSearchResults(res.data.data);
          } catch (error) {
               console.error(error);
          }
     };

     const handlePromoteClick = (user: any) => {
          setSelectedUser(user);
          setPassword(""); // Reset password
          setIsPasswordOpen(true);
     };

     const handleConfirmPromote = async () => {
          if (!selectedUser || !password) return;

          toast.promise(
               async () => {
                    await api.patch(`/admin/users/${selectedUser.id}/role`, {
                         role: 'panitia',
                         password: password
                    });
                    setIsPasswordOpen(false);
                    setIsAddOpen(false);
                    setSelectedUser(null);
                    refetch();
               },
               {
                    loading: 'Mempromosikan pengguna...',
                    success: 'Pengguna berhasil dipromosikan dan password telah diatur',
                    error: 'Gagal mempromosikan pengguna'
               }
          );
     };

     const handleDemote = async (id: string) => {
          toast.promise(
               async () => {
                    await api.patch(`/admin/users/${id}/role`, { role: 'voter' });
                    refetch();
               },
               {
                    loading: 'Mendemosi pengguna...',
                    success: 'Pengguna dikembalikan menjadi Pemilih (Voter)',
                    error: 'Gagal mendemosi pengguna'
               }
          );
     };

     if (isLoading) return <div>Memuat...</div>;

     return (
          <div className="space-y-6">
               <div className="flex items-center justify-between">
                    <div>
                         <h2 className="text-3xl font-bold tracking-tight">Panitia</h2>
                         <p className="text-muted-foreground text-sm">Kelola hak akses Panitia dan Admin.</p>
                    </div>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                         <DialogTrigger asChild>
                              <Button className="gap-2">
                                   <Plus className="h-4 w-4" />
                                   Tambah Anggota
                              </Button>
                         </DialogTrigger>
                         <DialogContent>
                              <DialogHeader>
                                   <DialogTitle>Tambah Anggota Panitia</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                   <div className="flex gap-2">
                                        <Input
                                             placeholder="Cari mahasiswa (NIM/Nama)..."
                                             value={searchQuery}
                                             onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <Button onClick={handleSearch}>Cari</Button>
                                   </div>
                                   <div className="space-y-2">
                                        {searchResults.map((s: any) => (
                                             <div key={s.id} className="flex justify-between items-center border p-2 rounded">
                                                  <div>
                                                       <div className="font-bold">{s.name}</div>
                                                       <div className="text-xs text-muted-foreground">{s.nim}</div>
                                                  </div>
                                                  <Button size="sm" onClick={() => handlePromoteClick(s)}>Angkat Panitia</Button>
                                             </div>
                                        ))}
                                        {searchResults.length === 0 && searchQuery && <p className="text-sm text-muted-foreground">Tidak ditemukan.</p>}
                                   </div>
                              </div>
                         </DialogContent>
                    </Dialog>

                    {/* Password Confirmation Dialog */}
                    <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
                         <DialogContent>
                              <DialogHeader>
                                   <DialogTitle>Atur Password Panitia</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-2">
                                   <p className="text-sm text-muted-foreground">
                                        Untuk keamanan, silakan atur password baru untuk <strong>{selectedUser?.name}</strong> agar dapat login ke dashboard admin.
                                   </p>
                                   <div className="space-y-2">
                                        <label htmlFor="pass" className="text-sm font-medium">Password Baru</label>
                                        <Input
                                             id="pass"
                                             type="password"
                                             placeholder="Masukkan password..."
                                             value={password}
                                             onChange={(e) => setPassword(e.target.value)}
                                        />
                                   </div>
                                   <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setIsPasswordOpen(false)}>Batal</Button>
                                        <Button onClick={handleConfirmPromote} disabled={!password}>
                                             Konfirmasi & Simpan
                                        </Button>
                                   </div>
                              </div>
                         </DialogContent>
                    </Dialog>
               </div>

               <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
                    <Table>
                         <TableHeader>
                              <TableRow>
                                   <TableHead>Nama/ID</TableHead>
                                   <TableHead>Email</TableHead>
                                   <TableHead>Peran (Role)</TableHead>
                                   <TableHead className="text-right">Aksi</TableHead>
                              </TableRow>
                         </TableHeader>
                         <TableBody>
                              {users?.map((member: any) => (
                                   <TableRow key={member.id}>
                                        <TableCell className="font-medium">{member.name || member.id}</TableCell>
                                        <TableCell>{member.email}</TableCell>
                                        <TableCell>{member.role}</TableCell>
                                        <TableCell className="text-right">
                                             <div className="flex items-center justify-end gap-2">
                                                  <Button variant="ghost" size="icon">
                                                       <Shield className="h-4 w-4" />
                                                  </Button>
                                                  {member.role !== 'super_admin' && (
                                                       <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDemote(member.id)}>
                                                            Hapus
                                                       </Button>
                                                  )}
                                             </div>
                                        </TableCell>
                                   </TableRow>
                              ))}
                         </TableBody>
                    </Table>
               </div>
          </div>
     );
}
