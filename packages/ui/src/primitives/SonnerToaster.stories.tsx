import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./Button";
import { SonnerToaster, toast } from "./SonnerToaster";

const ToastTriggerPanel = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        onClick={() => toast.success("보관함에 콕 저장했습니다.")}
      >
        성공 토스트
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => toast.error("요청 처리에 실패했습니다. 다시 시도해 주세요.")}
      >
        오류 토스트
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => toast.warning("이메일 인증이 필요합니다.")}
      >
        경고 토스트
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          toast.info("로그인 후 도움이 되었어요를 남길 수 있습니다.", {
            action: {
              label: "로그인",
              onClick: () => {},
            },
          })
        }
      >
        안내 + 액션 토스트
      </Button>
    </div>
    <SonnerToaster />
  </div>
);

const meta: Meta<typeof SonnerToaster> = {
  title: "Shared/Primitives/SonnerToaster",
  component: SonnerToaster,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SonnerToaster>;

export const Default: Story = {
  render: () => <ToastTriggerPanel />,
};

export const DarkMode: Story = {
  render: () => (
    <div className="dark rounded-xl bg-background p-4 text-foreground">
      <ToastTriggerPanel />
    </div>
  ),
};
