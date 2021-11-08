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
    name: i18n._(t`Farm`),
    href: '/farm',
    farm: true,
    stake: false, 
    enchant: false, 
  },
  {
    name: i18n._(t`Stake`),
    href: '/seance',
    farm: false,
    stake: true, 
    enchant: false, 
  },
  {
    name: i18n._(t`Enchant`),
    href: '/enchant',
    farm: false,
    stake: false, 
    enchant: true, 
  },
]

export default function Menu() {
  const { i18n } = useLingui()
  const solutions = items(i18n)

  return (
    
    <Popover as="nav" className="w-full relative ml-6 md:m-0">
      {({ open }) => (
        <>
          <Popover.Button
            className={classNames(
              open ? 'text-primary' : 'text-secondary',
              'focus:outline-none hover:text-high-emphesis'
              )}
          >
            
            <Image src="https://media.giphy.com/media/Y4DUjvMhT9nHdNoMIj/giphy.gif" alt="earn soul" width={50} height={50} />
             <br/>
             SUMMON
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
              className="w-screen x-full bottom-12 lg:top-12 left-full sm:px-0"
            >
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid gap-6 px-5 py-6 bg-dark-900 sm:gap-8 sm:p-8">

                  {solutions.map((item) =>
                    item.farm ? (
                      <NavLink key={item.name} href={item.href}>
                      <a className="block p-3 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-800">
                        
                      FARM
                      </a>
                    </NavLink>

                    ) : 
                      item.stake ?
                      (
                        <NavLink key={item.name} href={item.href}>
                        <a className="block p-3 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-800">
                          {/* <p className="text-base font-medium text-high-emphesis">{item.name}</p> */}
                          
                        STAKE
                        </a>
                      </NavLink>
                      ) : (
                        item.enchant ?
                        (
                          <NavLink key={item.name} href={item.href}>
                          <a className="block p-3 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-dark-800">
                            ENCHANT
                          </a>
                        </NavLink>
                        ) : ''
                      )
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