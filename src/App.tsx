/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppRouter } from "./app/router";
import { AlertContainer } from "./shared/components/ui/Alert";

export default function App() {
  return (
    <>
      <AppRouter />
      <AlertContainer />
    </>
  );
}
