import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())

  // 1.3 - VALIDASI REQUEST BODY
  .post(
    "/request",
    ({ body }) => {
      return {
        message: "Success",
        data: body,
      };
    },
    {
      body: t.Object({
        name: t.String({ minLength: 3 }),
        email: t.String({ format: "email" }),
        age: t.Number({ minimum: 18 }),
      }),
    }
  )

  // 1.4 - VALIDASI PARAMS & QUERY
  // GET /products/:id?sort=asc
  .get(
    "/products/:id",
    ({ params, query }) => {
      return {
        message: "Success",
        data: {
          productId: params.id,
          sortBy: query.sort || "asc",
        },
      };
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      query: t.Object({
        sort: t.Optional(t.Union([t.Literal("asc"), t.Literal("desc")])),
      }),
    }
  )

  // 1.5 - VALIDASI RESPONSE (SANGAT PENTING)
  .get(
    "/ping",
    () => {
      return {
        success: true,
        message: "Server OK",
      };
    },
    {
      response: t.Object({
        success: t.Boolean(),
        message: t.String(),
      }),
    }
  )

  // PRAKTIKUM 3 - VALIDASI RESPONSE
  .get(
    "/stats",
    () => {
      return {
        total: 100,
        active: 75,
      };
    },
    {
      response: t.Object({
        total: t.Number(),
        active: t.Number(),
      }),
    }
  )

  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
