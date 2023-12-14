import { FunctionComponent, useEffect, useState } from "react";
import { Button, Form, FormGroup, Modal, ModalVariant, TextArea, TextInput } from "@patternfly/react-core";
import { NewApi } from "@client/hub/models";
import { ObjectSelect } from "@apicurio/common-ui-components";

type TypeSelectionItem = {
    label: string;
    value: string;
}

const TYPE_SELECTION_ITEMS: TypeSelectionItem[] = [
    {
        label: "OpenAPI",
        value: "OPENAPI"
    },
    {
        label: "AsyncAPI",
        value: "ASYNCAPI"
    }
];

/**
 * Properties
 */
export type CreateApiModalProps = {
    isOpen: boolean|undefined;
    onCreate: (event: NewApi) => void;
    onCancel: () => void;
};

export const CreateApiModal: FunctionComponent<CreateApiModalProps> = (props: CreateApiModalProps) => {
    const [apiId, setApiId] = useState("");
    const [type, setType] = useState("OPENAPI");
    const [typeSelection, setTypeSelection] = useState(TYPE_SELECTION_ITEMS[0]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        if (props.isOpen) {
            setType("OPENAPI");
            setTypeSelection(TYPE_SELECTION_ITEMS[0]);
            setName("");
            setDescription("");
            setApiId("");
            setIsValid(false);
        }
    }, [props.isOpen]);

    useEffect(() => {
        setType(typeSelection.value);
    }, [typeSelection]);

    useEffect(() => {
        setIsValid(apiId.length > 0 && name.length > 0);
    }, [apiId, type, name, description]);

    const onCreate = (): void => {
        const data: NewApi = {
            name,
            description,
            type,
            apiId
        };
        props.onCreate(data);
    };

    return (
        <Modal
            variant={ModalVariant.medium}
            title="Create an API"
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
            <Form>
                <FormGroup label="API ID" isRequired={true} fieldId="create-api-id">
                    <TextInput
                        isRequired
                        type="text"
                        id="create-api-id"
                        data-testid="text-api-id"
                        name="create-api-id"
                        aria-describedby="create-api-id-helper"
                        value={apiId}
                        onChange={(_event, value) => {setApiId(value);}}
                    />
                </FormGroup>
                <FormGroup label="Name" isRequired={true} fieldId="create-api-name">
                    <TextInput
                        isRequired
                        type="text"
                        id="create-api-name"
                        data-testid="text-api-name"
                        name="create-api-name"
                        aria-describedby="create-api-name-helper"
                        value={name}
                        onChange={(_event, value) => {setName(value);}}
                    />
                </FormGroup>
                <FormGroup label="Description" fieldId="create-api-description">
                    <TextArea
                        type="text"
                        id="create-api-description"
                        data-testid="textarea-api-description"
                        name="create-api-description"
                        aria-describedby="create-api-description-helper"
                        value={description}
                        onChange={(_event, value) => {setDescription(value);}}
                    />
                </FormGroup>
                <FormGroup label="Type" isRequired={true} fieldId="create-api-type">
                    <ObjectSelect
                        value={typeSelection}
                        testId="select-api-type"
                        items={TYPE_SELECTION_ITEMS}
                        onSelect={setTypeSelection}
                        itemToTestId={item => `select-api-type-item-${item.value}`}
                        itemToString={item => item.label} />
                </FormGroup>
            </Form>
        </Modal>
    );
};
