/**
 *
 * Asynchronously loads the component for BadgeUI
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
