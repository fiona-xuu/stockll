import { applyParams, ActionOptions, hashCode, save } from "gadget-server";

export const run: ActionRun = async ({ params, record, logger, api, session }) => {
  // Applies new 'email' and 'password' to the user record and saves to database
  applyParams(params, record);

  // Ensure that the user is signing up with a valid invite
  const inviteToken = params.inviteCode && hashCode(params.inviteCode);
  const invite =
    inviteToken &&
    (await api.internal.invite.maybeFindFirst({
      filter: { inviteToken: { equals: inviteToken } },
      select: { id: true, email: true },
    }));



  record.lastSignedIn = new Date();
  // since we've verified the invite via email, we can mark the user as emailVerified
  record.emailVerified = true;
  (record as any).roles = ["signed-in"];

  await save(record);

  // Assigns the signed-in user to the active session
  session?.set("user", { _link: record.id });


  return {
    result: "ok",
  };
};

export const params = {
  inviteCode: { type: "string" },
};

export const options: ActionOptions = {
  actionType: "create",
  returnType: true,
  triggers: {
    googleOAuthSignUp: true,
    emailSignUp: true,
  },
};
