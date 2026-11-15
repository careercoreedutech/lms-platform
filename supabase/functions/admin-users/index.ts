// Supabase Edge Function: admin-users
//
// Account actions that need the service-role key, callable only by a
// logged-in admin. Deploy with:
//   supabase functions deploy admin-users
// SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are provided
// to Edge Functions automatically.
//
// Actions (POST JSON):
//   { action: "set_password", kind: "student" | "mentor", id, password }
//       Sets a temporary password; the user must choose a new one at next login.
//       For a mentor without a login yet, the login is created here.
//   { action: "delete_users", ids: string[] }
//       Deletes students: progress, enrollments, profile and the auth account.
//   { action: "delete_mentor", id }
//       Deletes a mentor row and its auth account.

import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const syntheticMentorEmail = (id: string) =>
  `mentor-${String(id).replace(/[^a-z0-9]/gi, "").slice(0, 12).toLowerCase()}@mentors.careercore.invalid`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const url = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // 1. Who is calling? Check their role with their own token.
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) return json({ error: "Not signed in" }, 401);
  const caller = createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });
  const { data: role, error: roleErr } = await caller.rpc("get_my_role");
  if (roleErr || role !== "ADMIN") return json({ error: "Admins only" }, 403);

  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }

  try {
    switch (body.action) {
      case "set_password": {
        const password = String(body.password ?? "");
        const id = String(body.id ?? "");
        if (password.length < 8) return json({ error: "Password must be at least 8 characters." }, 400);
        if (!id) return json({ error: "Missing id" }, 400);

        let authId: string | null = null;
        if (body.kind === "mentor") {
          const { data: m, error } = await admin.from("mentors").select("id, name, email, auth_user_id").eq("id", id).maybeSingle();
          if (error || !m) return json({ error: "Mentor not found" }, 404);
          authId = m.auth_user_id;
          if (!authId) {
            const email = (m.email || "").trim().toLowerCase() || syntheticMentorEmail(m.id);
            const created = await admin.auth.admin.createUser({
              email, password, email_confirm: true,
              app_metadata: { kind: "mentor" },
              user_metadata: { full_name: m.name, must_reset_password: true },
            });
            if (created.error) return json({ error: created.error.message }, 400);
            authId = created.data.user.id;
            const link = await admin.from("mentors").update({ auth_user_id: authId }).eq("id", m.id);
            if (link.error) return json({ error: link.error.message }, 400);
            return json({ ok: true, created: true });
          }
        } else if (body.kind === "student") {
          authId = id;
        } else {
          return json({ error: "kind must be student or mentor" }, 400);
        }

        const { data: existing, error: getErr } = await admin.auth.admin.getUserById(authId);
        if (getErr || !existing?.user) return json({ error: "No login exists for this account" }, 404);
        const upd = await admin.auth.admin.updateUserById(authId, {
          password,
          user_metadata: { ...existing.user.user_metadata, must_reset_password: true },
        });
        if (upd.error) return json({ error: upd.error.message }, 400);
        return json({ ok: true });
      }

      case "delete_users": {
        const ids = Array.isArray(body.ids) ? body.ids.map(String).filter(Boolean) : [];
        if (!ids.length) return json({ error: "No ids" }, 400);
        // Never delete admins or mentors through this path.
        const { data: protectedRows } = await admin.from("admins").select("auth_user_id").in("auth_user_id", ids);
        const { data: mentorRows } = await admin.from("mentors").select("auth_user_id").in("auth_user_id", ids);
        const blocked = new Set([...(protectedRows ?? []), ...(mentorRows ?? [])].map((r) => r.auth_user_id));
        const targets = ids.filter((i) => !blocked.has(i));

        const failed: string[] = [];
        for (let i = 0; i < targets.length; i += 200) {
          const chunk = targets.slice(i, i + 200);
          await admin.from("student_progress").delete().in("student_id", chunk);
          await admin.from("enrollments").delete().in("student_id", chunk);
          await admin.from("profiles").delete().in("id", chunk);
          for (const id of chunk) {
            const del = await admin.auth.admin.deleteUser(id);
            if (del.error && !/not found/i.test(del.error.message)) failed.push(id);
          }
        }
        return json({ ok: failed.length === 0, deleted: targets.length - failed.length, failed });
      }

      case "delete_mentor": {
        const id = String(body.id ?? "");
        const { data: m } = await admin.from("mentors").select("auth_user_id").eq("id", id).maybeSingle();
        const del = await admin.from("mentors").delete().eq("id", id);
        if (del.error) return json({ error: del.error.message }, 400);
        if (m?.auth_user_id) await admin.auth.admin.deleteUser(m.auth_user_id);
        return json({ ok: true });
      }

      default:
        return json({ error: "Unknown action" }, 400);
    }
  } catch (e) {
    return json({ error: (e as Error).message ?? String(e) }, 500);
  }
});
