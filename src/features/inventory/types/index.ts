// src/features/inventory/types/index.ts
export interface BahanBaku {
  id: number;
  created_at: string;
  nama: string;
  stok_saat_ini: number;
  unit_pemakaian: string;
  ambang_batas_stok: number;
}
