import { supabase } from "../../../config/supabaseClient";
import type { ProdukJadi } from "../types";

type ProdukJadiDTO = Omit<ProdukJadi, "id" | "created_at">;

export const getProdukJadi = async (): Promise<ProdukJadi[]> => {
  const { data, error } = await supabase
    .from("ProdukJadi")
    .select("*")
    .order("nama_produk");
  if (error) throw new Error(error.message);
  return data || [];
};

export const createProdukJadi = async (produk: ProdukJadiDTO) => {
  const { data, error } = await supabase
    .from("ProdukJadi")
    .insert([produk])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateProdukJadi = async (
  id: number,
  updates: Partial<ProdukJadiDTO>
) => {
  const { data, error } = await supabase
    .from("ProdukJadi")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteProdukJadi = async (id: number) => {
  const { error } = await supabase.from("ProdukJadi").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
};

export interface ResepItem {
  id: number; // ID dari baris di tabel Resep
  jumlah_pemakaian: number;
  BahanBaku: {
    // Supabase akan membuat objek ini karena ada relasi
    id: number;
    nama: string;
    unit_pemakaian: string;
  } | null;
}

export const getResepForProduk = async (
  produkId: number
): Promise<ResepItem[]> => {
  const { data, error } = await supabase
    .from("Resep")
    .select(
      `
      id,
      jumlah_pemakaian,
      BahanBaku (
        id,
        nama,
        unit_pemakaian
      )
    `
    )
    .eq("produk_jadi_id", produkId);

  if (error) throw new Error(error.message);
  return (data || []).map((item) => ({
    ...item,
    BahanBaku: Array.isArray(item.BahanBaku)
      ? item.BahanBaku[0]
      : item.BahanBaku,
  }));
};

export const addBahanToResep = async (item: {
  produk_jadi_id: number;
  bahan_baku_id: number;
  jumlah_pemakaian: number;
}) => {
  const { data, error } = await supabase
    .from("Resep")
    .insert([item])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteBahanFromResep = async (resepId: number) => {
  const { error } = await supabase.from("Resep").delete().eq("id", resepId);
  if (error) throw new Error(error.message);
  return true;
};
