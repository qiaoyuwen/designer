import useMergedState from 'rc-util/lib/hooks/useMergedState';

type Dispatch<A> = (value: A) => void;

export const useMountMergeState = <S>(
  initialState: S | (() => S),
  option?: {
    defaultValue?: S;
    value?: S;
    onChange?: (value: S, prevValue: S) => void;
    postState?: (value: S) => S;
  },
): [S, Dispatch<S>] => {
  const [state, setState] = useMergedState<S>(initialState, option);
  return [state, setState];
};
