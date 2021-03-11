import React from 'react';
import { OnSubscriptionDataOptions } from 'react-apollo';

import Client from './Client';

type SubscriptionDataFunction = (data: OnSubscriptionDataOptions) => void;

export interface UseClientsIncome {
    clients: Client[];
    setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}

export interface UseClientsOutcome {
    onClientAdded: SubscriptionDataFunction;
    onClientChanged: SubscriptionDataFunction;
    onClientDeleted: SubscriptionDataFunction;
}