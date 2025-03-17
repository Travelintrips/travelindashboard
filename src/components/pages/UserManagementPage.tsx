import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { PlusCircle, Pencil, Trash2, UserCog } from "lucide-react";
import DashboardHeader from "../dashboard/DashboardHeader";
import { fetchUsers, updateUser, deleteUser } from "../../services/userService";
import { useAuth } from "../../contexts/AuthContext";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
}

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Omit<User, "id" | "lastLogin">>({
    name: "",
    email: "",
    role: "Staf",
    status: "active",
  });

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const usersData = await fetchUsers();
        setUsers(usersData);
        setError(null);
      } catch (err) {
        console.error("Error loading users:", err);
        setError("Gagal memuat data pengguna. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const roles = ["Admin", "Manajer", "Staf", "Tamu"];

  const handleAddUser = async () => {
    try {
      setLoading(true);
      // Generate a random password - in a real app, you'd want to send an email with a reset link
      const tempPassword = Math.random().toString(36).slice(-8);

      const { error, user } = await signUp(newUser.email, tempPassword, {
        name: newUser.name,
        role: newUser.role,
        status: newUser.status,
      });

      if (error) {
        setError(error.message || "Gagal menambahkan pengguna");
        return;
      }

      if (user) {
        // Refresh the user list
        const updatedUsers = await fetchUsers();
        setUsers(updatedUsers);
        setNewUser({ name: "", email: "", role: "Staf", status: "active" });
        setIsAddDialogOpen(false);
      }
    } catch (err) {
      console.error("Error adding user:", err);
      setError("Gagal menambahkan pengguna. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async () => {
    if (editingUser) {
      try {
        setLoading(true);
        const updatedUser = await updateUser(editingUser.id, {
          name: editingUser.name,
          role: editingUser.role,
          status: editingUser.status,
        });

        setUsers(
          users.map((user) =>
            user.id === editingUser.id ? updatedUser : user,
          ),
        );
        setEditingUser(null);
        setIsEditDialogOpen(false);
      } catch (err) {
        console.error("Error updating user:", err);
        setError("Gagal memperbarui pengguna. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      setLoading(true);
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Gagal menghapus pengguna. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Manajemen Pengguna" />
      <main className="container mx-auto py-6 px-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Daftar Pengguna</h2>
            <div className="flex gap-4">
              <Input
                placeholder="Cari pengguna..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Tambah Pengguna
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Pengguna Baru</DialogTitle>
                    <DialogDescription>
                      Buat akun pengguna baru dengan peran yang sesuai.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Nama
                      </Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser({ ...newUser, name: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="role" className="text-right">
                        Peran
                      </Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value) =>
                          setNewUser({ ...newUser, role: value })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Pilih peran" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        Status
                      </Label>
                      <Select
                        value={newUser.status}
                        onValueChange={(value: "active" | "inactive") =>
                          setNewUser({ ...newUser, status: value })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Aktif</SelectItem>
                          <SelectItem value="inactive">Tidak Aktif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      onClick={handleAddUser}
                      disabled={!newUser.name || !newUser.email}
                    >
                      Simpan
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => (window.location.href = "/role-management")}
              >
                <UserCog className="h-4 w-4" />
                Kelola Peran
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Login Terakhir</TableHead>
                <TableHead className="text-right">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {user.status === "active" ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog
                        open={isEditDialogOpen && editingUser?.id === user.id}
                        onOpenChange={(open) => {
                          setIsEditDialogOpen(open);
                          if (!open) setEditingUser(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEditingUser(user)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Pengguna</DialogTitle>
                            <DialogDescription>
                              Ubah detail pengguna dan peran.
                            </DialogDescription>
                          </DialogHeader>
                          {editingUser && (
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="edit-name"
                                  className="text-right"
                                >
                                  Nama
                                </Label>
                                <Input
                                  id="edit-name"
                                  value={editingUser.name}
                                  onChange={(e) =>
                                    setEditingUser({
                                      ...editingUser,
                                      name: e.target.value,
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="edit-email"
                                  className="text-right"
                                >
                                  Email
                                </Label>
                                <Input
                                  id="edit-email"
                                  type="email"
                                  value={editingUser.email}
                                  onChange={(e) =>
                                    setEditingUser({
                                      ...editingUser,
                                      email: e.target.value,
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="edit-role"
                                  className="text-right"
                                >
                                  Peran
                                </Label>
                                <Select
                                  value={editingUser.role}
                                  onValueChange={(value) =>
                                    setEditingUser({
                                      ...editingUser,
                                      role: value,
                                    })
                                  }
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Pilih peran" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {roles.map((role) => (
                                      <SelectItem key={role} value={role}>
                                        {role}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="edit-status"
                                  className="text-right"
                                >
                                  Status
                                </Label>
                                <Select
                                  value={editingUser.status}
                                  onValueChange={(
                                    value: "active" | "inactive",
                                  ) =>
                                    setEditingUser({
                                      ...editingUser,
                                      status: value,
                                    })
                                  }
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Pilih status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">
                                      Aktif
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                      Tidak Aktif
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button type="submit" onClick={handleEditUser}>
                              Simpan Perubahan
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default UserManagementPage;
