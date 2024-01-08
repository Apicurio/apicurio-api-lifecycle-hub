const ApiLifecycleConfig = {
    apis: {
        hub: "http://localhost:7070/apis/hub/v0",
        workflows: "http://localhost:9002/apis/workflows/v0"
    },
    ui: {
        contextPath: "/",
        navPrefixPath: ""
    },
    integrations: {
        apiDesigner: "http://localhost:8000/",
        registry: "http://localhost:8001/",
        microcks: "http://localhost:8080/"
    },
    auth: {
        type: "none"
    }
};
