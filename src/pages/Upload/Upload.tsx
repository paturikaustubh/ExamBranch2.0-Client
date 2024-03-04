import { Grid, MenuItem, TextField } from "@mui/material";
import Title from "../../components/Title";
import { useState } from "react";

export default function Upload() {
    const [type, settype] = useState("results");
    const [clicked, setclicked] = useState(false);
    const [table, settable] = useState("regular");

    return (
        <>
            <Title title="Upload" />
            {/* Results... registered Entries... code Names */}
            <div className="grid grid-cols-12 gap-2 mb-4">
                <div className="col-span-12 sm:col-span-4 md:col-span-2">
                    <TextField
                        fullWidth
                        select
                        style={{
                            backgroundColor: "white",
                        }}
                        defaultValue={"results"}
                        onChange={(e) => {
                            settype(e.target.value);
                        }}
                    >
                        {[
                            <MenuItem value={"results"}>Results</MenuItem>,
                            <MenuItem value={"paid"}>Registered Entries</MenuItem>,
                            <MenuItem value={"codes"}>Code Names</MenuItem>,
                        ]}
                    </TextField>
                </div>
            </div>

            {type === "results" && (
                <>
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <div className="col-span-12 sm:col-span-4 md:col-span-2">
                            <TextField
                                fullWidth
                                select
                                defaultValue={"regular"}
                                // size="large"
                                style={{
                                    backgroundColor: "white",
                                }}
                                label="Exam"
                                value={"regular"}
                                onChange={({ target: { value } }) => {
                                    settable(value);
                                }
                            }
                                disabled={clicked}
                            >
                                {[
                                    <MenuItem value={"regular"}>Regular</MenuItem>,
                                    <MenuItem value={"supply"}>
                                        Supplementary/Revaluation
                                    </MenuItem>,
                                    <MenuItem value={"cbt"}>CBT</MenuItem>,
                                ]}
                            </TextField>
                        </div>
                    </div>

                </>
            )
            }
        </>
    )
}