import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "session" model, go to https://stockll.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "HZtPV02NrJSj",
  fields: {
    user: {
      type: "belongsTo",
      parent: { model: "user" },
      storageKey: "23HH0p7iH1AS",
    },
  },
};
