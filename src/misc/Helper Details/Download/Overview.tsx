export function DownOverview() {
  return (
    <div className="flex flex-col gap-4">
      <span>
        In this page you can download data regarding Supplementary, Revaluation
        and Written Test; like how many have registered for what exam, how many
        have taken a print but didn't confirm their registration, and a report
        on how many people have registered for what subject. This coves both
        Paid and Print tables for all the tree types.
      </span>
      <span>
        You can also clear the tables for all the tree types from here. Look out
        for the <code>Truncate</code> button on the bottom right cornner.
      </span>
    </div>
  );
}
