import { Event, globalThisPolyfill, uid } from '@designer/utils';
import { EngineMountEvent } from '../events/engine/EngineMountEvent';
import { EngineUnmountEvent } from '../events/engine/EngineUnmountEvent';
import { IEngineProps } from '../types';
import { Cursor } from './cursor';

/**
 * 设计器引擎
 */
export class Engine extends Event {
  public id: string;

  public props: IEngineProps<Engine>;

  public cursor: Cursor;

  public static defaultProps: IEngineProps<Engine> = {
    // shortcuts: [],
    effects: [],
    drivers: [],
    rootComponentName: 'Root',
    sourceIdAttrName: 'data-designer-source-id',
    nodeIdAttrName: 'data-designer-node-id',
    contentEditableAttrName: 'data-content-editable',
    contentEditableNodeIdAttrName: 'data-content-editable-node-id',
    clickStopPropagationAttrName: 'data-click-stop-propagation',
    nodeSelectionIdAttrName: 'data-designer-node-helpers-id',
    nodeDragHandlerAttrName: 'data-designer-node-drag-handler',
    screenResizeHandlerAttrName: 'data-designer-screen-resize-handler',
    nodeResizeHandlerAttrName: 'data-designer-node-resize-handler',
    nodeRotateHandlerAttrName: 'data-designer-node-rotate-handler',
    outlineNodeIdAttrName: 'data-designer-outline-node-id',
    nodeTranslateAttrName: 'data-designer-node-translate-handler',
    // defaultScreenType: ScreenType.PC,
  };

  public constructor(props: IEngineProps<Engine>) {
    super(props);
    this.props = {
      ...Engine.defaultProps,
      ...props,
    };
    this.init();
    this.id = uid();
  }

  public init() {
    this.cursor = new Cursor(this);
  }

  public findMovingNodes() /*:  TreeNode[] */ {
    const results = [];
    // TODO
    /* this.workbench.eachWorkspace((workspace) => {
      workspace.operation.moveHelper.dragNodes?.forEach((node) => {
        if (!results.includes(node)) {
          results.push(node)
        }
      })
    }) */
    return results;
  }

  public mount() {
    this.attachEvents(globalThisPolyfill);
    this.dispatch(new EngineMountEvent(this), this);
  }

  public unmount() {
    this.dispatch(new EngineUnmountEvent(this), this);
    this.detachEvents();
  }
}
