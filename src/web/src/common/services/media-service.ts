export enum ScreenSize {
  ExtraSmall = "xs",
  Small = "sm",
  Medium = "md",
  Large = "lg",
  ExtraLarge = "xl"
}

export type ScreenResizeEventListener = (size: ScreenSize) => void;

export class MediaService {
  private _listeners: ScreenResizeEventListener[] = [];
  private _mediaQueries: MediaQueryList[] = [];
  public screenSize: ScreenSize = ScreenSize.ExtraLarge;
  private readonly _screenSizes = {
    "(max-width: 639px)": ScreenSize.ExtraSmall,
    "(max-width: 767px) and (min-width: 640px)": ScreenSize.Small,
    "(max-width: 1023px) and (min-width: 768px)": ScreenSize.Medium,
    "(max-width: 1279px) and (min-width: 1024px)": ScreenSize.Large,
    "(min-width: 1280px)": ScreenSize.ExtraLarge
  };
  private onChange(mediaQuery: MediaQueryListEvent) {
    if (mediaQuery.matches) {
      this.screenSize = this._screenSizes[mediaQuery.media];
      for (let index = 0; index < this._listeners.length; index++) {
        const listener = this._listeners[index];
        listener(this.screenSize);
      }
    }
  }
  public initialize(): void {
    for (const query in this._screenSizes) {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.onchange = e => this.onChange(e);
      this._mediaQueries.push(mediaQuery);
    }
  }
  public constructor() {
    this.initialize();
  }
  public addChangedLister(listener: ScreenResizeEventListener): void {
    if (this._listeners.indexOf(listener, 0) === -1) {
      this._listeners.push(listener);
    }
  }
  public removeChangedListener(listener: ScreenResizeEventListener): void {
    for (let index = 0; index < this._listeners.length; index++) {
      if (this._listeners[index] === listener) {
        this._listeners.splice(index, 1);
      }
    }
  }
}
