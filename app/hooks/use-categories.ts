import { useEffect, useState } from "react";
import { fetchCategories } from "@/utils/api/category";
import type { Category } from "@/types/category";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function updateCategories() {
      const categories = await fetchCategories();
      setCategories(categories);
    }

    updateCategories();
  }, []);

  return {
    categories,
  };
};
