import React, { useRef } from 'react';
import { NavigationContainer, NavigationContainerRef, NavigationState } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState }  from '../store/store';
import { useAuth }    from '../core/auth/useAuth';
import { AuthStack }             from './stacks/AuthStack';
import { DrawerNavigator }       from './drawer/DrawerNavigator';
import { LockScreen }            from '../screens/LockScreen';
import { SecurityBlockedScreen } from '../screens/SecurityBlockedScreen';
import { runWithLoader } from '../ui-kit/components/loaders/loaderService';


export type RootStackParamList = {
  Auth:            undefined;
  Main:            undefined;
  LockScreen:      undefined;
  SecurityBlocked: { failures: string[] };
};

const Root = createNativeStackNavigator<RootStackParamList>();

function getActiveRouteName(state: NavigationState | undefined): string | undefined {
  if (!state) {
    return undefined;
  }

  const route = state.routes[state.index ?? 0];
  if (route?.state) {
    return getActiveRouteName(route.state as NavigationState);
  }

  return route?.name;
}

interface RootNavigatorProps {}

export const RootNavigator = React.forwardRef<
  NavigationContainerRef<RootStackParamList>,
  RootNavigatorProps
>((_, ref) => {
  const { isAuthenticated } = useAuth();
  const locked             = useSelector((s: RootState) => s.session.locked);
  const securityBlocked    = useSelector((s: RootState) => s.session.securityBlocked);
  const securityFailures   = useSelector((s: RootState) => s.session.securityFailures);
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList> | null>(null);
  const routeNameRef = useRef<string | undefined>(undefined);

  return (
    <NavigationContainer
      ref={node => {
        navigationRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      onReady={() => {
        routeNameRef.current = getActiveRouteName(navigationRef.current?.getRootState());
      }}
      onStateChange={() => {
        const nextRoute = getActiveRouteName(navigationRef.current?.getRootState());
        if (!nextRoute || nextRoute === routeNameRef.current) {
          return;
        }
        routeNameRef.current = nextRoute;
        void runWithLoader(() => undefined, 500);
      }}
    >
      <Root.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>

        {/* Priority 1 — Security blocked */}
        {securityBlocked ? (
          <Root.Screen
            name="SecurityBlocked"
            component={SecurityBlockedScreen}
            initialParams={{ failures: securityFailures }}
            options={{ animation: 'fade', gestureEnabled: false }}
          />

        ) : locked ? (
          /* Priority 2 — Session locked */
          <Root.Screen name="LockScreen" component={LockScreen} />

        ) : isAuthenticated ? (
          /* Priority 3 — Authenticated */
          <Root.Screen name="Main" component={DrawerNavigator} />

        ) : (
          /* Priority 4 — Login */
          <Root.Screen name="Auth" component={AuthStack} />
        )}

      </Root.Navigator>
    </NavigationContainer>
  );
});

RootNavigator.displayName = 'RootNavigator';
