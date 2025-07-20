// src/components/layout/Sidebar.tsx
import { Box, VStack, Link as ChakraLink, Text, Icon } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuPackage,
  LuShoppingCart,
  LuClipboardList,
  LuChefHat,
  LuBookMarked,
} from "react-icons/lu";

// Definisikan item-item navigasi
const navItems = [
  { icon: LuLayoutDashboard, label: "Dashboard", path: "/" },
  { icon: LuPackage, label: "Inventaris", path: "/inventory" },
  { icon: LuShoppingCart, label: "Kasir (POS)", path: "/pos" },
  { icon: LuClipboardList, label: "Pembelian (PO)", path: "/procurement" },
  { icon: LuBookMarked, label: 'Menu & Resep', path: '/menu' }
  { icon: LuShoppingCart, label: 'Kasir (POS)', path: '/pos' }
  { icon: LuChefHat, label: "Dapur (KDS)", path: "/kds" },
  { icon: LuClipboardList, label: 'Pembelian', path: '/procurement' },
];

// npx supabase link --project-ref imjpfxcklfiwyqwyhewv
const Sidebar = () => {
  const location = useLocation();

  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      h="100%"
      w="250px" // Lebar sidebar
      bg="gray.800" // Warna surface, sedikit lebih terang dari background
      p="4"
      borderRight="1px"
      borderColor="gray.700"
    >
      <VStack align="stretch" spacing={2}>
        <Text fontSize="2xl" fontWeight="bold" color="white" mb="6">
          Gourmet POS 🍲
        </Text>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ChakraLink
              key={item.label}
              as={RouterLink}
              to={item.path}
              p={3}
              borderRadius="md"
              display="flex"
              alignItems="center"
              bg={isActive ? "blue.500" : "transparent"} // Warna primer untuk item aktif
              color={isActive ? "white" : "gray.300"}
              _hover={{
                bg: isActive ? "blue.500" : "gray.700",
                color: "white",
              }}
            >
              <Icon as={item.icon} mr="3" boxSize="5" />
              <Text fontWeight="medium">{item.label}</Text>
            </ChakraLink>
          );
        })}
      </VStack>
    </Box>
  );
};

export default Sidebar;
