import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

declare var process: any;

const getGraphQLUrl = async () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.GRAPHQL_URL || 'http://localhost:3000/graphql';
  } else {
    if (process.env.GRAPHQL_URL) {
      return process.env.GRAPHQL_URL;
    } else {
      const config = await fetch('/config.json');
      return (await config.json()).graphqlUrl;
    }
  }
};

getGraphQLUrl().then(uri => {
  const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache()
  });
  
  
  const root = ReactDOM.createRoot(document.getElementById('app'));
  
  root.render(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  );  
});