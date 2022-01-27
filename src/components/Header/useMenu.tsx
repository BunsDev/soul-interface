import { GlobeIcon, SwitchVerticalIcon, TrendingUpIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { SOUL_ADDRESS } from 'sdk'
import { PoolIcon, RocketIcon, WalletIcon } from 'components/Icon'
import { Feature } from 'enums'
import { featureEnabled } from 'functions'
import { useActiveWeb3React } from 'services/web3'
import { ReactNode, useMemo } from 'react'

export interface MenuItemLeaf {
  key: string
  title: string
  link: string
  // icon?: ReactNode
}

export interface MenuItemNode {
  key: string
  title: string
  items: MenuItemLeaf[]
  // icon?: ReactNode
}

export type MenuItem = MenuItemLeaf | MenuItemNode
export type Menu = MenuItem[]

type UseMenu = () => Menu
const useMenu: UseMenu = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!chainId) return []

    // By default show just a swap button
    let tradeMenu: MenuItem = {
      key: 'swap',
      title: i18n._(t`Exchange`),
      link: '/swap',
      // icon: <SwitchVerticalIcon width={20} />,
    }
 // If AMM is enabled, replace swap button with a submenu under trade
//  if (featureEnabled(Feature.AMM, chainId)) {
//   tradeMenu = {
//     key: 'exchange',
//     title: i18n._(t`Exchange`),
//     // icon: <SwitchVerticalIcon width={20} />,
//     items: [
//       {
//         key: 'swap',
//         title: i18n._(t`Swap`),
//         link: '/swap',
//       },
//       {
//         key: 'bridge',
//         title: i18n._(t`Bridge`),
//         link: '/bridge',
//       },
//     ],
//   }
// }
    // If limit orders is enabled, replace swap button with a submenu under trade
    if (featureEnabled(Feature.LIMIT_ORDERS, chainId)) {
      tradeMenu = {
        key: 'trade',
        title: i18n._(t`Trade`),
        // icon: <SwitchVerticalIcon width={20} />,
        items: [
          {
            key: 'swap',
            title: i18n._(t`Swap`),
            link: '/swap',
          },
          {
            key: 'limit',
            title: i18n._(t`Limit order`),
            link: '/limit-order',
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
      // {
      //   key: 'remove-liquidity',
      //   title: i18n._(t`Remove`),
      //   link: '/remove',
      // },
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

    const exploreMenu: MenuItemLeaf[] = []
    if (featureEnabled(Feature.VESTING, chainId)) {
      exploreMenu.push({
        key: 'stake',
        title: i18n._(t`Stake`),
        link: '/stake',
      })
    }

    const mainItems: Menu = [tradeMenu]

    if (poolMenu.length > 0)
      mainItems.push({
        key: 'pool',
        title: i18n._(t`Liquidity`),
        items: poolMenu,
        // icon: <PoolIcon width={20} />,
      })

    if (exploreMenu.length > 0)
      mainItems.push({
        key: 'explore',
        title: i18n._(t`Explore`),
        items: exploreMenu,
        // icon: <GlobeIcon width={20} />,
      })

    if (featureEnabled(Feature.LIQUIDITY_MINING, chainId)) {
      const farmItems = {
        key: 'farm',
        title: i18n._(t`Farms`),
        // icon: <SwitchVerticalIcon width={20} className="rotate-90 filter" />,
        items: [
          {
            key: 'your-farms',
            title: i18n._(t`Deposited`),
            link: '/mines?filter=deposited',
          },
          {
            key: 'your-farms',
            title: i18n._(t`Staking`),
            link: '/seance',
          },
          {
            key: 'all-farms',
            title: i18n._(t`Active`),
            link: '/mines?filter=active',
          },
        ],
      }
      mainItems.push(farmItems)
    }

    // if (featureEnabled(Feature.UNDERWORLD, chainId)) {
    //   mainItems.push({
    //     key: 'lending',
    //     title: i18n._(t`Lending`),
    //     icon: <SwitchVerticalIcon width={20} className="rotate-90 filter" />,
    //     items: [
    //       {
    //         key: 'lend',
    //         title: i18n._(t`Lend`),
    //         link: '/lend',
    //       },
    //       {
    //         key: 'borrow',
    //         title: i18n._(t`Borrow`),
    //         link: '/borrow',
    //       },
    //     ],
    //   })
    // }

    // if (featureEnabled(Feature.MISO, chainId)) {
    //   mainItems.push({
    //     key: 'launchpad',
    //     title: i18n._(t`Launchpad`),
    //     icon: <RocketIcon width={20} />,
    //     items: [
    //       {
    //         key: 'marketplace',
    //         title: i18n._(t`Marketplace`),
    //         link: '/miso',
    //       },
    //       {
    //         key: 'factory',
    //         title: i18n._(t`Factory`),
    //         link: '/miso/auction',
    //       },
    //     ],
    //   })
    // }

    let analyticsMenu: MenuItem = {
      key: 'analytics',
      title: i18n._(t`Analytics`),
      // icon: <TrendingUpIcon width={20} />,
      items: [
        {
          key: 'wallet',
          title: 'Wallet',
          link: '/info/dashboard',
        },
        {
          key: 'balances',
          title: 'Balances',
          link: '/balances',
        },
        {
          key: 'dashboard',
          title: 'Dashboard',
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

    // mainItems.push({
    //   key: 'balances',
    //   title: i18n._(t`Portfolio`),
    //   link: '/balances',
    //   // icon: <WalletIcon width={20} />,
    // })

    return mainItems.filter((el) => Object.keys(el).length > 0)
  }, [chainId, i18n])
}

export default useMenu