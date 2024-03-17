import { formatCost } from "../misc/CostFormater";
import { CustTextField } from "./Custom/CustTextField";

export const [addcost, basecosts, maxcost] = [300, 900, 1800];

function CostField({ cost, label }: { cost: number, label: string }) {
    return (
        <div className="lg:col-span-1 md:col-span-1 col-span-1">
            <CustTextField
                disabled
                fullWidth
                value={formatCost(cost)}
                label={label}
                className="bg-white"
                inputProps={{ style: { textAlign: "right" } }}
            />
        </div>
    );
}

export default function Costs() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <CostField cost={basecosts} label={"Base Cost"} />
            <CostField cost={addcost} label={"Additional Cost"} />
            <CostField cost={maxcost} label={"Max Cost"} />
        </div>
    );
}
