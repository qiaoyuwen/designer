import { createContext } from 'react';
import { Engine } from '@designer/core';
import { IDesignerLayoutContext } from './types';

export const DesignerEngineContext = createContext<Engine>(null);

export const DesignerLayoutContext = createContext<IDesignerLayoutContext>(null);
