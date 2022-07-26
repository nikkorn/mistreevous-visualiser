import Button from "@mui/material/Button/Button";
import Dialog from "@mui/material/Dialog/Dialog";
import DialogActions from "@mui/material/DialogActions/DialogActions";
import DialogContent from "@mui/material/DialogContent/DialogContent";
import DialogContentText from "@mui/material/DialogContentText/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle/DialogTitle";

import { DialogFieldType } from "./DialogTypes";

/**
 * The Dialog component props.
 */
export type DialogProps = {
    fieldType: DialogFieldType;
    title: string;
    text: string;
};

/**
 * The Dialog component.
 */
export const DialogComponent: React.FunctionComponent<DialogProps> = () => {
	return (
		<Dialog
            open={true}
            onClose={() => console.log("handle close!")} >
            <DialogTitle>
                {"Use Google's location service?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Let Google help apps determine location. This means sending anonymous
                    location data to Google, even when no apps are running.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => console.log("handle click!")}>Disagree</Button>
                <Button onClick={() => console.log("handle click!")} autoFocus>Agree</Button>
            </DialogActions>
        </Dialog>
	);
};
