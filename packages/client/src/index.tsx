import "tailwindcss/tailwind.css";
import "react-toastify/dist/ReactToastify.css";

import ReactDOM from "react-dom/client";
import { mount as mountDevTools } from "@latticexyz/dev-tools";
import { App } from "./App";
import { setup } from "./mud/setup";
import { MUDProvider } from "./MUDContext";
import { ToastContainer } from "react-toastify";
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
  ConnectButton,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { Chain } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const latticeTestChain: Chain = {
  id: 4242,
  name: 'LatticeTest',
  network: 'LatticeTest',
  nativeCurrency: {
    decimals: 18,
    name: 'LatticeTest',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://follower.testnet-chain.linfra.xyz'],
    },
    public: {
      http: ['https://follower.testnet-chain.linfra.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'Otterscan', url: 'https://explorer.testnet-chain.linfra.xyz/' },
    etherscan: { name: 'Otterscan', url: 'https://explorer.testnet-chain.linfra.xyz/' },
  },
  testnet: false,
};

const { publicClient, chains } = configureChains(
  [latticeTestChain],
  [
    jsonRpcProvider({
      rpc: chain => ({
        http: `https://follower.testnet-chain.linfra.xyz`,
      }),
    }),
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'AutonomousNFTs',
  projectId: 'AutonomousNFTs',
  chains
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})



const rootElement = document.getElementById("react-root");
if (!rootElement) throw new Error("React root not found");
const root = ReactDOM.createRoot(rootElement);

// TODO: figure out if we actually want this to be async or if we should render something else in the meantime
setup().then((result) => {
  root.render(
    
    <MUDProvider value={result}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <div className="mt-auto">
            <ConnectButton />
          </div>
          
          <App />
          <ToastContainer position="bottom-right" draggable={false} theme="dark" />
        </RainbowKitProvider>
      </WagmiConfig>
    </MUDProvider>
 
  );
  mountDevTools();
});
