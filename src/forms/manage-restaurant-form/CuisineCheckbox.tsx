
import { Checkbox } from "../../components/ui/checkbox";
import { FormControl, FormItem, FormLabel } from "../../components/ui/form";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

type Props = {
  cuisine: { id: number, name: string };
  field: ControllerRenderProps<FieldValues, "cuisines">;
};

const CuisineCheckbox = ({ cuisine, field }: Props) => {
  return (
    <FormItem className="flex flex-row items-center space-x-1 space-y-0 mt-2">
      <FormControl>
        <Checkbox
          className="bg-white"
          checked={field.value.includes(cuisine.name)}
          onCheckedChange={(checked) => {
            if (checked) {
              field.onChange([...field.value, cuisine.name]);
            } else {
              field.onChange(
                field.value.filter((value: string) => value !== cuisine.name)
              );
            }
          }}
        />
      </FormControl>
      <FormLabel className="text-sm font-normal">{cuisine.name}</FormLabel>
    </FormItem>
  );
};

export default CuisineCheckbox;
