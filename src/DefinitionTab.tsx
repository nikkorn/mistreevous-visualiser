import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-sqlserver";
import "./mode-mdsl";

export type DefinitionTabProps = {
    value: string;
    onChange(value: string): void
}

/**
 * The DefinitionTab component.
 */
 export const DefinitionTab: React.FunctionComponent<DefinitionTabProps> = ({ value, onChange }) => {
    return (
        <div className="sidebar-tab definition-tab">
            <AceEditor
                value={value}
                onChange={onChange}
				width="100%"
                height="100%"
				mode="mdsl"
                theme="sqlserver"
                setOptions={{ useWorker: false }}
			/>
        </div>
    );
  }
  