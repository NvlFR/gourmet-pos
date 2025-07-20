// src/styles/theme.ts
import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

// Konfigurasi untuk memaksa dark mode sebagai default
const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// Definisikan palet warna kustom Anda
const colors = {
  brand: {
    // Anda bisa menambahkan warna brand di sini jika ada
  },
  // Contoh warna dari desain Anda
  // Chakra sudah memiliki skema warna yang bagus, kita bisa langsung pakai
  // seperti 'blue.400', 'gray.900', dll.
};

const theme = extendTheme({
  config,
  colors,
  styles: {
    global: {
      body: {
        bg: "gray.900", // Latar belakang utama
        color: "gray.50", // Warna teks utama
      },
    },
  },
});

export default theme;
