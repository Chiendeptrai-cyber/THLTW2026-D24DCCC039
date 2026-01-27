import { GuideContext } from '@/components/Guide/GuideContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
interface IProps {
  children: React.ReactNode;
  stepActive: number;
  titleGuide: React.ReactNode | string;
  arrow?: 'top' | 'right' | 'left' | 'bottom';
}
const GuideItem = (props: IProps) => {
  const { dataGuide, show } = useContext(GuideContext);
  const contentRef = useRef<HTMLDivElement>(null);
  const [heightDiv, setHeightDiv] = useState<number>();
  const [widthDiv, setWidthDiv] = useState<number>();
  useEffect(() => {
    if (contentRef.current) {
      const node = contentRef.current;
      if (node) {
        setHeightDiv(+node.offsetHeight / 2);
        setWidthDiv(+node.offsetWidth);
        console.log(widthDiv);
      }
    }
  }, [contentRef, dataGuide]);
  if (show) {
    return (
      <div className={`guide-item ${dataGuide === props.stepActive ? 'z-101' : ''}`}>
        <div key={heightDiv}>
          <div
            id={'content-guide'}
            className={`content-guide content-top
        ${dataGuide === props.stepActive ? '' : 'd-none'}`}
            style={{
              top: `calc(-${heightDiv}px)`,
              left: `${props.arrow === 'right' ? `calc(${widthDiv}px + 12px)` : '0'}`,
            }}
          >
            <div className={`content-guide-box-${props.arrow ? props.arrow : 'top'}`}>
              {props.titleGuide}
            </div>
          </div>
        </div>
        <div ref={contentRef}>{props.children}</div>
      </div>
    );
  } else {
    return <>{props.children}</>;
  }
};
export default GuideItem;
