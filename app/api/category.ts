import type { Category, RawCategory } from "@/types/category";
import { KyInstance } from "ky";

/**
 * @see https://api.ticketbell.store/swagger-ui/index.html#/category-controller/getCategoryList
 */
export async function fetchCategories(client: KyInstance) {
  return await client.get(`categories`).json<RawCategory[]>();
}

export type UpdateCategoryPayload = Partial<Omit<Category, "id">> &
  Pick<Category, "id">;
/**
 * @see https://api.ticketbell.store/swagger-ui/index.html#/category-controller/changeCategory
 */
export async function updateCategory(
  client: KyInstance,
  payload: UpdateCategoryPayload
) {
  const { id, name, color } = payload;
  return await client
    .put(`categories/${id}`, {
      body: JSON.stringify({
        name,
        color,
      }),
    })
    .json<RawCategory>();
}

export type DeleteCategoryPayload = Pick<Category, "id">;
/**
 * @see https://api.ticketbell.store/swagger-ui/index.html#/category-controller/removeCategory
 */
export async function deleteCategory(
  client: KyInstance,
  payload: DeleteCategoryPayload
) {
  const { id } = payload;
  return await client.delete(`categories/${id}`);
}

export type CreateCategoryPayload = Omit<Category, "id">;
/**
 * @see https://api.ticketbell.store/swagger-ui/index.html#/category-controller/saveCategory
 */
export async function createCategory(
  client: KyInstance,
  payload: CreateCategoryPayload
) {
  const { name, color } = payload;
  return await client
    .post(`categories`, {
      body: JSON.stringify({
        name,
        color,
      }),
    })
    .json<RawCategory>();
}
