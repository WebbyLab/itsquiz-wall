import { backgroundImagesPrefix } from '../config';

const NUMBER_OF_BACKGROUNDS = 12;

export default {
    formatActivation(activation, author) {
        return {
            id                   : activation.id,
            name                 : activation.name,
            linkToPass           : activation.linkToPass,
            publicLink           : activation.publicLink,
            actionId             : activation.links ? activation.links.action.id : '',
            numberOfQuestions    : activation.numberOfQuestions,
            numberOfUsersPassed  : activation.numberOfPeople,
            dueTime              : activation.dueTime,
            message              : activation.message,
            isSponsored          : activation.isSponsored,
            isPrivate            : activation.isPublic === false,
            isPassed             : activation.assigneeQuizSession && activation.assigneeQuizSession.finishedAt,
            userQuizSession      : this.formatUserQuizSession(activation.assigneeQuizSession),
            pictureURL           : activation.pictureURL,
            backgroundURL        : activation.backgroundURL || this._getBackgpoundURLById(activation.id),
            tags                 : activation.tags,
            timeToPass           : activation.timeToPass,
            author               : author ? this.formatUserInfo(author) : {}
        };
    },

    formatUserInfo(user) {
        return {
            id          : user.id,
            isTrusted   : user.isTrusted,
            type        : user.type,
            fullName    : this._getUserFullName(user),
            avatar      : user.image
        };
    },

    formatAuthorProfileData(user) {
        return {
            id          : user.id,
            country     : user.country,
            city        : user.city,
            industry    : user.industry,
            isTrusted   : user.isTrusted,
            type        : user.type,
            firstName   : user.firstName,
            secondName  : user.secondName,
            lastName    : user.lastName,
            companyName : user.companyName,
            pictureURL  : user.image
        };
    },

    formatUserQuizSession(session) {
        if (!session || !session.createdAt) {
            return null;
        }

        const gainedPoints = Math.ceil(+session.gainedPoints * 100) / 100 || 0;
        const userScore = Math.ceil(+gainedPoints * 100 / +session.maxPoints);

        return {
            canViewAnswers : session.canAssigneeViewQuestions,
            startedAt      : session.startedAt,
            finishedAt     : session.finishedAt,
            score          : userScore,
            gainedPoints   : gainedPoints,
            maxPoints      : session.maxPoints,
            status         : session.status,
            id             : session.id,
            grade          : this._getResultGrade(userScore)
        };
    },

    _getUserFullName(user) {
        return user.type === 'COMPANY' ? user.companyName : `${user.firstName} ${user.secondName}`;
    },

    _getResultGrade(score) {
        if (score > 95) {
            return 'excellent';
        }

        if (score > 75) {
            return 'good';
        }

        if (score > 50) {
            return 'normal';
        }

        if (score > 30) {
            return 'bad';
        }

        return 'verybad';
    },

    _getBackgpoundURLById(id) {
        const number = parseInt(id, 16);
        const backgroundNumber = number % NUMBER_OF_BACKGROUNDS + 1;
        return `${backgroundImagesPrefix}${backgroundNumber}.jpg`;
    }
};
