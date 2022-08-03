// TODO
/* import {
  DragDropDriver,
  MouseClickDriver,
  MouseMoveDriver,
  ViewportResizeDriver,
  ViewportScrollDriver,
  KeyboardDriver,
} from './drivers'
import {
  useCursorEffect,
  useViewportEffect,
  useDragDropEffect,
  useSelectionEffect,
  useKeyboardEffect,
  useAutoScrollEffect,
  useWorkspaceEffect,
  useFreeSelectionEffect,
  useContentEditableEffect,
  useTransformEffect,
} from './effects'
import {
  SelectNodes,
  SelectAllNodes,
  SelectSameTypeNodes,
  DeleteNodes,
  CopyNodes,
  PasteNodes,
  UndoMutation,
  RedoMutation,
  CursorSwitchSelection,
  PreventCommandX,
  SelectPrevNode,
  SelectNextNode,
} from './shortcuts' */

import { MouseMoveDriver, DragDropDriver, MouseClickDriver, KeyboardDriver } from './drivers';
import { useCursorEffect, useDragDropEffect, useKeyboardEffect, useSelectionEffect } from './effects';

export const DEFAULT_EFFECTS = [
  useCursorEffect,
  useDragDropEffect,
  useSelectionEffect,
  useKeyboardEffect,
  // useFreeSelectionEffect,
  // useViewportEffect,
  // useAutoScrollEffect,
  // useWorkspaceEffect,
  // useContentEditableEffect,
  // useTransformEffect,
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
