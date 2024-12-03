import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, X } from "lucide-react";

const formSchema = z.object({
  searchQuery: z.string({
    required_error: "Search is required",
  }),
});

export type SearchForm = z.infer<typeof formSchema>;

type Props = {
  onSubmit: (formData: SearchForm) => void;
  placeHolder: string;
  onReset?: () => void;
  searchQuery: string;
};

const SearchBar = ({
  onSubmit,
  onReset,
  placeHolder,
  searchQuery,
}: Props) => {
  const form = useForm<SearchForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchQuery,
    },
  });

  useEffect(() => {
    form.reset({ searchQuery });
  }, [form, searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("searchQuery", e.target.value);
  };

  const handleReset = () => {
    form.reset({ searchQuery: "" });
    if (onReset) {
      onReset();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`flex items-center gap-1 border-2 rounded-full p-2 md:p-3
          ${form.formState.errors.searchQuery && "border-red-700"}`}
      >
        {/* Search Icon */}
        <button type="submit" className="p-1" aria-label="Search">
          <Search className="w-5 h-5 text-green-600" />
        </button>

        {/* Input Field */}
        <FormField
          control={form.control}
          name="searchQuery"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  {...field}
                  className="border-none shadow-none text-xs md:text-base lg:text-xl focus-visible:ring-0"
                  placeholder={placeHolder}
                  onChange={handleInputChange}
                  style={{ minWidth: "100px" }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Reset Button Icon */}
        <button
          onClick={handleReset}
          type="button"
          className="p-1"
          aria-label="Reset"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Full buttons for larger screens */}
        <Button
          onClick={handleReset}
          type="button"
          variant="outline"
          className="hidden md:block rounded-full"
        >
          Reset
        </Button>
        <Button type="submit" className="hidden md:block rounded-full bg-green-600 text-white">
          Search
        </Button>
      </form>
    </Form>
  );
};

export default SearchBar;
