import { createContext, useContext, ReactNode } from "react";

interface LayoutContextValue {
  globalLayoutEnabled: boolean;
}

const LayoutContext = createContext<LayoutContextValue>({
  globalLayoutEnabled: false,
});

export const LayoutProvider = ({
  children,
  globalLayoutEnabled = false,
}: {
  children: ReactNode;
  globalLayoutEnabled?: boolean;
}) => {
  return (
    <LayoutContext.Provider value={{ globalLayoutEnabled }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayoutContext = () => useContext(LayoutContext);
