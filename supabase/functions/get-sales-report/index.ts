// supabase/functions/get-sales-report/index.ts
// Note: Deno errors are expected in editor but will work in Supabase Edge Functions
// @ts-ignore - Deno is available in Supabase Edge Functions runtime
import { createClient } from "@supabase/supabase-js";
import { corsHeaders } from "../_shared/cors";

// Deno.serve is only available in Deno Deploy or Deno runtime, not in Node.js.
// Pastikan environment kamu memang Deno, bukan Node.js.

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Pastikan variabel environment tersedia
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error(
        "SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum di-set di environment."
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Ambil data penjualan 7 hari terakhir
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6); // 7 hari termasuk hari ini

    const { data, error } = await supabaseAdmin
      .from("Pesanan")
      .select("created_at, total_harga")
      .gte("created_at", sevenDaysAgo.toISOString());

    if (error) throw error;

    // Siapkan struktur tanggal 7 hari terakhir
    const salesByDay: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(sevenDaysAgo.getDate() + i);
      const key = d.toISOString().split("T")[0];
      salesByDay[key] = 0;
    }

    // Agregasi data per tanggal
    if (Array.isArray(data)) {
      for (const sale of data) {
        const dateKey = new Date(sale.created_at).toISOString().split("T")[0];
        if (salesByDay[dateKey] !== undefined) {
          salesByDay[dateKey] += Number(sale.total_harga) || 0;
        }
      }
    }

    // Ubah format menjadi array untuk grafik, urutkan tanggal ASC
    const report = Object.keys(salesByDay)
      .sort()
      .map((date) => ({
        tanggal: new Date(date).toLocaleDateString("id-ID", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
        total_penjualan: salesByDay[date],
      }));

    return new Response(JSON.stringify(report), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    // error bisa bertipe unknown, jadi cek dulu
    const message =
      err instanceof Error ? err.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
