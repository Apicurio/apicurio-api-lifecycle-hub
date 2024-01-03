import { FunctionComponent, useEffect } from "react";

/**
 * Properties
 */
export type BpmnDiagramProps = {
    diagramUrl: string;
};

export const BpmnDiagram: FunctionComponent<BpmnDiagramProps> = (props: BpmnDiagramProps) => {
    useEffect(() => {
        // Load BPMN workflow diagram when switching to the Lifecycle tab
        setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const viewer = new BpmnJS({
                container: "#bpmnCanvas"
            });
            fetch(props.diagramUrl).then(response => {
                response.text().then(bpmnXml => {
                    viewer.importXML(bpmnXml).then(() => {
                        // const canvas = viewer.get("canvas");
                        // canvas.zoom("fit-viewport");
                    });
                });
            });
        }, 100);
    }, []);

    return (
        <div id="bpmnCanvas" style={{ width: "100%", height: "650px", backgroundColor: "#ddd" }}>
        </div>
    );
};
