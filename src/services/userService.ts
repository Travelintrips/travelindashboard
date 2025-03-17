import { supabase } from "../lib/supabase";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
}

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data: profiles, error } = await supabase.from("profiles").select(`
        id,
        full_name,
        status,
        last_login,
        roles(name),
        auth_users:id(email)
      `);

    if (error) throw error;

    return profiles.map((profile: any) => ({
      id: profile.id,
      name: profile.full_name || "",
      email: profile.auth_users?.email || "",
      role: profile.roles?.name || "Tamu",
      status: profile.status || "inactive",
      lastLogin: profile.last_login || "",
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const updateUser = async (
  id: string,
  userData: Partial<User>,
): Promise<User> => {
  try {
    // 1. Get role ID if role is being updated
    let roleId = null;
    if (userData.role) {
      const { data: roleData, error: roleError } = await supabase
        .from("roles")
        .select("id")
        .eq("name", userData.role)
        .single();

      if (roleError) throw roleError;
      roleId = roleData.id;
    }

    // 2. Update profile
    const updateData: any = {};
    if (userData.name) updateData.full_name = userData.name;
    if (userData.status) updateData.status = userData.status;
    if (roleId) updateData.role_id = roleId;
    if (userData.role) updateData.role = userData.role;

    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", id)
      .select(
        `
        id,
        full_name,
        status,
        last_login,
        roles(name),
        auth_users:id(email)
      `,
      )
      .single();

    if (updateError) throw updateError;

    return {
      id: updatedProfile.id,
      name: updatedProfile.full_name || "",
      email: updatedProfile.auth_users?.email || "",
      role: updatedProfile.roles?.name || "Tamu",
      status: updatedProfile.status || "inactive",
      lastLogin: updatedProfile.last_login || "",
    };
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    // This will cascade delete the profile due to RLS policies
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw error;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
