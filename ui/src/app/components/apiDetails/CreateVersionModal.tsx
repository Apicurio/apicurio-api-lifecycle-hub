import { FunctionComponent, useEffect, useState } from "react";
import { Button, Form, FormGroup, Modal, ModalVariant, TextArea, TextInput } from "@patternfly/react-core";
import { NewContent_source, NewVersion } from "@client/hub/models";
import { If, ObjectSelect } from "@apicurio/common-ui-components";

const EMPTY_CONTENT: string = `{
    "openapi": "3.0.2",
    "info": {
        "title": "Empty API",
        "version": "1.0.0",
        "description": "Just an empty API."
    }
}
`;

/**
 * Properties
 */
export type CreateVersionModalProps = {
    isOpen: boolean|undefined;
    onCreate: (event: NewVersion) => void;
    onCancel: () => void;
};

export const CreateVersionModal: FunctionComponent<CreateVersionModalProps> = (props: CreateVersionModalProps) => {
    const [version, setVersion] = useState("");
    const [description, setDescription] = useState("");
    const [workflow, setWorkflow] = useState("Default");
    const [contentType, setContentType] = useState("application/json");
    const [content, setContent] = useState(EMPTY_CONTENT);
    const [url, setUrl] = useState("");
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        if (props.isOpen) {
            setVersion("");
            setDescription("");
            setContentType("application/json");
            setContent(EMPTY_CONTENT);
            setIsValid(false);
        }
    }, [props.isOpen]);

    useEffect(() => {
        let valid: boolean = true;
        if (version.trim().length === 0) {
            valid = false;
        }
        if (workflow === "GitHub" && url.trim().length === 0) {
            valid = false;
        }
        if (workflow === "Default" && content.trim().length === 0) {
            valid = false;
        }
        setIsValid(valid);
    }, [version, description, content, url, workflow]);

    const onCreate = (): void => {
        const data: NewVersion = {
            version,
            description,
            content: {
                source: NewContent_source.INLINE,
                contentType,
                content
            },
            workflow: workflow.toLowerCase()
        };
        if (workflow === "GitHub") {
            data.labels = {
                additionalData: {
                    "github:url": url
                }
            };
        }
        props.onCreate(data);
    };

    return (
        <Modal
            variant={ModalVariant.large}
            title="Create a Version"
            isOpen={props.isOpen}
            onClose={props.onCancel}
            actions={[
                <Button key="create" variant="primary" isDisabled={!isValid} onClick={onCreate} data-testid="btn-modal-create">
                    Create
                </Button>,
                <Button key="cancel" variant="link" onClick={props.onCancel} data-testid="btn-modal-cancel">
                    Cancel
                </Button>
            ]}
        >
            <Form isHorizontal={true}>
                <FormGroup label="Version" isRequired={true} fieldId="create-version-version">
                    <TextInput
                        isRequired
                        type="text"
                        id="create-version-version"
                        data-testid="text-version"
                        name="create-version-version"
                        aria-describedby="create-version-version-helper"
                        value={version}
                        onChange={(_event, value) => {setVersion(value);}}
                    />
                </FormGroup>
                <FormGroup label="Description" fieldId="create-version-description">
                    <TextArea
                        type="text"
                        id="create-version-description"
                        data-testid="textarea-version-description"
                        name="create-version-description"
                        aria-describedby="create-version-description-helper"
                        value={description}
                        resizeOrientation="vertical"
                        onChange={(_event, value) => {setDescription(value);}}
                    />
                </FormGroup>
                <FormGroup label="Content type" isRequired={true} fieldId="create-version-contentType">
                    <ObjectSelect
                        value={contentType}
                        testId="select-version-contentType"
                        items={["application/json", "application/yaml"]}
                        onSelect={setContentType}
                        itemToTestId={item => `select-version-ct-item-${item.split("/")[1]}`}
                        itemToString={item => item} />
                </FormGroup>
                <FormGroup label="Workflow" isRequired={true} fieldId="create-version-workflow">
                    <ObjectSelect
                        value={workflow}
                        testId="select-version-workflow"
                        items={["Default", "GitHub"]}
                        onSelect={setWorkflow}
                        itemToTestId={item => `select-version-workflow-item-${item}`}
                        itemToString={item => item} />
                </FormGroup>
                <If condition={workflow === "Default"}>
                    <FormGroup label="Content" isRequired={true} fieldId="create-version-content">
                        <TextArea
                            type="text"
                            id="create-version-content"
                            data-testid="textarea-version-content"
                            name="create-version-content"
                            aria-describedby="create-version-content-helper"
                            value={content}
                            style={{ minHeight: "200px" }}
                            resizeOrientation="vertical"
                            onChange={(_event, value) => {setContent(value);}}
                        />
                    </FormGroup>
                </If>
                <If condition={workflow === "GitHub"}>
                    <FormGroup label="GitHub URL" isRequired={true} fieldId="create-version-github-url">
                        <TextInput
                            isRequired
                            type="text"
                            id="create-version-github-url"
                            data-testid="text-url"
                            name="create-version-url"
                            aria-describedby="create-version-url-helper"
                            value={url}
                            onChange={(_event, value) => {setUrl(value);}}
                        />
                    </FormGroup>
                </If>
            </Form>
        </Modal>
    );
};
