package io.apicurio.lifecycle.workflows.rest.v0;

import io.apicurio.lifecycle.workflows.rest.v0.beans.Event;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.validation.constraints.NotNull;

@ApplicationScoped
public class EventsResourceImpl implements EventsResource {

    /**
     * @see io.apicurio.lifecycle.workflows.rest.v0.EventsResource#publishEvent(io.apicurio.lifecycle.workflows.rest.v0.beans.Event)
     */
    @Override
    public void publishEvent(@NotNull Event data) {
        System.out.println("Received an event: " + data.getType());
        // TODO implement this!
    }

}
