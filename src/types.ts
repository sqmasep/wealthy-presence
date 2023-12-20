export interface Preset {
  title?: string;
  description?: string;

  largeImage?: string;
  smallImage?: string;

  buttons?: [Button] | [Button, Button];
}

interface Button {
  url: string;
  label: string;
}
