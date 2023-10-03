import "./App.css";
import {
    Masthead, MastheadBrand, MastheadContent,
    MastheadMain,
    Page, PageSection, PageSectionVariants,
    Toolbar,
    ToolbarContent,
    ToolbarItem
} from "@patternfly/react-core";

function App() {

    const headerToolbar = (
        <Toolbar id="vertical-toolbar">
            <ToolbarContent>
                <ToolbarItem></ToolbarItem>
            </ToolbarContent>
        </Toolbar>
    );

    const header = (
        <Masthead className="masthead">
            <MastheadMain>
                <MastheadBrand href="https://www.apicur.io" target="_blank" className="logo-link">
                    <img className="logo-image" src="/logo.png" />
                    <div className="logo-text">API Lifecycle Hub</div>
                </MastheadBrand>
            </MastheadMain>
            <MastheadContent>{headerToolbar}</MastheadContent>
        </Masthead>
    );

    return (
        <Page header={header}>
            <PageSection variant={PageSectionVariants.darker}>Section with darker background</PageSection>
            <PageSection variant={PageSectionVariants.dark}>Section with dark background</PageSection>
            <PageSection variant={PageSectionVariants.light}>Section with light background</PageSection>
        </Page>
    );
}

export default App;
