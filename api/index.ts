import express from "express";
import { SquareClient, SquareEnvironment } from "square";
import crypto from "crypto";

const app = express();
app.use(express.json());

// Cache Square clients per environment
const squareClients: Record<string, SquareClient> = {};
const getSquare = (env: SquareEnvironment) => {
  if (!squareClients[env]) {
    const token = process.env.SQUARE_ACCESS_TOKEN;
    if (!token) {
      throw new Error("SQUARE_ACCESS_TOKEN environment variable is required");
    }
    squareClients[env] = new SquareClient({
      environment: env,
      token: token,
    });
  }
  return squareClients[env];
};

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Square configuration for client-side Web Payments SDK
app.get("/api/square-config", (req, res) => {
  res.json({
    squareApplicationId: process.env.VITE_SQUARE_APPLICATION_ID || process.env.SQUARE_APPLICATION_ID,
    squareLocationId: process.env.VITE_SQUARE_LOCATION_ID || process.env.SQUARE_LOCATION_ID,
  });
});

// Square Payment endpoint
app.post("/api/payment", async (req, res) => {
  try {
    const { sourceId, items, deliveryType, buyerName, buyerEmail, buyerPhone } = req.body;
    let locationId = process.env.SQUARE_LOCATION_ID;

    // Calculate total amount
    let shippingRate = 0;
    if (deliveryType === "delivery_la") {
      shippingRate = 2000; // $20
    } else if (deliveryType === "delivery_lb") {
      shippingRate = 1000; // $10
    }

    let totalAmount = shippingRate;
    if (Array.isArray(items)) {
      items.forEach((item: any) => {
        totalAmount += Math.round((Number(item.price) || 0) * 100 * (Number(item.quantity) || 1));
      });
    }

    const note = `Buyer: ${buyerName || "N/A"}, Email: ${buyerEmail || "N/A"}, Phone: ${buyerPhone || "N/A"}`;

    const processPayment = async (env: SquareEnvironment) => {
      const square = getSquare(env);

      if (!locationId) {
        const locs = await square.locations.list();
        if (locs.locations && locs.locations.length > 0) {
          const active = locs.locations.find((l) => l.status === "ACTIVE");
          locationId = (active?.id || locs.locations[0].id) as string;
        }
      }

      try {
        return await square.payments.create({
          sourceId,
          idempotencyKey: crypto.randomUUID(),
          amountMoney: {
            amount: BigInt(totalAmount),
            currency: "USD",
          },
          locationId: locationId!,
          note: note,
        });
      } catch (err: any) {
        const isInvalidLocation =
          err.errors &&
          err.errors.some((e: any) => e.detail && e.detail.toLowerCase().includes("location id"));
        if (isInvalidLocation) {
          const locs = await square.locations.list();
          if (locs.locations && locs.locations.length > 0) {
            const active = locs.locations.find((l) => l.status === "ACTIVE");
            locationId = (active?.id || locs.locations[0].id) as string;

            return await square.payments.create({
              sourceId,
              idempotencyKey: crypto.randomUUID(),
              amountMoney: {
                amount: BigInt(totalAmount),
                currency: "USD",
              },
              locationId: locationId!,
              note: note,
            });
          }
        }
        throw err;
      }
    };

    let response;
    try {
      response = await processPayment(SquareEnvironment.Production);
    } catch (prodError: any) {
      const isAuthError =
        prodError.statusCode === 401 ||
        (prodError.errors && prodError.errors[0]?.code === "UNAUTHORIZED");
      if (isAuthError) {
        response = await processPayment(SquareEnvironment.Sandbox);
      } else {
        throw prodError;
      }
    }

    const serializedResponse = JSON.parse(
      JSON.stringify(response, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.json(serializedResponse);
  } catch (e: any) {
    console.error("Square API Error:", e);
    let errorMsg = e.message;
    if (e.errors && Array.isArray(e.errors)) {
      errorMsg = e.errors.map((err: any) => err.detail || err.code).join(", ");
    }
    res.status(500).json({ error: errorMsg });
  }
});

// Fallback 404 for unmatched /api routes
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

export default app;
