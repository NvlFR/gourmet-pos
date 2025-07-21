import { supabase } from "../../../config/supabaseClient";
import type { Supplier } from "../types";

type SupplierDTO = Omit<Supplier, "id" | "created_at">;

export const getSuppliers = async (): Promise<Supplier[]> => {
  const { data, error } = await supabase
    .from("Supplier")
    .select("*")
    .order("nama_supplier");
  if (error) throw new Error(error.message);
  return data || [];
};

export const createSupplier = async (supplier: SupplierDTO) => {
  const { data, error } = await supabase
    .from("Supplier")
    .insert([supplier])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateSupplier = async (
  id: number,
  updates: Partial<SupplierDTO>
) => {
  const { data, error } = await supabase
    .from("Supplier")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteSupplier = async (id: number) => {
  const { error } = await supabase.from("Supplier").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return true;
};
