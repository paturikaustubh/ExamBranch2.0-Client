import { Grid, TextField } from "@mui/material";
import { formatCost } from "../misc/CostFormater";
export const [addcost, basecosts, maxcost] = [300, 900, 1800];
function CostField({ cost, label }: { cost: number, label: string }) {
    return <Grid item className="Costs">
        <TextField
            disabled
            fullWidth
            value={formatCost(cost)}
            label={label}
            style={{
                backgroundColor: "white",
            }}
            inputProps={{ style: { textAlign: "right" } }}
        />
    </Grid>
}

export default function Costs() {
    return (
        <Grid container spacing={2} className="no-print">
            <CostField cost={basecosts} label={"Base Cost"} />
            <CostField cost={addcost} label={"Additional Cost"} />
            <CostField cost={maxcost} label={"Max Cost"} />

        </Grid>
    )
}