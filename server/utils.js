'use strict';
import Promise from 'bluebird';

export function fetchComponentsData(dispatch, components, params, query) {
    const promises = components.map(current => {
        const component = current.WrappedComponent ? current.WrappedComponent : current;
        return component.fetchData
            ? component.fetchData(dispatch, params, query)
            : null;
    });

    return Promise.all(promises);
}

export function getOGDataFromState(route, state) {
    console.log(route, state);

    return {
        title : 'Vivamus aliquet elit ac nisl',
        image : 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRpiqzxnmi6UvHXQmo8NHV5sfB9kQ1eJRxQHKtXCX5qxwRvkiIlet07uI4',
        description : 'Vivamus aliquet elit ac nisl Vivamus aliquet elit ac nisl Vivamus aliquet elit ac nisl'
    };
}
