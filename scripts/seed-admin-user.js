const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function createAdminUser() {
  const email = "admin@pwt360.id";
  const password = "Pwt360AdminSecurePass2026!";

  console.log(`Creating/updating admin user: ${email}...`);
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: "admin", name: "PWT360 Administrator" },
  });

  if (error) {
    if (error.message.includes("already registered") || error.message.includes("unique")) {
      console.log("Admin user already registered. Updating password...");
      const { data: usersData, error: listErr } = await supabase.auth.admin.listUsers();
      if (!listErr && usersData && usersData.users) {
        const existing = usersData.users.find((u) => u.email === email);
        if (existing) {
          await supabase.auth.admin.updateUserById(existing.id, { password, email_confirm: true });
          console.log("\x1b[32mAdmin user updated successfully!\x1b[0m");
          return;
        }
      }
    }
    console.error("Error creating admin user:", error.message);
  } else {
    console.log("\x1b[32mAdmin user created successfully with ID:\x1b[0m", data.user.id);
  }
}

createAdminUser();
