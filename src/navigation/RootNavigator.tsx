import React from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState }  from '../store/store';
import { useAuth }    from '../core/auth/useAuth';
import { AuthStack }             from './stacks/AuthStack';
import { DrawerNavigator }       from './drawer/DrawerNavigator';
import { LockScreen }            from '../screens/LockScreen';
import { SecurityBlockedScreen } from '../screens/SecurityBlockedScreen';


export type RootStackParamList = {
  Auth:            undefined;
  Main:            undefined;
  LockScreen:      undefined;
  SecurityBlocked: { failures: string[] };
};

const Root = createNativeStackNavigator<RootStackParamList>();

interface RootNavigatorProps {}

export const RootNavigator = React.forwardRef<
  NavigationContainerRef<RootStackParamList>,
  RootNavigatorProps
>((_, ref) => {
  const { isAuthenticated } = useAuth();
  const locked             = useSelector((s: RootState) => s.session.locked);
  const securityBlocked    = useSelector((s: RootState) => s.session.securityBlocked);
  const securityFailures   = useSelector((s: RootState) => s.session.securityFailures);

  return (
    <NavigationContainer ref={ref}>
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
