import { MonacoInput } from '../../MonacoInput';
import { getNpmCDNRegistry } from '../../../registry';

export interface IDependency {
  name: string;
  path: string;
  extra?: string;
}

const loadDependencies = async (deps: IDependency[]) => {
  return Promise.all(
    deps.map(async ({ name, path, extra }) => ({
      name,
      path,
      library: await fetch(`${getNpmCDNRegistry()}/${path}`).then((res) => res.text()),
      extra,
    })),
  );
};

export const initDeclaration = async () => {
  return MonacoInput.loader.init().then(async (monaco) => {
    const deps = await loadDependencies([
      { name: '@formily/core', path: '@formily/core/dist/formily.core.all.d.ts' },
      {
        name: 'react',
        path: '@types/react/index.d.ts',
        extra: `
        export interface IReact {
          createElement: typeof React.createElement;
          Fragment: typeof React.Fragment;
        }
        `,
      },
    ]);
    deps?.forEach(({ name, library, extra }) => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        `declare module '${name}'{
        ${library}
        ${extra}
       }`,
        `file:///node_modules/${name}/index.d.ts`,
      );
    });
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
    import { IReact, ForwardRefExoticComponent } from 'react'
    import { Form, Field } from '@formily/core'

    interface IAntd {
      Button: ForwardRefExoticComponent<any>;
      Tag: ForwardRefExoticComponent<any>;
      message: {
        info(content: any, duration?: number, onClose?: () => void): () => void;
        success(content: any, duration?: number, onClose?: () => void): () => void;
        error(content: any, duration?: number, onClose?: () => void): () => void;
        warn(content: any, duration?: number, onClose?: () => void): () => void;
        warning(content: any, duration?: number, onClose?: () => void): () => void;
        loading(content: any, duration?: number, onClose?: () => void): () => void;
      };
    }

    interface IAntdIcon {
      UserOutlined: ForwardRefExoticComponent<any>;
      LockOutlined: ForwardRefExoticComponent<any>;
      MobileOutlined: ForwardRefExoticComponent<any>;
      SafetyOutlined: ForwardRefExoticComponent<any>;
    }

    interface IUmiHistory {
      push(path: string, state?: Record<string, any>): void;
      replace(path: string, state?: Record<string, any>): void;
      go(n: number): void;
      goBack(): void;
      goForward(): void;
    }

    declare global {
      declare var $React: IReact
      declare var $Antd: IAntd
      declare var $AntdIcon: IAntdIcon
      declare var $UmiHistory: IUmiHistory
      /*
       * Form Model
       **/
      declare var $form: Form
      /*
       * Form Values
       **/
      declare var $values: any
      /*
       * Field Model
       **/
      declare var $self: Field
      /*
       * create an persistent observable state object
       **/
      declare var $observable: <T>(target: T, deps?: any[]) => T
      /*
       * create a persistent data
       **/
      declare var $memo: <T>(callback: () => T, deps?: any[]) => T
      /*
       * handle side-effect logic
       **/
      declare var $effect: (callback: () => void | (() => void), deps?: any[]) => void
      /*
       * set initial component props to current field
       **/
      declare var $props: (props: any) => void
    }
    `,
      `file:///node_modules/formily_global.d.ts`,
    );
  });
};
