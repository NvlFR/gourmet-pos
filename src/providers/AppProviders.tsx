// src/providers/AppProviders.tsx
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import customTheme from "../styles/theme";

// Buat instance dari QueryClient
const queryClient = new QueryClient();

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={customTheme}>{children}</ChakraProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};
