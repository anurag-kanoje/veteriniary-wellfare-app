// Type declarations for @react-navigation packages
declare module '@react-navigation/native' {
  import * as React from 'react';
  
  export function useNavigation(): any;
  export function useRoute(): any;
  export function useFocusEffect(effect: () => void): void;
  export function useIsFocused(): boolean;
  export function NavigationContainer(props: { children: React.ReactNode }): JSX.Element;
  export const CommonActions: any;
  export const StackActions: any;
  export const DefaultTheme: any;
  export const DarkTheme: any;
  export const useTheme: () => any;
  export const useNavigationState: any;
  export const useLinkTo: () => (to: string) => void;
  export const useLinkProps: (props: { to: string }) => any;
  export const useScrollToTop: (ref: any) => void;
}

declare module '@react-navigation/stack' {
  import * as React from 'react';
  
  export function createStackNavigator(): {
    Navigator: React.ComponentType<any>;
    Screen: React.ComponentType<any>;
  };
  
  export const HeaderBackButton: React.ComponentType<any>;
  export const HeaderTitle: React.ComponentType<any>;
  export const Header: React.ComponentType<any>;
  export const TransitionPresets: any;
  export const CardStyleInterpolators: any;
  export const HeaderStyleInterpolators: any;
}

declare module '@react-navigation/bottom-tabs' {
  import * as React from 'react';
  
  export function createBottomTabNavigator(): {
    Navigator: React.ComponentType<any>;
    Screen: React.ComponentType<any>;
  };
  
  export const BottomTabBar: React.ComponentType<any>;
  export const BottomTabBarHeightContext: React.Context<number>;
  export const useBottomTabBarHeight: () => number;
}
