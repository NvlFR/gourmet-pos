// src/features/inventory/components/BahanBakuForm.tsx
import {
  Button,
  FormControl,
  FormLabel,
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
import { useForm } from "react-hook-form";
import { BahanBaku } from "../types";
import { useEffect } from "react";

type BahanBakuFormData = Omit<BahanBaku, "id" | "created_at">;

interface BahanBakuFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BahanBakuFormData) => void;
  isLoading: boolean;
  defaultValues?: BahanBaku | null; // Tambahkan prop ini
}

export const BahanBakuForm = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  defaultValues,
}: BahanBakuFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BahanBakuFormData>();

  // Efek ini akan mengisi form saat mode edit
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    } else {
      reset({
        nama: "",
        stok_saat_ini: 0,
        unit_pemakaian: "",
        ambang_batas_stok: 0,
      });
    }
  }, [defaultValues, reset, isOpen]);

  const modalTitle = defaultValues
    ? "Edit Bahan Baku"
    : "Tambah Bahan Baku Baru";

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)} bg="gray.800">
        <ModalHeader>{modalTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* VStack dan FormControl lainnya tetap sama persis */}
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.nama}>
              <FormLabel htmlFor="nama">Nama Bahan</FormLabel>
              <Input
                id="nama"
                {...register("nama", {
                  required: "Nama bahan tidak boleh kosong",
                })}
              />
            </FormControl>

            <FormControl isInvalid={!!errors.stok_saat_ini}>
              <FormLabel htmlFor="stok_saat_ini">Stok Saat Ini</FormLabel>
              <NumberInput min={0}>
                <NumberInputField
                  id="stok_saat_ini"
                  {...register("stok_saat_ini", { valueAsNumber: true })}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl isInvalid={!!errors.unit_pemakaian}>
              <FormLabel htmlFor="unit_pemakaian">Unit Pemakaian</FormLabel>
              <Input
                id="unit_pemakaian"
                placeholder="Contoh: gram, ml, pcs"
                {...register("unit_pemakaian", {
                  required: "Unit tidak boleh kosong",
                })}
              />
            </FormControl>

            <FormControl isInvalid={!!errors.ambang_batas_stok}>
              <FormLabel htmlFor="ambang_batas_stok">
                Ambang Batas Stok
              </FormLabel>
              <NumberInput min={0}>
                <NumberInputField
                  id="ambang_batas_stok"
                  {...register("ambang_batas_stok", { valueAsNumber: true })}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </VStack>
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
