import api from '../apiSingleton';

export const LOAD_ASSESSMENT_SYSTEM_SUCCESS = 'LOAD_ASSESSMENT_SYSTEM_SUCCESS';
export const LOAD_ASSESSMENT_SYSTEM_FAIL    = 'LOAD_ASSESSMENT_SYSTEM_FAIL';

export function loadAssessmentSystem(id) {
    return (dispatch) => {
        return api.assessmentSystems.show(
            id
        ).then((response) => {
            dispatch({
                type             : LOAD_ASSESSMENT_SYSTEM_SUCCESS,
                assessmentSystem : response.assessmentSystem
            });
        }).catch(error => {
            dispatch({
                type: LOAD_ASSESSMENT_SYSTEM_FAIL,
                error
            });
        });
    };
}
