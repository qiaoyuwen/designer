import { Context, createContext } from 'react';
import { Engine } from '@designer/core';
import { IDesignerLayoutContext } from './types';

export const DesignerEngineContext: Context<Engine> = createContext<Engine>(null);

export const DesignerLayoutContext: Context<IDesignerLayoutContext> = createContext<IDesignerLayoutContext>(null);
