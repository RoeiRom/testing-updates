import { gql } from 'apollo-boost';

export const NEW_CLIENT_SUBSCRIPTION = gql`
subscription newClientSubscription {
    listen(topic: "new_client") {
        relatedNode: {
            ... on Client {
                id
                name
            }
        }
    }
}
`;

export const UPDATED_CLIENT_SUBSCRIPTION = gql`
subscription newClientSubscription {
    listen(topic: "change_client") {
        relatedNode: {
            ... on Client {
                id
                name
            }
        }
    }
}
`;

export const DELETED_CLIENT_SUBSCRIPTION = gql`
subscription DeletedClientSubscription {
    deletedClient {
        id
    }
}
`;