"use client";

import { useEffect, useRef, useState } from "react";
import { Combobox } from "@headlessui/react";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { v4 as uuidv4 } from "uuid";

import Spacer from "@/components/Spacer";
import useDetectClickOutside from "@/hooks/useDetectClickOutside";

type ShoppingListItem = {
  id: string;
  itemName: string;
};

type SearchResult = {
  name: string;
  isAdded: boolean;
};

export default function Home() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkedItemIDs, setCheckedItemIDs] = useState<Set<string>>(new Set());
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useDetectClickOutside({ ref: dropdownRef, callback: setIsShowDropdown });

  useEffect(() => {
    const getShoppingItems = async () => {
      const res = await fetch(
        `https://api.frontendeval.com/fake/food/${searchQuery}`
      );
      const data = (await res.json()) as string[];
      setSearchResults(
        data.map((item) => {
          return { name: item, isAdded: false };
        })
      );
    };

    const timeout = setTimeout(() => {
      if (searchQuery.length > 1) {
        getShoppingItems();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchQuery]);

  const deleteItem = (id: string) => {
    setShoppingList(
      shoppingList.filter((item) => {
        return item.id !== id;
      })
    );
    toggleCheckedItem(id);
  };

  const toggleCheckedItem = (id: string) => {
    const checkedItemsCopy = structuredClone(checkedItemIDs);
    if (checkedItemsCopy.has(id)) {
      checkedItemsCopy.delete(id);
    } else {
      checkedItemsCopy.add(id);
    }
    setCheckedItemIDs(checkedItemsCopy);
  };

  const addItem = (item: string) => {
    setShoppingList([...shoppingList, { id: uuidv4(), itemName: item }]);
    setSearchResults(
      searchResults.map((searchResult) => {
        if (searchResult.name === item) {
          return { ...searchResult, isAdded: true };
        } else {
          return searchResult;
        }
      })
    );
  };

  return (
    <div className="grid place-items-center">
      <div className="py-48px px-40px [border:1px_solid_rgba(0,0,0,.2)] rounded-12px w-[450px] h-[500px] bg-white max-w-[96vw]">
        <h1 className="text-20px font-600">Shopping list</h1>
        <Spacer size={48} axis="y" />
        <Combobox onChange={addItem} value={searchQuery}>
          <div ref={dropdownRef} className="relative">
            <Combobox.Input
              className="rounded-6px px-[10px] py-[6px] w-full [border:1px_solid_rgba(0,0,0,.2)] bg-[rgba(0,0,0,.02)]"
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsShowDropdown(true)}
              autoComplete="off"
              placeholder="Search for an item"
              aria-label="Search for an item"
            />
            {isShowDropdown && searchResults.length > 0 && (
              <Combobox.Options
                className="absolute bg-[#FCFCFC] w-full rounded-6px overflow-hidden [border:1px_solid_rgba(0,0,0,.2)] shadow-sm"
                static
              >
                {searchResults.slice(0, 5).map((result) => {
                  const { name, isAdded } = result;
                  return (
                    <Combobox.Option
                      value={name}
                      key={name}
                      className="cursor-pointer"
                    >
                      {({ active }) => (
                        <div
                          className={`px-8px py-8px flex items-center justify-between ${
                            active ? "bg-[rgba(0,0,0,.07)]" : ""
                          }`}
                        >
                          <p>{name}</p>
                          {isAdded ? (
                            <div className="animate-fade-in">
                              <CheckIcon />
                            </div>
                          ) : null}
                        </div>
                      )}
                    </Combobox.Option>
                  );
                })}
              </Combobox.Options>
            )}
          </div>
        </Combobox>
        <Spacer size={32} axis="y" />
        {shoppingList.length === 0 ? (
          <p className="text-grey-200">
            There are no items in your list. To add items, use the search box
            above
          </p>
        ) : (
          <div className="flex flex-col gap-12px overflow-auto h-[250px] pr-20px -mr-20px">
            {shoppingList.map((item) => {
              const { id, itemName } = item;
              const isChecked = checkedItemIDs.has(id);
              return (
                <div key={id} className="flex">
                  <button onClick={() => toggleCheckedItem(id)}>
                    <CheckIcon color={isChecked ? "#576E75" : "black"} />
                    <p className="visually-hidden">check item</p>
                  </button>
                  <Spacer size={24} axis="x" />
                  <p
                    className={`${
                      isChecked ? "line-through text-[#576E75]" : ""
                    }`}
                  >
                    {itemName}
                  </p>
                  <Spacer size={8} axis="x" />
                  <button onClick={() => deleteItem(id)} className="ml-auto">
                    <p className="visually-hidden">delete item</p>
                    <Cross1Icon color="red" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
