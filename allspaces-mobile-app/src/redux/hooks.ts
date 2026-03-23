import { useAppStateContext } from "./provider";
import { RootState } from "./store";

export const useDispatch = () => {
  const { dispatch } = useAppStateContext();
  return dispatch;
};

export const useSelector = <TSelected,>(
  selector: (state: RootState) => TSelected
) => {
  const { state } = useAppStateContext();
  return selector(state);
};
