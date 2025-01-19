import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "subscribedStocks" model, go to https://stockll.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "vasemHPJrCCH",
  fields: {
    Change: {
      type: "number",
      decimals: 4,
      storageKey: "dMpuM9CE7-vh",
    },
    PriceChange: { type: "number", storageKey: "xyoaYFUS8psn" },
    StockID: {
      type: "string",
      validations: { required: true },
      storageKey: "vA6zYGYSfFlR",
    },
    StockName: { type: "string", storageKey: "vuPJ3-KxiDIB" },
    StockPrice: {
      type: "number",
      decimals: 4,
      validations: { required: true },
      storageKey: "AsZvKMh-i69D",
    },
    pinnedBy: {
      type: "belongsTo",
      validations: { required: true },
      parent: { model: "user" },
      storageKey: "B5CybP7cOM2-",
    },
  },
};
