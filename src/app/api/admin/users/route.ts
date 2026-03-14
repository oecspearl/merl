import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

/**
 * POST /api/admin/users — Create a new user via Supabase Auth Admin API.
 * Requires SUPABASE_SERVICE_ROLE_KEY env var.
 */
export async function POST(request: NextRequest) {
  // Verify caller is a SuperAdmin
  const serverSupabase = await createServerClient();
  const {
    data: { user: caller },
  } = await serverSupabase.auth.getUser();

  if (!caller) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: callerProfile } = await serverSupabase
    .from("users")
    .select("type")
    .eq("id", caller.id)
    .single();

  if (callerProfile?.type !== "SuperAdmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Parse request
  const body = await request.json();
  const { email, password, type } = body as {
    email?: string;
    password?: string;
    type?: string;
  };

  if (!email) {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return NextResponse.json(
      {
        error:
          "SUPABASE_SERVICE_ROLE_KEY is not configured. Add it to your environment variables.",
      },
      { status: 500 }
    );
  }

  // Create admin client with service role key
  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Create the auth user
  const generatedPassword =
    password || Math.random().toString(36).slice(-12) + "A1!";

  const { data: authData, error: authError } =
    await adminSupabase.auth.admin.createUser({
      email,
      password: generatedPassword,
      email_confirm: true,
    });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  // Update the user type in the public.users table (trigger creates the row)
  if (type && type !== "User" && authData.user) {
    await adminSupabase
      .from("users")
      .update({ type })
      .eq("id", authData.user.id);
  }

  return NextResponse.json({
    success: true,
    user: { id: authData.user?.id, email },
    generatedPassword: !password ? generatedPassword : undefined,
  });
}

/**
 * DELETE /api/admin/users — Delete a user via Supabase Auth Admin API.
 */
export async function DELETE(request: NextRequest) {
  // Verify caller is a SuperAdmin
  const serverSupabase = await createServerClient();
  const {
    data: { user: caller },
  } = await serverSupabase.auth.getUser();

  if (!caller) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: callerProfile } = await serverSupabase
    .from("users")
    .select("type")
    .eq("id", caller.id)
    .single();

  if (callerProfile?.type !== "SuperAdmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("id");

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  // Don't allow deleting yourself
  if (userId === caller.id) {
    return NextResponse.json(
      { error: "You cannot delete your own account" },
      { status: 400 }
    );
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is not configured." },
      { status: 500 }
    );
  }

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { error } = await adminSupabase.auth.admin.deleteUser(userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
