import React, { createContext, useState } from 'react';
interface PropsType {
  children: React.ReactNode;
}
export interface GuideContextType {
  dataGuide?: number;
  setDataGuide: (item: number) => void;
  totalStep?: number;
  setTotalStep: (item: number) => void;
  show?: boolean;
  setShow: (item: boolean) => void;
}
const defaultValue: GuideContextType = {
  setDataGuide: () => null,
  setTotalStep: () => null,
  setShow: () => null,
};
export const GuideContext = createContext<GuideContextType>(defaultValue);

const GuideProvider: React.FC<PropsType> = (props: PropsType) => {
  const [dataGuide, setDataGuide] = useState<number>(1);
  const [totalStep, setTotalStep] = useState<number>(0);
  const [show, setShow] = useState<boolean>(false);
  return (
    <GuideContext.Provider
      value={{
        dataGuide,
        setDataGuide,
        totalStep,
        setTotalStep,
        show,
        setShow,
      }}
    >
      {props.children}
    </GuideContext.Provider>
  );
};
export default GuideProvider;
