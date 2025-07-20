// src/features/dashboard/pages/DashboardPage.tsx
import {
  Box,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Tag,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../config/supabaseClient";
import { SalesChart } from "../components/SalesChart";

const getProfitabilityReport = async () => {
  const { data, error } = await supabase.functions.invoke(
    "calculate-profitability"
  );
  if (error) throw new Error(await error.context.json().then((d) => d.error));
  return data;
};

const DashboardPage = () => {
  const { data: report, isLoading } = useQuery({
    queryKey: ["profitabilityReport"],
    queryFn: getProfitabilityReport,
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);

  const getMarginColor = (margin: number) => {
    if (margin < 25) return "red";
    if (margin < 50) return "orange";
    return "green";
  };

  return (
    <Box>
      <Heading mb={6}>Dasbor Analitik</Heading>

      <VStack spacing={6} align="stretch">
        {/* Panggil komponen grafik di sini */}
        <SalesChart />

        <Heading size="md" mb={4}>
          Analisis Profitabilitas per Menu
        </Heading>
        <Box bg="gray.800" p={4} borderRadius="md">
          {isLoading ? (
            <Spinner />
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>Nama Menu</Th>
                  <Th isNumeric>Harga Jual</Th>
                  <Th isNumeric>HPP (Food Cost)</Th>
                  <Th isNumeric>Profit (Rp)</Th>
                  <Th isNumeric>Margin</Th>
                </Tr>
              </Thead>
              <Tbody>
                {report?.map((item: any) => (
                  <Tr key={item.id}>
                    <Td>{item.nama_produk}</Td>
                    <Td isNumeric>{formatCurrency(item.harga_jual)}</Td>
                    <Td isNumeric>{formatCurrency(item.hpp)}</Td>
                    <Td isNumeric color="green.300">
                      {formatCurrency(item.profit)}
                    </Td>
                    <Td isNumeric>
                      <Tag colorScheme={getMarginColor(item.margin)}>
                        {item.margin.toFixed(2)}%
                      </Tag>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default DashboardPage;
