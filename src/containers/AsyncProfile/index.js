import { asyncComponent } from 'react-async-component';

export default asyncComponent({
  resolve: () => import(
    /* webpackChunkName: "profile-page" */
    './ProfilePage'
  )
});
