import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { DAI_BNB_MARKET, DAI_ETH_MARKET, REFUNDER_ADDRESS, DAI_NATIVE_MARKET, NATIVE_DAI_MARKET, Token } from 'sdk'
import { Button } from 'components/Button'
import Card from 'components/Card'
import Container from 'components/Container'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { Feature } from 'enums'
import NetworkGuard from 'guards/Network'
import { useRefunderContract, useTokenContract } from 'hooks/useContract'
import Layout from 'layouts/Underworld'
import { useActiveWeb3React } from 'services/web3'
import Head from 'next/head'
import React, { useCallback, useState } from 'react'
import Typography from 'components/Typography'
import { i18n } from '@lingui/core'
import { formatNumber } from 'functions'
import useSendTransaction from 'hooks/useSendTransaction'

// import { useTransactionAdder } from 'state/transactions/hooks'
// import { WFTM } from 'constants/index'
// import useSendTransaction from 'hooks/useSendTransaction'
// import { ethers } from 'ethers'

export default function LendSwap() {
  const { account, chainId, library } = useActiveWeb3React()
  const provider = library.provider
  const [id, setId] = useState(0)
  const [currency, setCurrency] = useState<Token>(null)
  const [pairAddress, setPairAddress] = useState(DAI_NATIVE_MARKET[chainId])
  const [pairSymbol, setPairSymbol] = useState('FTM Market')
  const [amount, setAmount] = useState(0)
  const [refundable, setRefundable] = useState(0)
  const [isActive, setStatus] = useState(true)
  const [available, setAvailable] = useState(0)
//   const [supplied, setSuppliedAmount] = useState(0)
//   const [lentAmount, setLentAmount] = useState(0)
  const [errored, setErrored] = useState(false)
//   const [inputError, setError] = useState('')

const RefunderContract = useRefunderContract()
// const addTransaction = useTransactionAdder()
// const maxUint = ethers.BigNumber.from(2).pow(ethers.BigNumber.from(255)).sub(ethers.BigNumber.from(1))
const PairContract = useTokenContract(pairAddress)

    // [ √ ] updates: id
    const handleAssetSelect = useCallback(
        (selectedCurrency: Token) => {
            setCurrency(selectedCurrency)
            let assetSymbol = selectedCurrency.wrapped.symbol

            let id = 
                assetSymbol == 'BNB' ? 0
                : assetSymbol == 'DAI' ? 1
                : assetSymbol == 'ETH' ? 2
                : assetSymbol == 'WFTM' ? 3
                : 4
            setId(id)

            handlePairSelect(selectedCurrency)
            handleRefundable(selectedCurrency)
            handleAvailable(selectedCurrency)

            let pairSymbol =
                id == 0 ? 'BNB Market'
                : id == 1 ? 'DAI Market'
                : id == 2 ? 'ETH Market'
                : id == 3 ? 'FTM Market'
                : 'Invalid Market'
            setPairSymbol(pairSymbol)

            id == 4 ? setErrored(true) : setErrored(false)
            console.log({id})

        }, [setCurrency, setId, setPairSymbol, setErrored]
    )

    const handleAssetAmount = useCallback(
        (inputAmount) => {
            setAmount(inputAmount)
            setPairAddress(pairAddress)
        }, [setAmount]
    )
    
    // [ √ ] updates: available amount.
    const handleAvailable = useCallback(
        async (selectedCurrency: Token) => {
            let assetSymbol = selectedCurrency.wrapped.symbol
            let result = 
                assetSymbol == 'BNB' ? await RefunderContract?.showAvailable(0)
                : assetSymbol == 'DAI' ? await RefunderContract?.showAvailable(1)
                : assetSymbol == 'ETH' ? await RefunderContract?.showAvailable(2)
                : assetSymbol == 'WFTM' ? await RefunderContract?.showAvailable(3)
                : 0
            let _available = await result?.toString()
            let available = Number(_available) / 1E18
                setAvailable(available)
            let isActive = await RefunderContract?.isActive()
                setStatus(isActive)
                console.log({result})
        }, [setAvailable]
    )
    
    // [ √ ] updates: refundable amount.
    const handleRefundable = useCallback(
        async (selectedCurrency: Token) => {
            let assetSymbol = selectedCurrency.wrapped.symbol
            let result = 
                assetSymbol == 'BNB' ? await RefunderContract?.showRefundable(0, account)
                : assetSymbol == 'DAI' ? await RefunderContract?.showRefundable(1, account)
                : assetSymbol == 'ETH' ? await RefunderContract?.showRefundable(2, account)
                : assetSymbol == 'WFTM' ? await RefunderContract?.showRefundable(3, account)
                : 0
            let _refundable = await result?.toString()
            let refundable = Number(_refundable) / 1E18
                setRefundable(refundable)
                console.log({result})
        }, [setRefundable]
    )

    // [ √ ] updates: pairAddress.
    const handlePairSelect = useCallback(
        (selectedCurrency: Token) => {
            let assetSymbol = selectedCurrency.wrapped.symbol

            let pairAddress = 
                assetSymbol == 'BNB' ? DAI_BNB_MARKET[chainId]
                : assetSymbol == 'DAI' ? NATIVE_DAI_MARKET[chainId]
                : assetSymbol == 'ETH' ? DAI_ETH_MARKET[chainId]
                : assetSymbol == 'WFTM' ? DAI_NATIVE_MARKET[chainId]
                : DAI_NATIVE_MARKET[chainId]

        setPairAddress(pairAddress)
        console.log({pairAddress})

        }, [setPairAddress]
    )

  const {
    sendTx: handleRefund,
    isPending: isRefundPending,
    isCompleted: isRefundCompleted,
  } = useSendTransaction(() =>
    RefunderContract?.refund(id, (amount * 1E18)?.toString())
  );

  const {
    sendTx: handleApprove,
    isPending: isApprovePending,
    isCompleted: isApproveCompleted,
  } = useSendTransaction(() =>
    PairContract.approve(REFUNDER_ADDRESS[chainId], (amount * 4 * 1E18).toString())
  );

  return (
    <LendSwapLayout>
      <Head>
        <title>Swap Asset | Underworld by Soul</title>
        <meta key="description" name="description" content="Reclaim Retired Assets on Underworld by Soul" />
      </Head>
      <Card
        className="h-full bg-dark-900"
        header={
          <Card.Header className="bg-dark-800 text-2xl font-bold justify-center"> 
          {`Reclaim Underworld Asset`}
          </Card.Header>
        }
      >
        <Container maxWidth="full" className="space-y-6">
            <div className={`flex justify-center border p-2 rounded rounded-2xl ${isActive ? `border-green` : `border-red`}`}>
            <div className={`grid grid-cols-2`}>
            <Typography
                className={`font-bold text-lg sm:text-2xl ${isActive ? `text-green` : `text-red`} text-center`}
                >
                {isActive 
                    ? `Redeemable Assets`
                    : `Redemption Paused`
                }
            </Typography>
            <Typography
                className={`font-bold text-lg sm:text-2xl ${isActive ? `text-green` : `text-red`} text-center`}
                >
                {currency ? 
                    `${formatNumber(available, false, true)} ${currency?.wrapped.symbol}` 
                    : 'Select Asset'
                }
            </Typography>
            </div>
            </div>
          <div className="grid grid-cols-1">
            <CurrencyInputPanel
              label="Asset"
              chainId={chainId}
              hideBalance={true}
              hideInput={false}
              currency={currency}
              onCurrencySelect={handleAssetSelect}
              onUserInput={handleAssetAmount}
              showCommonBases={false}
              showSearch={false}
              id="underworld-currency-asset"
            />
          </div>

            <Button 
                color="green"
                variant={`outlined`}
                className="w-full px-4 py-3 text-base font-bold rounded text-high-emphesis"
                onClick={handleApprove}
                disabled={id == 4 || amount == 0}
            >
                {
                  isApprovePending
                    ? "Approving Market..."
                    : isApproveCompleted ? "Approved Market"
                    : amount == 0 ? `Enter Amount`
                    : `Approve Market`
                }
            </Button>

            <Button
                color={isActive ? `purple` : `red`}
                variant={`filled`}
                className="w-full px-4 py-3 text-base font-bold rounded text-high-emphesis"
                onClick={() => handleRefund()}
                disabled={id == 4 || !isActive}
                >
                {`${id == 4 ? `Invalid Asset Selected`
                    : amount == 0 ? `Enter Amount`
                        : isRefundPending ? `Redeeming ${currency?.wrapped.symbol}`
                        : isRefundCompleted ? `Redeemed ${currency?.wrapped.symbol}`
                        : !isActive ? `Redemption Paused`
                        : `Redeem ${currency?.wrapped.symbol}`
                }`}
            </Button>
        </Container>

        <div className="flex flex-col bg-dark-1000 mt-8 p-3 border border-1 border-dark-700 hover:border-purple w-full space-y-1">
            <div className="flex justify-between">
                <Typography className="text-white" fontFamily={'medium'}>
                {i18n._(t`Market`)}
                </Typography>
                <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                {currency ? pairSymbol : 'Select Market'}
                </Typography>
            </div>
            <div className="flex justify-between">
                <Typography className="text-white" fontFamily={'medium'}>
                {i18n._(t`Balance`)}
                </Typography>
                <Typography className="text-white" weight={600} fontFamily={'semi-bold'}>
                {`${formatNumber(refundable, false, true)} ${currency?.wrapped.symbol || ''}`}
                </Typography>
            </div>

            <div className="flex justify-between">
                <Typography className={isActive ? `text-green` : `text-red`} fontFamily={'medium'}>
                {i18n._(t`Redeemable`)}
                </Typography>
                <Typography className={isActive ? `text-green` : `text-red`} weight={600} fontFamily={'semi-bold'}>
                {`${formatNumber(available >= refundable ? refundable : available, false, true)} ${currency?.wrapped.symbol || ''}`}
                </Typography>
            </div>
        </div>
      </Card>
    </LendSwapLayout>
  )
}

const LendSwapLayout = ({ children }) => {
  const { i18n } = useLingui()
  return (
  // @ts-ignore TYPE NEEDS FIXING
    <Layout
      left={
        <Card
          className="h-full bg-dark-900"
          backgroundImage="/images/underworld/deposit.png"
          title={i18n._(t`Reclaim Retired Underworld Assets`)}
          description={i18n._(
            t`For those looking to reclaim their retired Underworld Assets (1:1).`
          )}
        />
      }
    >
      {children}
    </Layout>
  )
}

LendSwap.Guard = NetworkGuard(Feature.UNDERWORLD)