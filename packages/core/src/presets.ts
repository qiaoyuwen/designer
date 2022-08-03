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

import { MouseMoveDriver } from './drivers';
import { DragDropDriver } from './drivers/DragDropDriver';
import { MouseClickDriver } from './drivers/MouseClickDriver';
import { useCursorEffect, useDragDropEffect, useSelectionEffect } from './effects';

export const DEFAULT_EFFECTS = [
  useCursorEffect,
  useDragDropEffect,
  useSelectionEffect,
  // useFreeSelectionEffect,
  // useViewportEffect,
  // useKeyboardEffect,
  // useAutoScrollEffect,
  // useWorkspaceEffect,
  // useContentEditableEffect,
  // useTransformEffect,
];

export const DEFAULT_DRIVERS = [
  MouseMoveDriver,
  DragDropDriver,
  MouseClickDriver,
  /* ViewportResizeDriver,
  ViewportScrollDriver,
  KeyboardDriver, */
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
