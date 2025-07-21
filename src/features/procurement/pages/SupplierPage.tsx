// src/features/procurement/pages/SupplierPage.tsx
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
import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
} from "../api/supplierApi";
// import { SupplierForm } from "../components/SupplierForm"; // Komentar karena error: tidak ada export SupplierForm
import type { Supplier } from "../types";

const SupplierPage = () => {
  // State & hooks
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
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const toast = useToast();

  // Query data supplier
  const {
    data: suppliers,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["suppliers"],
    queryFn: getSuppliers,
  });

  // Mutasi: Tambah Supplier
  const createMutation = useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast({
        title: "Supplier berhasil ditambahkan",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onFormClose();
    },
    onError: () => {
      toast({
        title: "Gagal menambah supplier",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  // Mutasi: Update Supplier
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Supplier> }) =>
      updateSupplier(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast({
        title: "Supplier berhasil diupdate",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onFormClose();
    },
    onError: () => {
      toast({
        title: "Gagal mengupdate supplier",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  // Mutasi: Hapus Supplier
  const deleteMutation = useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast({
        title: "Supplier berhasil dihapus",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setSupplierToDelete(null);
      onAlertClose();
    },
    onError: () => {
      toast({
        title: "Gagal menghapus supplier",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  // Handler
  const handleOpenForm = (supplier: Supplier | null) => {
    setSelectedSupplier(supplier);
    onFormOpen();
  };

  const handleFormSubmit = (values: Omit<Supplier, "id">) => {
    if (selectedSupplier) {
      updateMutation.mutate({ id: selectedSupplier.id, updates: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleOpenDeleteAlert = (id: number) => {
    setSupplierToDelete(id);
    onAlertOpen();
  };

  const handleDeleteSupplier = () => {
    if (supplierToDelete) {
      deleteMutation.mutate(supplierToDelete);
    }
  };

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading>Manajemen Supplier</Heading>
        <Button
          leftIcon={<LuPlus />}
          colorScheme="blue"
          onClick={() => handleOpenForm(null)}
        >
          Tambah Supplier
        </Button>
      </Flex>

      <Box bg="gray.800" p={4} borderRadius="md">
        {isLoading ? (
          <Flex justify="center" align="center" h="200px">
            <Spinner size="xl" />
          </Flex>
        ) : isError ? (
          <Box color="red.300" textAlign="center" py={8}>
            Gagal memuat data supplier:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </Box>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nama Supplier</Th>
                <Th>Kontak Person</Th>
                <Th>Telepon</Th>
                <Th>Aksi</Th>
              </Tr>
            </Thead>
            <Tbody>
              {suppliers?.map((supplier: Supplier) => (
                <Tr key={supplier.id}>
                  <Td>{supplier.nama_supplier}</Td>
                  <Td>{supplier.kontak_person || "-"}</Td>
                  <Td>{supplier.telepon || "-"}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Edit"
                        icon={<LuPencil />}
                        size="sm"
                        onClick={() => handleOpenForm(supplier)}
                      />
                      <IconButton
                        aria-label="Hapus"
                        icon={<LuTrash2 />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleOpenDeleteAlert(supplier.id)}
                        isLoading={
                          deleteMutation.isPending &&
                          supplierToDelete === supplier.id
                        }
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* Dialog Form Supplier */}
      {/* 
        Anda harus membuat komponen SupplierForm di ../components/SupplierForm
        Props: isOpen, onClose, initialValues, onSubmit, isLoading
        Komponen ini dikomentari karena error import/export.
      */}
      {/* <SupplierForm
        isOpen={isFormOpen}
        onClose={onFormClose}
        initialValues={selectedSupplier}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      /> */}

      {/* Dialog Konfirmasi Hapus */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Hapus Supplier
            </AlertDialogHeader>
            <AlertDialogBody>
              Apakah Anda yakin ingin menghapus supplier ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                Batal
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteSupplier}
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

export default SupplierPage;
