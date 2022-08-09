import { isPlainObj, isStr } from '@designer/utils';
import { GlobalRegistry } from '../registry';
import { IDesignerMiniLocales } from '../types';

const takeLocale = (message: string | IDesignerMiniLocales): string => {
  if (isStr(message)) return message;
  if (isPlainObj(message)) {
    const lang = GlobalRegistry.getDesignerLanguage();
    for (const key in message) {
      if (key.toLocaleLowerCase() === lang) return message[key];
    }
    return;
  }
  return message;
};

export const takeMessage = (token: any) => {
  if (!token) return;
  const message = isStr(token) ? GlobalRegistry.getDesignerMessage(token) : token;
  if (message) return takeLocale(message);
  return token;
};
