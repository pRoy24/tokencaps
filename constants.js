// pRoy24 TokenPlex
/**
 * Change these values to the host that you are running
 * @type {{CQL_API_SERVER: string, REDIS_API_SERVER: string}}
 */
module.exports = {
  REDIS_API_SERVER: "127.0.0.1", // If running remote redis server, create a REDIS host here.
  CQL_API_SERVER: "127.0.0.1:9042"  // If running remote CQL server, create a CQL host here.
};