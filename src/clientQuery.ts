import { gql } from 'apollo-boost';

export const ALL_CLIENTS = gql`
query allClients {
    allClients {
        nodes {
            id
            name
        }
    }
}
`