import { AuthProvider } from "@alkok/core";
import { TooltipProvider } from "@alkok/ui";
import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./preview.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    viewport: {
      options: {
        mobile390: {
          name: "Mobile 390x844",
          styles: { width: "390px", height: "844px" },
        },
        tablet: {
          name: "Tablet 768x1024",
          styles: { width: "768px", height: "1024px" },
        },
        desktop: {
          name: "Desktop 1280x800",
          styles: { width: "1280px", height: "800px" },
        },
        adminWide: {
          name: "Admin Wide 1440x900",
          styles: { width: "1440px", height: "900px" },
        },
      },
    },
    a11y: {
      test: "todo",
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <div className="min-h-40 bg-background p-4 text-foreground">
              <Story />
            </div>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    ),
  ],
};

export default preview;
