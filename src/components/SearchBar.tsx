import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Fuse from "fuse.js";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

const formSchema = z.object({
  searchQuery: z.string({
    required_error: "Restaurant name is required",
  }),
});

export type SearchForm = z.infer<typeof formSchema>;

type Props = {
  onSubmit: (formData: SearchForm) => void;
  placeHolder: string;
  onReset?: () => void;
  searchQuery: string;
  cityList: string[];  // List of cities for fuzzy search suggestions
};

const SearchBar = ({ onSubmit, onReset, placeHolder, searchQuery, cityList }: Props) => {
  const form = useForm<SearchForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchQuery,
    },
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    form.reset({ searchQuery });
  }, [form, searchQuery]);

  const fuse = new Fuse(cityList, {
    threshold: 0.3,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    form.setValue("searchQuery", inputValue);

    const fuzzyResults = fuse.search(inputValue).map(result => result.item);
    setSuggestions(fuzzyResults);
  };

  const handleReset = () => {
    form.reset({
      searchQuery: "",
    });

    if (onReset) {
      onReset();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`flex items-center gap-3 justify-between border-2 rounded-full p-3
          ${form.formState.errors.searchQuery && "border-red-700"}`}
      >
        <Search
          strokeWidth={2.5}
          size={30}
          className="ml-2 text-green-600 hidden md:block"
        />
        <FormField
          control={form.control}
          name="searchQuery"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  {...field}
                  className="border-none shadow-none text-xl focus-visible:ring-0"
                  placeholder={placeHolder}
                  onChange={handleInputChange}
                />
              </FormControl>
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => form.setValue("searchQuery", suggestion)}
                    className="cursor-pointer"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </FormItem>
          )}
        />
        <Button
          onClick={handleReset}
          type="button"
          variant="outline"
          className="rounded-full"
        >
          Reset
        </Button>
        <Button type="submit" className="rounded-full bg-green-600 text-white">
          Search
        </Button>
      </form>
    </Form>
  );
};

export default SearchBar;
