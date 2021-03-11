import React from 'react';

import Client from './Client';
import useClients from './useClients';

const App = () => {

  const [clients, setClients] = React.useState<Client[]>([]);

  useClients({ clients, setClients });

  return (
    <div className="App">
      {
        clients.map(client => (
          <>{client.id} {client.name}</>
        ))
      }
    </div>
  );
}

export default App;
