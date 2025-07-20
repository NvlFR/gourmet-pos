// // src/features/procurement/pages/SupplierPage.tsx
// import {
//     AlertDialog,
//     AlertDialogBody,
//     AlertDialogContent,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogOverlay,
//     Box,
//     Button,
//     Flex,
//     Heading,
//     HStack,
//     IconButton,
//     Spinner,
//     Table,
//     Tbody,
//     Td,
//     Th,
//     Thead,
//     Tr,
//     useDisclosure,
//     useToast,
//   } from '@chakra-ui/react';
//   import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
//   import { useRef, useState } from 'react';
//   import { LuPencil, LuPlus, LuTrash2 } from 'react-icons/lu';
//   import { createSupplier, deleteSupplier, getSuppliers, updateSupplier } from '../api/supplierApi';
//   // Anda perlu membuat SupplierForm.tsx dengan mencontoh form sebelumnya
//   // import { SupplierForm } from '../components/SupplierForm';
//   import { Supplier } from '../types';

//   const SupplierPage = () => {
//     const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
//     const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
//     const cancelRef = useRef(null);

//     const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
//     const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null);

//     const queryClient = useQueryClient();
//     const toast = useToast();

//     const { data, isLoading, isError, error } = useQuery({
//       queryKey: ['suppliers'],
//       queryFn: getSuppliers,
//     });

//     // ... (Mutations: create, update, delete disesuaikan untuk supplier)
//     // Anda bisa copy-paste dari halaman produk dan ganti nama fungsinya
//     // Contoh: mutationFn: createSupplier, queryKey: ['suppliers'], dst.

//     // ... (Handlers: handleOpenForm, handleFormSubmit, dst.)

//     return (
//       <Box>
//         <Flex justifyContent="space-between" alignItems="center" mb={6}>
//           <Heading>Manajemen Supplier</Heading>
//           <Button leftIcon={<LuPlus />} colorScheme="blue" onClick={() => { /* handleOpenForm(null) */ }}>
//             Tambah Supplier
//           </Button>
//         </Flex>

//         <Box bg="gray.800" p={4} borderRadius="md">
//           {isLoading ? (
//             <Flex justify="center" align="center" h="200px"><Spinner size="xl" /></Flex>
//           ) : (
//             <Table variant="simple">
//               <Thead>
//                 <Tr>
//                   <Th>Nama Supplier</Th>
//                   <Th>Kontak Person</Th>
//                   <Th>Telepon</Th>
//                   <Th>Aksi</Th>
//                 </Tr>
//               </Thead>
//               <Tbody>
//                 {data?.map((supplier) => (
//                   <Tr key={supplier.id}>
//                     <Td>{supplier.nama_supplier}</Td>
//                     <Td>{supplier.kontak_person || '-'}</Td>
//                     <Td>{supplier.telepon || '-'}</Td>
//                     <Td>
//                       <HStack spacing={2}>
//                         <IconButton aria-label="Edit" icon={<LuPencil />} size="sm" onClick={() => { /* handleOpenForm(supplier) */ }} />
//                         <IconButton aria-label="Hapus" icon={<LuTrash2 />} size="sm" colorScheme="red" onClick={() => { /* handleOpenDeleteAlert(supplier.id) */ }} />
//                       </HStack>
//                     </Td>
//                   </Tr>
//                 ))}
//               </Tbody>
//             </Table>
//           )}
//         </Box>
//         {/* Komponen <SupplierForm> dan <AlertDialog> akan ditempatkan di sini */}
//       </Box>
//     );
//   };

//   export default SupplierPage;
