import React, { useMemo } from "react";
import { Currency, Percent } from "sdk";
import useTheme from "hooks/useTheme";
import { Rate } from "state/order/actions";
import { TYPE } from "theme/index";

export function RatePercentage({
  priceImpact,
  rateType,
  inputCurrency,
  outputCurrency,
}: {
  priceImpact?: Percent;
  rateType?: Rate;
  inputCurrency?: Currency | null;
  outputCurrency?: Currency | null;
}) {
  const theme = useTheme();
  const priceImpactColor = useMemo(() => {
    if (!priceImpact) return undefined;

    const pi = rateType === Rate.MUL ? priceImpact : priceImpact?.multiply(-1);

    if (pi.equalTo("0")) return theme.text4;
    if (pi.greaterThan("0")) return theme.green1;
    return theme.red1;
  }, [priceImpact, rateType, theme.green1, theme.red1, theme.text4]);

  return (
    <TYPE.Body fontSize={12} color={theme.text4}>
      {priceImpact ? (
        <span style={{ color: priceImpactColor }}>
          {rateType === Rate.MUL
            ? `Sell ${inputCurrency?.symbol ?? "-"} ${priceImpact.toSignificant(
                3
              )}% ${priceImpact.lessThan("0") ? "below" : "above"} market`
            : `Buy ${outputCurrency?.symbol ?? "-"} ${priceImpact
                .multiply(-1)
                .toSignificant(3)}% ${
                priceImpact.lessThan("0") ? "above" : "below"
              } market`}
        </span>
      ) : (
        "-"
      )}
    </TYPE.Body>
  );
}
