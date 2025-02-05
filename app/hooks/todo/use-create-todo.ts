// import * as TodoAPI from "@/api/todo";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   makeDailyQueryKey,
//   makeMonthlyQueryKey,
//   TODO_QUERY_KEY,
// } from "./query-key";

// export function useCreateCategory(date: Date) {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationKey: TODO_QUERY_KEY,
//     mutationFn: TodoAPI.createTodo,
//     onSuccess: (data) => {
//       // 대상 일자 업데이트
//       queryClient.invalidateQueries({
//         queryKey: makeDailyQueryKey(date),
//       });
//       // 대상 월 업데이트
//       queryClient.invalidateQueries({
//         queryKey: makeMonthlyQueryKey(date),
//       });
//     },
//     onError: (error) => {
//       console.error("Error add item:", error);
//     },
//   });
// }
