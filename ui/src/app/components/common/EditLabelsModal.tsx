import React, { FunctionComponent, useEffect, useState } from "react";
import {
    Button,
    Flex,
    FlexItem,
    Form,
    FormGroup,
    Grid,
    GridItem,
    Modal,
    ModalVariant,
    TextInput
} from "@patternfly/react-core";
import { Label, Labels } from "@client/hub/models";
import { MinusCircleIcon, PlusCircleIcon } from "@patternfly/react-icons";

/**
 * Properties
 */
export type EditLabelsModalProps = {
    isOpen: boolean;
    labels: Labels | undefined;
    onEdit: (event: Labels) => void;
    onCancel: () => void;
};

export const EditLabelsModal: FunctionComponent<EditLabelsModalProps> = (props: EditLabelsModalProps) => {
    const [allLabels, setAllLabels] = useState<Label[]>([]);
    const [isValid, setIsValid] = useState(true);

    const toLabelArray = (labels: any): Label[] => {
        if (props.labels) {
            const keys = Object.getOwnPropertyNames(labels);
            return keys.map(key => {
                return {
                    key,
                    value: labels[key] as string
                } as Label;
            });
        } else {
            return [];
        }
    };

    const toLabels = (labelArray: Label[]): Labels => {
        const rval: any = {};
        labelArray.forEach(label => {
            rval[label.key as string] = label.value;
        });
        return rval as Labels;
    };

    const addLabel = (): void => {
        setAllLabels([...allLabels, {}]);
    };

    const removeLabel = (label: Label): void => {
        const idx: number = allLabels.indexOf(label);
        const newLabels: Label[] = [...allLabels];
        newLabels.splice(idx, 1);
        setAllLabels(newLabels);
    };

    const validate = (): void => {
        setIsValid(true);
        allLabels.forEach(label => {
            if (!label.key || label.key.trim().length === 0) {
                setIsValid(false);
            }
        });
    };

    useEffect(() => {
        if (props.isOpen) {
            setAllLabels(toLabelArray(props.labels as any));
            setIsValid(true);
        }
    }, [props.isOpen]);

    useEffect(() => {
        validate();
    }, [allLabels]);

    const onEdit = (): void => {
        props.onEdit(toLabels(allLabels));
    };

    return (
        <Modal
            variant={ModalVariant.medium}
            title="Edit labels"
            isOpen={props.isOpen}
            onClose={props.onCancel}
            actions={[
                <Button key="edit" variant="primary" isDisabled={!isValid} onClick={onEdit} data-testid="btn-modal-edit">
                    Save
                </Button>,
                <Button key="cancel" variant="link" onClick={props.onCancel} data-testid="btn-modal-cancel">
                    Cancel
                </Button>
            ]}
        >
            <Form>
                <Grid hasGutter md={6}>
                    {
                        allLabels.map((label, idx) => (
                            <React.Fragment key={idx}>
                                <GridItem span={6}>
                                    <FormGroup
                                        fieldId={`form-labels-key-${idx}`}
                                        isRequired={true}
                                        label={idx === 0 ? "Key" : ""}>
                                        <TextInput
                                            type="text"
                                            placeholder="Enter key"
                                            id={`form-labels-key-${idx}`}
                                            data-testid={`edit-metadata-modal-property-name-${idx}`}
                                            name={`form-labels-key-${idx}`}
                                            validated={(label.key && label.key.trim().length > 0) ? "success" : "error"}
                                            value={label.key}
                                            onChange={(_event, newVal) => {
                                                label.key = newVal;
                                                setAllLabels([...allLabels]);
                                            }}
                                        />
                                    </FormGroup>
                                </GridItem>
                                <GridItem span={6}>
                                    <FormGroup
                                        fieldId={`form-labels-value-${idx}`}
                                        label={idx === 0 ? "Value" : ""}
                                    >
                                        <Flex className="prop-value-group">
                                            <FlexItem grow={{ default: "grow" }}>
                                                <TextInput
                                                    type="text"
                                                    id={`form-labels-value-${idx}`}
                                                    data-testid={`edit-metadata-modal-property-value-${idx}`}
                                                    placeholder="Enter value"
                                                    name={`form-labels-value-${idx}`}
                                                    value={label.value}
                                                    onChange={(_event, newVal) => {
                                                        label.value = newVal;
                                                        setAllLabels([...allLabels]);
                                                    }}
                                                />
                                            </FlexItem>
                                            <FlexItem>
                                                <Button
                                                    key={"remove-button-new"}
                                                    variant="link"
                                                    icon={<MinusCircleIcon />}
                                                    iconPosition="right"
                                                    className="pf-m-plain"
                                                    onClick={() => {
                                                        removeLabel(label);
                                                    }} />
                                            </FlexItem>
                                        </Flex>
                                    </FormGroup>
                                </GridItem>
                            </React.Fragment>
                        ))
                    }
                    <GridItem span={12}>
                        <Button
                            variant="link"
                            icon={<PlusCircleIcon />}
                            onClick={() => addLabel()}>Add label</Button>
                    </GridItem>
                </Grid>
            </Form>
        </Modal>
    );
};
