import React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/lib/utils";

export const Drawer = ({ shouldScaleBackground = true, ...props }) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
);

export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerPortal = DrawerPrimitive.Portal;
export const DrawerClose = DrawerPrimitive.Close;

export const DrawerOverlay = React.forwardRef((props, ref) => {
  return (
    <DrawerPrimitive.Overlay
      ref={ref}
      className={cn("fixed inset-0 z-50 bg-black/80", props.className)}
      {...props}
    />
  );
});
DrawerOverlay.displayName = "DrawerOverlay";

export const DrawerContent = React.forwardRef((props, ref) => {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
          props.className
        )}
        {...props}
      >
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        {props.children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
});
DrawerContent.displayName = "DrawerContent";

export const DrawerHeader = (props) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", props.className)}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

export const DrawerFooter = (props) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", props.className)}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

export const DrawerTitle = React.forwardRef((props, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", props.className)}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

export const DrawerDescription = React.forwardRef((props, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", props.className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";
