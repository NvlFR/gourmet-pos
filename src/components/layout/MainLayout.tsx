// src/components/layout/MainLayout.tsx
import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const MainLayout = () => {
  return (
    <Flex>
      {/* Sidebar yang sudah kita buat */}
      <Sidebar />

      {/* Konten Utama Aplikasi */}
      <Box
        as="main"
        flex="1"
        ml="250px" // Memberi ruang selebar sidebar
        p="6" // Padding untuk area konten
      >
        {/* Di sinilah semua halaman (seperti Dashboard, Inventaris, dll.) akan dirender */}
        <Outlet />
      </Box>
    </Flex>
  );
};

export default MainLayout;
