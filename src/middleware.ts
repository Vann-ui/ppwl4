import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())

  // 2.3 onRequest - Global Logger
  .onRequest(({ request }) => {
    console.log("📥", request.method, request.url);
    console.log("🕒", new Date().toISOString());
  })

  // Short-Circuit Example - Block requests with x-block header
  .onRequest(({ request, set }) => {
    if (request.headers.get("x-block") === "true") {
      set.status = 403;
      return { message: "Blocked" };
    }
  })

  // Basic Route
  .get("/", () => "Hello Middleware")

  // 2.4 beforeHandle - Authentication Example
  .get(
    "/dashboard",
    () => ({
      message: "Welcome to Dashboard",
    }),
    {
      beforeHandle({ request, set }) {
        if (!request.headers.get("authorization")) {
          set.status = 401;
          return {
            success: false,
            message: "Unauthorized",
          };
        }
      },
      response: t.Object({
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

  // PRAKTIKUM 4 - beforeHandle (Authorization Required)
  .get(
    "/admin",
    () => {
      return {
        stats: 99,
      };
    },
    {
      beforeHandle({ request, set }) {
        const auth = request.headers.get("authorization");
        if (!auth || auth !== "Bearer 123") {
          set.status = 401;
          return {
            success: false,
            message: "Unauthorized",
          };
        }
      },
      response: t.Object({
        stats: t.Number(),
      }),
    }
  )

  // 2.5 afterHandle - Modify Response (scoped to /profile)
  .get(
    "/profile",
    () => ({
      name: "Nama kamu",
    }),
    {
      afterHandle: ({ response }) => {
        return {
          success: true,
          data: response,
        };
      },
    }
  )

  .listen(3000);

console.log("🦊 Server running at http://localhost:3000");
