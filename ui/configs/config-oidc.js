const ApiLifecycleConfig = {
    apis: {
        "hub": "http://localhost:8080/apis/hub/v0",
        workflows: "http://localhost:9002/apis/workflows/v0"
    },
    ui: {
        contextPath: "/",
        navPrefixPath: ""
    },
    auth: {
        type: "oidc",
        options: {
            url: "https://auth.apicur.io/auth/realms/apicurio-local",
            redirectUri: "http://localhost:8888",
            clientId: "apicurio-studio",
            scopes: "openid profile email offline_token"
        }
    }
};
