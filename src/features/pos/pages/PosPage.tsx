// src/features/pos/pages/PosPage.tsx
import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Image,
  NumberInput,
  NumberInputField,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getProdukJadi } from "../../menu/api";
import { useCartStore } from "../store/cartStore";
import { LuTrash2 } from "react-icons/lu";

// Fungsi untuk format mata uang
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const PosPage = () => {
  // Ambil data produk dari server
  const { data: products, isLoading } = useQuery({
    queryKey: ["produkJadi"],
    queryFn: getProdukJadi,
  });

  // Hubungkan ke cart store
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    getTotalPrice,
    clearCart,
  } = useCartStore();

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={6} h="calc(100vh - 100px)">
      {/* Kolom Daftar Produk (2/3 layar) */}
      <GridItem colSpan={2} overflowY="auto" p={2}>
        <Heading size="lg" mb={4}>
          Pilih Menu
        </Heading>
        {isLoading ? (
          <Flex justify="center" align="center" h="100%">
            <Spinner size="xl" />
          </Flex>
        ) : (
          <Grid templateColumns="repeat(auto-fill, minmax(180px, 1fr))" gap={4}>
            {products?.map((product) => (
              <Card
                key={product.id}
                onClick={() => addItem(product)}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ transform: "scale(1.05)", shadow: "lg" }}
                bg="gray.700"
              >
                <CardBody>
                  {/* Ganti dengan Image jika punya URL gambar */}
                  <Box h="100px" bg="gray.600" mb={3} borderRadius="md" />
                  <Text fontWeight="bold">{product.nama_produk}</Text>
                  <Text fontSize="sm" color="blue.300">
                    {formatCurrency(product.harga_jual)}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}
      </GridItem>

      {/* Kolom Keranjang (1/3 layar) */}
      <GridItem
        colSpan={1}
        bg="gray.800"
        borderRadius="md"
        p={4}
        display="flex"
        flexDirection="column"
      >
        <Heading size="lg" mb={4}>
          Pesanan
        </Heading>
        <VStack divider={<Divider />} spacing={4} flex="1" overflowY="auto">
          {items.length === 0 ? (
            <Text color="gray.500">Keranjang masih kosong.</Text>
          ) : (
            items.map((item) => (
              <Flex
                key={item.id}
                w="100%"
                justify="space-between"
                align="center"
              >
                <Box>
                  <Text fontWeight="bold">{item.nama_produk}</Text>
                  <Text fontSize="sm">{formatCurrency(item.harga_jual)}</Text>
                </Box>
                <HStack>
                  <NumberInput
                    size="sm"
                    w="70px"
                    value={item.quantity}
                    min={1}
                    onChange={(_, valueAsNumber) =>
                      updateQuantity(item.id, valueAsNumber)
                    }
                  >
                    <NumberInputField />
                  </NumberInput>
                  <IconButton
                    aria-label="Hapus item"
                    icon={<LuTrash2 />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => removeItem(item.id)}
                  />
                </HStack>
              </Flex>
            ))
          )}
        </VStack>

        {/* Total dan Tombol Aksi */}
        {items.length > 0 && (
          <Box pt={4} mt="auto">
            <Divider mb={4} />
            <Flex justify="space-between" mb={4}>
              <Text fontSize="xl" fontWeight="bold">
                Total
              </Text>
              <Text fontSize="xl" fontWeight="bold">
                {formatCurrency(getTotalPrice())}
              </Text>
            </Flex>
            <Button colorScheme="blue" size="lg" w="100%" mb={2}>
              Bayar
            </Button>
            <Button
              variant="outline"
              colorScheme="red"
              w="100%"
              onClick={clearCart}
            >
              Batalkan
            </Button>
          </Box>
        )}
      </GridItem>
    </Grid>
  );
};

export default PosPage;
