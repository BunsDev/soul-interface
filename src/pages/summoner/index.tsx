import React, { useState } from 'react'
import { Wrap } from '../../components/ReusableStyles'
import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
// import FarmBanner from '../../components/FarmBanner'
import Container from '../../components/Container'
import Head from 'next/head'
import FarmList from '../../features/summoner/List'
import { POOLS } from 'constants/farms'
import useSummoner from 'features/mines/hooks/useMasterChef'
import { useTVL } from 'hooks/useV2Pairs'
import { usePositions } from 'features/mines/hooks'

import { useFuse, useSummonerContract } from 'hooks'
import { useRouter } from 'next/router'
import { useSoulPrice } from 'hooks/getPrices'
import { getAddress } from '@ethersproject/address'
import { TridentHeader } from 'layouts/Trident'
import { formatNumberScale } from 'functions'
import { Button } from 'components/Button'
import { addTransaction } from 'state/transactions/actions'
import { useFarms } from 'services/graph/hooks'
// import { XIcon } from '@heroicons/react/solid'
import { Toggle } from 'components/Toggle'
import { XIcon } from '@heroicons/react/solid'
import { ChainId } from 'sdk'
import { useActiveWeb3React } from 'services/web3'
// import { usePairPrice } from 'hooks/usePairData'
// import { useActiveWeb3React } from 'services/web3/hooks/useActiveWeb3React'

const Summoner = () => {
  const { chainId } = useActiveWeb3React()
  const router = useRouter()
  const [pendingTx, setPendingTx] = useState(false)
  const [showBalances, openShowBalances] = useState(true)

  const soulPrice = useSoulPrice()

  const type = router.query?.filter === null ? 'active' : (router.query?.filter as string)
  const farms = useFarms()
  const { harvest } = useSummoner()
  const SummonerContract = useSummonerContract()

  const positions = usePositions()
  const tvl = useTVL()

  const map = (pool) => {
    pool.owner = 'SoulSwap'
    pool.balance = 0

    const pair = POOLS[250][pool.lpToken]

    const tvl = pool.pair?.token1
      ? Number(pool?.pairPrice) * Number(pool.lpBalance) / 1e18
      : Number(soulPrice) * Number(pool.lpBalance) / 1e18

    const position = positions.find((position) => position.id === pool.id)

    return {
      ...pool,
      ...position,
      pair: {
        ...pair,
        decimals: 18,
      },
      tvl,
    }
  }

  const FILTER = {
    deposited: (farm) => farm.amount,
    active: (farm) => farm.allocPoint > 0,
    inactive: (farm) => farm?.allocPoint == 0,
    soulswap: (farm) => farm.allocPoint > 0
      && (
        farm.pair.token0?.symbol == 'SOUL'
        || farm.pair.token0?.symbol == 'SEANCE'
        || farm.pair.token0?.symbol == 'LUX'
        || farm.pair.token0?.symbol == 'wLUM'

        || farm.pair.token1?.symbol == 'SOUL'
        || farm.pair.token1?.symbol == 'SEANCE'
        || farm.pair.token1?.symbol == 'LUX'
        || farm.pair.token1?.symbol == 'wLUM'
      ),
    single: (farm) => farm.pair.token0 && !farm.pair.token1,
    lending: (farm) => farm.allocPoint > 0 && farm.pair.type == 'underworld',
    fantom: (farm) => farm.allocPoint > 0 && (farm.pair.token0?.symbol == 'FTM' || farm.pair.token1?.symbol == 'FTM'),
    stables: (farm) => farm.allocPoint == 200 // since all [active] stables have 200 AP <3
  }

  let summTvl = tvl.reduce((previousValue, currentValue) => {
    return previousValue + currentValue.tvl
  }, 0)

  const data = farms.map(map).filter((farm) => {
    return type in FILTER ? FILTER[type](farm) : true
  })

  const options = {
    keys: ['pair.id', 'pair.token0.symbol', 'pair.token1.symbol'],
    threshold: 0.4,
  }

  const { result, term, search } = useFuse({
    data,
    options,
  })

  const pendingValue = positions.reduce((previousValue, currentValue) => {
    return previousValue + (currentValue.pendingSoul / 1e18) * soulPrice
  }, 0)

  const farmingPools = Object.keys(POOLS[250]).map((key) => {
    return { ...POOLS[250][key], lpToken: key }
  })

  const allStaked = positions.reduce((previousValue, currentValue) => {
    const pool = farmingPools.find((r) => parseInt(r.id.toString()) == parseInt(currentValue.id))
    const poolTvl = tvl.find((r) => getAddress(r.lpToken) == pool?.lpToken)
    console.log('lpToken:%s', poolTvl?.lpPrice)
    return !poolTvl ? previousValue + 0 : previousValue + ((currentValue.amount / 1e18) * poolTvl?.lpPrice)
  }, 0)

    // harvests: all staked pools (for user)
    const handleHarvestAll = async () => {
      try {
        let tx
        tx = SummonerContract?.harvestAll()
        await tx?.wait()
    } catch (e) {
        console.log(e)
        return
    }
  }

  return (
    <Wrap padding='1rem 0 0 0' justifyContent="center">
      {showBalances &&
      <div className="flex flex-row text-dark-600 justify-end">
        <XIcon
          height="24px"
          id="toggle-button"
          onClick={() => openShowBalances(false)}
        />
      </div>
      }
      {showBalances &&
        <TridentHeader className="sm:!flex-row justify-center items-center" pattern="bg-bubble">
          <div>
          </div>
          <div className={`flex items-center justify-between px-2 py-2`}>
            <div className="flex gap-0">
              <Button
                color="purple"
                className="text-emphasis"
                variant="outlined"
                size={"sm"}
              >
                {formatNumberScale(allStaked, true)} {' STAKED'}
              </Button>
              {positions.length > 0 && [ChainId.FANTOM].includes(chainId) && (
                <Button
                  color="greydient"
                  className="text-emphasis"
                  variant="flexed"
                  size={"sm"}
                  disabled={pendingTx}
                  onClick={async () => {
                    setPendingTx(true)
                    for (const pos of positions) {
                      try {
                        const tx = await harvest(parseInt(pos.id))
                        addTransaction(tx)
                      } catch (error) {
                        console.error(error)
                      }
                    }
                    setPendingTx(false)
                  }}
                >
                  CLAIM ALL {formatNumberScale(pendingValue, true)}
                </Button>
              )}
              {positions.length > 0 && [ChainId.AVALANCHE].includes(chainId) && (
                <Button
                  color="greydient"
                  className="text-emphasis"
                  variant="flexed"
                  size={"sm"}
                  disabled={pendingTx}
                  onClick={async () => {
                    setPendingTx(true)
                      try { 
                        await handleHarvestAll()
                        } catch (error) {
                          console.error(error)
                        }
                    setPendingTx(false)
                  }}
                >
                  CLAIM ALL {formatNumberScale(pendingValue, true)}
                </Button>
              )}
              <Button
                color="purple"
                className="text-emphasis"
                variant={'outlined'}
                size={"sm"}
              >
                {/* {'TOTAL: '} */}
                {formatNumberScale(summTvl, true)} {' '} TOTAL
              </Button>
            </div>
          </div>
        </TridentHeader>
      }

      <DoubleGlowShadowV2 opacity="0.6">
        <Container id="farm-page">
          {/* <NewFeature /> */}
          <br />
          <Head>
            <title>Farm | All</title>
            <meta key="description" name="description" content="Farm SOUL" />
          </Head>
          <FarmList />
        </Container>
      </DoubleGlowShadowV2>
    </Wrap>
  )
}

export default Summoner