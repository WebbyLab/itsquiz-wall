'use strict';
import Promise from 'bluebird';

export default function fetchComponentData(dispatch, components, params, query) {
    const promises = components.map(current => {
        const component = current.WrappedComponent ? current.WrappedComponent : current;
        return component.fetchData
            ? component.fetchData(dispatch, params, query)
            : null;
    });

    return Promise.all(promises);
}
