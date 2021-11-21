import { Popover, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'

import ExternalLink from '../ExternalLink'
import { I18n } from '@lingui/core'
import Image from 'next/image'
import { classNames } from '../../functions/styling'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import NavLink from '../NavLink'
import { Link } from 'react-feather'

const items = (i18n: I18n) => [

  {
    name: i18n._(t`Borrow`),
    href: '/seance',
    borrow: true,
    enchant: false,
    stake: false,
    bridge: false,
    analytics: false, 
    links: false, 
    explore: false,
  },
  {
    name: i18n._(t`Enchant`),
    href: '/enchant',
    borrow: false,
    enchant: true,
    stake: false,
    bridge: false,
    analytics: false, 
    links: false, 
    explore: false,
  },
  {
    name: i18n._(t`Stake`),
    href: '/circles',
    borrow: false,
    enchant: false,
    stake: true,
    bridge: false,
    analytics: false, 
    links: false, 
    explore: false,
  },
  // {
  //   name: i18n._(t`Bridge`),
  //   href: '/bridge',
  //   borrow: false,
  //   enchant: false,
  //   stake: false,
  //   bridge: true,
  //   analytics: true, 
  //   links: false, 
  //   explore: false,
  // },
  // {
  //   name: i18n._(t`Analytics`),
  //   href: '/charts',
  //   borrow: false,
  //   enchant: false,
  //   stake: false,
  //   bridge: false,
  //   analytics: true, 
  //   links: false, 
  //   explore: false,
  // },
  {
    name: i18n._(t`Links`),
    href: '/links',
    borrow: false,
    enchant: false,
    stake: false,
    bridge: false,
    analytics: false, 
    links: true, 
    explore: false,
  },
  {
  name: i18n._(t`More`),
  href: '/explore',
  borrow: false,
  enchant: false,
  stake: false,
  bridge: false,
  analytics: false, 
  links: false, 
  explore: true,
  },
]

export default function Menu() {
  const { i18n } = useLingui()
  const solutions = items(i18n)

  return (
    
    // <Popover as="nav" className="w-full relative ml-6 md:m-0">
    <Popover as="nav" 
    className="w-full relative ml-6 md:p-2">
      {({ open }) => (
        <>
          <Popover.Button
            className={classNames(
              open ? 'text-primary' : 'text-secondary',
              'focus:outline-none hover:text-high-emphesis'
              )}
          >
            
            {/* <Image 
              src="https://media.giphy.com/media/Y3wYCIhIcnzwB2qXg7/giphy.gif" 
              alt="earn soul" 
              width={50} height={50} 
            /> */}
            {/* <br/> */}
             EXPLORE
          </Popover.Button>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              flex-direction="column"
              className="bottom-12 lg:top-12 left-full sm:px-0"
            >
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="absolute grid gap-6 px-5 py-6 bg-dark-900 sm:gap-6 sm:p-6">

                  {solutions.map((item) =>
                    item.borrow ? (
                      <NavLink key={item.name} href={item.href}>
                      <a className="block p-3 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-800">
                      BORROW
                      </a>
                    </NavLink>
                    ) : item.enchant ? 
                    (
                      <NavLink key={item.name} href={item.href}>
                      <a className="block p-3 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-800">
                      ENCHANT
                      </a>
                    </NavLink>
                    ) : item.stake ? 
                    (
                      <NavLink key={item.name} href={item.href}>
                      <a className="block p-3 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-800">
                      STAKING
                      </a>
                    </NavLink>
                    // ) : item.bridge ?
                    // (
                    //  <NavLink key={item.name} href={item.href}>
                    // <a className="block p-3 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-800">
                    // BRIDGE
                    // </a>
                    // </NavLink>
                    // ) : item.analytics ?
                    // (
                    //  <NavLink key={item.name} href={item.href}>
                    // <a className="block p-3 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-800">
                    // CHARTS
                    // </a>
                    // </NavLink>
                    ) : item.links ?
                    (
                     <NavLink key={item.name} href={item.href}>
                     <a className="block p-3 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-800">        
                    ECOSYSTEM
                    </a>
                    </NavLink>
                    ) : item.explore ?
                    (
                    <NavLink key={item.name} href={item.href}>
                    <a className="block p-3 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-800">
                      EXPLORE
                    </a>
                   </NavLink>
                      ) : ''
                    )}
                  </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )

}