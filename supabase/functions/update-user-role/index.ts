import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    // Create a Supabase client with the auth header
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the request body
    const { userId, roleName } = await req.json();

    if (!userId || !roleName) {
      throw new Error("Missing required fields: userId and roleName");
    }

    // Get the role ID
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", roleName)
      .single();

    if (roleError) {
      throw new Error(`Error fetching role: ${roleError.message}`);
    }

    // Update the user's profile with the new role
    const { data, error } = await supabase
      .from("profiles")
      .update({ role_id: roleData.id })
      .eq("id", userId)
      .select();

    if (error) {
      throw new Error(`Error updating user role: ${error.message}`);
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      status: 400,
    });
  }
});
