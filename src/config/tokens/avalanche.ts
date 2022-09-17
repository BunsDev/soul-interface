import { ChainId, SOUL_ADDRESS, Token, USDC_ADDRESS } from 'sdk'
export const DAI = new Token(ChainId.AVALANCHE, '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70', 18, 'DAI', 'Dai Stablecoin')
export const WBTC = new Token(ChainId.AVALANCHE, '0x50b7545627a5162F82A992c33b87aDc75187B218', 8, 'WBTC', 'Wrapped Bitcoin')
export const WETH = new Token(ChainId.AVALANCHE, '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB', 18, 'WETH', 'Wrapped Ether')
export const JOE = new Token(ChainId.AVALANCHE, '0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd', 18, 'JOE', 'JoeToken')
export const SOUL = new Token(ChainId.AVALANCHE, SOUL_ADDRESS[ChainId.AVALANCHE], 18, 'SOUL', 'SoulPower')
export const USDC = new Token(ChainId.AVALANCHE, USDC_ADDRESS[ChainId.AVALANCHE], 6, 'USDC', 'USD Coin')
