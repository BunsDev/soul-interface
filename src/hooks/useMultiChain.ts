import { useEffect, useState } from "react";
// import { useSoftwareWallet } from "./useSoftwareWallet";
import { bridgeNetworks } from "utils/bridge";
import config from "config/configurations";
import { switchToChain } from "utils/events";
import { getDefaultProvider, JsonRpcProvider } from "@ethersproject/providers";
import { useActiveWeb3React } from "services/web3";

const SUPPORTED_CHAINS = [250, 1, 56, 137, 43114, 42161];
const DEFAULT_PROVIDERS = {
  // 1: getDefaultProvider(),
  1: new JsonRpcProvider("https://rpc.ankr.com/eth"),
  56: new JsonRpcProvider(bridgeNetworks[56].rpc),
  137: new JsonRpcProvider(bridgeNetworks[137].rpc),
  250: new JsonRpcProvider(config.rpc),
  4002: new JsonRpcProvider(config.rpc),
  43114: new JsonRpcProvider(bridgeNetworks[43114].rpc),
  42161: new JsonRpcProvider(bridgeNetworks[42161].rpc),
} as any;

const useMultiChain = () => {
  const { chainId, account, library } = useActiveWeb3React()
  // const { changeWalletProvider } = useSoftwareWallet();
  const [toChain, setToChain] = useState(null);

  const swapToChain = (chainId: number) => {
    // if (walletContext.activeWallet.providerType === "browser") {
      switchToChain(library.provider, chainId);
    // }

    // if (walletContext.activeWallet.providerType === "software") {
    //   changeWalletProvider(
    //     walletContext.activeWallet.signer,
    //     bridgeNetworks[chainId].rpc
    //   );
    // }
  };

  useEffect(() => {
    if (!toChain) return;
    if (!SUPPORTED_CHAINS.includes(toChain)) return;
    if (chainId === toChain) return;
    swapToChain(toChain);

    // return () => swapToChain(parseInt(config.chainId));
  }, [toChain, account]);

  return {
    setToChain,
    forceSwap: (chainId: number) => swapToChain(chainId),
    DEFAULT_PROVIDERS,
  };
};

export default useMultiChain;