export const queryKeys = {
  dashboard: (userId?: number) => ["dashboard", userId],
  transactions: (type: string, userId?: number) => [type, "transactions", userId],
};