import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";

import { cn } from "@/shared/lib/cn";

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-8 bg-[#1f1f1f] text-neutral-0",
        className,
      )}
      {...props}
    />
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div className="p-100 pb-0">
      <div className="flex h-500 items-center gap-100 rounded-6 border border-[#666] px-150 transition-colors focus-within:border-brand-lime">
        <Search aria-hidden="true" className="size-200 shrink-0 text-neutral-200" />
        <CommandPrimitive.Input
          className={cn(
            "typography-preset-5 h-full min-w-0 flex-1 bg-transparent text-neutral-0 outline-none placeholder:text-neutral-200",
            className,
          )}
          {...props}
        />
      </div>
    </div>
  );
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      className={cn(
        "max-h-[356px] overflow-x-hidden overflow-y-auto overscroll-contain outline-none",
        className,
      )}
      {...props}
    />
  );
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      className={cn(
        "typography-preset-5 px-200 py-400 text-center text-neutral-200",
        className,
      )}
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={cn(
        "overflow-hidden py-050 text-neutral-0 [&_[cmdk-group-heading]]:flex [&_[cmdk-group-heading]]:h-400 [&_[cmdk-group-heading]]:items-center [&_[cmdk-group-heading]]:justify-between [&_[cmdk-group-heading]]:border-b [&_[cmdk-group-heading]]:border-[#2a2a2a] [&_[cmdk-group-heading]]:px-150 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:leading-none [&_[cmdk-group-heading]]:text-neutral-200",
        className,
      )}
      {...props}
    />
  );
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={cn(
        "typography-preset-5-medium flex h-[42px] cursor-pointer items-center gap-100 px-150 outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40 data-[selected=true]:bg-[#2a2a2a]",
        className,
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
};
