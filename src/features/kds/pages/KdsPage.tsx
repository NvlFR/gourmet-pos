// src/features/kds/pages/KdsPage.tsx
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "../../../config/supabaseClient";

// Tipe data untuk pesanan di KDS
interface Order {
  id: number;
  nomor_pesanan: string;
  status_dapur: string;
  created_at: string;
  DetailPesanan: {
    jumlah: number;
    ProdukJadi: {
      nama_produk: string;
    };
  }[];
}

const getActiveOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from("Pesanan")
    .select(
      `
      id,
      nomor_pesanan,
      status_dapur,
      created_at,
      DetailPesanan (
        jumlah,
        ProdukJadi ( nama_produk )
      )
    `
    )
    .in("status_dapur", ["BARU", "SEDANG DIMASAK"])
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

const KdsPage = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["activeOrders"],
    queryFn: getActiveOrders,
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const toast = useToast();

  useEffect(() => {
    if (data) setOrders(data);
  }, [data]);

  // --- Logika Real-time ---
  useEffect(() => {
    const channel = supabase
      .channel("pesanan_dapur")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Pesanan" },
        (payload) => {
          toast({
            title: "Pesanan Baru Masuk!",
            status: "info",
            isClosable: true,
          });
          refetch(); // Ambil ulang semua data untuk kesederhanaan
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, toast]);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { error } = await supabase
        .from("Pesanan")
        .update({ status_dapur: status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => refetch(),
  });

  if (isLoading) return <Spinner />;

  const renderOrders = (status: string) => {
    return orders
      .filter((order) => order.status_dapur === status)
      .map((order) => (
        <Card key={order.id} bg="gray.800" size="sm">
          <CardHeader>
            <Heading size="md">{order.nomor_pesanan}</Heading>
          </CardHeader>
          <CardBody>
            <VStack align="stretch">
              {order.DetailPesanan.map((detail, index) => (
                <Text key={index}>
                  {detail.jumlah}x {detail.ProdukJadi.nama_produk}
                </Text>
              ))}
            </VStack>
          </CardBody>
          <CardFooter>
            {status === "BARU" && (
              <Button
                w="100%"
                colorScheme="yellow"
                onClick={() =>
                  updateStatusMutation.mutate({
                    id: order.id,
                    status: "SEDANG DIMASAK",
                  })
                }
              >
                Mulai Masak
              </Button>
            )}
            {status === "SEDANG DIMASAK" && (
              <Button
                w="100%"
                colorScheme="green"
                onClick={() =>
                  updateStatusMutation.mutate({ id: order.id, status: "SIAP" })
                }
              >
                Sajikan
              </Button>
            )}
          </CardFooter>
        </Card>
      ));
  };

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
      <Box>
        <Heading size="lg" mb={4}>
          Pesanan Baru
        </Heading>
        <VStack spacing={4} align="stretch">
          {renderOrders("BARU")}
        </VStack>
      </Box>
      <Box>
        <Heading size="lg" mb={4}>
          Sedang Dibuat
        </Heading>
        <VStack spacing={4} align="stretch">
          {renderOrders("SEDANG DIMASAK")}
        </VStack>
      </Box>
    </SimpleGrid>
  );
};

export default KdsPage;
