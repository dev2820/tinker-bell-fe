import type { Category, RawCategory } from "@/types/category";
import { authAPI } from "./index";
import Cookies from "js-cookie";

/**
 * @see https://api.ticketbell.store/swagger-ui/index.html#/category-controller/getCategoryList
 */
export async function fetchCategories() {
  return await authAPI
    .get(`categories`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    })
    .json<RawCategory[]>();
}

type UpdateCategoryPayload = Partial<Omit<Category, "id">> &
  Pick<Category, "id">;
/**
 * @see https://api.ticketbell.store/swagger-ui/index.html#/category-controller/changeCategory
 */
export async function updateCategory(payload: UpdateCategoryPayload) {
  const { id, name, color } = payload;
  return await authAPI
    .put(`categories/${id}`, {
      body: JSON.stringify({
        name,
        color,
      }),
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    })
    .json<RawCategory>();
}

type DeleteCategoryPayload = Pick<Category, "id">;
/**
 * @see https://api.ticketbell.store/swagger-ui/index.html#/category-controller/removeCategory
 */
export async function deleteCategory(payload: DeleteCategoryPayload) {
  const { id } = payload;
  return await authAPI.delete(`categories/${id}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  });
}

type CreateCategoryPayload = Omit<Category, "id">;
/**
 * @see https://api.ticketbell.store/swagger-ui/index.html#/category-controller/saveCategory
 */
export async function createCategory(payload: CreateCategoryPayload) {
  const { name, color } = payload;
  return await authAPI
    .post(`categories`, {
      body: JSON.stringify({
        name,
        color,
      }),
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    })
    .json<RawCategory>();
}
