import { app } from "./app.js";
import { env } from "./config/env.js";
import { redis } from "./config/redis.js";

const startServer = async (): Promise<void> => {
  await redis.connect();
  console.log(`Redis connesso su ${env.REDIS_URL}`);

  app.listen(env.PORT, () => {
    console.log(`Server attivo su http://localhost:${env.PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Impossibile avviare il backend:", error);
  process.exit(1);
});
