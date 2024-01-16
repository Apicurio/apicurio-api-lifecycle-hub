package io.apicurio.lifecycle.workflows.github;

import io.apicurio.lifecycle.workflows.AlwAppException;
import org.apache.commons.codec.digest.DigestUtils;
import org.eclipse.jgit.api.CreateBranchCommand.SetupUpstreamMode;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.transport.PushConfig;
import org.eclipse.jgit.transport.URIish;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;


public class GitRepo implements AutoCloseable {

    //private static final Logger log = LoggerFactory.getLogger(GitRepo.class);

    private static final String REMOTE = "origin";

    private final GitConfigProperties config;
    private final Git git;


    GitRepo(GitConfigProperties config, String remoteStrURI) {
        try {
            this.config = config;

            var remoteURI = new URIish(remoteStrURI);

            var workDirPath = Paths.get(config.getGitWorkDir());
            var repoDir = DigestUtils.sha256Hex(remoteURI.toString()).substring(0, 16);
            var repoPath = workDirPath.resolve(repoDir);
            var gitDirPath = repoPath.resolve(".git");

            if (Files.exists(gitDirPath.resolve("config"))) {

                git = Git.open(gitDirPath.toFile());

                var remotes = git.remoteList()
                        .call();

                if (remotes.size() != 1 || !remotes.get(0).getName().equals(REMOTE) || !remotes.get(0).getURIs().stream().allMatch(u -> u.equals(remoteURI))) {
                    throw new IllegalStateException(
                            "Unexpected remote configuration in '%s': %s".formatted(repoPath, remotes.stream()
                                    .map(r -> Map.entry(r.getName(), r.getURIs()))
                                    .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue))
                            )
                    );
                }

            } else {
                git = Git.init()
                        .setBare(false)
                        .setDirectory(repoPath.toFile())
                        .setGitDir(gitDirPath.toFile())
                        .setInitialBranch(UUID.randomUUID().toString())
                        .call();

                git.remoteAdd()
                        .setName(REMOTE)
                        .setUri(remoteURI)
                        .call();
            }

            git.fetch()
                    .setRemoveDeletedRefs(true)
                    .setRemote(REMOTE)
                    .call();

        } catch (GitAPIException | IOException | URISyntaxException ex) {
            throw new AlwAppException(ex);
        }
    }


    public Path getRepoPath() {
        return git.getRepository().getWorkTree().toPath();
    }


    public boolean hasChanged() {
        try {

            var status = git
                    .status()
                    .call();

            return !status.getModified().isEmpty();

        } catch (GitAPIException e) {
            throw new AlwAppException(e);
        }
    }


    public void checkout(String remoteBranch, String localBranch) {
        try {

            git.branchCreate()
                    .setStartPoint("remotes/%s/%s".formatted(REMOTE, remoteBranch))
                    .setName(localBranch)
                    .setForce(true)
                    .setUpstreamMode(SetupUpstreamMode.NOTRACK)
                    .call();

            git.checkout()
                    .setForced(true)
                    .setCreateBranch(false)
                    .setName(localBranch)
                    .call();

        } catch (GitAPIException ex) {
            throw new AlwAppException(ex);
        }
    }


    public void commit() {
        try {

            git.add()
                    .addFilepattern(".")
                    .call();

            git.commit()
                    .setAllowEmpty(false)
                    .setMessage("feat: update schema")
                    .setAuthor("Apicurio API Lifecycle Hub", "todo@todo.example")
                    .call();

        } catch (GitAPIException ex) {
            throw new AlwAppException(ex);
        }
    }


    public void push() {
        try {

            git.push()
                    .setRemote(REMOTE)
                    .setPushDefault(PushConfig.PushDefault.CURRENT)
                    .setCredentialsProvider(new UsernamePasswordCredentialsProvider(config.getGithubUser(), config.getGithubToken()))
                    .call();

        } catch (GitAPIException ex) {
            throw new AlwAppException(ex);
        }
    }


    @Override
    public void close() {
        git.close();
    }
}
