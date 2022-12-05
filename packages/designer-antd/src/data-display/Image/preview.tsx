import { Image as AntdImage } from 'antd';
import { createBehavior, createResource } from '@designer/core';
import { DnFC, useNodeIdProps } from '@designer/react';
import { createVoidFieldSchema } from '../../components/Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
import { withContainer } from '../../common/Container';

export const Image: DnFC<React.ComponentProps<typeof AntdImage>> & {
  PreviewGroup: DnFC<React.ComponentProps<typeof AntdImage.PreviewGroup>>;
} = (props) => {
  const nodeId = useNodeIdProps();
  let style: any = {
    display: 'inline-block',
  };
  if (props.style) {
    const { position, width, height } = props.style;
    style = {
      ...style,
      position,
      width,
      height,
    };
  }
  return (
    <div {...nodeId} style={style}>
      <AntdImage {...props} />
    </div>
  );
};

Image.PreviewGroup = withContainer(AntdImage.PreviewGroup);

Image.Behavior = createBehavior(
  {
    name: 'Image',
    extends: ['Field'],
    selector: (node) => node.props?.['x-component'] === 'Image',
    designerProps: {
      propsSchema: createVoidFieldSchema(AllSchemas.Image),
    },
    designerLocales: AllLocales.Image,
  },
  {
    name: 'Image.PreviewGroup',
    extends: ['Field'],
    selector: (node) => node.props?.['x-component'] === 'Image.PreviewGroup',
    designerProps: {
      droppable: true,
      allowAppend: (_, sources) => {
        return sources.every((node) => node.props['x-component'] === 'Image');
      },
      propsSchema: createVoidFieldSchema(AllSchemas.Image.PreviewGroup),
    },
    designerLocales: AllLocales.Image.PreviewGroup,
  },
);

Image.Resource = createResource(
  {
    icon: 'Image',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'void',
          'x-component': 'Image',
          'x-component-props': {
            title: 'Title',
          },
        },
      },
    ],
  },
  {
    icon: 'Image',
    elements: [
      {
        componentName: 'Field',
        props: {
          type: 'void',
          'x-component': 'Image.PreviewGroup',
        },
      },
    ],
  },
);
