package io.apicurio.lifecycle.workflows.activiti.tasks;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Util {

    private static final Logger log = LoggerFactory.getLogger(Util.class);

    public static Long parseLongONull(String value) {
        try {
            return Long.valueOf(value);
        } catch (NumberFormatException ex) {
            log.debug("Could not convert '{}' to Long: {}", value, ex.getMessage());
            return null;
        }
    }
}
