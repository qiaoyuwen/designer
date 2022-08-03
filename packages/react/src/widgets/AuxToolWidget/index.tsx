import { FunctionComponent, useEffect, useRef } from 'react';
import { useViewport, useDesigner, usePrefix } from '../../hooks';
import { Cover } from './Cover';
import { Selection } from './Selection';
import { DashedBox } from './DashedBox';
/* import { Insertion } from './Insertion';
import { FreeSelection } from './FreeSelection'
import { SpaceBlock } from './SpaceBlock'
import { SnapLine } from './SnapLine'
import { TransformBox } from './TransformBox' */
import './styles.less';

export const AuxToolWidget: FunctionComponent = () => {
  const engine = useDesigner();
  const viewport = useViewport();
  const prefix = usePrefix('auxtool');
  const ref = useRef<HTMLDivElement>();
  useEffect(() => {
    return engine.subscribeWith('viewport:scroll', () => {
      if (viewport.isIframe && ref.current) {
        ref.current.style.transform = `perspective(1px) translate3d(${-viewport.scrollX}px,${-viewport.scrollY}px,0)`;
      }
    });
  }, [engine, viewport]);

  if (!viewport) return null;

  return (
    <div ref={ref} className={prefix}>
      {
        <>
          <Cover />
          <Selection />
          <DashedBox />
        </>
        /*
          <Insertion />
          <SpaceBlock />
          <SnapLine />
          <TransformBox />
          <FreeSelection /> */
      }
    </div>
  );
};

AuxToolWidget.displayName = 'AuxToolWidget';
