import Base from './Base';

export default class UsersAPI extends Base {
    list(params) {
        return this.apiClient.get('quizwall/users', {}, params);
    }

    show(id, params) {
        return this.apiClient.get(`quizwall/users/${id}`, {}, params);
    }
}
