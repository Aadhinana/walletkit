import type { UseSolanaArgs } from "@saberhq/use-solana";
import { SolanaProvider } from "@saberhq/use-solana";
import React, { useContext, useMemo, useState } from "react";
import { I18nextProvider } from "react-i18next";

import {
  ModalStep,
  WalletSelectorModal,
} from "./components/WalletSelectorModal";
import type { WalletKitArgs, LangOption } from "./types";

export interface WalletKit {
  connect: () => void;
}

const WalletKitContext = React.createContext<WalletKit | null>(null);

interface Props extends WalletKitArgs, UseSolanaArgs {
  i18n?: any;
  langOptions?: LangOption;
  children: React.ReactNode;
}

export const WalletKitProvider: React.FC<Props> = ({
  children,
  app,
  i18n,
  langOptions,
  initialStep = ModalStep.Intro,
  ...solanaProviderArgs
}: Props) => {
  const [showWalletSelector, setShowWalletSelector] = useState<boolean>(false);

  const kit = useMemo(() => {
    return { connect: () => setShowWalletSelector(true) };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <SolanaProvider {...solanaProviderArgs}>
        <WalletKitContext.Provider value={kit}>
          <WalletSelectorModal
            app={app}
            initialStep={initialStep}
            isOpen={showWalletSelector}
            onDismiss={() => setShowWalletSelector(false)}
            langOptions={langOptions}
          />
          {children}
        </WalletKitContext.Provider>
      </SolanaProvider>
    </I18nextProvider>
  );
};

/**
 * Returns a function which shows the wallet selector modal.
 */
export const useWalletKit = (): WalletKit => {
  const kit = useContext(WalletKitContext);
  if (!kit) {
    throw new Error("Not in WalletConnector context");
  }
  return kit;
};
