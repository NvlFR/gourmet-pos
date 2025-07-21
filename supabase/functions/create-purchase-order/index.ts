// supabase/functions/create-purchase-order/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface PoItem {
  bahan_baku_id: number;
  jumlah_dipesan: number;
  harga_beli_per_unit: number;
}

interface PoPayload {
  supplier_id: number;
  tanggal_po: string;
  items: PoItem[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { supplier_id, tanggal_po, items }: PoPayload = await req.json();
    if (!supplier_id || !items || items.length === 0) {
      throw new Error("Data PO tidak lengkap.");
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 1. Hitung total harga
    const total_harga_beli = items.reduce((sum, item) => sum + (item.jumlah_dipesan * item.harga_beli_per_unit), 0);

    // 2. Buat entri di tabel PurchaseOrder
    const { data: po, error: poError } = await supabaseAdmin
      .from('PurchaseOrder')
      .insert({
        supplier_id,
        tanggal_po,
        total_harga_beli,
        status: 'DIPESAN',
      })
      .select()
      .single();

    if (poError) throw poError;

    // 3. Siapkan dan masukkan detail PO
    const detailPoData = items.map(item => ({
      po_id: po.id,
      ...item,
    }));

    const { error: detailError } = await supabaseAdmin
      .from('DetailPurchaseOrder')
      .insert(detailPoData);

    if (detailError) throw detailError;

    return new Response(JSON.stringify({ poId: po.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})

npx supabase functions deploy create-purchase-order --no-verify-jwt



npx supabase functions new receive-purchase-order

// supabase/functions/receive-purchase-order/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { po_id } = await req.json();
    if (!po_id) {
      throw new Error("ID Purchase Order tidak ditemukan.");
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Ambil detail PO untuk mendapatkan item-itemnya
    const { data: poDetails, error: detailError } = await supabaseAdmin
      .from('DetailPurchaseOrder')
      .select('*')
      .eq('po_id', po_id);

    if (detailError) throw detailError;

    // Loop melalui setiap item dan update stok bahan baku
    for (const item of poDetails) {
      // Gunakan rpc untuk menambah stok dengan aman (opsional, tapi best practice)
      // Untuk penambahan, bisa juga langsung update
      const { error: stockError } = await supabaseAdmin.rpc('tambah_stok_bahan', {
        id_bahan: item.bahan_baku_id,
        jumlah_ditambah: item.jumlah_dipesan
      });
      if (stockError) throw stockError;
    }

    // Setelah semua stok berhasil diupdate, ubah status PO menjadi "DITERIMA"
    const { data: updatedPo, error: poUpdateError } = await supabaseAdmin
      .from('PurchaseOrder')
      .update({ status: 'DITERIMA' })
      .eq('id', po_id)
      .select()
      .single();

    if (poUpdateError) throw poUpdateError;

    return new Response(JSON.stringify(updatedPo), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})

npx supabase functions deploy receive-purchase-order --no-verify-jwt


npx supabase functions new calculate-profitability

// supabase/functions/calculate-profitability/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 1. Ambil semua produk jadi beserta resepnya
    const { data: products, error: productError } = await supabaseAdmin
      .from('ProdukJadi')
      .select(`
        id,
        nama_produk,
        harga_jual,
        Resep (
          jumlah_pemakaian,
          BahanBaku ( id, unit_pemakaian )
        )
      `);

    if (productError) throw productError;

    const profitabilityReport = [];

    // 2. Loop setiap produk untuk menghitung HPP-nya
    for (const product of products) {
      let hpp = 0;

      if (product.Resep.length > 0) {
        for (const resepItem of product.Resep) {
          // 3. Cari harga beli terakhir untuk bahan baku ini
          const { data: lastPurchase, error: priceError } = await supabaseAdmin
            .from('DetailPurchaseOrder')
            .select('harga_beli_per_unit')
            .eq('bahan_baku_id', resepItem.BahanBaku.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          const hargaBeli = lastPurchase?.harga_beli_per_unit || 0;
          hpp += resepItem.jumlah_pemakaian * hargaBeli;
        }
      }

      const profit = product.harga_jual - hpp;
      const margin = product.harga_jual > 0 ? (profit / product.harga_jual) * 100 : 0;

      profitabilityReport.push({
        ...product,
        hpp,
        profit,
        margin,
      });
    }

    return new Response(JSON.stringify(profitabilityReport), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})
