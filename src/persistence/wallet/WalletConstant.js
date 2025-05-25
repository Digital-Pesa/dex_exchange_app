import { arb, bsc, btc, bttc, digital_money_bsc, eth, polygon, tron } from "@modules/core/constant/constant";
import { applicationProperties } from "@src/application.properties";

export const WALLET_TYPE = {
  MANY: 1,
  ONE: 2,
};
export const WALLET_LIST_KEY = "@WALLET_LIST_KEY";

export const WALLET_LIST = [
  {
    chain: "ALL",
    name: "Multi-Coin Wallet",
    type: WALLET_TYPE.MANY,
    defaultChain: "ETH",
    image: applicationProperties.logoURI.app,
    swappable: true,
    dapps: true,
    coins: [
      btc,
      eth,
      bsc,
      polygon,
      tron,

    ],
    tokens: [digital_money_bsc],
  },
  {
    chain: "ETH",
    name: "Ethereum",
    defaultChain: "ETH",
    type: WALLET_TYPE.ONE,
    image: applicationProperties.logoURI.eth,
    swappable: true,
    dapps: true,
    coins: [
      eth,
    ],
  },
  {
    chain: "BSC",
    name: "Binance Coin",
    defaultChain: "BSC",
    type: WALLET_TYPE.ONE,
    image: applicationProperties.logoURI.bsc,
    swappable: true,
    dapps: true,
    coins: [
      bsc,
    ],
    tokens: [digital_money_bsc],
  },
  {
    chain: "POLYGON",
    name: "Matic",
    defaultChain: "POLYGON",
    type: WALLET_TYPE.ONE,
    image: applicationProperties.logoURI.polygon,
    swappable: true,
    dapps: true,
    coins: [
      polygon,
    ],
  },
  {
    chain: "TRON",
    name: "Tron",
    defaultChain: "TRON",
    type: WALLET_TYPE.ONE,
    image: applicationProperties.logoURI.tron,
    swappable: false,
    dapps: false,
    coins: [
      tron,
    ],
  },
  {
    chain: "ARB",
    name: "Arbitrum",
    defaultChain: "ARB",
    type: WALLET_TYPE.ONE,
    image: applicationProperties.logoURI.arb,
    swappable: false,
    dapps: false,
    coins: [
      arb,
    ],
  },
  {
    chain: "BTTC",
    name: "BitTorrent",
    defaultChain: "BTTC",
    type: WALLET_TYPE.ONE,
    image: applicationProperties.logoURI.bttc,
    swappable: false,
    dapps: false,
    coins: [
      bttc,
    ],
  },
];
