/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function CandidateDialog({ open, onOpenChange, candidate, onSuccess }: any) {
     const api = useApi();
     const [loading, setLoading] = useState(false);

     // Form States
     const [name, setName] = useState("");
     const [orderNumber, setOrderNumber] = useState("");
     const [vision, setVision] = useState("");
     const [mission, setMission] = useState("");
     const [photoUrl, setPhotoUrl] = useState("");

     // Populate form on edit
     useEffect(() => {
          if (candidate) {
               setName(candidate.name);
               setOrderNumber(String(candidate.orderNumber));
               setVision(candidate.vision || "");
               setMission(candidate.mission || "");
               setPhotoUrl(candidate.photoUrl || "");
          } else {
               // Reset
               setName("");
               setOrderNumber("");
               setVision("");
               setMission("");
               setPhotoUrl("");
          }
     }, [candidate, open]);

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setLoading(true);

          const payload = {
               name,
               orderNumber: Number(orderNumber),
               vision,
               mission,
               photoUrl
          };

          try {
               if (candidate) {
                    // Update
                    await api.put(`/candidates/${candidate.id}`, payload);
               } else {
                    // Create
                    await api.post('/candidates', payload);
               }
               onOpenChange(false);
               onSuccess();
          } catch (error) {
               console.error(error);
               alert("Gagal menyimpan data kandidat");
          } finally {
               setLoading(false);
          }
     };

     return (
          <Dialog open={open} onOpenChange={onOpenChange}>
               <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                         <DialogTitle>{candidate ? "Edit Kandidat" : "Tambah Kandidat"}</DialogTitle>
                         <DialogDescription>
                              {candidate ? "Perbarui detail kandidat." : "Tambahkan profil kandidat baru."}
                         </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                         <div className="grid gap-2">
                              <Label htmlFor="order">Nomor Urut</Label>
                              <Input id="order" type="number" value={orderNumber} onChange={e => setOrderNumber(e.target.value)} required />
                         </div>
                         <div className="grid gap-2">
                              <Label htmlFor="name">Nama</Label>
                              <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                         </div>
                         <div className="grid gap-2">
                              <Label htmlFor="photo">URL Foto</Label>
                              <Input id="photo" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} placeholder="https://..." />
                         </div>
                         <div className="grid gap-2">
                              <Label htmlFor="vision">Visi</Label>
                              <Input id="vision" value={vision} onChange={e => setVision(e.target.value)} />
                         </div>
                         <div className="grid gap-2">
                              <Label htmlFor="mission">Misi</Label>
                              <Input id="mission" value={mission} onChange={e => setMission(e.target.value)} />
                         </div>
                         <DialogFooter>
                              <Button type="submit" disabled={loading}>
                                   {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                   Simpan Perubahan
                              </Button>
                         </DialogFooter>
                    </form>
               </DialogContent>
          </Dialog>
     );
}
