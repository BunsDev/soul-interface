import { Transition } from '@headlessui/react'
import { ArrowDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount, Fraction, JSBI, maximum, minimum, ZERO } from 'sdk'
import {
  LendingMarketBorrowButton,
//   LendingMarketBorrowLeverageView,
  LendingMarketDetailsView,
  LendingMarketView,
} from 'features/lending/LendingMarket'
import { useLendingMarket } from 'features/lending/LendingMarket/LendingMarketContext'
import { LendingMarketCurrentPosition } from 'features/lending/LendingMarket/LendingMarketCurrentPosition'
import SwapAssetPanel from 'features/trident/swap/SwapAssetPanel'
import { computeRealizedLPFeePercent, tryParseAmount, unwrappedToken } from 'functions'
import { useV2TradeExactIn } from 'hooks/useV2Trades'
import { useAppSelector } from 'state/hooks'
import { selectSlippage } from 'state/slippage/slippageSlice'
import React, { FC, useCallback, useMemo, useRef, useState } from 'react'
import { useActiveWeb3React } from 'services/web3'

interface LendingMarketBorrowView {}

const DEFAULT_UPDATE_ORACLE = true

export const LendingMarketBorrowView: FC<LendingMarketBorrowView> = () => {
  const { i18n } = useLingui()
  const { market } = useLendingMarket()
  const { chainId } = useActiveWeb3React()

  const inputRef = useRef<HTMLInputElement>(null)
  const multiplierRef = useRef<Fraction>()

  const [updateOracle, setUpdateOracle] = useState(DEFAULT_UPDATE_ORACLE)
  const [leverage, setLeverage] = useState<boolean>(false)
  const [spendFromWallet, setSpendFromWallet] = useState<boolean>(true)
  const [receiveInWallet, setReceiveInWallet] = useState<boolean>(true)

  const collateral = unwrappedToken(market.collateral.token)
  const asset = unwrappedToken(market.asset.token)

  const [collateralAmount, setCollateralAmount] = useState<string>()
  const [borrowAmount, setBorrowAmount] = useState<string>()

  const borrowAmountCurrencyAmount = borrowAmount ? tryParseAmount(borrowAmount, asset) : undefined

  const collateralAmountCurrencyAmount = collateralAmount ? tryParseAmount(collateralAmount, collateral) : undefined

  const allowedSlippage = useAppSelector(selectSlippage)

  const trade = useV2TradeExactIn(borrowAmountCurrencyAmount, collateral, { maxHops: 4 })

  const swapCollateralAmount = leverage ? trade?.minimumAmountOut(allowedSlippage) : undefined

  const nextUserCollateralValue = JSBI.add(
    JSBI.add(
      market.userCollateralAmount,
      collateralAmountCurrencyAmount ? collateralAmountCurrencyAmount.quotient : JSBI.BigInt(0)
    ),
    swapCollateralAmount ? swapCollateralAmount.quotient : JSBI.BigInt(0)
  )

  const nextMaxBorrowableOracle = JSBI.divide(
    JSBI.multiply(nextUserCollateralValue, JSBI.multiply(JSBI.BigInt(1e16), JSBI.BigInt(75))),
    market.oracleExchangeRate
  )

  const nextMaxBorrowableSpot = JSBI.divide(
    JSBI.multiply(nextUserCollateralValue, JSBI.multiply(JSBI.BigInt(1e16), JSBI.BigInt(75))),
    market.spotExchangeRate
  )

  const nextMaxBorrowableStored = JSBI.divide(
    JSBI.multiply(nextUserCollateralValue, JSBI.multiply(JSBI.BigInt(1e16), JSBI.BigInt(75))),
    updateOracle ? market.oracleExchangeRate : market.exchangeRate
  )

  const nextMaxBorrowMinimum = minimum(nextMaxBorrowableOracle, nextMaxBorrowableSpot, nextMaxBorrowableStored)

  const nextMaxBorrowSafe = JSBI.subtract(
    JSBI.divide(JSBI.multiply(nextMaxBorrowMinimum, JSBI.BigInt(95)), JSBI.BigInt(100)),
    market.currentUserBorrowAmount
  )

  const nextMaxBorrowPossible = maximum(minimum(nextMaxBorrowSafe, market.maxAssetAvailable), ZERO)

  const nextBorrowValue = CurrencyAmount.fromRawAmount(
    asset,
    JSBI.add(
      market.currentUserBorrowAmount,
      borrowAmountCurrencyAmount ? borrowAmountCurrencyAmount.quotient : JSBI.BigInt(0)
    )
  )

  const priceImpact = useMemo(() => {
    if (!trade) return undefined
    const realizedLpFeePercent = computeRealizedLPFeePercent(trade)
    return realizedLpFeePercent ? trade.priceImpact.subtract(realizedLpFeePercent.asFraction) : undefined
  }, [trade])

  const onMultiply = useCallback(
    (multiplier: string, persist: boolean = false) => {
      if (!collateral || !asset || !collateralAmountCurrencyAmount) return
      multiplierRef.current = new Fraction(
        JSBI.add(JSBI.BigInt(multiplier.toBigNumber(18)), JSBI.BigInt(0)),
        JSBI.BigInt(1e18)
      )

      const { numerator, denominator } = collateralAmountCurrencyAmount
        .add(
          collateralAmountCurrencyAmount
            .multiply(multiplier.toBigNumber(collateral.decimals).toString())
            .divide('1'.toBigNumber(collateral.decimals).toString())
        )
        .multiply(JSBI.BigInt(1e16))
        .multiply(JSBI.BigInt(75))
        .divide(market.exchangeRate)

      const amount = CurrencyAmount.fromFractionalAmount(asset, numerator, denominator)
      if (inputRef.current) {
        inputRef.current.value = amount.toSignificant(6)
      }

      if (persist) {
        setBorrowAmount(amount.toSignificant(6))
      }
    },
    [asset, collateral, collateralAmountCurrencyAmount, market.exchangeRate]
  )

  return (
    <div className="flex flex-col gap-3">
      <LendingMarketCurrentPosition setBorrowAmount={setBorrowAmount} setCollateralAmount={setCollateralAmount} />
      <SwapAssetPanel
        chainId={chainId}
        error={false}
        header={(props) => <SwapAssetPanel.Header {...props} label={i18n._(t`Deposit`)} hideSearchModal />}
        walletToggle={(props) => (
          <SwapAssetPanel.Switch
            id={`switch-classic-withdraw-from-0}`}
            {...props}
            label={i18n._(t`Deposit from`)}
            onChange={() => setSpendFromWallet((prev) => !prev)}
          />
        )}
        spendFromWallet={spendFromWallet}
        currency={collateral}
        value={collateralAmount}
        onChange={setCollateralAmount}
      />
      <div className="flex justify-center relative lg:mt-[-23px] lg:mb-[-23px]">
        <div className="rounded-full lg:border-2 lg:border-dark-800 hover:lg:border-dark-700 hover:text-white bg-dark-900 p-1.5 cursor-pointer">
          <ArrowDownIcon width={12} height={12} />
        </div>
      </div>
      <SwapAssetPanel
        chainId={chainId}
        // ref={inputRef}
        error={false}
        header={(props) => <SwapAssetPanel.Header {...props} label={i18n._(t`Borrow`)} hideSearchModal />}
        walletToggle={(props) => (
          <Transition
            show={!leverage}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-100 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <SwapAssetPanel.Switch
              id={`switch-classic-withdraw-from-0}`}
              {...props}
              label={i18n._(t`Receive in`)}
              onChange={() => setReceiveInWallet((prev) => !prev)}
            />
          </Transition>
        )}
        spendFromWallet={receiveInWallet}
        currency={asset}
        value={borrowAmount}
        onChange={setBorrowAmount}
        // balancePanel={() => <></>}
      />
      {/* {collateralAmountCurrencyAmount?.greaterThan(ZERO) && (
        <LendingMarketBorrowLeverageView
          borrowAmount={borrowAmountCurrencyAmount}
          collateralAmount={collateralAmountCurrencyAmount}
          enabled={leverage}
          onSwitch={() => setLeverage((prev) => !prev)}
          onChange={(val) => onMultiply(val, false)}
          afterChange={(val) => onMultiply(val, true)}
          trade={trade}
        />
      )} */}
      <LendingMarketDetailsView
        trade={trade}
        priceImpact={leverage ? priceImpact : undefined}
        borrowAmount={borrowAmountCurrencyAmount}
        collateralAmount={collateralAmountCurrencyAmount}
        multiplier={leverage ? multiplierRef.current : undefined}
        view={LendingMarketView.BORROW}
      />
      <LendingMarketBorrowButton
        priceImpact={leverage ? priceImpact : undefined}
        borrowAmount={borrowAmountCurrencyAmount}
        collateralAmount={collateralAmountCurrencyAmount}
        spendFromWallet={spendFromWallet}
        leveraged={leverage}
        receiveInWallet={receiveInWallet}
        view={LendingMarketView.BORROW}
        nextMaxBorrowMinimum={nextMaxBorrowMinimum}
        nextMaxBorrowSafe={nextMaxBorrowSafe}
        nextMaxBorrowPossible={nextMaxBorrowPossible}
      />
    </div>
  )
}