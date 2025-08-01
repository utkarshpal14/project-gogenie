
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export default function LocationInput({ control }) {
  return (
    <FormField
      control={control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Where are you?</FormLabel>
          <FormControl>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Enter city or location" 
                className="pl-10" 
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
