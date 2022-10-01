import React, { FC } from 'react'
import { XIcon } from '@heroicons/react/outline'
import { Button } from 'components/Button'
import NavLink from 'components/NavLink'
import Link from 'next/link'
import { getChainColorCode, getChainInfo } from 'constants/chains'
import { useActiveWeb3React } from 'services/web3'
import { ChainId } from 'sdk'

export const Global: FC = () => (
  <div className="relative items-center w-full">
    <div className="w-full">
      <div className="text-center">
        <p className="font-medium text-center text-white">
          <Button variant="filled" color="purple" size="sm">
          <span className="justify-center">
            <a href="https://enchant.soulswap.finance" target = "_blank" rel="noreferrer"
              className="font-bold text-white text-lg">
              {' '}
              Click Here to Vote Now!
            </a>
          </span>
          </Button>
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
      </div>
    </div>
  </div>
)

interface IFeature {
  chainId: number
}

export const NewFeature: FC<IFeature> = ({ chainId }) => (
  <div className="relative items-center w-full">
    <div className="w-full">
      <div className="text-center">
        <p className="font-medium mb-2 mt-2 text-center text-white">
          {/* <span className="centered md:hidden"><b>Voting Ends Soon!</b> <b>&rarr;</b></span> */}
          {/* <span className="hidden md:inline"> Voting Has Begun <b> &rarr;</b></span> */}
          <Button variant="filled" color={getChainColorCode(chainId)} size="sm">
            <NavLink href="/summoner">
          <span className="justify-center font-bold">
              {[ChainId.AVALANCHE].includes(chainId) 
              ? `Click Here to Farm on ${getChainInfo(chainId, 'NETWORK')}`
                : [ChainId.ETHEREUM, ChainId.FANTOM].includes(chainId) ? `Swap now on Avalanche & Ethereum`
                    : `Farm and Bond on Avalanche`
              }
          </span>
            </NavLink>
          </Button>
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
      </div>
    </div>
  </div>
)

export const BetaFeature: FC = () => (
  <div className="relative items-center w-full">
    <div className="w-full">
      <div className="text-center">
        <p className="font-medium mb-2 mt-2 text-center text-white">
          {/* <span className="centered md:hidden"><b>Voting Ends Soon!</b> <b>&rarr;</b></span> */}
          {/* <span className="hidden md:inline"> Voting Has Begun <b> &rarr;</b></span> */}
          <Button variant="filled" color="purple" size="sm">
            <NavLink href="/summoner">
          <span className="justify-center font-bold">
              {`Cross Chain Swaps are in beta, please use at your own risk and report any bugs to our ${<Link href="https://discord.com/invite/soulswap"> Discord </Link>} channel, thanks!`}
          </span>
            </NavLink>
          </Button>
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
        {/*
        <button type="button" className="flex p-2 focus:outline-none">
           <span className="sr-only">Dismiss</span> 
           */}
           
          {/* <XIcon className="w-6 h-6 text-white" aria-hidden="true" /> */}
        {/* </button> */}
      </div>
    </div>
  </div>
)

export const Banner: FC = () => (
  <div className="relative w-full bg-purple bg-opacity-10">
    <div className="px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="pr-16 sm:text-center sm:px-16">
        <p className="font-medium text-white">
          <span className="centered md:hidden"><b>Concluded. Please Unstake.</b></span>
          <span className="hidden md:inline"> Circle Has Concluded. <b>Please Unstake</b></span>
          <span className="hidden block sm:ml-2 sm:inline-block">
            <a href="https://twitter.com/SoulSwapFinance" target = "_blank" rel="noreferrer"
              className="font-bold text-white underline">
              {' '}
              <br />
              Stay Tuned For Our Upcoming Rounds <span aria-hidden="true">&rarr;</span>
            </a>
          </span>
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
        {/*
        <button type="button" className="flex p-2 focus:outline-none">
           <span className="sr-only">Dismiss</span> 
           */}
           
          {/* <XIcon className="w-6 h-6 text-white" aria-hidden="true" /> */}
        {/* </button> */}
      </div>
    </div>
  </div>
)

export const LuxorBanner: FC = () => (
  <div className="relative items-center w-full">
    <div className="w-full">
      <div className="text-center">
        <p className="font-medium text-center text-white">
          {/* <span className="centered md:hidden"><b>Voting Ends Soon!</b> <b>&rarr;</b></span> */}
          {/* <span className="hidden md:inline"> Voting Has Begun <b> &rarr;</b></span> */}
          <Button variant="filled" color="yellow" size="sm">
          <span className="justify-center">
            <a href="https://twitter.com/LuxorMoney/status/1515653849490538500?s=20&t=2JuPf_55Fr5zwC27UchGww" target = "_blank" rel="noreferrer"
              className="font-bold text-black text-lg">
              {' '}
              Introducing SOR: Click to Learn More 
              {/* Please vote in our LIVE proposals regarding withdrawal fees and governance. <span aria-hidden="true">&rarr;</span> */}
            </a>
          </span>
          </Button>
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
      </div>
    </div>
  </div>
)

export const BondsBanner: FC = () => (
  <div className="relative items-center w-full">
    <div className="w-full">
      <div className="text-center">
        <p className="font-medium text-center text-white">
          <Button variant="filled" color="purple" size="sm">
          <span className="justify-center">
            <a href="https://soulswapfinance.medium.com/owning-our-liquidity-via-our-innovative-soul-bonds-podl-592c2849ceed" target = "_blank" rel="noreferrer"
              className="font-bold text-white text-lg">
              {' '}
              Introducing Bonds: Click to Learn More 
            </a>
          </span>
          </Button>
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
      </div>
    </div>
  </div>
)