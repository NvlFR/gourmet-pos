// src/features/menu/components/ResepManager.tsx
import {
  Box,
  Button,
  FormControl,
  HStack,
  IconButton,
  NumberInput,
  NumberInputField,
  Select,
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
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { LuTrash2 } from "react-icons/lu";
import { getBahanBaku } from "../../inventory/api";
import {
  addBahanToResep,
  deleteBahanFromResep,
  getResepForProduk,
} from "../api";

interface ResepManagerProps {
  produkId: number;
}

interface FormValues {
  bahan_baku_id: number;
  jumlah_pemakaian: number;
}

const ResepManager = ({ produkId }: ResepManagerProps) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { register, handleSubmit, reset } = useForm<FormValues>();

  // Query 1: Mengambil resep untuk produk ini
  const { data: resep, isLoading: isResepLoading } = useQuery({
    queryKey: ["resep", produkId],
    queryFn: () => getResepForProduk(produkId),
  });

  // Query 2: Mengambil semua bahan baku untuk dropdown
  const { data: semuaBahanBaku, isLoading: isBahanLoading } = useQuery({
    queryKey: ["bahanBaku"],
    queryFn: getBahanBaku,
  });

  // Mutation untuk menambah bahan ke resep
  const addMutation = useMutation({
    mutationFn: addBahanToResep,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resep", produkId] });
      toast({ status: "success", title: "Bahan ditambahkan!" });
      reset();
    },
    onError: (err) => toast({ status: "error", title: err.message }),
  });

  // Mutation untuk menghapus bahan dari resep
  const deleteMutation = useMutation({
    mutationFn: deleteBahanFromResep,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resep", produkId] });
      toast({ status: "success", title: "Bahan dihapus!" });
    },
    onError: (err) => toast({ status: "error", title: err.message }),
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    addMutation.mutate({
      produk_jadi_id: produkId,
      bahan_baku_id: Number(data.bahan_baku_id),
      jumlah_pemakaian: data.jumlah_pemakaian,
    });
  };

  if (isResepLoading || isBahanLoading) {
    return <Spinner />;
  }

  return (
    <VStack spacing={4} align="stretch">
      {/* --- Form untuk menambah bahan --- */}
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <HStack spacing={2}>
          <FormControl>
            <Select
              placeholder="Pilih Bahan Baku"
              {...register("bahan_baku_id", { required: true })}
            >
              {semuaBahanBaku?.map((bahan) => (
                <option key={bahan.id} value={bahan.id}>
                  {bahan.nama}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <NumberInput min={0.1}>
              <NumberInputField
                placeholder="Jumlah"
                {...register("jumlah_pemakaian", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </NumberInput>
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={addMutation.isPending}
          >
            Tambah
          </Button>
        </HStack>
      </Box>

      {/* --- Tabel untuk menampilkan daftar bahan --- */}
      <Box>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Nama Bahan</Th>
              <Th isNumeric>Jumlah</Th>
              <Th>Unit</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {resep?.map((item) => (
              <Tr key={item.id}>
                <Td>{item.BahanBaku?.nama}</Td>
                <Td isNumeric>{item.jumlah_pemakaian}</Td>
                <Td>{item.BahanBaku?.unit_pemakaian}</Td>
                <Td>
                  <IconButton
                    aria-label="Hapus bahan"
                    icon={<LuTrash2 />}
                    size="xs"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => deleteMutation.mutate(item.id)}
                    isLoading={
                      deleteMutation.isPending &&
                      deleteMutation.variables === item.id
                    }
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {resep?.length === 0 && (
          <Text color="gray.500" fontStyle="italic" mt={2}>
            Belum ada bahan baku yang ditambahkan.
          </Text>
        )}
      </Box>
    </VStack>
  );
};

export default ResepManager;
