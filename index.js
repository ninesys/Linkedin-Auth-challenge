const JSSoup = require('jssoup').default;
const axios = require('axios');

const SEED_URL = 'https://www.linkedin.com/uas/login'
const LOGIN_URL = 'https://www.linkedin.com/checkpoint/lg/login-submit'
const VERIFY_URL = 'https://www.linkedin.com/checkpoint/challenge/verify';
let verificationSoup = null;

class LinkedInAuth {
    // Starting up the constructor
    constructor(email, password) {

        //this.doLogin(email, password);
    }

    // Starting up the login activity
    async doLogin(email, password) {
        if (Boolean(email) !== true || Boolean(password) !== true) {
            return { "status": "error", "message": "Please provide a valid username/password" };
        }
        try {
            const pageText = await axios.get(SEED_URL);
            let soup = new JSSoup(pageText.data);

            const payload = {
                'session_key': email,
                'loginCsrfParam': soup.find('input', { 'name': 'loginCsrfParam' }).attrs.value,
                'session_password': password
            }
            const res = await axios.post(LOGIN_URL, payload)
            verificationSoup = new JSSoup(res.data);
            if (res.request.path.indexOf("unexpected_error") >= 0) {
                return { "status": "error", "message": "Unexpected error!" }
            }
            return { "status": "success", "message": "Please check email" }
        } catch (error) {
            console.error("\n\n============== Something went wrong in pin generation! =====================\n\n");
            console.error(error);
            return { "status": "error", "message": "Something bad happened" };
        }
    }

    // verify the pin
    async verifyPin(pin) {
        if (verificationSoup == null) {
            return { "status": "error", "message": "You forget to login!, please login first" };
        }
        payload = {
            'csrfToken': verificationSoup.find('input', { 'name': 'csrfToken' }).attrs.value,
            'pageInstance': verificationSoup.find('input', { 'name': 'pageInstance' }).attrs.value,
            'resendUrl': verificationSoup.find('input', { 'name': 'resendUrl' }).attrs.value,
            'challengeId': verificationSoup.find('input', { 'name': 'challengeId' }).attrs.value,
            'language': 'en-US',
            'displayTime': verificationSoup.find('input', { 'name': 'displayTime' }).attrs.value,
            'challengeSource': verificationSoup.find('input', { 'name': 'challengeSource' }).attrs.value,
            'requestSubmissionId': verificationSoup.find('input', { 'name': 'requestSubmissionId' }).attrs.value,
            'challengeType': verificationSoup.find('input', { 'name': 'challengeType' }).attrs.value,
            'challengeData': verificationSoup.find('input', { 'name': 'challengeData' }).attrs.value,
            'challengeDetails': verificationSoup.find('input', { 'name': 'challengeDetails' }).attrs.value,
            'failureRedirectUri': verificationSoup.find('input', { 'name': 'failureRedirectUri' }).attrs.value,
            'pin': pin
        }
        try {
            await axios.post(VERIFY_URL, payload);
            return { "status": "success", "message": "you are successfully registered!" }
        } catch (error) {
            console.error("\n\n============ Error! in pin validation ===============\n\n");
            console.error(error);
            return { "status": "error", "message": "Something bad happened" };
        }
    }
};
module.exports = LinkedInAuth;