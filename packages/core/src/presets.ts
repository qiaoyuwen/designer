import { MouseMoveDriver, DragDropDriver, MouseClickDriver, KeyboardDriver } from './drivers';
import {
  useCursorEffect,
  useDragDropEffect,
  useKeyboardEffect,
  useSelectionEffect,
  useTransformEffect,
  useWorkspaceEffect,
  useContentEditableEffect,
} from './effects';

export const DEFAULT_EFFECTS = [
  useCursorEffect,
  useDragDropEffect,
  useSelectionEffect,
  useKeyboardEffect,
  useTransformEffect,
  // useFreeSelectionEffect,
  // useViewportEffect,
  // useAutoScrollEffect,
  useWorkspaceEffect,
  useContentEditableEffect,
];

export const DEFAULT_DRIVERS = [
  MouseMoveDriver,
  DragDropDriver,
  MouseClickDriver,
  KeyboardDriver,
  /* ViewportResizeDriver,
  ViewportScrollDriver, */
];

export const DEFAULT_SHORTCUTS = [
  /* PreventCommandX,
  SelectNodes,
  SelectAllNodes,
  SelectSameTypeNodes,
  DeleteNodes,
  CopyNodes,
  PasteNodes,
  SelectPrevNode,
  SelectNextNode,
  UndoMutation,
  RedoMutation,
  CursorSwitchSelection, */
];
