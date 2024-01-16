package io.apicurio.lifecycle.workflows.github;

import jakarta.enterprise.context.ApplicationScoped;
import lombok.Getter;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@ApplicationScoped
public class GitConfigProperties {

    @ConfigProperty(name = "alw.git.workdir", defaultValue = "/tmp/apicurio-api-lifecycle-workflows-git")
    @Getter
    String gitWorkDir;


    @ConfigProperty(name = "alw.github.user")
    @Getter
    String githubUser;


    @ConfigProperty(name = "alw.github.token")
    @Getter
    String githubToken;
}
