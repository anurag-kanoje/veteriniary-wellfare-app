// Custom type declarations for React
import * as React from 'react';

declare global {
  namespace React {
    type ReactNode = React.ReactElement | string | number | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined;
    
    interface FunctionComponent<P = {}> {
      (props: P): ReactElement | null;
      propTypes?: any;
      defaultProps?: Partial<P>;
      displayName?: string;
    }
  }
}
