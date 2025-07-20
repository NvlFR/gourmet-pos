export interface Supplier {
  id: number;
  created_at: string;
  nama_supplier: string;
  kontak_person: string | null;
  telepon: string | null;
  alamat: string | null;
}
