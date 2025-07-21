// supabase/functions/proses-pesanan/index.ts
import { createClient } from "@supabase/supabase-js";
import { corsHeaders } from "../_shared/cors.ts";

// Definisikan tipe data yang diterima dari frontend
interface CartItem {
  id: number;
  harga_jual: number;
  quantity: number;
}

Deno.serve(async (req) => {
  // Tangani preflight request untuk CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { cartItems }: { cartItems: CartItem[] } = await req.json();
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Keranjang belanja kosong.");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // --- Mulai Transaksi ---
    // 1. Hitung total & buat nomor pesanan
    const totalHarga = cartItems.reduce(
      (sum, item) => sum + item.harga_jual * item.quantity,
      0
    );
    const nomorPesanan = `GOURMET-${new Date().getTime()}`;

    // 2. Buat entri di tabel Pesanan
    const { data: pesanan, error: pesananError } = await supabaseAdmin
      .from("Pesanan")
      .insert({
        total_harga: totalHarga,
        nomor_pesanan: nomorPesanan,
        status: "DIBAYAR",
      })
      .select()
      .single();

    if (pesananError) throw pesananError;

    // 3. Siapkan data untuk DetailPesanan
    const detailPesananData = cartItems.map((item) => ({
      pesanan_id: pesanan.id,
      produk_jadi_id: item.id,
      jumlah: item.quantity,
      subtotal: item.harga_jual * item.quantity,
    }));

    const { error: detailError } = await supabaseAdmin
      .from("DetailPesanan")
      .insert(detailPesananData);
    if (detailError) throw detailError;

    // 4. Proses pemotongan stok
    for (const item of cartItems) {
      // Ambil resep untuk produk ini
      const { data: resepItems, error: resepError } = await supabaseAdmin
        .from("Resep")
        .select("*")
        .eq("produk_jadi_id", item.id);

      if (resepError) throw resepError;

      // Loop melalui setiap bahan di resep dan kurangi stok
      for (const resep of resepItems) {
        const jumlahDipotong = resep.jumlah_pemakaian * item.quantity;

        // Panggil RPC function untuk mengurangi stok secara aman
        const { error: rpcError } = await supabaseAdmin.rpc(
          "kurangi_stok_bahan",
          {
            id_bahan: resep.bahan_baku_id,
            jumlah_dikurangi: jumlahDipotong,
          }
        );

        if (rpcError) {
          // Jika ada error (misal: stok tidak cukup), throw error
          throw new Error(
            `Stok untuk bahan ID ${resep.bahan_baku_id} tidak mencukupi.`
          );
        }
      }
    }

    return new Response(JSON.stringify({ pesananId: pesanan.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
