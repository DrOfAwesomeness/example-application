# Example Application
This is an example application to deploy with Kubernetes. In case it isn't obvious from the name, nothing here is intended for real-world production use.

## Docker Images
This example is expected to be deployed with Docker. Both the client and the server include a Dockerfile.

The server accepts the following environment variables for configuration:
* `PORT` - The port to listen on (default: 3000)
* `FRONTEND_URL` - The URL the client is available on; used for redirecting after a Stripe Checkout session (no default, example: `https://app.example.com`)
* `MARIADB_HOST` - The hostname or IP address of the MariaDB server
* `MARIADB_PORT` - The port the MariaDB server is listening on
* `MARIADB_USERNAME` - The MariaDB username
* `MARIADB_PASSWORD` - The MariaDB password
* `MARIADB_DATABASE` - The MariaDB database name
* `STRIPE_API_KEY` - A Stripe API key (**WARNING**: This application isn't intended for production use. Only run it with a Stripe test key)

The client accepts one environment variable:
* `GRAPHQL_URL` - The URL of the GraphQL endpoint to use (example: `http://api.example.com/graphql`)
