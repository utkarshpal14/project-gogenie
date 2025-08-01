
import { Zap, Coffee, Heart, Utensils, Moon, Sun } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";

// Define the moods available in the app
export const moods = [
  { value: "adventurous", label: "Adventurous", icon: <Zap className="h-5 w-5 text-yellow-500" /> },
  { value: "relaxed", label: "Relaxed", icon: <Coffee className="h-5 w-5 text-blue-500" /> },
  { value: "romantic", label: "Romantic", icon: <Heart className="h-5 w-5 text-pink-500" /> },
  { value: "hungry", label: "Hungry", icon: <Utensils className="h-5 w-5 text-orange-500" /> },
  { value: "tired", label: "Tired", icon: <Moon className="h-5 w-5 text-indigo-500" /> },
  { value: "energetic", label: "Energetic", icon: <Sun className="h-5 w-5 text-red-500" /> }
];

/**
 * @param {{ control: any }} props
 */

export default function MoodSelector({ control }) {
  return (
    <FormField
      control={control}
      name="mood"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <Label className="text-base">How are you feeling right now?</Label>
          <FormControl>
            <RadioGroup 
              onValueChange={field.onChange} 
              value={field.value}
              className="grid grid-cols-2 md:grid-cols-3 gap-3"
            >
              {moods.map((mood) => (
                <div key={mood.value}>
                  <RadioGroupItem
                    value={mood.value}
                    id={`mood-${mood.value}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`mood-${mood.value}`}
                    className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-goginie-primary [&:has([data-state=checked])]:border-goginie-primary"
                  >
                    {mood.icon}
                    <span className="mt-2">{mood.label}</span>
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
