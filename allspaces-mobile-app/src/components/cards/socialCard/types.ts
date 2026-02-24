import { OAuthStrategy } from "@clerk/types";
import React from "react";

export type T_SOCIAL_LIST_ITEM = {
  key: OAuthStrategy;
  title: string;
  icon: React.ReactNode;
};

export type T_SOCIAL_CARD = {
  socialItem: T_SOCIAL_LIST_ITEM;
  connectedAccounts: T_SOCIAL_LIST_ITEM[];
  onSocialCardPress: (socialItem: T_SOCIAL_LIST_ITEM) => void;
};
