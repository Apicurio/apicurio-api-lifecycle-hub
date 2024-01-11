package io.apicurio.lifecycle.workflows.github;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@lombok.experimental.SuperBuilder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor
@lombok.EqualsAndHashCode
@lombok.Getter
@lombok.Setter
@lombok.ToString(callSuper = true)
public class ResourceCoordinates {
    
    private String organization;
    private String repository;
    private String branch;
    private String path;
    
    public static ResourceCoordinates fromUrl(String url) {
        String regex = "https://github.com/([^/]+)/([^/]+)/blob/([^/]+)/(.+)";
        Pattern pattern = Pattern.compile(regex);

        // Match the pattern against the input URL
        Matcher matcher = pattern.matcher(url);

        // Check if the URL matches the pattern
        if (matcher.matches()) {
            // Extract individual components
            String organization = matcher.group(1);
            String repository = matcher.group(2);
            String branch = matcher.group(3);
            String resourcePath = matcher.group(4);
            
            return ResourceCoordinates.builder()
                    .organization(organization)
                    .repository(repository)
                    .branch(branch)
                    .path(resourcePath)
                    .build();
        } else {
            throw new RuntimeException("Invalid GitHub URL");
        }
    }
    
    public URI toURI() {
        String rawDownloadUrlFormat = "https://raw.githubusercontent.com/%s/%s/%s/%s";
        try {
            return new URI(String.format(rawDownloadUrlFormat, organization, repository, branch, path));
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
    }

}
