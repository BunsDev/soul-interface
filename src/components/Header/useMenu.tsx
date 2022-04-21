import React, { ReactNode, useMemo } from 'react'
import { GlobeIcon, SwitchVerticalIcon, TrendingUpIcon, SunIcon, CurrencyDollarIcon, UserGroupIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { SOUL_ADDRESS } from 'sdk'
// import { PoolIcon, RocketIcon, WalletIcon } from 'components/Icon'
import { Feature } from 'enums'
import { classNames, featureEnabled } from 'functions'
import { useActiveWeb3React } from 'services/web3'
import { useRouter } from 'next/router'

export interface MenuItemLeaf {
  key: string
  title: string
  link: string
  icon?: ReactNode
}

export interface MenuItemNode {
  key: string
  title: string
  items: MenuItemLeaf[]
  icon: ReactNode
}

export type MenuItem = MenuItemLeaf | MenuItemNode
export type Menu = MenuItem[]

type UseMenu = () => Menu
const useMenu: UseMenu = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const router = useRouter()
  const isLuxor = router.asPath.startsWith('/luxor')

  return useMemo(() => {
    if (!chainId) return []

    // By default show just a swap button
    let tradeMenu: MenuItem = {
      key: 'swap',
      title: i18n._(t`Exchange`),
      link: '/swap',
      icon: <SwitchVerticalIcon width={20} className={classNames(isLuxor ? "text-yellow" : "text-dark-600")} />,
    }
  
 // If AMM is enabled, replace swap button with a submenu under trade
 /* if (featureEnabled(Feature.AMM, chainId)) {
  tradeMenu = {
    key: 'exchange',
    title: i18n._(t`SWAP`),
    icon: <SwitchVerticalIcon width={20} />,
    items: [
      {
        key: 'swap',
        title: i18n._(t`Swap`),
        link: '/swap',
      },
      {
        key: 'bridge',
        title: i18n._(t`Bridge`),
        link: '/bridge',
      },
    ],
  }
} */
    // If limit orders is enabled, replace swap button with a submenu under trade
    if (featureEnabled(Feature.TRIDENT, chainId)) {
      tradeMenu = {
        key: 'trade',
        title: i18n._(t`Exchange`),
        icon: <SwitchVerticalIcon width={20} className={classNames(isLuxor ? "text-yellow" : "text-dark-600")} />,
        items: [
          {
            key: 'swap',
            title: i18n._(t`Swap`),
            link: '/swap',
          },
          {
            key: 'pool',
            title: i18n._(t`Pool`),
            link: '/pool',
          },
          {
            key: 'bridge',
            title: i18n._(t`Bridge`),
            link: 'https://bridge.soulswap.finance',
          },
          {
            key: 'limit',
            title: i18n._(t`Limit`),
            link: '/limit',
          },
          {
            key: 'margin',
            title: i18n._(t`Margin`),
            link: '/margin',
          },
        ],
      }
    }

    const poolMenu = [
      {
        key: 'browse',
        title: i18n._(t`Browse`),
        link: '/pool',
      },
      {
        key: 'add-liquidity',
        title: i18n._(t`Add`),
        link: `/add/FTM/${SOUL_ADDRESS[chainId]}`,
      },
      {
        key: 'remove-liquidity',
        title: i18n._(t`Remove`),
      link: `/remove/FTM/${SOUL_ADDRESS[chainId]}`,
      },
      {
        key: 'import',
        title: i18n._(t`Import`),
        link: '/find',
      },
    ]

    if (featureEnabled(Feature.MIGRATE, chainId)) {
      poolMenu.push({
        key: 'migrate',
        title: i18n._(t`Migrate`),
        link: '/migrate',
      })
    }

    const mainItems: Menu = [tradeMenu]

    // if (poolMenu.length > 0)
    //   mainItems.push({
    //     key: 'pool',
    //     title: i18n._(t`Liquidity`),
    //     items: poolMenu,
    //     icon: <PoolIcon width={20} />,
    //   })

    if (featureEnabled(Feature.LIQUIDITY_MINING, chainId)) {
      const farmItems = {
        key: 'SoulSwap',
        title: i18n._(t`SoulSwap`),
        icon: <CurrencyDollarIcon width={20} className={classNames("filter", isLuxor ? "text-yellow" : "text-dark-600")} />,
        items: [
          {
            key: 'pool',
            title: i18n._(t`Liquidity`),
            link: '/pool',
          },
          {
            key: 'farm',
            title: i18n._(t`Farms`),
            link: '/summoner',
          },
          {
            key: 'vault',
            title: i18n._(t`Vault`),
            link: '/autostake',
          },
          {
            key: 'staking',
            title: i18n._(t`Stake`),
            link: '/seance',
          },
          {
            key: 'bonds',
            title: i18n._(t`Bonds`),
            link: '/bonds',
          },
          {
            key: 'soul-docs',
            title: i18n._(t`Tutorials`),
            link: 'https://docs.soulswap.finance/docs/user-guides/exchange/swapping-tokens',
          },
        ],
      }
      mainItems.push(farmItems)
    }

    if (featureEnabled(Feature.LIQUIDITY_MINING, chainId)) {
      const learnItems = {
        key: 'Luxor',
        title: i18n._(t`Luxor`),
        icon: <SunIcon width={20} className={classNames("rotate-90 filter", isLuxor ? "text-yellow" : "text-dark-600")} />,
        items: [
          {
            key: 'luxor-dashboard',
            title: i18n._(t`Overview`),
            link: '/luxor/dashboard',
          },
          {
            key: 'luxor-bonds',
            title: i18n._(t`Bonds`),
            link: '/luxor/bonds',
          },
          {
            key: 'sor',
            title: i18n._(t`Stable`),
            link: '/luxor/sor',
          },
          {
            key: 'rebase',
            title: i18n._(t`Staking`),
            link: '/luxor/stake',
          },
          {
            key: 'lux-docs',
            title: i18n._(t`Tutorials`),
            link: 'https://docs.luxor.money',
          },
        ],
      }
      mainItems.push(learnItems)
      }
      

    if (featureEnabled(Feature.UNDERWORLD, chainId))
     {
      mainItems.push({
        key: 'lending',
        title: i18n._(t`Lending`),
        icon: <SwitchVerticalIcon width={20} className={classNames("rotate-90 filter", isLuxor ? "text-yellow" : "text-dark-600")} />,
        items: [
          {
            key: 'lend',
            title: i18n._(t`Markets`),
            link: '/underworld',
          },
          {
            key: 'underworld-farms',
            title: i18n._(t`Mines`),
            link: '/mines?filter=lending',
          },
          {
            key: 'balances',
            title: 'Coffinbox',
            link: '/balances',
          },
          {
            key: 'borrow-docs',
            title: i18n._(t`Tutorials`),
            link: 'https://docs.soulswap.finance/docs/user-guides/our-underworld/borrowing-assets',
          },
        ],
      })
      
    }

    let analyticsMenu: MenuItem = {
      key: 'analytics',
      title: i18n._(t`Analytics`),
      icon: <TrendingUpIcon width={20} className={classNames(isLuxor ? "text-yellow" : "text-dark-600")} />,
      items: [
        {
          key: 'wallet',
          title: 'Wallet',
          link: '/balances',
        },
        {
          key: 'dashboard',
          title: 'Overview',
          link: '/analytics/dashboard',
        },
        {
          key: 'tokens',
          title: 'Tokens',
          link: '/analytics/tokens',
        },
        {
          key: 'pairs',
          title: 'Pairs',
          link: '/analytics/pairs',
        },
      ],
    }

    // if (featureEnabled(Feature.COFFINBOX, chainId)) {
    //   analyticsMenu.items.push({
    //     key: 'coffinbox',
    //     title: 'CoffinBox',
    //     link: '/analytics/coffinbox',
    //   })
    // }

    if (featureEnabled(Feature.ANALYTICS, chainId)) {
      mainItems.push(analyticsMenu)
    }

    if (featureEnabled(Feature.AMM, chainId))
    {
     mainItems.push({
       key: 'socials',
       title: i18n._(t`Social`),
       icon: <UserGroupIcon width={20} className={classNames(isLuxor ? "text-yellow" : "text-dark-600")} />,
       items: [
         {
           key: 'discord',
           title: 'Discord',
           link: 'https://discord.com/invite/DQjChB6Wa6',
         },
         {
           key: 'telegram',
           title: 'Telegram',
           link: 'https://t.me/SoulSwapDeFi',
         },
         {
           key: 'soul-twitter',
           title: 'Twitter',
           link: 'https://twitter.com/SoulSwapFinance',
         },
         {
           key: 'lux-twitter',
           title: '@LuxorMoney',
           link: 'https://twitter.com/LuxorMoney',
         },
         {
           key: 'forum',
           title: 'Forum',
           link: 'https://forum.soulswap.finance',
         },
         {
           key: 'medium',
           title: 'Medium',
           link: 'https://soulswapfinance.medium.com',
         },
       ],
     })
     
   }
   
    // mainItems.push({
    //   key: 'balances',
    //   title: i18n._(t`Portfolio`),
    //   link: '/balances',
    //   icon: <WalletIcon width={20} />,
    // })
    
  // let exploreMenu: MenuItem = {
  //   key: 'explore',
  //   title: i18n._(t`Explore`),
  //   link: '/explore',
  //   icon: <GlobeIcon width={20} className={classNames(isLuxor ? "text-yellow" : "text-dark-600")} />,
  // }
  //   mainItems.push(exploreMenu)

    
    return mainItems.filter((el) => Object.keys(el).length > 0)
  }, [chainId, i18n])
}

export default useMenu