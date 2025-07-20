// src/features/procurement/pages/PurchaseOrderDetailPage.tsx
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
  Tag,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "../../../config/supabaseClient";

const getPurchaseOrderDetail = async (poId: string) => {
  const { data, error } = await supabase
    .from("PurchaseOrder")
    .select(
      `
            *,
            Supplier (*),
            DetailPurchaseOrder (
                *,
                BahanBaku (*)
            )
        `
    )
    .eq("id", poId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const PurchaseOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    data: po,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["purchaseOrder", id],
    queryFn: () => getPurchaseOrderDetail(id!),
    enabled: !!id,
  });

  const receivePoMutation = useMutation({
    mutationFn: async (poId: number) => {
      const { error } = await supabase.functions.invoke(
        "receive-purchase-order",
        { body: { po_id: poId } }
      );
      if (error)
        throw new Error(await error.context.json().then((d) => d.error));
    },
    onSuccess: () => {
      toast({
        title: "Sukses",
        description: "Barang telah diterima dan stok diperbarui.",
        status: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["purchaseOrders"] }); // Invalidate list
      refetch(); // Refetch detail
    },
    onError: (err: Error) =>
      toast({ title: "Error", description: err.message, status: "error" }),
  });

  if (isLoading) return <Spinner />;
  if (!po) return <Text>Purchase Order tidak ditemukan.</Text>;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  const getStatusColor = (status: string) =>
    status === "DITERIMA" ? "green" : "yellow";

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading>Detail PO #{po.id}</Heading>
        {po.status !== "DITERIMA" && (
          <Button
            colorScheme="green"
            onClick={() => receivePoMutation.mutate(po.id)}
            isLoading={receivePoMutation.isPending}
          >
            Terima Barang & Update Stok
          </Button>
        )}
      </Flex>

      <VStack spacing={4} align="stretch" bg="gray.800" p={6} borderRadius="md">
        <Flex justify="space-between">
          <Box>
            <Text color="gray.400">Supplier</Text>
            <Text fontSize="lg" fontWeight="bold">
              {po.Supplier?.nama_supplier}
            </Text>
          </Box>
          <Box textAlign="right">
            <Text color="gray.400">Status</Text>
            <Tag size="lg" colorScheme={getStatusColor(po.status)}>
              {po.status}
            </Tag>
          </Box>
        </Flex>
        <Flex justify="space-between">
          <Box>
            <Text color="gray.400">Tanggal PO</Text>
            <Text fontSize="lg" fontWeight="bold">
              {new Date(po.tanggal_po).toLocaleDateString("id-ID")}
            </Text>
          </Box>
          <Box textAlign="right">
            <Text color="gray.400">Total Pembelian</Text>
            <Text fontSize="lg" fontWeight="bold">
              {formatCurrency(po.total_harga_beli)}
            </Text>
          </Box>
        </Flex>
      </VStack>

      <Heading size="md" mt={8} mb={4}>
        Rincian Item
      </Heading>
      <Box bg="gray.800" p={4} borderRadius="md">
        <Table>
          <Thead>
            <Tr>
              <Th>Bahan Baku</Th>
              <Th isNumeric>Jumlah</Th>
              <Th isNumeric>Harga Beli / Unit</Th>
              <Th isNumeric>Subtotal</Th>
            </Tr>
          </Thead>
          <Tbody>
            {po.DetailPurchaseOrder.map((item) => (
              <Tr key={item.id}>
                <Td>{item.BahanBaku?.nama}</Td>
                <Td isNumeric>{item.jumlah_dipesan}</Td>
                <Td isNumeric>{formatCurrency(item.harga_beli_per_unit)}</Td>
                <Td isNumeric>
                  {formatCurrency(
                    item.jumlah_dipesan * item.harga_beli_per_unit
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default PurchaseOrderDetailPage;
