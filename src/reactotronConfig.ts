import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  Reactotron
    .configure({
      name: 'MF-React-Prod_v6',
      port: 9090,
    })
    .useReactNative()
    .connect();

  Reactotron.clear();

  (global as any).tron = Reactotron;
  (console as any).tron = Reactotron;
}