import { Fragment, FunctionComponent, PropsWithChildren } from 'react';
import { takeMessage, IDesignerMiniLocales } from '@designer/core';
import { observer } from '@formily/reactive-react';

export interface ITextWidgetProps {
  componentName?: string;
  sourceName?: string;
  token?: string | IDesignerMiniLocales;
  defaultMessage?: string | IDesignerMiniLocales;
}

export const TextWidget: FunctionComponent<PropsWithChildren<ITextWidgetProps>> = observer((props) => {
  return (
    <Fragment>{takeMessage(props.children) || takeMessage(props.token) || takeMessage(props.defaultMessage)}</Fragment>
  );
});
