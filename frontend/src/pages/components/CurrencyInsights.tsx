import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

export const CurrencyInsights = () => {
  return (
    <section className="mt-8.25" aria-label="Currency insights">
      <Tabs defaultValue="HISTORY">
        <TabsList>
          <TabsTrigger className="px-[20px]" value="HISTORY">HISTORY</TabsTrigger>
          <TabsTrigger className="px-[20px]" value="COMPARE">COMPARE</TabsTrigger>
          <TabsTrigger className="px-[20px]" value="FAVORITES">
            FAVORITES
            <span className="min-w-[20px] typography-preset-6 rounded-full bg-brand-lime/15 p-1.25 text-brand-lime">
              10
            </span>
          </TabsTrigger>
          <TabsTrigger className="px-[20px]" value="LOG">
            LOG
            <span className="min-w-[20px] typography-preset-6 rounded-full bg-brand-lime/15 p-1.25 text-brand-lime">
              8
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="HISTORY">HISTORY</TabsContent>
        <TabsContent value="COMPARE">COMPARE</TabsContent>
        <TabsContent value="FAVORITES">FAVORITES</TabsContent>
        <TabsContent value="LOG">LOG</TabsContent>
      </Tabs>
    </section>
  );
};
