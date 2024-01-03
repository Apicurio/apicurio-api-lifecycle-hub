import { FunctionComponent, useEffect, useState } from "react";
import { Button, Form, FormGroup, Modal, ModalVariant, TextArea, TextInput } from "@patternfly/react-core";
import { NewContent_source, NewVersion } from "@client/hub/models";
import { ObjectSelect } from "@apicurio/common-ui-components";

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
    const [contentType, setContentType] = useState("application/json");
    const [content, setContent] = useState(EMPTY_CONTENT);
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
        setIsValid(version.trim().length > 0 && content.trim().length > 0);
    }, [version, description]);

    const onCreate = (): void => {
        const data: NewVersion = {
            version,
            description,
            content: {
                source: NewContent_source.INLINE,
                contentType,
                content
            }
        };
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
                        value="Default"
                        testId="select-version-workflow"
                        items={["Default", "Enhanced", "Full"]}
                        onSelect={() => {}}
                        itemToTestId={item => `select-version-workflow-item-${item}`}
                        itemToString={item => item} />
                </FormGroup>
                <FormGroup label="Content" fieldId="create-version-content">
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
            </Form>
        </Modal>
    );
};
