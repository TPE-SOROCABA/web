import { Input, Button } from "@material-tailwind/react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

type FilterText = {
  toSearch: string;
};

/**
 * FilterText component
 * @param {string} toSearch - Text to be displayed as a placeholder
 * @example
 * <FilterText toSearch="Pesquisar Voluntários" />
 */
export function FilterText({ toSearch }: FilterText) {
  const [search, setSearch] = useState("");
  const [_, setSearchParams] = useSearchParams();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!search) return setSearchParams({});
    setSearchParams({ search });
  };

  const updateSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch((old) => {
      if (Boolean(old) && !value) setSearchParams({});
      return value;
    });
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex justify-between items-center w-full gap-4"
    >
      <Input
        crossOrigin
        placeholder={toSearch}
        label="Pesquisar"
        type="search"
        size="lg"
        value={search}
        onChange={updateSearch}
      />
      <Button
        variant="outlined"
        className="border border-primary-600 rounded-3xl"
        placeholder="Filtrar"
        type="submit"
      >
        Filtrar
      </Button>
    </form>
  );
}
