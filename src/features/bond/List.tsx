import React from 'react'
import Typography from 'components/Typography'
import { BondKey } from './Key'
import BondRowRender from './Row'
import { AvalanchePools, FantomPools } from './Pids'
import { Button } from 'components/Button'
import NavLink from 'components/NavLink'
import { useActiveWeb3React } from 'services/web3'
import { ChainId } from 'sdk'
// import { useSummonerContract } from 'hooks/useContract'
// import ExternalLink from 'components/ExternalLink'
// import { classNames } from 'functions'
// import { getChainColor, getChainColorCode } from 'constants/chains'
// import { getChainColorCode } from 'constants/chains'
// import { classNames } from 'functions'
import Image from 'next/image'
import MINT_BANNER from 'assets/branding/mint-banner.png'
import ExternalLink from 'components/ExternalLink'
// import { SubmitButton } from 'features/bond/Styles'
// import { classNames } from 'functions/styling'
// import TokenStats from 'components/TokenStats' 
import { featureEnabled } from 'functions/feature'
import { Feature } from 'enums/Feature'

export const BondList = () => {
  const { chainId } = useActiveWeb3React()
  // const SummonerContract = useSummonerContract()
  const ftmList = FantomPools.map((bond) => (
    <BondRowRender
      key={bond.pid} 
      pid={bond.pid}
      type={bond.type}
      lpSymbol={bond.lpSymbol}
      lpToken={bond.lpAddress}
      token0Symbol={bond.token0Symbol}
      token1Symbol={bond.token1Symbol}
      token0Address={bond.token0Address}
      token1Address={bond.token1Address}
      bond={bond}
    />
  ))

  const avaxList = AvalanchePools.map((bond) => (
    <BondRowRender
      key={bond.pid} 
      pid={bond.pid}
      type={bond.type}
      lpSymbol={bond.lpSymbol}
      lpToken={bond.lpAddress}
      token0Symbol={bond.token0Symbol}
      token1Symbol={bond.token1Symbol}
      token0Address={bond.token0Address}
      token1Address={bond.token1Address}
      bond={bond}
    />
  ))

  // harvests: all staked pools (for user)
  // const handleHarvestAll = async () => {
  //   try {
  //     let tx
  //     tx = SummonerContract?.harvestAll()
  //     await tx?.wait()
  //   } catch (e) {
  //     console.log(e)
  //     return
  //   }
  // }

  return (
    <div className={`grid grid-cols-1 justify-center p-1 mt-8 sm:m-8 sm:max-w-[90%] md:max-w-2xl bg-dark-900 rounded-2xl`}>
      {/* <div
            className={
              classNames(chainId == ChainId.FANTOM 
                  ? 'rounded-xl bg-purple' 
                  : 'hidden')
              }
          > */}
              <Button
                variant="filled"
                // primaryColor={"#7G1BD9"}
                className={`bg-purple rounded-xl p-4 mt-4 w-full animate-pulse`}
                size="xl"
                >
            <ExternalLink
              href="https://soulswapfinance.medium.com/owning-our-liquidity-via-our-innovative-soul-bonds-podl-592c2849ceed"
              target="_blank"
              rel="noreferrer"
              >
                <a 
                  className="block text-md font-bold md:text-xl text-white p-0 -m-3 text-md transition duration-150 ease-in-out rounded-md hover:bg-dark-300"
                  >
                  <span> Read Before Bonding ↗</span>
                </a>
            </ExternalLink>
            </Button>
          {/* </div> */}
          <div
              className={`flex m-6 border-4 p-4 border-dark-800 rounded-2xl`}
            >
              <Image src={MINT_BANNER}
                height={180}
                width={720}
                alt={'mint banner'}
              />
          </div>
          <div className={`flex justify-center m-1 p-1`}>
        <Button variant="bordered" color="purple" size="lg">
          <NavLink href={'/dashboard'}>
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Soul Economy</span>
            </a>
          </NavLink>
        </Button>
      </div>
      <div className="flex ml-2 mr-2 mb-4 mt-2 gap-1 items-center justify-center">
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/autostake'}>
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Vault</span>
            </a>
          </NavLink>
        </Button>
        <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/summoner'}>
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>Farms</span>
            </a>
          </NavLink>
        </Button>
        {featureEnabled(Feature.DEFARM, chainId) &&
          <Button variant="filled" color="purple" size="lg">
          <NavLink href={'/defarms'}>
            <a className="block text-md md:text-xl text-white font-bold p-0 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-300">
              <span>DeFarms</span>
            </a>
          </NavLink>
        </Button>
        }
      </div>
      <Typography className="text-2xl bg-dark-1000 mb-2 rounded rounded-2xl m-1 p-4 border border-purple font-bold text-center">SoulSwap Pools</Typography>
      <BondKey />
          <>{chainId == ChainId.FANTOM ? ftmList : avaxList}</>
      <div>
      {/* <Typography className="text-2xl bg-dark-1000 mb-2 rounded rounded-2xl m-1 p-4 border border-ftmBlue font-bold text-center">Lending Pools</Typography> */}
        {/* chainId == ChainId.FANTOM ? <Inactive /> : null */}
        {/* chainId == ChainId.FANTOM ? inactiveFtmList : inactiveAvaxList */}
      </div>
    </div>
    
  )
}

export default BondList