import { supabase } from "../lib/supabase";

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export const fetchRoles = async (): Promise<Role[]> => {
  try {
    // Get all roles
    const { data: roles, error: rolesError } = await supabase
      .from("roles")
      .select("id, name, description");

    if (rolesError) throw rolesError;

    // Get role permissions for each role
    const rolesWithPermissions = await Promise.all(
      roles.map(async (role) => {
        const { data: permissions, error: permissionsError } = await supabase
          .from("role_permissions")
          .select("permissions(name)")
          .eq("role_id", role.id);

        if (permissionsError) throw permissionsError;

        // Extract permission names
        const permissionNames = permissions.map((p: any) => p.permissions.name);

        return {
          ...role,
          permissions: permissionNames,
        };
      }),
    );

    return rolesWithPermissions;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

export const createRole = async (role: Omit<Role, "id">): Promise<Role> => {
  try {
    // 1. Create the role
    const { data: newRole, error: roleError } = await supabase
      .from("roles")
      .insert({ name: role.name, description: role.description })
      .select()
      .single();

    if (roleError) throw roleError;

    // 2. Get permission IDs
    const { data: permissions, error: permissionsError } = await supabase
      .from("permissions")
      .select("id, name")
      .in("name", role.permissions);

    if (permissionsError) throw permissionsError;

    // 3. Create role-permission relationships
    if (permissions.length > 0) {
      const rolePermissions = permissions.map((permission) => ({
        role_id: newRole.id,
        permission_id: permission.id,
      }));

      const { error: insertError } = await supabase
        .from("role_permissions")
        .insert(rolePermissions);

      if (insertError) throw insertError;
    }

    return {
      ...newRole,
      permissions: role.permissions,
    };
  } catch (error) {
    console.error("Error creating role:", error);
    throw error;
  }
};

export const updateRole = async (
  id: string,
  role: Omit<Role, "id">,
): Promise<Role> => {
  try {
    // 1. Update the role
    const { data: updatedRole, error: roleError } = await supabase
      .from("roles")
      .update({ name: role.name, description: role.description })
      .eq("id", id)
      .select()
      .single();

    if (roleError) throw roleError;

    // 2. Delete existing role permissions
    const { error: deleteError } = await supabase
      .from("role_permissions")
      .delete()
      .eq("role_id", id);

    if (deleteError) throw deleteError;

    // 3. Get permission IDs
    const { data: permissions, error: permissionsError } = await supabase
      .from("permissions")
      .select("id, name")
      .in("name", role.permissions);

    if (permissionsError) throw permissionsError;

    // 4. Create new role-permission relationships
    if (permissions.length > 0) {
      const rolePermissions = permissions.map((permission) => ({
        role_id: id,
        permission_id: permission.id,
      }));

      const { error: insertError } = await supabase
        .from("role_permissions")
        .insert(rolePermissions);

      if (insertError) throw insertError;
    }

    return {
      ...updatedRole,
      permissions: role.permissions,
    };
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
};

export const deleteRole = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase.from("roles").delete().eq("id", id);
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting role:", error);
    throw error;
  }
};

export const fetchPermissions = async (): Promise<
  { id: string; name: string; label: string }[]
> => {
  try {
    const { data, error } = await supabase
      .from("permissions")
      .select("id, name, label");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching permissions:", error);
    throw error;
  }
};
