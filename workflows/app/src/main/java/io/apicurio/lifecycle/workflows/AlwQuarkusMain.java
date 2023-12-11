package io.apicurio.lifecycle.workflows;

import io.quarkus.runtime.Quarkus;
import io.quarkus.runtime.annotations.QuarkusMain;

@QuarkusMain(name = "API Lifecycle Workflows")
public class AlwQuarkusMain {

    public static void main(String... args) {
        Quarkus.run(args);
    }
    
}
