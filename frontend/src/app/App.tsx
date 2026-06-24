import { Home } from "../pages/Home";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const App = () => {
  const [queryClient] = useState(new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-black h-full">
        <Home />
      </div>
    </QueryClientProvider>
  );
};
