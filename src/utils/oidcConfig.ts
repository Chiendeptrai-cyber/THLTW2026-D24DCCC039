// import { keycloakSecret } from './ip';
import { keycloakClientID } from './ip';
import { keycloakAuthority } from './ip';

export const oidcConfig = {
  authority: keycloakAuthority,
  client_id: keycloakClientID,
  // client_secret: keycloakSecret,
};
