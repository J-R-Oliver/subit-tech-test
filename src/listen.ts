import createApp from "./app";

const { PORT = 9090 } = process.env;

(async () => {
  const app = await createApp();
  // eslint-disable-next-line no-console
  app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
})();
