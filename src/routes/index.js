import controller from "../controllers/basic.controller.js";
import dashboard from "../controllers/dashboard.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authRouter from "./auth.route.js";
import imageRouter from "./image.route.js";

export default function setupRoutes(app) {
  app.get("/", (req, res) => {
    res.send("Running 🏃🏃🏃");
  });

  app.use(authRouter);
  app.use(imageRouter);

  app.get("/dashboard", authMiddleware("required-admin"), dashboard);

  app.get("/products", authMiddleware("none"), controller.findMany("product"));
  app.get(
    "/products/:id",
    authMiddleware("required-admin"),
    controller.findSingle("product")
  );
  app.post(
    "/products",
    authMiddleware("required-admin"),
    controller.createSingle("product")
  );
  app.put(
    "/products/:id",
    authMiddleware("required-admin"),
    controller.updateSingle("product")
  );
  app.delete(
    "/products/:id",
    authMiddleware("required-admin"),
    controller.removeSingle("product")
  );

  app.get(
    "/categories",
    authMiddleware("none"),
    controller.findMany("category")
  );
  app.get(
    "/categories/:id",
    authMiddleware("required-admin"),
    controller.findSingle("category")
  );
  app.post(
    "/categories",
    authMiddleware("required-admin"),
    controller.createSingle("category")
  );
  app.put(
    "/categories/:id",
    authMiddleware("required-admin"),
    controller.updateSingle("category")
  );
  app.delete(
    "/categories/:id",
    authMiddleware("required-admin"),
    controller.removeSingle("category")
  );

  app.get(
    "/variants",
    authMiddleware("required-admin"),
    controller.findMany("variant")
  );
  app.get(
    "/variants/:id",
    authMiddleware("required-admin"),
    controller.findSingle("variant")
  );
  app.post(
    "/variants",
    authMiddleware("required-admin"),
    controller.createSingle("variant")
  );
  app.put(
    "/variants/:id",
    authMiddleware("required-admin"),
    controller.updateSingle("variant")
  );
  app.delete(
    "/variants/:id",
    authMiddleware("required-admin"),
    controller.removeSingle("variant")
  );

  app.get(
    "/variantGroups",
    authMiddleware("required-admin"),
    controller.findMany("variantgroup")
  );
  app.get(
    "/variantGroups/:id",
    authMiddleware("required-admin"),
    controller.findSingle("variantgroup")
  );
  app.post(
    "/variantGroups",
    authMiddleware("required-admin"),
    controller.createSingle("variantgroup")
  );
  app.put(
    "/variantGroups/:id",
    authMiddleware("required-admin"),
    controller.updateSingle("variantgroup")
  );
  app.delete(
    "/variantGroups/:id",
    authMiddleware("required-admin"),
    controller.removeSingle("variantgroup")
  );

  app.get("/orders", authMiddleware("required"), controller.findMany("order"));
  app.get(
    "/orders/:id",
    authMiddleware("required-admin"),
    controller.findSingle("order")
  );
  app.post(
    "/orders",
    authMiddleware("required"),
    controller.createSingle("order")
  );
  app.put(
    "/orders/:id",
    authMiddleware("required-admin"),
    controller.updateSingle("order")
  );
  app.delete(
    "/orders/:id",
    authMiddleware("required-admin"),
    controller.removeSingle("order")
  );

  app.get(
    "/reservations",
    authMiddleware("required-admin"),
    controller.findMany("reservation")
  );
  app.get(
    "/reservations/:id",
    authMiddleware("required-admin"),
    controller.findSingle("reservation")
  );
  app.post(
    "/reservations",
    authMiddleware("required"),
    controller.createSingle("reservation")
  );
  app.put(
    "/reservations/:id",
    authMiddleware("required-admin"),
    controller.updateSingle("reservation")
  );
  app.delete(
    "/reservations/:id",
    authMiddleware("required-admin"),
    controller.removeSingle("reservation")
  );

  app.get(
    "/reviews",
    authMiddleware("required-admin"),
    controller.findMany("review")
  );
  app.get(
    "/reviews/:id",
    authMiddleware("required-admin"),
    controller.findSingle("review")
  );
  app.post(
    "/reviews",
    authMiddleware("none"),
    controller.createSingle("review")
  );
  app.put(
    "/reviews/:id",
    authMiddleware("required-admin"),
    controller.updateSingle("review")
  );
  app.delete(
    "/reviews/:id",
    authMiddleware("required-admin"),
    controller.removeSingle("review")
  );

  app.get(
    "/users",
    authMiddleware("required-admin"),
    controller.findMany("user")
  );
  app.get(
    "/users/:id",
    authMiddleware("required-admin"),
    controller.findSingle("user")
  );
  app.delete(
    "/users/:id",
    authMiddleware("required-admin"),
    controller.removeSingle("user")
  );

  app.get("/faqs", authMiddleware("none"), controller.findMany("faq"));
  app.get(
    "/faqs/:id",
    authMiddleware("required-admin"),
    controller.findSingle("faq")
  );
  app.post(
    "/faqs",
    authMiddleware("required-admin"),
    controller.createSingle("faq")
  );
  app.put(
    "/faqs/:id",
    authMiddleware("required-admin"),
    controller.updateSingle("faq")
  );
  app.delete(
    "/faqs/:id",
    authMiddleware("required-admin"),
    controller.removeSingle("faq")
  );

  app.get(
    "/business",
    authMiddleware("none"),
    controller.findMany("businessinformation")
  );
  app.get(
    "/business/:id",
    authMiddleware("none"),
    controller.findSingle("businessinformation")
  );
  app.put(
    "/business/:id",
    authMiddleware("required-admin"),
    controller.updateSingle("businessinformation")
  );

  app.get("/tables", authMiddleware("none"), controller.findMany("table"));
  app.get(
    "/tables/:id",
    authMiddleware("required-admin"),
    controller.findSingle("table")
  );
  app.post(
    "/tables",
    authMiddleware("required-admin"),
    controller.createSingle("table")
  );
  app.put(
    "/tables/:id",
    authMiddleware("required-admin"),
    controller.updateSingle("table")
  );
  app.delete(
    "/tables/:id",
    authMiddleware("required-admin"),
    controller.removeSingle("table")
  );
}
