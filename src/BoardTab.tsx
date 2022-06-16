import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

export type BoardTabProps = {
    value: string;
    onChange(value: string): void
}

/**
 * The BoardTab component.
 */
 export const BoardTab: React.FunctionComponent<BoardTabProps> = ({ value, onChange }) => {
    return (
        <div className="sidebar-tab board-tab">
            <AceEditor
                value={value}
                onChange={onChange}
				width="100%"
                height="100%"
				mode="javascript"
                theme="github"
                setOptions={{ useWorker: false }}
			/>
        </div>
    );
  }