import { ArrowDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ZERO } from 'sdk'
import AssetInput from 'components/AssetInput'
import { Button } from 'components/Button'
import Dots from 'components/Dots'
import { WalletIcon } from 'components/Icon'
import HeadlessUiModal from 'components/Modal/HeadlessUIModal'
import Typography from 'components/Typography'
import { useBalancesSelectedCurrency } from 'features/trident/balances/useBalancesDerivedState'
import { tryParseAmount } from 'functions'
import { useBentoBox } from 'hooks'
import { useActiveWeb3React } from 'services/web3'
import { useBentoBalanceV2 } from 'state/bentobox/hooks'
import { useCurrencyBalance } from 'state/wallet/hooks'
import React, { FC, useCallback, useState } from 'react'

interface WithdrawToWalletModalProps {
  open: boolean
  onClose(): void
}

const WithdrawToWalletModal: FC<WithdrawToWalletModalProps> = ({ open, onClose }) => {
  const { account } = useActiveWeb3React()
  const currency = useBalancesSelectedCurrency()
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const walletBalance = useCurrencyBalance(account ?? undefined, currency)
  const bentoBalance = useBentoBalanceV2(currency ? currency.wrapped.address : undefined)
  const { withdraw } = useBentoBox()
  const [value, setValue] = useState<string>()
  const { i18n } = useLingui()

  const valueCA = currency ? tryParseAmount(value, currency) : undefined
  let valuePlusBalance = valueCA?.wrapped
  if (valuePlusBalance && walletBalance) valuePlusBalance = valuePlusBalance.wrapped.add(walletBalance.wrapped)

  const execute = useCallback(async () => {
    if (!currency || !value) return

    try {
      setAttemptingTxn(true)
      await withdraw(currency?.wrapped.address, value.toBigNumber(currency?.decimals))
    } finally {
      setAttemptingTxn(false)
      onClose()
    }
  }, [currency, value, withdraw, onClose])

  const error = !account
    ? i18n._(t`Connect Wallet`)
    : !valueCA?.greaterThan(ZERO)
    ? i18n._(t`Enter Amount`)
    : !bentoBalance
    ? i18n._(t`Loading Balance`)
    : valueCA?.greaterThan(bentoBalance)
    ? i18n._(t`Insufficient ${valueCA.currency.symbol} Balance`)
    : ''

  const disabled = !!error || attemptingTxn
  const buttonText = attemptingTxn ? (
    <Dots>{i18n._(t`Withdrawing`)}</Dots>
  ) : error ? (
    error
  ) : (
    i18n._(t`Confirm Withdrawal`)
  )

  return (
    <HeadlessUiModal.Controlled isOpen={open} onDismiss={onClose} maxWidth="md">
      <div className="flex flex-col gap-4">
        <HeadlessUiModal.Header header={i18n._(t`Withdraw to wallet`)} onClose={onClose} />
        <AssetInput
          title={''}
          currency={currency}
          onChange={(val) => setValue(val)}
          value={value}
          spendFromWallet={false}
        />
        <div className="z-10 flex justify-center -mt-6 -mb-6">
          <div className="p-1.5 rounded-full bg-dark-800 border border-dark-800 shadow-md border-dark-700">
            <ArrowDownIcon width={14} className="text-high-emphesis" />
          </div>
        </div>
        <HeadlessUiModal.BorderedContent className="flex gap-3 px-3 bg-dark-900">
          <div className="border border-dark-700 rounded-full w-[48px] h-[48px] flex items-center justify-center shadow-md">
            <WalletIcon width={20} height={20} />
          </div>
          <div className="flex flex-col gap-1">
            <Typography variant="h3" className={value ? 'text-high-emphesis' : 'text-secondary'} weight={700}>
              {(valuePlusBalance || walletBalance)?.toSignificant(6)}
            </Typography>
            <Typography variant="xxs" className="text-secondary">
              {i18n._(t`In Wallet`)}
            </Typography>
          </div>
        </HeadlessUiModal.BorderedContent>
        <Button color="gradient" disabled={disabled} onClick={execute}>
          <Typography variant="sm" weight={700} className={!error ? 'text-high-emphesis' : 'text-low-emphasis'}>
            {buttonText}
          </Typography>
        </Button>
      </div>
    </HeadlessUiModal.Controlled>
  )
}

export default WithdrawToWalletModal