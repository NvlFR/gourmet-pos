// src/features/menu/components/ProdukForm.tsx

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
// --- Ganti Import Tipe dan Komponen ---
import type { ProdukJadi } from "../types";
import ResepManager from "./ResepManager";

// --- Ganti Definisi Tipe dan Props ---
type ProdukJadiFormData = Omit<ProdukJadi, "id" | "created_at">;

interface ProdukFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProdukJadiFormData) => void;
  isLoading: boolean;
  defaultValues?: ProdukJadi | null;
}

export const ProdukForm = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  defaultValues,
}: ProdukFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProdukJadiFormData>();

  // Efek ini akan mengisi form saat mode edit atau membersihkan saat mode tambah
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    } else {
      // --- Sesuaikan dengan field ProdukJadi ---
      reset({
        nama_produk: "",
        harga_jual: 0,
        kategori: "",
      });
    }
  }, [defaultValues, reset, isOpen]);

  const modalTitle = defaultValues ? "Edit Produk" : "Tambah Produk Baru";

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)} bg="gray.800">
        <ModalHeader>{modalTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            {/* --- Ganti Field Form --- */}
            <FormControl isInvalid={!!errors.nama_produk}>
              <FormLabel htmlFor="nama_produk">Nama Produk</FormLabel>
              <Input
                id="nama_produk"
                {...register("nama_produk", {
                  required: "Nama produk tidak boleh kosong",
                })}
              />
            </FormControl>

            <FormControl isInvalid={!!errors.kategori}>
              <FormLabel htmlFor="kategori">Kategori</FormLabel>
              <Input
                id="kategori"
                placeholder="Contoh: Makanan, Minuman, Camilan"
                {...register("kategori", {
                  required: "Kategori tidak boleh kosong",
                })}
              />
            </FormControl>

            <FormControl isInvalid={!!errors.harga_jual}>
              <FormLabel htmlFor="harga_jual">Harga Jual (Rp)</FormLabel>
              <NumberInput min={0}>
                <NumberInputField
                  id="harga_jual"
                  {...register("harga_jual", {
                    required: "Harga jual tidak boleh kosong",
                    valueAsNumber: true,
                  })}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </VStack>

          {/* --- Integrasi ResepManager --- */}
          {defaultValues && (
            <Box mt={6} pt={6} borderTop="1px" borderColor="gray.700">
              <Heading size="md" mb={4}>
                Resep & Bahan Baku
              </Heading>
              <ResepManager produkId={defaultValues.id} />
            </Box>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" colorScheme="blue" isLoading={isLoading}>
            Simpan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
