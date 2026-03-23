type StatusModalAction = () => void | Promise<void>;

const actionRegistry = new Map<string, StatusModalAction>();

export const registerStatusModalAction = (
  actionKey: string,
  action: StatusModalAction
) => {
  actionRegistry.set(actionKey, action);
};

export const unregisterStatusModalAction = (actionKey: string) => {
  actionRegistry.delete(actionKey);
};

export const runStatusModalAction = async (actionKey: string | null) => {
  if (!actionKey) return;
  const action = actionRegistry.get(actionKey);
  if (!action) return;
  await action();
};
