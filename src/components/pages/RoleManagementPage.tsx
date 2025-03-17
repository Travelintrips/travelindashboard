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
import { Label } from "../ui/label";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import DashboardHeader from "../dashboard/DashboardHeader";
import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
  fetchPermissions,
} from "../../services/roleService";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const RoleManagementPage = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState<Omit<Role, "id">>({
    name: "",
    description: "",
    permissions: [],
  });

  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionOptions, setPermissionOptions] = useState<
    { id: string; label: string }[]
  >([]);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        setLoading(true);
        const [rolesData, permissionsData] = await Promise.all([
          fetchRoles(),
          fetchPermissions(),
        ]);

        setRoles(rolesData);
        setPermissionOptions(
          permissionsData.map((p) => ({ id: p.name, label: p.label })),
        );
        setError(null);
      } catch (err) {
        console.error("Error loading roles:", err);
        setError("Gagal memuat data peran. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, []);

  const handleAddRole = async () => {
    try {
      setLoading(true);
      const createdRole = await createRole(newRole);
      setRoles([...roles, createdRole]);
      setNewRole({ name: "", description: "", permissions: [] });
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error("Error adding role:", err);
      setError("Gagal menambahkan peran. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = async () => {
    if (editingRole) {
      try {
        setLoading(true);
        const { id, ...roleData } = editingRole;
        const updatedRole = await updateRole(id, roleData);
        setRoles(
          roles.map((role) =>
            role.id === editingRole.id ? updatedRole : role,
          ),
        );
        setEditingRole(null);
        setIsEditDialogOpen(false);
      } catch (err) {
        console.error("Error updating role:", err);
        setError("Gagal memperbarui peran. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      setLoading(true);
      await deleteRole(id);
      setRoles(roles.filter((role) => role.id !== id));
    } catch (err) {
      console.error("Error deleting role:", err);
      setError("Gagal menghapus peran. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (
    permissionId: string,
    isChecked: boolean,
    isEditing: boolean,
  ) => {
    if (isEditing && editingRole) {
      const updatedPermissions = isChecked
        ? [...editingRole.permissions, permissionId]
        : editingRole.permissions.filter((p) => p !== permissionId);
      setEditingRole({ ...editingRole, permissions: updatedPermissions });
    } else {
      const updatedPermissions = isChecked
        ? [...newRole.permissions, permissionId]
        : newRole.permissions.filter((p) => p !== permissionId);
      setNewRole({ ...newRole, permissions: updatedPermissions });
    }
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Manajemen Peran" />
      <main className="container mx-auto py-6 px-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Daftar Peran</h2>
            <div className="flex gap-4">
              <Input
                placeholder="Cari peran..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Tambah Peran
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Peran Baru</DialogTitle>
                    <DialogDescription>
                      Buat peran baru dengan izin yang sesuai.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Nama
                      </Label>
                      <Input
                        id="name"
                        value={newRole.name}
                        onChange={(e) =>
                          setNewRole({ ...newRole, name: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Deskripsi
                      </Label>
                      <Input
                        id="description"
                        value={newRole.description}
                        onChange={(e) =>
                          setNewRole({
                            ...newRole,
                            description: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <Label className="text-right pt-2">Izin</Label>
                      <div className="col-span-3 space-y-2">
                        {permissionOptions.map((permission) => (
                          <div
                            key={permission.id}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              id={`add-${permission.id}`}
                              checked={newRole.permissions.includes(
                                permission.id,
                              )}
                              onChange={(e) =>
                                handlePermissionChange(
                                  permission.id,
                                  e.target.checked,
                                  false,
                                )
                              }
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor={`add-${permission.id}`}>
                              {permission.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      onClick={handleAddRole}
                      disabled={!newRole.name}
                    >
                      Simpan
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Peran</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Izin</TableHead>
                <TableHead className="text-right">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="px-2 py-1 bg-gray-100 text-xs rounded-full"
                        >
                          {
                            permissionOptions.find((p) => p.id === permission)
                              ?.label
                          }
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog
                        open={isEditDialogOpen && editingRole?.id === role.id}
                        onOpenChange={(open) => {
                          setIsEditDialogOpen(open);
                          if (!open) setEditingRole(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEditingRole(role)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Peran</DialogTitle>
                            <DialogDescription>
                              Ubah detail dan izin untuk peran ini.
                            </DialogDescription>
                          </DialogHeader>
                          {editingRole && (
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
                                  value={editingRole.name}
                                  onChange={(e) =>
                                    setEditingRole({
                                      ...editingRole,
                                      name: e.target.value,
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="edit-description"
                                  className="text-right"
                                >
                                  Deskripsi
                                </Label>
                                <Input
                                  id="edit-description"
                                  value={editingRole.description}
                                  onChange={(e) =>
                                    setEditingRole({
                                      ...editingRole,
                                      description: e.target.value,
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 gap-4">
                                <Label className="text-right pt-2">Izin</Label>
                                <div className="col-span-3 space-y-2">
                                  {permissionOptions.map((permission) => (
                                    <div
                                      key={permission.id}
                                      className="flex items-center gap-2"
                                    >
                                      <input
                                        type="checkbox"
                                        id={`edit-${permission.id}`}
                                        checked={editingRole.permissions.includes(
                                          permission.id,
                                        )}
                                        onChange={(e) =>
                                          handlePermissionChange(
                                            permission.id,
                                            e.target.checked,
                                            true,
                                          )
                                        }
                                        className="h-4 w-4 rounded border-gray-300"
                                      />
                                      <Label htmlFor={`edit-${permission.id}`}>
                                        {permission.label}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button type="submit" onClick={handleEditRole}>
                              Simpan Perubahan
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteRole(role.id)}
                        disabled={role.name === "Admin"}
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

export default RoleManagementPage;
