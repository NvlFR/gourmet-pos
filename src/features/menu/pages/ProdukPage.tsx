// src/features/menu/pages/ProdukPage.tsx

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
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
// --- Ganti Import API, Form, dan Tipe ---
import {
  createProdukJadi,
  deleteProdukJadi,
  getProdukJadi,
  updateProdukJadi,
} from "../api";
import { ProdukForm } from "../components/ProdukForm"; // Pastikan Anda sudah membuat file ini
import type { ProdukJadi } from "../types";

const ProdukPage = () => {
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

  // --- Ganti State dari 'BahanBaku' ke 'ProdukJadi' ---
  const [selectedProduk, setSelectedProduk] = useState<ProdukJadi | null>(null);
  const [produkToDelete, setProdukToDelete] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const toast = useToast();

  // --- Ganti Query Key dan Query Function ---
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["produkJadi"],
    queryFn: getProdukJadi,
  });

  const handleToast = (
    title: string,
    description: string,
    status: "success" | "error"
  ) => {
    toast({ title, description, status, duration: 3000, isClosable: true });
  };

  // --- Ganti Mutations untuk menggunakan API Produk ---
  const createMutation = useMutation({
    mutationFn: createProdukJadi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produkJadi"] });
      handleToast("Sukses", "Produk baru berhasil ditambahkan.", "success");
      onFormClose();
    },
    onError: (err) => handleToast("Error", err.message, "error"),
  });

  const updateMutation = useMutation({
    mutationFn: (variables: { id: number; updates: Partial<ProdukJadi> }) =>
      updateProdukJadi(variables.id, variables.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produkJadi"] });
      handleToast("Sukses", "Produk berhasil diperbarui.", "success");
      onFormClose();
    },
    onError: (err) => handleToast("Error", err.message, "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProdukJadi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produkJadi"] });
      handleToast("Sukses", "Produk berhasil dihapus.", "success");
      onAlertClose();
    },
    onError: (err) => handleToast("Error", err.message, "error"),
  });

  // --- Ganti Handlers untuk menggunakan state Produk ---
  const handleOpenForm = (produk: ProdukJadi | null) => {
    setSelectedProduk(produk);
    onFormOpen();
  };

  const handleFormSubmit = (
    formData: Omit<ProdukJadi, "id" | "created_at">
  ) => {
    if (selectedProduk) {
      updateMutation.mutate({ id: selectedProduk.id, updates: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleOpenDeleteAlert = (id: number) => {
    setProdukToDelete(id);
    onAlertOpen();
  };

  const handleDeleteConfirm = () => {
    if (produkToDelete) {
      deleteMutation.mutate(produkToDelete);
    }
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  // Fungsi untuk format mata uang
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        {/* --- Ganti Teks Judul --- */}
        <Heading>Manajemen Menu & Produk</Heading>
        <Button
          leftIcon={<LuPlus />}
          colorScheme="blue"
          onClick={() => handleOpenForm(null)}
        >
          {/* --- Ganti Teks Tombol --- */}
          Tambah Produk
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
              {/* --- Ganti Header Tabel --- */}
              <Tr>
                <Th>Nama Produk</Th>
                <Th>Kategori</Th>
                <Th isNumeric>Harga Jual</Th>
                <Th>Aksi</Th>
              </Tr>
            </Thead>
            <Tbody>
              {/* --- Ganti map dan data di dalam tabel --- */}
              {data.map((produk) => (
                <Tr key={produk.id}>
                  <Td>{produk.nama_produk}</Td>
                  <Td>{produk.kategori}</Td>
                  <Td isNumeric>{formatCurrency(produk.harga_jual)}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Edit"
                        icon={<LuPencil />}
                        size="sm"
                        onClick={() => handleOpenForm(produk)}
                      />
                      <IconButton
                        aria-label="Hapus"
                        icon={<LuTrash2 />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleOpenDeleteAlert(produk.id)}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* --- Ganti Komponen Form dan Props --- */}
      <ProdukForm
        isOpen={isFormOpen}
        onClose={onFormClose}
        onSubmit={handleFormSubmit}
        isLoading={isMutating}
        defaultValues={selectedProduk}
      />

      {/* --- Ganti Teks Dialog --- */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Hapus Produk
            </AlertDialogHeader>
            <AlertDialogBody>
              Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak
              bisa dibatalkan.
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

export default ProdukPage;
