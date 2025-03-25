import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const data = {
    report_date: "20/3/2025",
    report_period: "0600hrs 19/3/2025 - 0600hrs 20/3/2025",
    health_safety_environment: {
        performance_summary: {
            MHS: 17580,
            POB: 1533,
        },
    },
    production: {
        gross_actual: 156128.69,
        net_target: 48571.0,
        net_actual: 43162.42,
        deferment: -5909.35,
    },
    daily_production_data: [
        { station: "AFIESERE", target: 28506, actual: 28821, net_target: 7591, net_actual: 8646.3 },
        { station: "ERIEMU", target: 15299, actual: 13071, net_target: 5877, net_actual: 5195.72 },
        { station: "EVWRENI", target: 2153, actual: 0, net_target: 997, net_actual: 0 },
        { station: "KOKORI", target: 27635, actual: 21857, net_target: 5960, net_actual: 4574.67 },
        { station: "OLOMORO", target: 69981, actual: 62416.2, net_target: 17231, net_actual: 15941.1 },
        { station: "ORONI", target: 4283, actual: 4289.5, net_target: 2699, net_actual: 2518.37 },
    ],
};

export default function Dashboard() {
    return (
        <div className="p-6 grid gap-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <CardHeader><CardTitle>Gross Production</CardTitle></CardHeader>
                    <CardContent>{data.production.gross_actual} bbls</CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Net Target</CardTitle></CardHeader>
                    <CardContent>{data.production.net_target} bbls</CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Net Actual</CardTitle></CardHeader>
                    <CardContent>{data.production.net_actual} bbls</CardContent>
                </Card>
            </div>
            
            {/* Bar Chart for Production */}
            <Card>
                <CardHeader><CardTitle>Production Overview</CardTitle></CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.daily_production_data}>
                            <XAxis dataKey="station" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="target" fill="#8884d8" name="Target" />
                            <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Daily Production Table */}
            <Card>
                <CardHeader><CardTitle>Daily Production</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Station</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead>Actual</TableHead>
                                <TableHead>Net Target</TableHead>
                                <TableHead>Net Actual</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.daily_production_data.map((station) => (
                                <TableRow key={station.station}>
                                    <TableCell>{station.station}</TableCell>
                                    <TableCell>{station.target}</TableCell>
                                    <TableCell>{station.actual}</TableCell>
                                    <TableCell>{station.net_target}</TableCell>
                                    <TableCell>{station.net_actual}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
