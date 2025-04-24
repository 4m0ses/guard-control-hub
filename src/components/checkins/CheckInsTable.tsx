
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CheckInRow from "./CheckInRow";
import { CheckIn } from "@/types/checkIn";

interface CheckInsTableProps {
  checkins: CheckIn[];
}

const CheckInsTable = ({ checkins }: CheckInsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Call ID</TableHead>
            <TableHead>Guard</TableHead>
            <TableHead>Site</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {checkins.map((checkin) => (
            <CheckInRow key={checkin.id} checkin={checkin} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CheckInsTable;
