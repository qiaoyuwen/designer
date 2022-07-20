import { FunctionComponent } from 'react';
import { uid } from '@designer/utils';

const HomePage: FunctionComponent = () => {
  return <div>index page: {uid()}</div>;
};

export default HomePage;
