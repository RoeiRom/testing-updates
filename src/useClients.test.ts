import {act} from 'react-dom/test-utils';
import {MockedResponse, wait} from "@apollo/react-testing";
import {ApolloClient, InMemoryCache, from} from 'apollo-boost';

import Client from './Client';
import useClients from './useClients';
import {ALL_CLIENTS} from './clientQuery';
import {testHooksWithDBMocks} from './TestHooks';
import {UseClientsOutcome} from './useClientsInterfaces';
import {DELETED_CLIENT_SUBSCRIPTION, NEW_CLIENT_SUBSCRIPTION, UPDATED_CLIENT_SUBSCRIPTION} from './clientSubsciption';

const defaultClientDBMock = {
    id: 1,
    name: 'test 1'
}

const mainClient = new ApolloClient({link: from([]), cache: new InMemoryCache()})

const dbMocks : MockedResponse[] = [
    {
        request: {
            query: ALL_CLIENTS
        },
        result: {
            data: {
                allClients: {
                    nodes: [
                        {
                            ...defaultClientDBMock
                        }, {
                            ...defaultClientDBMock,
                            id: 2
                        }
                    ]
                }
            }
        }
    }
]

describe('subscription tests', () => {

    let clients : Client[];
    let setClients = (newValue : Client[]) => {
        clients = newValue
    };
    let useClientsOutcome : UseClientsOutcome;

    beforeEach(async() => {
        clients = [];
        const wrapper = testHooksWithDBMocks(() => {
            // @ts-ignore
            useClientsOutcome = useClients({clients, setClients})
        }, dbMocks);

        await act(async() => {
            await wait(0);
            await wrapper.update();
        })
    });

    it('should render', () => {
        expect(clients).toStrictEqual([
            {
                id: 1,
                name: 'test 1'
            }, {
                id: 2,
                name: 'test 1'
            }
        ]);
    })

    it('should add new client', () => {
        act(() => {
            useClientsOutcome.onClientAdded({
                subscriptionData: {
                    data: {
                        listen: {
                            relatedNode: {
                                ...defaultClientDBMock,
                                id: 3
                            }
                        }
                    },
                    loading: false,
                    // @ts-ignore
                    client: mainClient
                }
            })
        });

        expect(clients.map(client => client.id)).toContain(3);
    });

    it('should delete client', () => {
        act(() => {
            useClientsOutcome.onClientDeleted({
                subscriptionData: {
                    data: {
                        deletedClient: {
                            id: 1
                        }
                    },
                    loading: false,
                    // @ts-ignore
                    client: mainClient
                }
            })
        });

        expect(clients.map(client => client.id))
            .not
            .toContain(1);
    });

    it('should change the selected client', () => {
        act(() => {
            useClientsOutcome.onClientChanged({
                subscriptionData: {
                    data: {
                        listen: {
                            relatedNode: {
                                ...defaultClientDBMock,
                                id: 2,
                                name: 'bla bla'
                            }
                        }
                    },
                    loading: false,
                    // @ts-ignore
                    client: mainClient
                }
            });
        });

        expect(clients.filter(client => client.id === 2)[0]).toStrictEqual({id: 2, name: 'bla bla'})
    })
})