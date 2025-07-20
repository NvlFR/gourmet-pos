// src/features/inventory/pages/InventoryPage.tsx
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LuPlus, LuPencil, LuTrash2 } from "react-icons/lu";
import {
  createBahanBaku,
  getBahanBaku,
  updateBahanBaku,
  deleteBahanBaku,
} from "../api";
import { BahanBakuForm } from "../components/BahanBakuForm";
import { BahanBaku } from "../types";
import { useState, useRef } from "react";

const InventoryPage = () => {
  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const cancelRef = useRef(null);

  const [selectedBahanBaku, setSelectedBahanBaku] = useState<BahanBaku | null>(
    null
  );
  const [bahanBakuToDelete, setBahanBakuToDelete] = useState<number | null>(
    null
  );

  const queryClient = useQueryClient();
  const toast = useToast();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["bahanBaku"],
    queryFn: getBahanBaku,
  });

  const handleToast = (
    title: string,
    description: string,
    status: "success" | "error"
  ) => {
    toast({ title, description, status, duration: 3000, isClosable: true });
  };

  // --- Mutations ---
  const createMutation = useMutation({
    mutationFn: createBahanBaku,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bahanBaku"] });
      handleToast("Sukses", "Bahan baku baru berhasil ditambahkan.", "success");
      onFormClose();
    },
    onError: (err) => handleToast("Error", err.message, "error"),
  });

  const updateMutation = useMutation({
    mutationFn: (variables: { id: number; updates: Partial<BahanBaku> }) =>
      updateBahanBaku(variables.id, variables.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bahanBaku"] });
      handleToast("Sukses", "Bahan baku berhasil diperbarui.", "success");
      onFormClose();
    },
    onError: (err) => handleToast("Error", err.message, "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBahanBaku,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bahanBaku"] });
      handleToast("Sukses", "Bahan baku berhasil dihapus.", "success");
      onAlertClose();
    },
    onError: (err) => handleToast("Error", err.message, "error"),
  });

  // --- Handlers ---
  const handleOpenForm = (bahanBaku: BahanBaku | null) => {
    setSelectedBahanBaku(bahanBaku);
    onFormOpen();
  };

  const handleFormSubmit = (formData: Omit<BahanBaku, "id" | "created_at">) => {
    if (selectedBahanBaku) {
      updateMutation.mutate({ id: selectedBahanBaku.id, updates: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleOpenDeleteAlert = (id: number) => {
    setBahanBakuToDelete(id);
    onAlertOpen();
  };

  const handleDeleteConfirm = () => {
    if (bahanBakuToDelete) {
      deleteMutation.mutate(bahanBakuToDelete);
    }
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading>Manajemen Bahan Baku</Heading>
        <Button
          leftIcon={<LuPlus />}
          colorScheme="blue"
          onClick={() => handleOpenForm(null)}
        >
          Tambah Bahan
        </Button>
      </Flex>

      <Box bg="gray.800" p={4} borderRadius="md">
        {isLoading && (
          <Flex justify="center" align="center" h="200px">
            <Spinner size="xl" />
          </Flex>
        )}
        {isError && (
          <Box color="red.400">Terjadi kesalahan: {error?.message}</Box>
        )}
        {data && (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nama Bahan</Th>
                <Th isNumeric>Stok</Th>
                <Th>Unit</Th>
                <Th>Aksi</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((bahan) => (
                <Tr key={bahan.id}>
                  <Td>{bahan.nama}</Td>
                  <Td isNumeric>
                    <Text
                      color={
                        bahan.stok_saat_ini <= bahan.ambang_batas_stok
                          ? "red.400"
                          : "inherit"
                      }
                      fontWeight={
                        bahan.stok_saat_ini <= bahan.ambang_batas_stok
                          ? "bold"
                          : "normal"
                      }
                    >
                      {bahan.stok_saat_ini}
                    </Text>
                  </Td>
                  <Td>{bahan.unit_pemakaian}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Edit"
                        icon={<LuPencil />}
                        size="sm"
                        onClick={() => handleOpenForm(bahan)}
                      />
                      <IconButton
                        aria-label="Hapus"
                        icon={<LuTrash2 />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleOpenDeleteAlert(bahan.id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* Modal Formulir */}
      <BahanBakuForm
        isOpen={isFormOpen}
        onClose={onFormClose}
        onSubmit={handleFormSubmit}
        isLoading={isMutating}
        defaultValues={selectedBahanBaku}
      />

      {/* Dialog Konfirmasi Hapus */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Hapus Bahan Baku
            </AlertDialogHeader>
            <AlertDialogBody>
              Apakah Anda yakin ingin menghapus bahan baku ini? Tindakan ini
              tidak bisa dibatalkan.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                Batal
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteConfirm}
                ml={3}
                isLoading={deleteMutation.isPending}
              >
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default InventoryPage;
