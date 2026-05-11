import { createClient } from "@supabase/supabase-js";
import ws from "ws";

const STATE_KEYS = [
  "users",
  "orders",
  "categories",
  "serviceAreas",
  "demoAccounts",
  "statusColors",
  "reports",
  "notifications",
  "chats",
  "reviews",
  "portfolioItems",
  "availability",
];

const createSupabaseStateStore = ({ supabaseUrl, supabaseServiceRoleKey, initialState }) => {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return {
      enabled: false,
      async loadState() {
        return { ...initialState };
      },
      async saveKey() {},
    };
  }

  const client = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    realtime: {
      transport: ws,
    },
  });

  const loadState = async () => {
    const { data, error } = await client.from("app_state").select("key, value");
    if (error) throw new Error(`Gagal membaca app_state: ${error.message}`);

    const byKey = new Map((data || []).map((row) => [row.key, row.value]));
    const nextState = {};

    for (const key of STATE_KEYS) {
      nextState[key] = byKey.has(key) ? byKey.get(key) : initialState[key];
    }

    const missingRows = STATE_KEYS.filter((key) => !byKey.has(key)).map((key) => ({
      key,
      value: initialState[key],
    }));

    if (missingRows.length > 0) {
      const { error: upsertError } = await client.from("app_state").upsert(missingRows, { onConflict: "key" });
      if (upsertError) throw new Error(`Gagal inisialisasi app_state: ${upsertError.message}`);
    }

    return nextState;
  };

  const saveKey = async (key, value) => {
    const { error } = await client.from("app_state").upsert({ key, value }, { onConflict: "key" });
    if (error) throw new Error(`Gagal simpan state '${key}': ${error.message}`);
  };

  return {
    enabled: true,
    loadState,
    saveKey,
  };
};

export { STATE_KEYS, createSupabaseStateStore };
