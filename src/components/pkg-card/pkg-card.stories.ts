import type { Meta, StoryObj } from "@storybook/web-components";
import "./pkg-card.ts";

const meta = {
  title: "Package Card",
  tags: ["autodocs"],
  component: "pkg-card",
  args: {
    pkg: "history-adapter",
    repo: "EskiMojo14/history-adapter",
    docs: "https://eskimojo14.github.io/history-adapter/",
    name: "History Adapter",
    description: "For managing undoable state",
    route: "/packages/history-adapter",
    icon: "history",
  },
} satisfies Meta<HTMLElementTagNameMap["pkg-card"]>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
