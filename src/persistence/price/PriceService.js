import React from "react";
import CommonAPI from "@modules/api/CommonAPI";
import { PricesFactory } from "@modules/core/factory/PriceFactory";
import _ from "lodash";

export const PriceService = {
  getPrices,
};

async function getPrices(ids, nonCoinGeckoIds) {
  const { data } = await CommonAPI.get("coingecko/price?ids=" + ids, {});
  let coinGeckoPrices = data.data;
  const nonCoinGeckoPrices = await PricesFactory.load(nonCoinGeckoIds);
  nonCoinGeckoPrices.forEach(item => {
    coinGeckoPrices = _.merge(coinGeckoPrices, item);
  });
  return {
    success: true,
    data: coinGeckoPrices,
  };
}
