import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "user" model, go to https://stockll.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "T3XAEpFCR-u5",
  fields: {
    email: {
      type: "email",
      validations: { required: true, unique: true },
      storageKey: "EfuPo2RhQoEw",
    },
    emailVerificationToken: {
      type: "string",
      storageKey: "h7T8sKueqqS1",
    },
    emailVerificationTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "cOQpSSpK0YeA",
    },
    emailVerified: {
      type: "boolean",
      default: false,
      storageKey: "WN3j2qJh4BLQ",
    },
    firstName: { type: "string", storageKey: "AbPcsNG7xvMv" },
    googleImageUrl: { type: "url", storageKey: "jAITCmSi_1qt" },
    googleProfileId: { type: "string", storageKey: "cLvpAfpjxffk" },
    lastName: { type: "string", storageKey: "lqZxb76CGdjo" },
    lastSignedIn: {
      type: "dateTime",
      includeTime: true,
      storageKey: "ZLk6dpAkaDnW",
    },
    password: {
      type: "password",
      validations: { strongPassword: true },
      storageKey: "TDiBZ_E2CI4W",
    },
    profilePicture: {
      type: "file",
      allowPublicAccess: true,
      storageKey: "revW0ivC1E_4",
    },
    resetPasswordToken: {
      type: "string",
      storageKey: "LUf0-cjlU4of",
    },
    resetPasswordTokenExpiration: {
      type: "dateTime",
      includeTime: true,
      storageKey: "CA_r250Wg9Sp",
    },
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "BnlMVYQQ6_M0",
    },
    subscribedStocks: {
      type: "hasMany",
      children: {
        model: "subscribedStocks",
        belongsToField: "pinnedBy",
      },
      storageKey: "6JYVJqwbEQhW",
    },
  },
};
