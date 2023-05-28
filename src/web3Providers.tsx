import React from "react";
import { createWeb3ReactRoot, Web3ReactProvider } from "@web3-react/core";
import { Provider } from "react-redux";
import { NetworkContextName } from "./constants";
import getLibrary from "./utils/getLibrary";
import configureStore from "./redux/store";

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

const initialState = {};
const store = configureStore(initialState);

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        {/* <Provider store={store}> */}
          {children}
          {/* </Provider> */}
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  );
};

export default Providers;
