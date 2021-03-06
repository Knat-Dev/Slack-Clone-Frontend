// import {
//   ApolloClient,
//   ApolloLink,
//   ApolloProvider,
//   createHttpLink,
//   DocumentNode,
//   InMemoryCache,
//   split,
// } from '@apollo/client';
// import { setContext } from '@apollo/client/link/context';
// import { WebSocketLink } from '@apollo/client/link/ws';
// import { getMainDefinition } from '@apollo/client/utilities';
// import { ChakraProvider } from '@chakra-ui/react';
// import { TokenRefreshLink } from 'apollo-link-token-refresh';
// import { createUploadLink } from 'apollo-upload-client';
// import jwtDecode from 'jwt-decode';
// import React, { FC, useEffect, useState } from 'react';
// import ReactDOM from 'react-dom';
// import {
//   SessionContextProvider,
//   useSessionContext,
// } from './context/SessionContext';
// import { Message, PaginatedMessages } from './graphql/generated';
// import './index.css';
// import reportWebVitals from './reportWebVitals';
// import Routes from './routes';
// import { getAccessToken, setAccessToken } from './utils/accessToken';

// const httpLink = createHttpLink({
//   uri: 'https://api.knat.dev/graphql',
//   credentials: 'include',
// });

// const authLink = setContext((_, { headers }) => {
//   const token = getAccessToken();
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       Authorization: token ? `Bearer ${token}` : '',
//     },
//   };
// });

// const tokenRefreshLink = new TokenRefreshLink({
//   accessTokenField: 'accessToken',
//   isTokenValidOrUndefined: () => {
//     const token = getAccessToken();
//     if (!token) return true;

//     try {
//       const { exp } = jwtDecode(token) as { exp: number };
//       if (Date.now() >= exp * 1000) return false;
//       else return true;
//     } catch (e) {
//       return false;
//     }
//   },
//   fetchAccessToken: async (): Promise<Response> => {
//     return fetch('https://api.knat.dev/refresh', {
//       credentials: 'include',
//       method: 'POST',
//     });
//   },
//   handleFetch: (accessToken: string) => {
//     console.log('refreshed...');
//     setAccessToken(accessToken);
//   },
//   handleError: (err: Error) => {
//     console.error(err);
//   },
// });

// const wsLink = new WebSocketLink({
//   // uri: `wss://api.knat.dev/graphql`,
//   uri: `wss://api.knat.dev/graphql`,
//   options: {
//     lazy: true,
//     reconnect: true,
//     reconnectionAttempts: 10,
//     connectionParams: {
//       token: getAccessToken(),
//     },
//   },
// });

// const isFile = (value: File | Blob) =>
//   (typeof File !== 'undefined' && value instanceof File) ||
//   (typeof Blob !== 'undefined' && value instanceof Blob);

// const isUpload = ({ variables }: { variables: Record<string, File | Blob> }) =>
//   Object.values(variables).some(isFile);

// const isSubscriptionOperation = ({ query }: { query: DocumentNode }) => {
//   const definition = getMainDefinition(query);
//   return (
//     definition.kind === 'OperationDefinition' &&
//     definition.operation === 'subscription'
//   );
// };

// const requestLink = split(isSubscriptionOperation, wsLink, httpLink);

// const terminalLink = split(
//   isUpload,
//   createUploadLink({ uri: 'https://api.knat.dev/graphql' }),
//   requestLink
// );

// const client = new ApolloClient({
//   cache: new InMemoryCache({
//     typePolicies: {
//       Query: {
//         fields: {
//           messages: {
//             keyArgs: ['id', 'channelId'],
//             merge(
//               existing: PaginatedMessages | undefined,
//               incoming: PaginatedMessages,
//               { args }
//             ) {
//               if (!existing) return incoming;
//               else if (args?.cursor && existing.page) {
//                 return {
//                   hasMore: incoming.hasMore,
//                   page: [...incoming.page, ...existing.page],
//                 };
//               } else return incoming;
//             },
//           },
//           newMessages: {
//             keyArgs: ['id', 'channelId'],
//             merge(_, incoming: Message[]) {
//               return incoming;
//             },
//           },
//           userStatuses: {
//             keyArgs: ['username', 'online'],
//             merge(existing, incoming: Message[]) {
//               if (!existing) return incoming;

//               return [...existing, ...incoming];
//             },
//           },
//         },
//       },
//     },
//   }),
//   link: ApolloLink.from([tokenRefreshLink, authLink, terminalLink]),
// });

// const App: FC = () => {
//   const [loading, setLoading] = useState(true);
//   const [sessionContext, updateSessionContext] = useSessionContext();

