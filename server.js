const app = require("./src/app");

const PORT = 3055;

const server = app.listen(PORT, () => {
  console.log(`WSV BE ShoeStore ${PORT}`);
});

// process.env("SIGINT", () => {
//   server.close(() => console.log(`Exit server express`));
// });
