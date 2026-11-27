export type UserRole = "USER" | "ADMIN";
export type UserStatus = "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED";
export type ContentType = "GUIDE" | "TOOL" | "NEWS" | "SKILL";
export type SkillKind = "SKILL" | "PLUGIN" | "MCP";
export type SkillExecutionVerification = "VERIFIED" | "SOURCE_CHECKED" | "UNVERIFIED";
export type PublishStatus = "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "REJECTED" | "ARCHIVED";
export type VerificationStatus = "VALID" | "NEEDS_REVIEW" | "EXPIRED";
export type SourceType = "OFFICIAL" | "MEDIA" | "COMMUNITY";
export type CategoryGroup = "WORK_DOMAIN" | "AI_USE";
export type DifficultyLevel = "BEGINNER" | "PRACTICAL" | "ADVANCED";
export type PricingModel = "FREE" | "FREEMIUM" | "PAID";
export type ToolKind = "TOOL" | "MODEL";
export type KoreanSupportLevel = "FULL" | "PARTIAL" | "NONE";
export type ReportReason =
  | "PRICING_CHANGED"
  | "BROKEN_LINK"
  | "CONTENT_ERROR"
  | "OUTDATED_OTHER";
export type ReportStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "DISMISSED";
export type VaultItemType = "INTERNAL_CONTENT" | "EXTERNAL_URL";
export type JobType =
  | "RSS_FETCH"
  | "URL_INGEST"
  | "AI_DRAFT"
  | "FRESHNESS_CHECK"
  | "TOKEN_CLEANUP";
export type JobStatus = "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED" | "DEAD_LETTER";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
}

export interface ApiEnvelope<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  statusCode: number;
  errorCode: string;
  message: string;
  details: unknown;
  timestamp: string;
  path: string;
}

export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  role: UserRole;
  status: UserStatus;
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  interestCategorySlugs?: string[];
  createdAt?: string;
}

export interface CategoryItem {
  id: string;
  group: CategoryGroup;
  slug: string;
  name: string;
  sortOrder: number;
}

export interface TagItem {
  id: string;
  slug: string;
  name: string;
}

export interface PromptBlockItem {
  id: string;
  title: string;
  content?: string;
  prompt?: string;
  variables: string[];
  variableExamples?: Record<string, string>;
  expectedOutput?: string;
  tips?: string;
}

export interface GuideBeforeAfterExample {
  id: string;
  title: string;
  beforeInput: string;
  afterOutput: string;
  improvementPoints: string[];
}

export type GuideMistakeCategory =
  | "SECURITY"
  | "HALLUCINATION"
  | "FREE_LIMIT"
  | "WORKFLOW";

export interface GuideCommonMistake {
  id: string;
  category: GuideMistakeCategory;
  title: string;
  mistake: string;
  prevention: string;
}

export interface ContentSummary {
  id: string;
  type: ContentType;
  slug: string;
  title: string;
  summary: string;
  publishStatus: PublishStatus;
  verificationStatus: VerificationStatus;
  verifiedAt?: string | null;
  publishedAt?: string | null;
  sourceType: SourceType;
  sourceUrl: string;
  sourceName?: string | null;
  helpfulCount: number;
  isFeatured?: boolean;
  isBookmarked?: boolean;
  isHelpful?: boolean;
  categories?: CategoryItem[];
  tags?: TagItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GuideDetailData extends ContentSummary {
  type: "GUIDE";
  difficulty: DifficultyLevel;
  estimatedMinutes?: number | null;
  pricingModel: PricingModel;
  markdownBody: string;
  prompts: PromptBlockItem[];
  beforeAfterExamples?: GuideBeforeAfterExample[];
  commonMistakes?: GuideCommonMistake[];
  verificationChecklist?: string[];
  cautions?: string | null;
  toc?: Array<{ id: string; text: string; level: number }>;
  recommendedTools?: ToolDetailData[];
  relatedGuides?: ContentSummary[];
}

export interface ToolPricingPlan {
  name: string;
  price: string;
  target: string;
  highlights: string;
}

export interface ToolGettingStartedStep {
  step: number;
  title: string;
  description: string;
}

export interface ToolExamplePrompt {
  title: string;
  prompt: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ToolDetailData extends ContentSummary {
  type: "TOOL";
  toolKind: ToolKind;
  providerName: string;
  officialUrl: string;
  isAffiliate?: boolean;
  affiliateUrl?: string | null;
  pricingModel: PricingModel;
  hasFreePlan: boolean;
  pricingSummary: string;
  pricingPlans?: ToolPricingPlan[];
  koreanSupport: KoreanSupportLevel;
  platforms: string[];
  strengths: string[];
  limitations: string[];
  useCases?: string[];
  gettingStartedSteps?: ToolGettingStartedStep[];
  examplePrompts?: ToolExamplePrompt[];
  faq?: FaqItem[];
  relatedGuides?: ContentSummary[];
  compatibleSkills?: SkillDetailData[];
}

export interface NewsDetailData extends ContentSummary {
  type: "NEWS";
  keyPoints: string[];
  workImpact: string;
  originalPublishedAt?: string | null;
  relatedContents?: ContentSummary[];
}

export interface SkillBeforeAfter {
  beforeItems: string[];
  afterItems: string[];
}

export interface SkillWorkflowStep {
  step: number;
  title: string;
  description: string;
  badge?: string;
}

export interface SkillPrerequisite {
  name: string;
  required: boolean;
  description: string;
}

export interface SkillInstallGuide {
  environment: string;
  label: string;
  steps: string[];
  command?: string;
  invokeExample?: string;
}

export interface SkillExamplePrompt {
  label: string;
  prompt: string;
}

export interface SkillExpectedOutput {
  order: string;
  title: string;
  description: string;
}

export interface SkillWebAlternative {
  title: string;
  description: string;
  recommendedTools: string[];
  guideSlug?: string;
}

export interface SkillDetailData extends ContentSummary {
  type: "SKILL";
  skillKind: SkillKind;
  skillSlug: string;
  authorName: string;
  license?: string | null;
  repositoryUrl: string;
  sourceFileUrl?: string | null;
  executionVerification: SkillExecutionVerification;
  difficulty: DifficultyLevel;
  pricingModel: PricingModel;
  compatibleAgents: string[];
  overview: string;
  useCases: string[];
  beforeAfter: SkillBeforeAfter;
  workflowSteps: SkillWorkflowStep[];
  prerequisites: SkillPrerequisite[];
  installPrompt?: string | null;
  installGuides: SkillInstallGuide[];
  examplePrompts: SkillExamplePrompt[];
  expectedOutputs: SkillExpectedOutput[];
  postRunChecklist: string[];
  tips: string[];
  cautions?: string | null;
  faq: FaqItem[];
  fileStructure: string[];
  skillMdPreview?: string | null;
  webAlternative?: SkillWebAlternative | null;
  toc?: Array<{ id: string; text: string; level: number }>;
  compatibleTools?: ToolDetailData[];
  relatedSkills?: ContentSummary[];
}
