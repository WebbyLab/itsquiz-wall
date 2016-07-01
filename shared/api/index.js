import ApiClient            from './ApiClient';
import ActivationsAPI       from './Activations';
import UsersAPI             from './Users';
import AssessmentSystemsAPI from './AssessmentSystems';

export default function ({ apiPrefix } = {}) {
    if (!apiPrefix) {
        throw new Error('[apiPrefix] required');
    }

    const api = new ApiClient({ prefix: apiPrefix });

    return {
        apiClient         : api,
        activations       : new ActivationsAPI({ apiClient: api }),
        users             : new UsersAPI({ apiClient: api }),
        assessmentSystems : new AssessmentSystemsAPI({ apiClient: api })
    };
}
