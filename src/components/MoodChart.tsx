'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [
  { day: 'Mon', mood: 3 },
  { day: 'Tue', mood: 5 },
  { day: 'Wed', mood: 2 },
];

export default function MoodChart() {
  return (
    <LineChart width={300} height={200} data={data}>
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="day" />
      <YAxis domain={[1, 5]} />
      <Tooltip />
      <Line type="monotone" dataKey="mood" stroke="#7c3aed" />
    </LineChart>
  );
}
