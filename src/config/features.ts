import { ChainId } from 'sdk'
import { Feature } from 'enums'

type FeatureMap = { readonly [chainId in ChainId]?: Feature[] }

const features: FeatureMap = {
  [ChainId.ETHEREUM]: [
    Feature.AMM,
    Feature.SWAP,
    Feature.LIQUIDITY,
    Feature.AGGREGATE,
    Feature.BRIDGE,
    // Feature.DEFARM,
    // Feature.ANALYTICS,
    // Feature.LIQUIDITY_MINING,
    // Feature.COFFINBOX,
    // Feature.UNDERWORLD,
    // Feature.MIGRATE,
    // Feature.STAKING,
    // Feature.VESTING,
  ],

  [ChainId.TELOS]: [
    Feature.AMM,
    // Feature.ANALYTICS,
    // Feature.UNDERWORLD
  ],

  [ChainId.MOONRIVER]: [
    Feature.AMM,
    Feature.BRIDGE,
    // Feature.ANALYTICS,
    // Feature.UNDERWORLD
  ],

  [ChainId.MATIC]: [
    Feature.AMM,
    Feature.AGGREGATE,
    Feature.BRIDGE,
    // Feature.ANALYTICS,
    // Feature.UNDERWORLD
  ],

  [ChainId.ARBITRUM]: [
    Feature.AMM,
    // Feature.ANALYTICS,
    // Feature.UNDERWORLD
  ],

  [ChainId.BSC]: [
    Feature.AMM, 
    Feature.ANALYTICS,
    Feature.AGGREGATE,
    Feature.BRIDGE,
    Feature.LIQUIDITY,
    // Feature.UNDERWORLD
  ],

  [ChainId.AVALANCHE]: [
    Feature.AMM,
    // Feature.DEFARM,
    // Feature.MANIFESTATION,
    Feature.SWAP,
    Feature.BRIDGE,
    Feature.ANALYTICS,
    Feature.LIQUIDITY,
    Feature.LIQUIDITY_MINING,
    Feature.BONDS,
    Feature.VAULT,
    Feature.COFFINBOX,
    Feature.AGGREGATE,
    Feature.EXPLORE,
    Feature.LIMIT,
    Feature.UNDERWORLD
  ],
  
  [ChainId.FANTOM]: [
    Feature.AMM,
    // Feature.NFT,
    Feature.DEFARM,
    Feature.MANIFESTATION,
    Feature.BRIDGE,
    Feature.SWAP,
    Feature.SEANCE,
    Feature.VAULT,
    Feature.STAKING,
    Feature.LIQUIDITY,
    Feature.ANALYTICS,
    Feature.LIQUIDITY_MINING,
    Feature.AGGREGATE,
    Feature.BONDS,
    Feature.COFFINBOX,
    Feature.LIMIT,
    Feature.EXPLORE,
    Feature.LUXOR,
    Feature.SOULSWAP,
    Feature.UNDERWORLD,
    Feature.UNDERWORLD_SWAP,
  ],
}

export default features