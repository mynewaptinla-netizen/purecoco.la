import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { SquareClient, SquareEnvironment } from "square";
import crypto from "crypto";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Cache Square clients per environment
  let squareClients: Record<string, SquareClient> = {};
  const getSquare = (env: SquareEnvironment) => {
    if (!squareClients[env]) {
      const token = process.env.SQUARE_ACCESS_TOKEN;
      if (!token) {
        throw new Error('SQUARE_ACCESS_TOKEN environment variable is required');
      }
      squareClients[env] = new SquareClient({
        environment: env,
        token: token,
      });
    }
    return squareClients[env];
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/square-config", (req, res) => {
    res.json({
      squareApplicationId: process.env.VITE_SQUARE_APPLICATION_ID || process.env.SQUARE_APPLICATION_ID,
      squareLocationId: process.env.VITE_SQUARE_LOCATION_ID || process.env.SQUARE_LOCATION_ID,
    });
  });

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
      items.forEach((item: any) => {
        totalAmount += item.price * 100 * item.quantity;
      });

      const note = `Buyer: ${buyerName || 'N/A'}, Email: ${buyerEmail || 'N/A'}, Phone: ${buyerPhone || 'N/A'}`;

      const processPayment = async (env: SquareEnvironment) => {
        const square = getSquare(env);

        if (!locationId) {
          const locs = await square.locations.list();
          if (locs.locations && locs.locations.length > 0) {
            const active = locs.locations.find(l => l.status === 'ACTIVE');
            locationId = (active?.id || locs.locations[0].id) as string;
          }
        }

        try {
          return await square.payments.create({
            sourceId,
            idempotencyKey: crypto.randomUUID(),
            amountMoney: {
              amount: BigInt(totalAmount),
              currency: 'USD'
            },
            locationId: locationId!,
            note: note,
          });
        } catch (err: any) {
          const isInvalidLocation = err.errors && err.errors.some((e: any) => e.detail && e.detail.toLowerCase().includes('location id'));
          if (isInvalidLocation) {
            const locs = await square.locations.list();
            if (locs.locations && locs.locations.length > 0) {
              const active = locs.locations.find(l => l.status === 'ACTIVE');
              locationId = (active?.id || locs.locations[0].id) as string;
              
              return await square.payments.create({
                sourceId,
                idempotencyKey: crypto.randomUUID(),
                amountMoney: {
                  amount: BigInt(totalAmount),
                  currency: 'USD'
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
        const isAuthError = prodError.statusCode === 401 || (prodError.errors && prodError.errors[0]?.code === 'UNAUTHORIZED');
        if (isAuthError) {
          response = await processPayment(SquareEnvironment.Sandbox);
        } else {
          throw prodError;
        }
      }

      // We need to safely convert BigInts to strings before sending JSON
      const serializedResponse = JSON.parse(JSON.stringify(response, (key, value) =>
        typeof value === 'bigint'
          ? value.toString()
          : value
      ));

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

  // Catch-all for API routes to return 404 JSON instead of falling through to SPA fallback
  app.use("/api", (req, res) => {
    res.status(404).json({ error: "API route not found" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
