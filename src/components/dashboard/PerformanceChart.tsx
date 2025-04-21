
import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface PerformanceData {
  subject: string;
  você: number;
  média: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  chartConfig: {
    você: {
      theme: {
        light: string;
        dark: string;
      };
    };
    média: {
      theme: {
        light: string;
        dark: string;
      };
    };
  };
}

export const PerformanceChart = ({ data, chartConfig }: PerformanceChartProps) => {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Desempenho por Área
        </h2>
        <p className="text-sm text-gray-600">
          Comparação com a média da turma
        </p>
      </div>
      <div className="h-[300px] w-full">
        <ChartContainer config={chartConfig}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="você" fill="#3b82f6" name="Você" />
            <Bar dataKey="média" fill="#94a3b8" name="Média" />
          </BarChart>
        </ChartContainer>
      </div>
    </Card>
  );
};
