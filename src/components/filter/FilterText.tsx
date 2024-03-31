import { Input, Button } from "@material-tailwind/react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { tv } from "tailwind-variants";

type FilterText = {
  toSearch: string;
  handleSearchEvent?: (event: string) => void;
  showButton?: boolean;
  className?: HTMLElement["className"];
};

const inputClass = tv({
  base: "flex justify-between items-center w-full gap-4",
});

/**
 * FilterText component
 * @param {string} toSearch - Text to be displayed as a placeholder
 * @param {function} handleSearchEvent - Function to be called when the input is changed
 * @param {boolean} showButton - Show the button to submit the form
 * @example
 * <FilterText toSearch="Pesquisar Voluntários" handleSearchEvent={handleSearch} showButton />
 */
export function FilterText({
  toSearch,
  handleSearchEvent,
  showButton = true,
  className,
}: FilterText) {
  const [search, setSearch] = useState("");
  const [, setSearchParams] = useSearchParams();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (handleSearchEvent) {
      return handleSearchEvent(search);
    }

    if (!search) return setSearchParams({});
    setSearchParams({ search });
  };

  const updateSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch((old) => {
      if (Boolean(old) && !value) setSearchParams({});
      handleSearchEvent && handleSearchEvent(value);
      return value;
    });
  };

  return (
    <form
      onSubmit={handleSearch}
      className={inputClass({
        className,
      })}
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
      {!handleSearchEvent && (<Button
        variant="outlined"
        className="border border-primary-600 rounded-3xl"
        placeholder="Filtrar"
        type="submit"
        hidden={!showButton}
      >
        Filtrar
      </Button>)}
    </form>
  );
}
