const categoryRouter = require("./category_router");
const NCCRouter = require("./NCC_router");
const accountRouter = require("./account_router");
const productRouter = require("./product_router");
const discountRouter = require("./discount_router");
const traffic = require("./traffic_router");
const cartRouter = require("./cart_router");
const orderRouter = require("./order_router");
const authRouter = require("./auth");
const promotionRouter = require("./KhuyenMai");
const khoRouter = require("./kho_router");

module.exports = (app) => {
  app.use("/api/categories", categoryRouter);
  app.use("/api/NCC", NCCRouter);
  app.use("/api/accounts", accountRouter);
  app.use("/api/products", productRouter);
  app.use("/api/discounts", discountRouter);
  app.use("/api/carts", cartRouter);
  app.use("/api/orders", orderRouter);
  app.use("/api/auth", authRouter);
  app.use("/promotion", promotionRouter);
  app.use("/api/kho", khoRouter);
};
