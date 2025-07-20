// src/features/pos/store/cartStore.ts
import { create } from "zustand";
import { ProdukJadi } from "../../menu/types";

export interface CartItem extends ProdukJadi {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: ProdukJadi) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  // Aksi untuk menambah item
  addItem: (product) => {
    const { items } = get();
    const existingItem = items.find((item) => item.id === product.id);

    if (existingItem) {
      // Jika item sudah ada, tambah quantity-nya
      const updatedItems = items.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      set({ items: updatedItems });
    } else {
      // Jika item baru, tambahkan ke keranjang
      set({ items: [...items, { ...product, quantity: 1 }] });
    }
  },

  // Aksi untuk menghapus item
  removeItem: (productId) => {
    set({ items: get().items.filter((item) => item.id !== productId) });
  },

  // Aksi untuk mengubah kuantitas
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      // Jika kuantitas 0 atau kurang, hapus item
      get().removeItem(productId);
    } else {
      set({
        items: get().items.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        ),
      });
    }
  },

  // Aksi untuk mengosongkan keranjang
  clearCart: () => set({ items: [] }),

  // Fungsi untuk menghitung total harga
  getTotalPrice: () => {
    return get().items.reduce(
      (total, item) => total + item.harga_jual * item.quantity,
      0
    );
  },
}));
