import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import resolvers from './resolvers';
import config from '../lib/config';
import database from '../lib/database';

const typeDefs = gql`
  # A product that the customer can purchase
  type Product {
    # The product ID
    id: Int!
    # The name of the product
    name: String!
    # The product description
    description: String!
    # The price of the product in cents
    price: Int
  }

  # The status of an order
  enum OrderStatus {
    # The order has not been paid for yet
    UNPAID,
    # The order has been paid for
    COMPLETED,
    # The order was cancelled
    CANCELLED
  }

  # Represents a single line item on an order
  type OrderLineItem {
    # The product the line item points to, if there is one
    product: Product
    # The text of the line item
    text: String
    # The price of the line item in cents
    price: Int!
  }

  # An order to purchase a product
  type Order {
    # The order ID
    id: Int!
    # The order's current status
    status: OrderStatus!
    # The total price of the order in cents
    totalPrice: Int!
    # The line items for the order
    lineItems: [OrderLineItem]!
    # The link to redirect the customer to for payment
    paymentUrl: String
  }

  type Query {
    products: [Product]!
    order(id: Int!): Order!
  }

  input PurchaseProductInput {
    # The product ID the customer is purchasing
    productId: Int!

    # The customer's name
    customerName: String!

    # The customer's email address
    customerEmail: String!
  }

  type Mutation {
    # Create an order to purchase a product
    purchaseProduct(input: PurchaseProductInput!): Order!

    # Cancels an order
    cancelOrder(id: Int!): String!
  }
`;

const server = new ApolloServer({
  cors: {
    origin: true
  },
  typeDefs,
  resolvers,
  csrfPrevention: true,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground()
  ]
});

database.initialize().then(() => {
  server.listen(config.port).then(({url}) => {
    console.log(`Server listening at ${url}`);
  });
});