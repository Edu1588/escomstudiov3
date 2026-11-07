import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextValue {
  value?: string | string[];
  onValueChange?: (val: string) => void;
  type?: "single" | "multiple";
}

const AccordionContext = React.createContext<AccordionContextValue>({});

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (val: any) => void;
  collapsible?: boolean;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ type = "single", value: controlledValue, defaultValue, onValueChange, className, children, ...props }, ref) => {
    const [value, setValue] = React.useState<string | string[]>(
      controlledValue ?? defaultValue ?? (type === "multiple" ? [] : "")
    );

    const handleValueChange = (itemValue: string) => {
      let nextValue: string | string[];
      if (type === "multiple") {
        const arr = Array.isArray(value) ? value : [];
        nextValue = arr.includes(itemValue) ? arr.filter((v) => v !== itemValue) : [...arr, itemValue];
      } else {
        nextValue = value === itemValue ? "" : itemValue;
      }
      setValue(nextValue);
      onValueChange?.(nextValue);
    };

    return (
      <AccordionContext.Provider value={{ value: controlledValue ?? value, onValueChange: handleValueChange, type }}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

const AccordionItemContext = React.createContext<{ value: string }>({ value: "" });

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => (
  <AccordionItemContext.Provider value={{ value }}>
    <div ref={ref} className={cn("border-b", className)} {...props}>
      {children}
    </div>
  </AccordionItemContext.Provider>
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { value: selected, onValueChange } = React.useContext(AccordionContext);
  const { value: itemValue } = React.useContext(AccordionItemContext);
  const isOpen = Array.isArray(selected) ? selected.includes(itemValue) : selected === itemValue;

  return (
    <div className="flex">
      <button
        ref={ref}
        type="button"
        onClick={() => onValueChange?.(itemValue)}
        data-state={isOpen ? "open" : "closed"}
        className={cn(
          "flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
      </button>
    </div>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { value: selected } = React.useContext(AccordionContext);
  const { value: itemValue } = React.useContext(AccordionItemContext);
  const isOpen = Array.isArray(selected) ? selected.includes(itemValue) : selected === itemValue;

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      data-state={isOpen ? "open" : "closed"}
      className={cn("overflow-hidden text-sm transition-all pb-4 pt-0", className)}
      {...props}
    >
      {children}
    </div>
  );
});
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