//   useEffect(() => {
//     fetch(`https://api.knat.dev/refresh`, {
//       credentials: 'include',
//       method: 'POST',
//     })
//       .then(async (res) => {
//         const data = await res.json();
//         const { accessToken } = data;
//         setAccessToken(accessToken);
//         if (accessToken) {
//           updateSessionContext({ ...sessionContext, isAuthenticated: true });
//         }
//         setLoading(false);
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   }, []);

//   if (loading) return null;

//   return (
//     <ApolloProvider client={client}>
//       <ChakraProvider>
//         <Routes />
//       </ChakraProvider>
//     </ApolloProvider>
//   );
// };

// ReactDOM.render(
//   <SessionContextProvider>
//     <App />
//   </SessionContextProvider>,
//   document.getElementById('root')
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  createHttpLink,
  DocumentNode,
  InMemoryCache,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { ChakraProvider } from '@chakra-ui/react';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { createUploadLink } from 'apollo-upload-client';
import jwtDecode from 'jwt-decode';
import React, { FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  SessionContextProvider,
  useSessionContext,
} from './context/SessionContext';
import { Message, PaginatedMessages } from './graphql/generated';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Routes from './routes';
import { getAccessToken, setAccessToken } from './utils/accessToken';

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_API + '/graphql',
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const tokenRefreshLink = new TokenRefreshLink({
  accessTokenField: 'accessToken',
  isTokenValidOrUndefined: () => {
    const token = getAccessToken();
    if (!token) return true;

    try {
      const { exp } = jwtDecode(token) as { exp: number };
      if (Date.now() >= exp * 1000) return false;
      else return true;
    } catch (e) {
      return false;
    }
  },
  fetchAccessToken: async (): Promise<Response> => {
    return fetch(`${process.env.REACT_APP_REFRESH_URL}`, {
      credentials: 'include',
      method: 'POST',
    });
  },
  handleFetch: (accessToken: string) => {
    console.log('refreshed...');
    setAccessToken(accessToken);
  },
  handleError: (err: Error) => {
    console.error(err);
  },
});

const wsLink = new WebSocketLink({
  // uri: `wss://api.knat.dev/graphql`,
  uri: `${process.env.REACT_APP_WS}`,
  options: {
    lazy: true,
    reconnect: true,
    reconnectionAttempts: 10,
    connectionParams: {
      token: getAccessToken(),
    },
  },
});

const isFile = (value: File | Blob) =>
  (typeof File !== 'undefined' && value instanceof File) ||
  (typeof Blob !== 'undefined' && value instanceof Blob);

const isUpload = ({ variables }: { variables: Record<string, File | Blob> }) =>
  Object.values(variables).some(isFile);

const isSubscriptionOperation = ({ query }: { query: DocumentNode }) => {
  const definition = getMainDefinition(query);
  return (
    definition.kind === 'OperationDefinition' &&
    definition.operation === 'subscription'
  );
};

const requestLink = split(isSubscriptionOperation, wsLink, httpLink);

const terminalLink = split(
  isUpload,
  createUploadLink({ uri: process.env.REACT_APP_API + '/graphql' }),
  requestLink
);

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          messages: {
            keyArgs: ['id', 'channelId'],
            merge(
              existing: PaginatedMessages | undefined,
              incoming: PaginatedMessages,
              { args }
            ) {
              if (!existing) return incoming;
              else if (args?.cursor && existing.page) {
                return {
                  hasMore: incoming.hasMore,
                  page: [...incoming.page, ...existing.page],
                };
              } else return incoming;
            },
          },
          newMessages: {
            keyArgs: ['id', 'channelId'],
            merge(_, incoming: Message[]) {
              return incoming;
            },
          },
          userStatuses: {
            keyArgs: ['username', 'online'],
            merge(existing, incoming: Message[]) {
              return incoming;

              // return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
  link: ApolloLink.from([tokenRefreshLink, authLink, terminalLink]),
});

const App: FC = () => {
  const [loading, setLoading] = useState(true);
  const [sessionContext, updateSessionContext] = useSessionContext();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/refresh`, {
      credentials: 'include',
      method: 'POST',
    })
      .then(async (res) => {
        const data = await res.json();
        const { accessToken } = data;
        setAccessToken(accessToken);
        if (accessToken) {
          updateSessionContext({ ...sessionContext, isAuthenticated: true });
        }
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  if (loading) return null;

  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <Routes />
      </ChakraProvider>
    </ApolloProvider>
  );
};

ReactDOM.render(
  <SessionContextProvider>
    <App />
  </SessionContextProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
