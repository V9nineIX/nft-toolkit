import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@material-tailwind/react'
import Web3Providers from './web3Providers'
import App from './App'

import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { offsetLimitPagination } from "@apollo/client/utilities";
import { StatusMobile } from './components/StatusMobile'
import { isMobileOnly, isTablet } from 'react-device-detect'

// const theme = {
//   button: {
//     defaultProps: {
//       // color: "primary",
//     },
//     valid: {
//       // colors: ["primary"],
//       colors: ["primary"],
//     },
//     styles: {
//       variants: {
//         filled: {
//           primary: {
//             background: "bg-primary",
//             color: "text-white",
//           },
//         },
//         // outlined: {
//         //   primary: {
//         //     border: "border border-primary",
//         //     color: "text-primary",
//         //   },
//         // },
//         // gradient: {
//         //   primary: {
//         //     background: "bg-primary",
//         //     color: "text-white",
//         //   },
//         // },
//         text: {
//           primary: {
//             color: "text-primary",
//           },
//         },
//       },
//     },
//   },
// };


const api = import.meta.env.VITE_PUBLIC_API_BASE_URL
const uri = `${api}/graphql/"`
// console.log('api', api)
// console.log('uri', uri)
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        books: offsetLimitPagination(),
      },
    },
  },
});


const token = import.meta.env.VITE_PUBLIC_API_SECRET_KEY
const httpLink = new HttpLink({
  uri: uri,
  headers: {
    authorization: token ? `Bearer ${token}` : '',
  }
})


const client = new ApolloClient({
  link: httpLink,
  cache: cache,
});


ReactDOM.createRoot(document.getElementById('root')!).render(

  <>
    {
      isMobileOnly || isTablet ?
        <StatusMobile />
        :
        <ApolloProvider client={client}>
          {/* <ThemeProvider value={theme}> */}
          <ThemeProvider>
            <Web3Providers>
              <App />
            </Web3Providers>
          </ThemeProvider>

        </ApolloProvider>
    }
  </>

)
