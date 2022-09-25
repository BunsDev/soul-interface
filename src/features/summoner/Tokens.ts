import { ChainId } from "sdk";
import { BNB_ADDRESS } from "constants/addresses";
import { DAI_ADDRESS, ENCHANT_ADDRESS, SEANCE_ADDRESS, SOUL_ADDRESS, USDC_ADDRESS } from "sdk";

export const tokens = {
    SOUL: {
      4002: "0xCF174A6793FA36A73e8fF18A71bd81C985ef5aB5",
      250: SOUL_ADDRESS[ChainId.FANTOM],
    },
    SEANCE: {
      4002: "0xD54Cf31D5653F4a062f5DA4C83170A5867d04442",
      250: SEANCE_ADDRESS[ChainId.FANTOM],
    },
    FTM: {
      4002: "0xf1277d1ed8ad466beddf92ef448a132661956621",
      250: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
    },
    WLUM: {
      4002: "",
      250: "0xa69557e01B0a6b86E5b29BE66d730c0Bfff68208",
    },
    SOR: {
      4002: "",
      250: "0xEFFd4874AcA3Acd19a24dF3281b5cdAdD823801A",
    },
    ENCHANT: {
      4002: "",
      250: ENCHANT_ADDRESS[ChainId.FANTOM],
    },
    FUSD: {
      4002: "0x306557358e20aea124b16a548597897858d13cb2",
      250: "0xAd84341756Bf337f5a0164515b1f6F993D194E1f",
    },
    BOO: {
      4002: "",
      250: "0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE",
    },
    BNB: {
      4002: "",
      250: BNB_ADDRESS[ChainId.FANTOM],
    },
    DAI: {
      4002: '',
      250: DAI_ADDRESS[ChainId.FANTOM],
    },
    ICE: {
      4002: '',
      250: '0xf16e81dce15B08F326220742020379B855B87DF9',
    },
    gFUSDT: {
      4002: '',
      250: '0x940F41F0ec9ba1A34CF001cc03347ac092F5F6B5',
    },
    USDT: {
      4002: '',
      250: '0x049d68029688eAbF473097a2fC38ef61633A3C7A',
    },
    LUX: {
      4002: '',
      250: '0x6671E20b83Ba463F270c8c75dAe57e3Cc246cB2b',
    },
    MIM: {
      4002: '',
      250: '0x82f0B8B456c1A451378467398982d4834b6829c1',
    },
    USDC: {
      4002: "",
      250: USDC_ADDRESS[ChainId.FANTOM],
    },
    WETH: {
      4002: "0x442993b05D170AE47af948FBF507B9972f26cA86",
      250: "0x74b23882a30290451A17c44f4F05243b6b58C76d",
    },
    WBTC: {
      4002: "0xd4cBf200850A79D5130c368f9D56592cfbE22179",
      250: "0x321162Cd933E2Be498Cd2267a90534A804051b11",
    },
    CRV: {
      4002: "",
      250: "0x1E4F97b9f9F913c46F1632781732927B9019C68b",
    },
    ANY: {
      4002: "",
      250: "0xdDcb3fFD12750B45d32E084887fdf1aABAb34239",
    },
    EVO: {
      4002: "",
      250: "0x0a77866C01429941BFC7854c0c0675dB1015218b",
    },
    AVAX: {
      4002: "",
      250: "0x511D35c52a3C244E7b8bd92c0C297755FbD89212",
    },
    SPELL: {
      4002: "",
      250: "0x468003B688943977e6130F4F68F23aad939a1040",
    },
    SPIRIT: {
      4002: "",
      250: "0x5Cc61A78F164885776AA610fb0FE1257df78E59B",
    },
    TOMB: {
      4002: "",
      250: "0x6c021Ae822BEa943b2E66552bDe1D2696a53fbB7",
    },
    UNIDX: {
      4002: "",
      250: "0x2130d2a1e51112D349cCF78D2a1EE65843ba36e0",
    },
    ZOO: {
      4002: "",
      250: "0x09e145A1D53c0045F41aEEf25D8ff982ae74dD56",
    },
  };