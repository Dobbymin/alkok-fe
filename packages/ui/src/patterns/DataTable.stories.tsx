import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "../primitives/Badge";
import { DataTable, type DataTableColumn } from "./DataTable";

interface SampleRow {
  id: string;
  title: string;
  status: string;
}

const columns: DataTableColumn<SampleRow>[] = [
  { key: "title", header: "제목", cell: (r) => r.title },
  {
    key: "status",
    header: "상태",
    cell: (r) => <Badge variant="valid">{r.status}</Badge>,
  },
];

const meta: Meta<typeof DataTable<SampleRow>> = {
  title: "Shared/Patterns/DataTable",
  component: DataTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DataTable<SampleRow>>;

export const Default: Story = {
  args: {
    columns,
    rows: [
      { id: "1", title: "주간 보고서 초안 프롬프트", status: "유효함" },
      { id: "2", title: "Claude 4 요금표 비교", status: "유효함" },
    ],
    getRowKey: (r) => r.id,
  },
};

export const Empty: Story = {
  args: {
    columns,
    rows: [],
    getRowKey: (r) => r.id,
    emptyState: <p className="text-sm text-muted-foreground">표시할 데이터가 없습니다.</p>,
  },
};
