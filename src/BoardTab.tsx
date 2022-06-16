import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

/**
 * The BoardTab component.
 */
 export const BoardTab: React.FunctionComponent = () => {
    return (
        <div className="sidebar-tab board-tab">
            <AceEditor
				width="100%"
                height="100%"
				mode="javascript"
                theme="github"
                setOptions={{ useWorker: false }}
			/>
        </div>
    );
  }