// src/features/procurement/pages/PurchaseOrderListPage.tsx
import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Tag,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { LuPlus } from "react-icons/lu";
import { Link } from "react-router-dom";
import { supabase } from "../../../config/supabaseClient";

const getPurchaseOrders = async () => {
  const { data, error } = await supabase
    .from("PurchaseOrder")
    .select(
      `
            id,
            created_at,
            tanggal_po,
            status,
            total_harga_beli,
            Supplier ( nama_supplier )
        `
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

const PurchaseOrderListPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["purchaseOrders"],
    queryFn: getPurchaseOrders,
  });

  const getStatusColor = (status: string) => {
    if (status === "DITERIMA") return "green";
    if (status === "DIKIRIM") return "blue";
    return "yellow";
  };

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading>Pesanan Pembelian (PO)</Heading>
        {/* Link ini akan kita buat halamannya nanti */}
        <Button
          as={Link}
          to="/procurement/new"
          leftIcon={<LuPlus />}
          colorScheme="blue"
        >
          Buat PO Baru
        </Button>
      </Flex>

      <Box bg="gray.800" p={4} borderRadius="md">
        {isLoading ? (
          <Spinner />
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Tanggal PO</Th>
                <Th>Supplier</Th>
                <Th>Status</Th>
                <Th isNumeric>Total Harga</Th>
                <Th>Aksi</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.map((po) => (
                <Tr key={po.id}>
                  <Td>{new Date(po.tanggal_po).toLocaleDateString("id-ID")}</Td>
                  <Td>{po.Supplier?.nama_supplier}</Td>
                  <Td>
                    <Tag colorScheme={getStatusColor(po.status)}>
                      {po.status}
                    </Tag>
                  </Td>
                  <Td isNumeric>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(po.total_harga_beli)}
                  </Td>
                  <Td>
                    {/* Tombol detail akan kita buat nanti */}
                    <Button size="sm" as={Link} to={`/procurement/${po.id}`}>
                      Detail
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default PurchaseOrderListPage;
