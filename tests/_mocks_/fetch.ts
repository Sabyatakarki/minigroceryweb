// tests/__mocks__/fetch.ts
export const fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ token: "mockToken", message: "Logged in" }),
});