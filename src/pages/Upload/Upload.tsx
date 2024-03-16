import { MenuItem } from "@mui/material";
import Title from "../../components/Title";
import { useState } from "react";
import { CustTextField } from "../../components/Custom/CustTextField";
import dayjs from "dayjs";
import { UploadOutlined } from "@mui/icons-material";
import Axios from "axios";

export default function Upload() {
    const [type, setType] = useState("results");
    const [loc, setLoc] = useState("");
    const [examYear, setExamYear] = useState(dayjs().year());
    const [examMonth, setExamMonth] = useState(dayjs().month() + 1);
    const [acYear, setAcYear] = useState(0);
    const [sem, setSem] = useState(0);
    const [exam, setExam] = useState("supple");

    return (
        <>
            <Title title="Upload" />
            {/* Results... registered Entries... code Names... Written-Test*/}
            <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-x-4 gap-y-6 no-print">
                <CustTextField
                    select
                    label="Type"
                    value={type}
                    onChange={({ target: { value } }) => {
                        setType((value))
                        setLoc("")
                        setAcYear(0)
                        setSem(0)
                    }}
                >
                    <MenuItem value="results">Results</MenuItem>
                    <MenuItem value="registeredEntries">Registered Entries</MenuItem>
                    <MenuItem value="codeNames">Code Names</MenuItem>
                    <MenuItem value="cbt">Written Test</MenuItem>
                </CustTextField>

                {/* type === Results || Written-Test */}
                {(type === "results" || type === "cbt") && (
                    <>

                        <div className="flex w-full col-span-2 row-start-2 gap-4">
                            <CustTextField
                                fullWidth
                                select
                                label="Year"
                                value={acYear}
                                onChange={({ target: { value } }) => {
                                    setAcYear(parseInt(value))
                                }}
                            >
                                <MenuItem disabled value={0}>Year</MenuItem>
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>

                            </CustTextField>
                            <CustTextField
                                fullWidth
                                select
                                label="Sem"
                                value={sem}
                                onChange={({ target: { value } }) => {
                                    setSem(parseInt(value))
                                }}
                            >
                                <MenuItem disabled value={0}>Sem</MenuItem>
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>

                            </CustTextField>
                        </div>
                        <div className="flex w-full col-span-2 row-start-3 gap-4">
                            <CustTextField
                                type="number"
                                label="Exam Year"
                                InputProps={{
                                    inputProps: { min: dayjs().year() - 1, max: dayjs().year() },
                                }}
                                value={examYear}
                                onChange={({ target: { value } }) => {
                                    setExamYear(
                                        parseInt(value) > 0 ? parseInt(value) : dayjs().year() - 1
                                    );
                                }}

                            />
                            <CustTextField
                                type="number"
                                label="Exam Month"
                                InputProps={{
                                    inputProps: { min: 1, max: 12 },
                                }}
                                value={examMonth}
                                onChange={({ target: { value } }) => {
                                    setExamMonth(parseInt(value) > 0 ? parseInt(value) : 0);
                                }}
                            />

                        </div>
                    </>
                )
                }

                {/* type === Registered Entries */}
                {type === "registeredEntries" && (
                    <>
                        <div className="flex w-full col-span-1 row-start-2 gap-4">
                            <CustTextField
                                fullWidth
                                select
                                label="Exam"
                                value={exam}
                                onChange={({ target: { value } }) => {
                                    setExam(value)
                                }}
                            >
                                <MenuItem value={"supple"}>Supplementary</MenuItem>
                                <MenuItem value={"reval"}>Revaluation</MenuItem>
                                <MenuItem value={"cbt"}>Written-Test</MenuItem>
                            </CustTextField>
                        </div>
                    </>
                )
                }

                {type === "codeNames" && (
                    <>
                        <div className="text-red-600 text-l font-bold text-2xl flex w-full col-span-1 row-start-2 gap-4 whitespace-nowrap">
                            The file name MUST be <code>code-names.csv</code>
                        </div>
                    </>
                )}

                {/* Folder loaction */}
                <div className="flex w-full col-span-2 row-start-4 gap-4">
                    <CustTextField
                        fullWidth
                        type="string"
                        label="Folder Location"
                        value={loc}
                        onChange={({ target: { value } }) => {
                            setLoc(value)
                        }}
                    />
                </div>

                {/* button */}
                <div className="flex w-full col-span-2 gap-4 row-start-4 items-end">
                    <button
                        type="submit"
                        className="blue-button-filled h-fit flex items-center gap-2"
                        disabled={(type === "results" || type === "cbt") && (acYear === 0 || examMonth === 0 || sem === 0 || loc.length === 0)
                            || (type === "registeredEntries" && (loc.length === 0))
                            || (type === "codeNames" && (loc.length === 0))
                        }
                        onClick={async () => {
                            if (type === "results") {
                                await Axios.post('/api/upload/results', {
                                    loc: loc,
                                    ext: '.xlsx',
                                    acYear: acYear,
                                    sem: sem,
                                    exYear: examYear,
                                    exMonth: examMonth
                                })
                                    .then(response => {
                                        console.log(response.data);
                                    })
                                    .catch(error => {
                                        console.error('Error uploading data:', error);
                                    })
                            }
                            else if (type === "registeredEntries" && exam === "supple") {
                                await Axios.post('/api/upload/table/paidsupple', {
                                    loc: loc
                                })
                                    .then(response => {
                                        console.log(response.data);
                                    })
                                    .catch(error => {
                                        console.error('Error uploading data:', error);
                                    })
                            }
                            else if (type === "registeredEntries" && exam === "reval") {
                                await Axios.post('/api/upload/table/paidreevaluation', {
                                    loc: loc
                                })
                                    .then(response => {
                                        console.log(response.data);
                                    })
                                    .catch(error => {
                                        console.error('Error uploading data:', error);
                                    })
                            }
                            else if (type === "registeredEntries" && exam === "cbt") {
                                await Axios.post('/api/upload/table/paidcbt', {
                                    loc: loc
                                })
                                    .then(response => {
                                        console.log(response.data);
                                    })
                                    .catch(error => {
                                        console.error('Error uploading data:', error);
                                    })
                            }
                            else if (type === "codeNames") {
                                await Axios.post('/api/upload/table/codeNames', {
                                    loc: loc
                                })
                                    .then(response => {
                                        console.log(response.data);
                                    })
                                    .catch(error => {
                                        console.error('Error uploading data:', error);
                                    })
                            }
                            else if (type === "cbt") {
                                await Axios.post('/api/upload/cbtsubjects', {
                                    loc: loc,
                                    ext: '.xlsx',
                                    acYear: acYear,
                                    sem: sem,
                                    regYear: examMonth,
                                })
                                    .then(response => {
                                        console.log(response.data);
                                    })
                                    .catch(error => {
                                        console.error('Error uploading data:', error);
                                    })
                            }
                        }}
                    >
                        <UploadOutlined fontSize="small" />
                        Upload
                    </button>
                </div>
            </div>
        </>
    )
}