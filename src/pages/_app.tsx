import '../bootstrap'
import '../styles/index.css'

import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { remoteLoader } from '@lingui/remote-loader'
import { Web3ReactProvider } from '@web3-react/core'
import Dots from 'components/Dots'
import Portals from 'components/Portals'
import { SyncWithRedux } from 'components/SyncWithRedux'
import Web3ReactManager from 'components/Web3ReactManager'
// import { MultichainExploitAlertModal } from 'features/user/MultichainExploitAlertModal'
import getLibrary from 'functions/getLibrary'
import { exception, GOOGLE_ANALYTICS_TRACKING_ID, pageview } from 'functions/gtag'
import DefaultLayout from 'layouts/Default'
// @ts-ignore TYPE NEEDS FIXING
import store, { persistor } from 'state'
import ApplicationUpdater from 'state/application/updater'
import ListsUpdater from 'state/lists/updater'
import MulticallUpdater from 'state/multicall/updater'
import TransactionUpdater from 'state/transactions/updater'
import UserUpdater from 'state/user/updater'
import * as plurals from 'make-plural/plurals'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'
import React, { Fragment, useEffect } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { RecoilRoot } from 'recoil'
import { PersistGate } from 'redux-persist/integration/react'
import { GelatoProvider } from 'soulswap-limit-orders-react'
import { useActiveWeb3React } from 'services/web3'

const Web3ProviderNetwork = dynamic(() => import('components/Web3ProviderNetwork'), { ssr: false })

if (typeof window !== 'undefined' && !!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = true
}

// @ts-ignore TYPE NEEDS FIXING
function MyApp({ Component, pageProps, fallback, err }) {
  const router = useRouter()
  const { locale, events } = router

  useEffect(() => {
    // @ts-ignore TYPE NEEDS FIXING
    const handleRouteChange = (url) => {
      pageview(url)
    }
    events.on('routeChangeComplete', handleRouteChange)

    // @ts-ignore TYPE NEEDS FIXING
    const handleError = (error) => {
      exception({
        description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
        fatal: true,
      })
    }

    window.addEventListener('error', handleError)

    return () => {
      events.off('routeChangeComplete', handleRouteChange)
      window.removeEventListener('error', handleError)
    }
  }, [events])

  useEffect(() => {
    // @ts-ignore TYPE NEEDS FIXING
    async function load(locale) {
      // @ts-ignore TYPE NEEDS FIXING
      i18n.loadLocaleData(locale, { plurals: plurals[locale.split('_')[0]] })

      try {
        // Load messages from AWS, use q session param to get latest version from cache
        const res = await fetch(
          `https://raw.githubusercontent.com/sushiswap/translations/master/sushiswap/${locale}.json`
        )
        const remoteMessages = await res.json()

        const messages = remoteLoader({ messages: remoteMessages, format: 'minimal' })
        i18n.load(locale, messages)
      } catch {
        // Load fallback messages
        // const { messages } = await import(`@lingui/loader!./../../locale/${locale}.json?raw-lingui`)
        // i18n.load(locale, messages)
      }

      i18n.activate(locale)
    }

    load(locale)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  // Allows for conditionally setting a provider to be hoisted per page
  const Provider = Component.Provider || Fragment

  // Allows for conditionally setting a layout to be hoisted per page
  const Layout = Component.Layout || DefaultLayout

  // Allows for conditionally setting a guard to be hoisted per page
  const Guard = Component.Guard || Fragment

  function Gelato({ children }: { children?: React.ReactNode }) {
    const { library, chainId, account } = useActiveWeb3React()
    return (
      <GelatoProvider library={library} chainId={chainId} account={account ?? undefined}>
        {children}
      </GelatoProvider>
    )
  }
  return (
    <>
      <Head>Soul</Head>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
      />

      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ANALYTICS_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <I18nProvider i18n={i18n} forceRenderOnLocaleChange={false}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ProviderNetwork getLibrary={getLibrary}>
            <Web3ReactManager>
              {/*@ts-ignore TYPE NEEDS FIXING*/}
              <ReduxProvider store={store}>
                <PersistGate loading={<Dots>loading</Dots>} persistor={persistor}>
                  <>
                    <ListsUpdater />
                    <UserUpdater />
                    <ApplicationUpdater />
                    <MulticallUpdater />
                  </>
                  <RecoilRoot>
                    <SyncWithRedux />
                    <Provider>
                      <Layout>
                        <Guard>
                          {/* TODO: Added alert Jan 25. Delete component after a few months. */}
                          {/* <MultichainExploitAlertModal /> */}
                          {/*@ts-ignore TYPE NEEDS FIXING*/}
                          <Gelato>
                            <Component {...pageProps} err={err} />
                          </Gelato>
                        </Guard>
                        <Portals />
                      </Layout>
                    </Provider>
                    <TransactionUpdater />
                  </RecoilRoot>
                </PersistGate>
              </ReduxProvider>
            </Web3ReactManager>
          </Web3ProviderNetwork>
        </Web3ReactProvider>
      </I18nProvider>
    </>
  )
}

export default MyApp