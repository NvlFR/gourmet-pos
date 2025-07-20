// src/features/dashboard/components/SalesChart.tsx
import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "../../../config/supabaseClient";

const getSalesReport = async () => {
  const { data, error } = await supabase.functions.invoke("get-sales-report");
  if (error) throw new Error("Gagal mengambil laporan penjualan.");
  return data;
};

const formatCurrency = (value: number) =>
  `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;

export const SalesChart = () => {
  const { data: report, isLoading } = useQuery({
    queryKey: ["salesReport"],
    queryFn: getSalesReport,
  });

  if (isLoading) return <Spinner />;

  return (
    <Box h="300px" bg="gray.800" p={6} borderRadius="md">
      <Heading size="md" mb={4}>
        Penjualan 7 Hari Terakhir
      </Heading>
      {report && report.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={report}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.1)"
            />
            <XAxis dataKey="tanggal" stroke="gray.400" />
            <YAxis tickFormatter={formatCurrency} stroke="gray.400" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(30, 41, 59, 0.9)",
                border: "1px solid #4A5568",
              }}
              labelStyle={{ color: "#A0AEC0" }}
              formatter={(value: number) => [
                formatCurrency(value),
                "Total Penjualan",
              ]}
            />
            <Bar
              dataKey="total_penjualan"
              fill="#4299E1"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Text color="gray.500">Belum ada data penjualan.</Text>
      )}
    </Box>
  );
};
