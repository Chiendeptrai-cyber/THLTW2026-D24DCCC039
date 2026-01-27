import { GuideContext } from '@/components/Guide/GuideContext';
import { useContext, useEffect } from 'react';
interface IProps {
  totalStep: number;
  show: boolean;
  handleEndGuiding: () => void;
}
const Background = (props: IProps) => {
  const { dataGuide, setDataGuide, setTotalStep, setShow, show } = useContext(GuideContext);
  useEffect(() => {
    setTotalStep(props.totalStep);
    setShow(props.show);
  }, [props.totalStep, props.show]);
  const handleNextStep = async () => {
    if (dataGuide) {
      if (dataGuide < props.totalStep) {
        let count = dataGuide;
        count++;
        setDataGuide(count);
      } else {
        setDataGuide(1);
        props.handleEndGuiding();
        setShow(false);
      }
    } else {
      setDataGuide(1);
    }
  };
  if (show) {
    return <div className="bg-training" onClick={() => handleNextStep()} />;
  } else return null;
};
export default Background;
