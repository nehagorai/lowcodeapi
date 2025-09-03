/**
 *
 * Asynchronously loads the component for CopyToClipboard
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
