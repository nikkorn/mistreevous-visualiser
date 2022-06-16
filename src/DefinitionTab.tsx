import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";

/**
 * The DefinitionTab component.
 */
 export const DefinitionTab: React.FunctionComponent = () => {
    return (
        <div className="sidebar-tab definition-tab">
            <AceEditor
				width="100%"
                height="100%"
				mode="json"
                theme="github"
                setOptions={{ useWorker: false }}
			/>
        </div>
    );
  }
  