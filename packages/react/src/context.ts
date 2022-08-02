import { Context, createContext } from 'react';
import { Engine, TreeNode } from '@designer/core';
import { IDesignerComponents, IDesignerLayoutContext, IWorkspaceContext } from './types';

export const DesignerComponentsContext: Context<IDesignerComponents> = createContext<IDesignerComponents>({});

export const DesignerEngineContext: Context<Engine> = createContext<Engine>(null);

export const DesignerLayoutContext: Context<IDesignerLayoutContext> = createContext<IDesignerLayoutContext>(null);

export const TreeNodeContext: Context<TreeNode> = createContext<TreeNode>(null);

export const WorkspaceContext: Context<IWorkspaceContext> = createContext<IWorkspaceContext>(null);
