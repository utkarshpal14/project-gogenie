
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";

// Define the time periods
export const timePeriods = [
  { value: "morning", label: "Morning (6 AM - 12 PM)" },
  { value: "afternoon", label: "Afternoon (12 PM - 5 PM)" },
  { value: "evening", label: "Evening (5 PM - 9 PM)" },
  { value: "night", label: "Night (9 PM - 6 AM)" }
];

/**
 * @param {{ control: any }} props
 */

export default function TimeSelector({ control }) {
  return (
    <FormField
      control={control}
      name="timePeriod"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <Label className="text-base">What time is it?</Label>
          <FormControl>
            <RadioGroup 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              className="grid grid-cols-2 gap-3"
            >
              {timePeriods.map((time) => (
                <div key={time.value}>
                  <RadioGroupItem
                    value={time.value}
                    id={`time-${time.value}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`time-${time.value}`}
                    className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-goginie-primary [&:has([data-state=checked])]:border-goginie-primary"
                  >
                    <span>{time.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
