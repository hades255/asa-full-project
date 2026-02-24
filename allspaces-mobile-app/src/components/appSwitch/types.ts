export type T_APP_SWITCH = {
  value?: boolean;
  onValueChange?: ((value: boolean) => Promise<void> | void) | null | undefined;
  disabled?: boolean;
};
