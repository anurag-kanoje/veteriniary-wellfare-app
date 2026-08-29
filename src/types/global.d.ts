// Temporary type declarations to work around npm installation issues
declare module 'react' {
  export = React;
  export as namespace React;

  // Basic types
  type Key = string | number | null | undefined;
  type JSXElementConstructor<P> = (props: P) => ReactElement<any, any> | null;
  type ReactText = string | number;
  type ReactChild = ReactElement | ReactText;
  type ReactFragment = {} | Iterable<ReactNode>;
  interface ReactPortal extends ReactElement {
    key: Key | null;
    children: ReactNode;
  }

  // ReactElement
  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }

  // ReactNode
  type ReactNode = ReactElement | string | number | ReactFragment | ReactPortal | boolean | null | undefined;
  
  // FunctionComponent
  interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactElement<any, any> | null;
    propTypes?: any;
    contextTypes?: any;
    defaultProps?: Partial<P>;
    displayName?: string;
  }

  // Component
  interface Component<P = {}, S = {}> {
    props: P;
    state: S;
    context: any;
    refs: {
      [key: string]: Component<any, any> | Element;
    };
  }

  // Hooks
  function useState<S>(initialState: S | (() => S)): [S, (newState: S | ((prevState: S) => S)) => void];
  function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T;
  function useMemo<T>(factory: () => T, deps: readonly any[] | undefined): T;
  function useContext<T>(context: React.Context<T>): T;
  function createContext<T>(defaultValue: T): React.Context<T>;
  function createRef<T = Element>(): { current: T | null };
  function forwardRef<T, P = {}>(render: (props: P, ref: React.Ref<T>) => React.ReactNode): (props: P & React.RefAttributes<T>) => React.ReactNode;

  // React types
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    // Standard HTML Attributes
    className?: string;
    id?: string;
    style?: any;
    [key: string]: any;
  }

  interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }

  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    alt?: string;
    src?: string;
    srcSet?: string;
    sizes?: string;
    width?: number | string;
    height?: number | string;
  }

  interface DOMAttributes<T> {
    children?: ReactNode;
    dangerouslySetInnerHTML?: {
      __html: string;
    };
  }

  // React.PropsWithChildren
  type PropsWithChildren<P = unknown> = P & { children?: ReactNode };

  // React.ReactElement
  type ReactElement = any;

  // React.ComponentType
  type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;

  // React.ComponentClass
  interface ComponentClass<P = {}, S = any> {
    new (props: P, context?: any): Component<P, S>;
    propTypes?: any;
    contextTypes?: any;
    childContextTypes?: any;
    defaultProps?: Partial<P>;
    displayName?: string;
  }

  // React.RefObject
  interface RefObject<T> {
    readonly current: T | null;
  }

  // React.MutableRefObject
  interface MutableRefObject<T> {
    current: T;
  }

  // React.Ref
  type Ref<T> = RefCallback<T> | RefObject<T> | null;
  
  // React.RefCallback
  interface RefCallback<T> {
    (instance: T | null): void;
  }

  // React.PropsWithRef
  type PropsWithRef<P> = P extends React.RefAttributes<infer T>
    ? P & { ref?: React.Ref<T> }
    : P & { ref?: React.Ref<unknown> };
}

declare module 'react-router-dom' {
  export interface RouteProps {
    path?: string;
    element?: React.ReactNode;
    children?: React.ReactNode;
  }

  export function Routes({ children }: { children: React.ReactNode }): JSX.Element;
  export function Route(props: RouteProps): JSX.Element;
  export function Navigate({ to, replace, state }: { to: string; replace?: boolean; state?: any }): JSX.Element;
  export function Outlet(): JSX.Element;
  export function useNavigate(): (to: string, options?: { replace?: boolean; state?: any }) => void;
  export function useLocation(): { pathname: string; search: string; hash: string; state: any; key: string };
  export function useParams(): { [key: string]: string | undefined };
  export function Link({ to, children, ...props }: { to: string; children: React.ReactNode; [key: string]: any }): JSX.Element;
}

// Declare the JSX namespace for React
declare namespace JSX {
  // Allow HTML elements in JSX
  interface IntrinsicElements {
    [elemName: string]: any;
    
    // Common HTML elements
    div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
    span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
    button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
    input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
    img: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
    a: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
    form: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
    label: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
    select: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
    option: React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
    textarea: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
    ul: React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
    ol: React.DetailedHTMLProps<React.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>;
    li: React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
    h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    h4: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    h5: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    h6: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
    p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
    nav: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    header: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    footer: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    main: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    section: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    article: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    aside: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
  
  // JSX Element
  interface Element extends React.ReactElement<any, any> {}

  // Element class (for class components)
  interface ElementClass extends React.Component<any> {
    render(): React.ReactNode;
  }

  // Element attributes property
  interface ElementAttributesProperty {
    props: {};
  }

  // Element children attribute
  interface ElementChildrenAttribute {
    children: {};
  }

  // Intrinsic attributes (props that can be passed to any component)
  interface IntrinsicAttributes extends React.Attributes {}
  
  // Intrinsic class attributes (for class components)
  interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> {}
}
