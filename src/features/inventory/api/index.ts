// src/features/inventory/api/index.ts
import { supabase } from "../../../config/supabaseClient";
import { BahanBaku } from "../types";

export const getBahanBaku = async (): Promise<BahanBaku[]> => {
  const { data, error } = await supabase
    .from("BahanBaku")
    .select("*")
    .order("nama", { ascending: true }); // Mengurutkan berdasarkan nama

  if (error) {
    console.error("Error fetching bahan baku: ", error);
    throw new Error(error.message);
  }

  return data || [];
};

// Tipe data untuk fungsi create, sama seperti di form
type CreateBahanBakuDTO = Omit<BahanBaku, "id" | "created_at">;

export const createBahanBaku = async (bahanBaku: CreateBahanBakuDTO) => {
  const { data, error } = await supabase
    .from("BahanBaku")
    .insert([bahanBaku])
    .select()
    .single(); // .single() untuk mendapatkan objek yang baru dibuat

  if (error) {
    console.error("Error creating bahan baku: ", error);
    throw new Error(error.message);
  }

  return data;
};

export const updateBahanBaku = async (
  id: number,
  updates: Partial<BahanBaku>
) => {
  const { data, error } = await supabase
    .from("BahanBaku")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating bahan baku: ", error);
    throw new Error(error.message);
  }

  return data;
};

export const deleteBahanBaku = async (id: number) => {
  const { error } = await supabase.from("BahanBaku").delete().eq("id", id);

  if (error) {
    console.error("Error deleting bahan baku: ", error);
    throw new Error(error.message);
  }

  return true; // Mengembalikan true jika berhasil
};
