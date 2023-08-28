const testApp = {
    cognito: {
        UserPoolId: 'us-east-1_dgaKxRACk',
        ClientId: '2n6hgl70qm8but7chh0t52ngv8',
    },
    baseApiUrl: "http://localhost:3001/api",
    supportEmail: "askrizzly@gmail.com",
}

const liveApp = {
    cognito: {
        UserPoolId: 'us-east-1_Idy0VPEqK',
        ClientId: '1hm0bcej0ok1rimjt93ehuuft3',
    },
    baseApiUrl: "https://api.rizz.ly/api",
    supportEmail: "askrizzly@gmail.com",
    // baseApiUrl: "http://rizzly-dev-api.us-east-1.elasticbeanstalk.com/api",
}

const currentApp = testApp

export default currentApp