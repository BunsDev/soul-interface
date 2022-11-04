import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST, CUSTOM_BASES } from "config/routing";
import flatMap from "lodash/flatMap";
import { Currency } from "sdk";

export function getCurrencyCombinations(chainId: number, currencyA: Currency, currencyB: Currency) {
    const [tokenA, tokenB] = chainId ? [currencyA?.wrapped, currencyB?.wrapped] : [undefined, undefined]

    const common = chainId in BASES_TO_CHECK_TRADES_AGAINST ? BASES_TO_CHECK_TRADES_AGAINST[chainId] : []
    const additionalA = tokenA ? ADDITIONAL_BASES[chainId]?.[tokenA.address] ?? [] : []
    const additionalB = tokenB ? ADDITIONAL_BASES[chainId]?.[tokenB.address] ?? [] : []
  
    const bases: Currency[] = [...common, ...additionalA, ...additionalB]
  
    const basePairs: [Currency, Currency][] = flatMap(bases, (base): [Currency, Currency][] =>
      bases.map((otherBase) => [base, otherBase])
    )
  
    if (!tokenA || !tokenB) {
      return []
    }
  
    return [
      // the direct pair
      [tokenA, tokenB],
      // token A against all bases
      ...bases.map((base): [Currency, Currency] => [tokenA, base]),
      // token B against all bases
      ...bases.map((base): [Currency, Currency] => [tokenB, base]),
      // each base against all bases
      ...basePairs,
    ]
      .filter((tokens): tokens is [Currency, Currency] => Boolean(tokens[0] && tokens[1]))
      .filter(([t0, t1]) => t0.wrapped.address !== t1.wrapped.address)
      .filter(([tokenA, tokenB]) => {
        if (!chainId) return true
        const customBases = CUSTOM_BASES[chainId]
  
        const customBasesA: Currency[] | undefined = customBases?.[tokenA.wrapped.address]
        const customBasesB: Currency[] | undefined = customBases?.[tokenB.wrapped.address]
  
        if (!customBasesA && !customBasesB) return true
  
        if (customBasesA && !customBasesA.find((base) => tokenB.equals(base))) return false
        if (customBasesB && !customBasesB.find((base) => tokenA.equals(base))) return false
  
        return true
      })
  }
  