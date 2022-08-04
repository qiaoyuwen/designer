import { Context, createContext } from 'react';
import { ISettingFormProps } from '../types';

export const SettingsFormContext: Context<ISettingFormProps> = createContext<ISettingFormProps>(null);
