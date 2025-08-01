import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

import LocationInput from "./LocationInput";
import MoodSelector from "./MoodSelector";
import TimeSelector from "./TimeSelector";
import FormActions from "./FormActions";

// Default values for the form
const defaultValues = {
  location: "",
  mood: "",
  timePeriod: "afternoon"
};

/**
 * @param {{ onSubmitSuccess: (data: { location: string, mood: string, timePeriod: string }) => void }}
 */
export default function MoodForm({ onSubmitSuccess }) {
  const form = useForm({
    defaultValues
  });

  const onSubmit = (values) => {
    if (!values.location) {
      toast.error("Please enter a location");
      return;
    }

    if (!values.mood) {
      toast.error("Please select your mood");
      return;
    }

    console.log("Form values:", values);
    onSubmitSuccess(values);
    toast.success("Generating recommendations based on your mood!");
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <LocationInput control={form.control} />
            <MoodSelector control={form.control} />
            <TimeSelector control={form.control} />
            <FormActions />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
