import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeContext } from "../../context/ThemeContext";
import SmartCodeAnalyzer from "../directory_converter/SmartCodeAnalyzer";

// Mock the necessary dependencies
vi.mock("react-icons/fa", () => ({
  FaBrain: ({ className }: { className?: string }) => (
    <span data-testid="brain-icon" className={className}>
      BrainIcon
    </span>
  ),
  FaSpinner: ({ className }: { className?: string }) => (
    <span data-testid="spinner-icon" className={className}>
      SpinnerIcon
    </span>
  ),
  FaChevronDown: ({ className }: { className?: string }) => (
    <span data-testid="chevron-down-icon" className={className}>
      ChevronDownIcon
    </span>
  ),
  FaChevronRight: ({ className }: { className?: string }) => (
    <span data-testid="chevron-right-icon" className={className}>
      ChevronRightIcon
    </span>
  ),
  FaFileCode: ({ className }: { className?: string }) => (
    <span data-testid="file-code-icon" className={className}>
      FileCodeIcon
    </span>
  ),
  FaExclamationCircle: ({ className }: { className?: string }) => (
    <span data-testid="exclamation-circle-icon" className={className}>
      ExclamationCircleIcon
    </span>
  ),
  FaCheckCircle: ({ className }: { className?: string }) => (
    <span data-testid="check-circle-icon" className={className}>
      CheckCircleIcon
    </span>
  ),
  FaTimes: ({ className }: { className?: string }) => (
    <span data-testid="times-icon" className={className}>
      TimesIcon
    </span>
  ),
  FaSync: ({ className }: { className?: string }) => (
    <span data-testid="sync-icon" className={className}>
      SyncIcon
    </span>
  ),
  FaChartBar: ({ className }: { className?: string }) => (
    <span data-testid="chart-bar-icon" className={className}>
      ChartBarIcon
    </span>
  ),
}));

describe("SmartCodeAnalyzer Component", () => {
  const mockOnToggle = vi.fn();

  // Sample test data
  const sampleFileData = [
    {
      name: "app.js",
      content: 'console.log("Hello World");',
      visible: true,
      path: "src/app.js",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render when visible", () => {
    render(
      <ThemeContext.Provider
        value={{ darkMode: false, toggleDarkMode: vi.fn() }}
      >
        <SmartCodeAnalyzer
          fileData={sampleFileData}
          isVisible={true}
          onToggle={mockOnToggle}
        />
      </ThemeContext.Provider>
    );

    expect(screen.getByText("Code Analysis")).toBeInTheDocument();
  });

  it("should not render when not visible", () => {
    render(
      <ThemeContext.Provider
        value={{ darkMode: false, toggleDarkMode: vi.fn() }}
      >
        <SmartCodeAnalyzer
          fileData={sampleFileData}
          isVisible={false}
          onToggle={mockOnToggle}
        />
      </ThemeContext.Provider>
    );

    expect(screen.queryByText("Code Analysis")).not.toBeInTheDocument();
  });

  it("should call onToggle when close button is clicked", () => {
    render(
      <ThemeContext.Provider
        value={{ darkMode: false, toggleDarkMode: vi.fn() }}
      >
        <SmartCodeAnalyzer
          fileData={sampleFileData}
          isVisible={true}
          onToggle={mockOnToggle}
        />
      </ThemeContext.Provider>
    );

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });
});
