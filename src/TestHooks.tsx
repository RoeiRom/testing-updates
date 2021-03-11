import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { MockedProvider, MockedResponse } from '@apollo/react-testing';

const TestHooksComponent = ({ callback }: any): null => {
    callback();
    return null;
}

export const testHooksWithDBMocks = (callback: any, mocks: MockedResponse[]): ReactWrapper => (
    mount(
        <MockedProvider mocks={mocks} addTypename={false}>
            <TestHooksComponent callback={callback} />
        </MockedProvider>
    )
)