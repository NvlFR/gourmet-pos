// src/features/procurement/pages/CreatePurchaseOrderPage.tsx
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
  Input,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../config/supabaseClient";
import { getBahanBaku } from "../../inventory/api";
import { getSuppliers } from "../api/supplierApi";

interface FormValues {
  supplier_id: number;
  tanggal_po: string;
  items: {
    bahan_baku_id: number;
    jumlah_dipesan: number;
    harga_beli_per_unit: number;
  }[];
}

const CreatePurchaseOrderPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { register, control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      tanggal_po: new Date().toISOString().split("T")[0],
      items: [],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const { data: suppliers, isLoading: isSuppliersLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: getSuppliers,
  });
  const { data: bahanBaku, isLoading: isBahanBakuLoading } = useQuery({
    queryKey: ["bahanBaku"],
    queryFn: getBahanBaku,
  });

  const createPoMutation = useMutation({
    mutationFn: async (payload: FormValues) => {
      const { data, error } = await supabase.functions.invoke(
        "create-purchase-order",
        { body: payload }
      );
      if (error)
        throw new Error(await error.context.json().then((d) => d.error));
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Sukses",
        description: "Purchase Order berhasil dibuat.",
        status: "success",
      });
      navigate("/procurement");
    },
    onError: (err: Error) =>
      toast({ title: "Error", description: err.message, status: "error" }),
  });

  const onSubmit = (data: FormValues) => {
    createPoMutation.mutate(data);
  };

  const watchedItems = watch("items");
  const totalHarga = watchedItems.reduce(
    (sum, item) =>
      sum + (item.jumlah_dipesan || 0) * (item.harga_beli_per_unit || 0),
    0
  );

  if (isSuppliersLoading || isBahanBakuLoading) return <Spinner />;

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <Heading mb={6}>Buat Purchase Order Baru</Heading>

      <VStack spacing={6} align="stretch" bg="gray.800" p={6} borderRadius="md">
        <HStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Supplier</FormLabel>
            <Select
              placeholder="Pilih Supplier"
              {...register("supplier_id", { valueAsNumber: true })}
            >
              {suppliers?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama_supplier}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Tanggal PO</FormLabel>
            <Input type="date" {...register("tanggal_po")} />
          </FormControl>
        </HStack>

        <Heading size="md" mt={4}>
          Item Bahan Baku
        </Heading>
        <Table>
          <Thead>
            <Tr>
              <Th>Bahan Baku</Th>
              <Th>Jumlah</Th>
              <Th>Harga Beli / Unit</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {fields.map((field, index) => (
              <Tr key={field.id}>
                <Td>
                  <Select
                    placeholder="Pilih Bahan"
                    {...register(`items.${index}.bahan_baku_id`, {
                      valueAsNumber: true,
                      required: true,
                    })}
                  >
                    {bahanBaku?.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nama}
                      </option>
                    ))}
                  </Select>
                </Td>
                <Td>
                  <NumberInput min={1}>
                    <NumberInputField
                      {...register(`items.${index}.jumlah_dipesan`, {
                        valueAsNumber: true,
                        required: true,
                      })}
                    />
                  </NumberInput>
                </Td>
                <Td>
                  <NumberInput min={0}>
                    <NumberInputField
                      {...register(`items.${index}.harga_beli_per_unit`, {
                        valueAsNumber: true,
                        required: true,
                      })}
                    />
                  </NumberInput>
                </Td>
                <Td>
                  <IconButton
                    aria-label="Hapus item"
                    icon={<LuTrash2 />}
                    colorScheme="red"
                    onClick={() => remove(index)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Button
          leftIcon={<LuPlus />}
          onClick={() =>
            append({
              bahan_baku_id: 0,
              jumlah_dipesan: 1,
              harga_beli_per_unit: 0,
            })
          }
          alignSelf="start"
        >
          Tambah Item
        </Button>

        <Flex
          justify="flex-end"
          mt={6}
          borderTop="1px"
          borderColor="gray.700"
          pt={4}
        >
          <Heading size="lg">
            Total:{" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(totalHarga)}
          </Heading>
        </Flex>
      </VStack>

      <Flex mt={6} justify="flex-end">
        <Button variant="ghost" mr={3} onClick={() => navigate("/procurement")}>
          Batal
        </Button>
        <Button
          type="submit"
          colorScheme="blue"
          isLoading={createPoMutation.isPending}
        >
          Simpan Purchase Order
        </Button>
      </Flex>
    </Box>
  );
};

export default CreatePurchaseOrderPage;
