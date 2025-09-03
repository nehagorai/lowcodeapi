/**
 *
 * Asynchronously loads the component for Tabs
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
