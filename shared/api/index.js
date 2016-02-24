import ApiClient      from './ApiClient';
import ActivationsAPI from './Activations';
import UsersAPI       from './Users';

export default function ({ apiPrefix } = {}) {
    if (!apiPrefix) {
        throw new Error('[apiPrefix] required');
    }

    const api = new ApiClient({ prefix: apiPrefix });

    return {
        activations : new ActivationsAPI({ apiClient: api }),
        users       : new UsersAPI({ apiClient: api })
    };
}
