import Background from '@/components/Guide/Background';
import GuideProvider from '@/components/Guide/GuideContext';
import React from 'react';
import './index.less';
interface IProps {
  children: React.ReactNode;
  totalStep: number;
  show: boolean;
  endGuiding: () => void;
}
const Guide = (props: IProps) => {
  return (
    <GuideProvider>
      <div>
        <Background
          show={props.show}
          totalStep={props.totalStep}
          handleEndGuiding={() => props.endGuiding()}
        />
        {props.children}
      </div>
    </GuideProvider>
  );
};
export default Guide;
