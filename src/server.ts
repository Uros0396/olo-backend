import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { PendingContactModel } from "./models/pending-contact.model.js";

const startServer = async (): Promise<void> => {
  await connectDatabase();
  await PendingContactModel.init();
  console.log("MongoDB connesso");

  app.listen(env.PORT, () => {
    console.log(`Server attivo su http://localhost:${env.PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Impossibile avviare il backend:", error);
  process.exit(1);
});
