const { port } = require("./config");
const fastify = require("fastify")({ logger: true });
const mercurius = require("mercurius");
const { resolvers } = require("./resolvers");
const { schema } = require("./schema");

fastify.register(require("fastify-cors"), {});

fastify.register(mercurius, {
  schema,
  resolvers,
  graphiql: true, // web page for to test queries
});
// start the fastify server
fastify.listen(port, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
