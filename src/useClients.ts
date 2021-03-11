import { OnSubscriptionDataOptions, useQuery, useSubscription } from 'react-apollo';

import { ALL_CLIENTS } from './clientQuery';
import { DELETED_CLIENT_SUBSCRIPTION, NEW_CLIENT_SUBSCRIPTION, UPDATED_CLIENT_SUBSCRIPTION } from './clientSubsciption';
import { UseClientsIncome, UseClientsOutcome } from './useClientsInterfaces';

const useClients = ({ clients, setClients }: UseClientsIncome): UseClientsOutcome => {
    useQuery(ALL_CLIENTS, {
        fetchPolicy: 'cache-and-network',
        onCompleted: (data) => {
            setClients(data.allClients.nodes);
        }
    });

    const onClientAdded = (data: OnSubscriptionDataOptions) => {
        setClients([...clients, data.subscriptionData.data.listen.relatedNode]);
    }

    const onClientDeleted = (data: OnSubscriptionDataOptions) => {
        setClients(clients.filter(client => client.id !== data.subscriptionData.data.deletedClient.id));
    }

    const onClientChanged = (data: OnSubscriptionDataOptions) => {
        const changedClient = data.subscriptionData.data.listen.relatedNode;
        setClients(clients.map(client => client.id === changedClient.id ? changedClient : client));
    }

    useSubscription(NEW_CLIENT_SUBSCRIPTION, {
        onSubscriptionData: onClientAdded
    });

    useSubscription(UPDATED_CLIENT_SUBSCRIPTION, {
        onSubscriptionData: onClientChanged
    });

    useSubscription(DELETED_CLIENT_SUBSCRIPTION, {
        onSubscriptionData: onClientDeleted
    })

    return {
        onClientAdded,
        onClientChanged,
        onClientDeleted
    }
};

export default useClients;