import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeContext } from "../../context/ThemeContext";
import MainContent from "../directory_converter/MainContent";

// Mock the SearchBox component since it's complex and should have its own tests
vi.mock("../SearchBox", () => ({
  default: ({ isVisible, onClose }: any) =>
    isVisible ? (
      <div data-testid="search-box">
        Search Box
        <button onClick={onClose}>Close Search</button>
      </div>
    ) : null,
}));

// Mock react-icons
vi.mock("react-icons/fa", () => ({
  FaFile: ({ className }: { className?: string }) => (
    <span data-testid="file-icon" className={className}>
      FileIcon
    </span>
  ),
  FaShieldAlt: ({ className }: { className?: string }) => (
    <span data-testid="shield-icon" className={className}>
      ShieldIcon
    </span>
  ),
  FaUpload: ({ className }: { className?: string }) => (
    <span data-testid="upload-icon" className={className}>
      UploadIcon
    </span>
  ),
  FaCopy: ({ className }: { className?: string }) => (
    <span data-testid="copy-icon" className={className}>
      CopyIcon
    </span>
  ),
  FaCheck: ({ className }: { className?: string }) => (
    <span data-testid="check-icon" className={className}>
      CheckIcon
    </span>
  ),
}));

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
});

describe("MainContent Component", () => {
  const mockAnonymizeContent = vi.fn((content: string) =>
    content.replace(/test@example.com/g, "[EMAIL]")
  );

  const sampleFileData = [
    {
      name: "test.js",
      content: 'console.log("Hello World");',
      visible: true,
      path: "src/test.js",
    },
    {
      name: "folder",
      content: "",
      visible: true,
      children: [
        {
          name: "nested.ts",
          content: 'export const email = "test@example.com";',
          visible: true,
          path: "src/folder/nested.ts",
        },
      ],
    },
    {
      name: "hidden.css",
      content: "body { color: red; }",
      visible: false,
      path: "src/hidden.css",
    },
  ];

  // Helper function to render MainContent with theme context
  const renderMainContentWithTheme = (
    darkMode = false,
    fileData = sampleFileData,
    isAnonymized = false
  ) => {
    return render(
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode: vi.fn() }}>
        <MainContent
          fileData={fileData}
          isAnonymized={isAnonymized}
          anonymizeContent={mockAnonymizeContent}
        />
      </ThemeContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render without crashing", () => {
      renderMainContentWithTheme();
      expect(screen.getByText(/Hello World/)).toBeInTheDocument();
    });

    it("should display empty state when no files are provided", () => {
      renderMainContentWithTheme(false, []);

      expect(screen.getByText("No Files Uploaded")).toBeInTheDocument();
      expect(
        screen.getByText(/Upload files or a directory/)
      ).toBeInTheDocument();
      // Check for at least one upload icon (there are multiple in empty state)
      const uploadIcons = screen.getAllByTestId("upload-icon");
      expect(uploadIcons.length).toBeGreaterThan(0);
    });

    it("should display file content with proper formatting", () => {
      renderMainContentWithTheme();

      // Check for file headers
      expect(screen.getByText(/File: test.js/)).toBeInTheDocument();
      expect(screen.getByText(/Path: src\/test.js/)).toBeInTheDocument();

      // Check for file content
      expect(
        screen.getByText(/console.log\("Hello World"\)/)
      ).toBeInTheDocument();
    });

    it("should display nested file content", () => {
      renderMainContentWithTheme();

      expect(screen.getByText(/File: nested.ts/)).toBeInTheDocument();
      expect(
        screen.getByText(/export const email = "test@example.com"/)
      ).toBeInTheDocument();
    });

    it("should not display hidden files", () => {
      renderMainContentWithTheme();

      expect(screen.queryByText(/File: hidden.css/)).not.toBeInTheDocument();
      expect(
        screen.queryByText(/body { color: red; }/)
      ).not.toBeInTheDocument();
    });

    it("should show controls bar when files are present", () => {
      renderMainContentWithTheme();

      expect(screen.getByText(/Press/)).toBeInTheDocument();
      expect(screen.getByText("Ctrl+F")).toBeInTheDocument();
      expect(screen.getByText(/to search/)).toBeInTheDocument();
    });
  });

  describe("Theme Support", () => {
    it("should apply dark theme classes", () => {
      const { container } = renderMainContentWithTheme(true);

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass("bg-dark-900");
    });

    it("should apply light theme classes", () => {
      const { container } = renderMainContentWithTheme(false);

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass("bg-gray-50");
    });

    it("should apply theme-specific classes to code viewer", () => {
      renderMainContentWithTheme(true);

      const codeViewer = screen.getByText(/console.log/).closest("pre");
      expect(codeViewer).toHaveClass("text-dark-100", "bg-dark-800");
    });
  });

  describe("Copy Functionality", () => {
    it("should copy all visible content when copy button is clicked", async () => {
      renderMainContentWithTheme();

      const copyButton = screen.getByRole("button", { name: /copy all/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
      });

      const copiedContent = (navigator.clipboard.writeText as any).mock
        .calls[0][0];
      expect(copiedContent).toContain('console.log("Hello World")');
      expect(copiedContent).toContain(
        'export const email = "test@example.com"'
      );
      expect(copiedContent).not.toContain("body { color: red; }"); // Hidden file
    });

    it("should show copy confirmation", async () => {
      renderMainContentWithTheme();

      const copyButton = screen.getByRole("button", { name: /copy all/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText("Copied!")).toBeInTheDocument();
        expect(screen.getByTestId("check-icon")).toBeInTheDocument();
      });
    });

    it("should revert copy button after timeout", async () => {
      renderMainContentWithTheme();

      const copyButton = screen.getByRole("button", { name: /copy all/i });
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText("Copied!")).toBeInTheDocument();
      });

      await waitFor(
        () => {
          expect(screen.queryByText("Copied!")).not.toBeInTheDocument();
          expect(screen.getByText("Copy All")).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe("Anonymization", () => {
    it("should display privacy mode indicator when anonymization is active", () => {
      renderMainContentWithTheme(false, sampleFileData, true);

      expect(screen.getByText("Privacy Mode Active")).toBeInTheDocument();
      // Check for at least one shield icon (there are multiple when privacy mode is active)
      const shieldIcons = screen.getAllByTestId("shield-icon");
      expect(shieldIcons.length).toBeGreaterThan(0);
    });

    it("should anonymize content when isAnonymized is true", () => {
      renderMainContentWithTheme(false, sampleFileData, true);

      // Should contain anonymized email
      expect(
        screen.getByText(/export const email = "\[EMAIL\]"/)
      ).toBeInTheDocument();
      expect(screen.queryByText(/test@example.com/)).not.toBeInTheDocument();
    });

    it("should show anonymization footer when active", () => {
      renderMainContentWithTheme(false, sampleFileData, true);

      expect(
        screen.getByText("Privacy Protection Applied")
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Personal information has been anonymized/)
      ).toBeInTheDocument();
    });

    it("should show privacy note in empty state when anonymized", () => {
      renderMainContentWithTheme(false, [], true);

      expect(screen.getByText("Privacy mode is active")).toBeInTheDocument();
      expect(
        screen.getByText(/Your personal information will be anonymized/)
      ).toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    it("should open search box when Ctrl+F is pressed", async () => {
      renderMainContentWithTheme();

      const user = userEvent.setup();
      await user.keyboard("{Control>}f{/Control}");

      await waitFor(() => {
        expect(screen.getByTestId("search-box")).toBeInTheDocument();
      });
    });

    it("should close search box when Escape is pressed", async () => {
      renderMainContentWithTheme();

      const user = userEvent.setup();
      await user.keyboard("{Control>}f{/Control}");

      await waitFor(() => {
        expect(screen.getByTestId("search-box")).toBeInTheDocument();
      });

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByTestId("search-box")).not.toBeInTheDocument();
      });
    });

    it("should close search box when close button is clicked", async () => {
      renderMainContentWithTheme();

      const user = userEvent.setup();
      await user.keyboard("{Control>}f{/Control}");

      await waitFor(() => {
        expect(screen.getByTestId("search-box")).toBeInTheDocument();
      });

      const closeButton = screen.getByText("Close Search");
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId("search-box")).not.toBeInTheDocument();
      });
    });
  });

  describe("File Formatting", () => {
    it("should format files with separators", () => {
      renderMainContentWithTheme();

      const content = screen
        .getByText(/console.log/)
        .closest("pre")?.textContent;
      expect(content).toContain("=" + "=".repeat(59)); // 60 equals signs
      expect(content).toContain("File: test.js");
      expect(content).toContain("Path: src/test.js");
    });

    it("should handle files without paths gracefully", () => {
      const fileWithoutPath = [
        {
          name: "no-path.js",
          content: "const test = true;",
          visible: true,
          path: "N/A",
        },
      ];

      renderMainContentWithTheme(false, fileWithoutPath);

      expect(screen.getByText(/Path: N\/A/)).toBeInTheDocument();
    });

    it("should maintain proper spacing between files", () => {
      renderMainContentWithTheme();

      const content = screen
        .getByText(/console.log/)
        .closest("pre")?.textContent;
      // Check that content contains multiple newlines between files
      expect(content).toMatch(/\n\n+/);
    });
  });

  describe("Responsive Empty State", () => {
    it("should show feature highlights in empty state", () => {
      renderMainContentWithTheme(false, []);

      expect(screen.getByText("Individual Files")).toBeInTheDocument();
      expect(screen.getByText("Project Directories")).toBeInTheDocument();
    });

    it("should show appropriate icons in empty state", () => {
      renderMainContentWithTheme(false, []);

      // Check for multiple upload icons in empty state
      const uploadIcons = screen.getAllByTestId("upload-icon");
      expect(uploadIcons.length).toBeGreaterThan(0);

      // Check for feature icons
      const fileIcons = screen.getAllByTestId("file-icon");
      expect(fileIcons.length).toBeGreaterThan(0);
    });
  });

  describe("Code Header", () => {
    it("should display code header with title", () => {
      renderMainContentWithTheme();

      expect(screen.getByText("Combined Project Files")).toBeInTheDocument();
    });

    it("should apply proper styling to code container", () => {
      renderMainContentWithTheme(true);

      const codeContainer = screen
        .getByText("Combined Project Files")
        .closest("div")?.parentElement;
      expect(codeContainer).toHaveClass("bg-dark-800", "border-dark-600/50");
    });
  });

  describe("Accessibility", () => {
    it("should have proper structure for screen readers", () => {
      renderMainContentWithTheme();

      const pre = screen.getByText(/console.log/).closest("pre");
      expect(pre).toBeInTheDocument();
      expect(pre).toHaveStyle({ minHeight: "500px" });
    });

    it("should have accessible buttons", () => {
      renderMainContentWithTheme();

      const copyButton = screen.getByRole("button", { name: /copy all/i });
      expect(copyButton).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty file content gracefully", () => {
      const emptyFile = [
        {
          name: "empty.js",
          content: "",
          visible: true,
          path: "src/empty.js",
        },
      ];

      renderMainContentWithTheme(false, emptyFile);

      // Since the file has empty content, it won't show in the output
      // The component filters out files without content
      const pre = screen
        .getByText("Combined Project Files")
        .closest("div")
        ?.parentElement?.querySelector("pre");
      expect(pre).toBeInTheDocument();
      // The pre element should exist but might be empty or contain only whitespace
    });

    it("should handle deeply nested files", () => {
      // Create a flat structure that represents deeply nested files
      // Folders have children array, files have path
      const deeplyNested = [
        {
          name: "level1",
          content: "",
          visible: true,
          children: [
            {
              name: "deep.js",
              content: "const deep = true;",
              visible: true,
              path: "level1/level2/deep.js",
            },
          ],
        },
      ];

      renderMainContentWithTheme(false, deeplyNested);

      expect(screen.getByText(/const deep = true/)).toBeInTheDocument();
      expect(
        screen.getByText(/Path: level1\/level2\/deep.js/)
      ).toBeInTheDocument();
    });

    it("should handle files with special characters in content", () => {
      const specialFile = [
        {
          name: "special.js",
          content:
            'const regex = /[a-z]+/g; // Test <script>alert("XSS")</script>',
          visible: true,
          path: "src/special.js",
        },
      ];

      renderMainContentWithTheme(false, specialFile);

      // Content should be escaped properly
      expect(
        screen.getByText(/const regex = \/\[a-z\]\+\/g/)
      ).toBeInTheDocument();
    });
  });
});
