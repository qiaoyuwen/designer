import { Engine } from './Engine';
import { Workspace, IWorkspaceProps } from './Workspace';
import { observable, define, action } from '@formily/reactive';
import { AddWorkspaceEvent, RemoveWorkspaceEvent, SwitchWorkspaceEvent } from '../events';
import { IEngineContext, WorkbenchTypes } from '../types';
export class Workbench {
  public workspaces: Workspace[];

  public currentWorkspace: Workspace;

  public activeWorkspace: Workspace;

  public engine: Engine;

  public type: WorkbenchTypes = 'DESIGNABLE';

  public constructor(engine: Engine) {
    this.engine = engine;
    this.workspaces = [];
    this.currentWorkspace = null;
    this.activeWorkspace = null;
    this.makeObservable();
  }

  public makeObservable() {
    define(this, {
      currentWorkspace: observable.ref,
      workspaces: observable.shallow,
      activeWorkspace: observable.ref,
      type: observable.ref,
      switchWorkspace: action,
      addWorkspace: action,
      removeWorkspace: action,
      setActiveWorkspace: action,
      setWorkbenchType: action,
    });
  }

  public getEventContext(): IEngineContext {
    return {
      engine: this.engine,
      workbench: this.engine.workbench,
      workspace: null,
      viewport: null,
    };
  }

  public switchWorkspace(id: string) {
    const finded = this.findWorkspaceById(id);
    if (finded) {
      this.currentWorkspace = finded;
      this.engine.dispatch(new SwitchWorkspaceEvent(finded));
    }
    return this.currentWorkspace;
  }

  public setActiveWorkspace(workspace: Workspace) {
    this.activeWorkspace = workspace;
    return workspace;
  }

  public setWorkbenchType(type: WorkbenchTypes) {
    this.type = type;
  }

  public addWorkspace(props: IWorkspaceProps) {
    const finded = this.findWorkspaceById(props.id);
    if (!finded) {
      this.currentWorkspace = new Workspace(this.engine, props);
      this.workspaces.push(this.currentWorkspace);
      this.engine.dispatch(new AddWorkspaceEvent(this.currentWorkspace));
      return this.currentWorkspace;
    }
    return finded;
  }

  public removeWorkspace(id: string) {
    const findIndex = this.findWorkspaceIndexById(id);
    if (findIndex > -1 && findIndex < this.workspaces.length) {
      const findedWorkspace = this.workspaces[findIndex];
      findedWorkspace.viewport.detachEvents();
      this.workspaces.splice(findIndex, 1);
      if (findedWorkspace === this.currentWorkspace) {
        if (this.workspaces.length && this.workspaces[findIndex]) {
          this.currentWorkspace = this.workspaces[findIndex];
        } else {
          this.currentWorkspace = this.workspaces[this.workspaces.length - 1];
        }
      }
      this.engine.dispatch(new RemoveWorkspaceEvent(findedWorkspace));
    }
  }

  public ensureWorkspace(props: IWorkspaceProps = {}) {
    const workspace = this.findWorkspaceById(props.id);
    if (workspace) return workspace;
    this.addWorkspace(props);
    return this.currentWorkspace;
  }

  public findWorkspaceById(id: string) {
    return this.workspaces.find((item) => item.id === id);
  }

  public findWorkspaceIndexById(id: string) {
    return this.workspaces.findIndex((item) => item.id === id);
  }

  public mapWorkspace<T>(callbackFn: (value: Workspace, index: number) => T): T[] {
    return this.workspaces.map(callbackFn);
  }

  public eachWorkspace<T>(callbackFn: (value: Workspace, index: number) => T) {
    this.workspaces.forEach(callbackFn);
  }
}
