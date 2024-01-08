var ApicurioRegistryConfig = {
    artifacts: {
        url: "http://localhost:9001/apis/registry/v3"
    },
    ui: {
        contextPath: "/",
        navPrefixPath: "/",
        oaiDocsUrl: "http://localhost:8002"
    },
    auth: {
        type: "none"
    },
    features: {
        showMasthead: false,
        readOnly: false,
        breadcrumbs: true,
        roleManagement: false,
        settings: true
    }
};
