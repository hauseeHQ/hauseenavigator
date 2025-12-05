import { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export type TabId = 'plan' | 'evaluate' | 'select' | 'guide' | 'ai';

export type HomeStage = 'dreaming' | 'getting_ready' | 'actively_looking';

export interface UserMetadata {
  fullName: string;
  phoneNumber?: string;
  homeStage: HomeStage;
}

export interface SignUpFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  homeStage: HomeStage | '';
  acceptedTerms: boolean;
}

export interface FormErrors {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  homeStage?: string;
  acceptedTerms?: string;
}

export type ModuleType =
  | 'my-dream-home'
  | 'financial-readiness'
  | 'self-assessment'
  | 'budget-planner'
  | 'down-payment-tracker'
  | 'mortgage-checklist'
  | 'moving-todo-list';

export interface PlanModule {
  id: ModuleType;
  title: string;
  description: string;
  isImplemented: boolean;
}

export interface DreamHome {
  constructionStatus: 'new' | 'ready' | null;
  priceRange: {
    min: number;
    max: number;
  };
  preferredCities: string[];
  bedrooms: string | null;
  bathrooms: string | null;
  maxCondoFees: number | null;
  backyard: 'small' | 'large' | 'indifferent' | null;
  timeline: string | null;
  notes: string;
  updatedAt: string;
}

export interface DreamHomeFormErrors {
  constructionStatus?: string;
  priceRange?: string;
  preferredCities?: string;
  timeline?: string;
}

export const ONTARIO_CITIES = [
  'Toronto',
  'Ottawa',
  'Mississauga',
  'Brampton',
  'Hamilton',
  'London',
  'Markham',
  'Vaughan',
  'Kitchener',
  'Windsor',
  'Richmond Hill',
  'Oakville',
  'Burlington',
  'Greater Sudbury',
  'Oshawa',
  'Barrie',
  'St. Catharines',
  'Cambridge',
  'Kingston',
  'Guelph',
] as const;

export type AssessmentStatus = 'needs_preparation' | 'on_track' | 'ready' | 'incomplete';

export type AssessmentCategory = 'financial' | 'knowledge' | 'emotional';

export interface CategoryScore {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface SelfAssessment {
  answers: number[];
  completedAt: string | null;
  score: number | null;
  status: AssessmentStatus;
  categoryScores: CategoryScore[];
  updatedAt: string;
}

export interface AssessmentQuestion {
  id: number;
  category: AssessmentCategory;
  text: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  helperText?: string;
}

export interface ChecklistSubsection {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistSection {
  id: string;
  title: string;
  icon: string;
  subsections?: ChecklistSubsection[];
  items?: ChecklistItem[];
}

export interface ChecklistItemState {
  checked: boolean;
  completedAt: string | null;
}

export interface ChecklistProgress {
  completed: number;
  total: number;
  percentage: number;
}

export interface MortgageChecklist {
  items: Record<string, ChecklistItemState>;
  progress: ChecklistProgress;
  updatedAt: string;
}

export interface MovingTodoItemState {
  checked: boolean;
  completedAt: string | null;
  completedBy?: string;
}

export interface MovingTodoList {
  items: Record<string, MovingTodoItemState>;
  progress: ChecklistProgress;
  updatedAt: string;
}

export interface MovingTask {
  id: string;
  title: string;
  description: string;
  timeline: string;
  category: 'planning' | 'logistics' | 'utilities' | 'final-prep';
}

export interface BudgetLineItem {
  current: number;
  expected: number;
}

export interface BudgetIncome {
  netIncome: BudgetLineItem;
  partnerNetIncome: BudgetLineItem;
  otherIncome: BudgetLineItem;
}

export interface BudgetDebt {
  creditCards: BudgetLineItem;
  linesOfCredit: BudgetLineItem;
  studentLoans: BudgetLineItem;
  personalLoan: BudgetLineItem;
  autoLoanLease: BudgetLineItem;
  otherLoans: BudgetLineItem;
}

export interface BudgetTransportation {
  autoInsurance: BudgetLineItem;
  repairsMaintenance: BudgetLineItem;
  fuel: BudgetLineItem;
  parking: BudgetLineItem;
  publicTransit: BudgetLineItem;
}

export interface BudgetHousing {
  rentMortgage: BudgetLineItem;
  propertyTaxes: BudgetLineItem;
  insurance: BudgetLineItem;
  condoPoaFees: BudgetLineItem;
  maintenance: BudgetLineItem;
  groceries: BudgetLineItem;
  laundry: BudgetLineItem;
}

export interface BudgetHealth {
  medication: BudgetLineItem;
  glassesContacts: BudgetLineItem;
  dental: BudgetLineItem;
  therapist: BudgetLineItem;
  specialNeedsItems: BudgetLineItem;
}

export interface BudgetCategory {
  income: BudgetIncome;
  debt: BudgetDebt;
  transportation: BudgetTransportation;
  housing: BudgetHousing;
  health: BudgetHealth;
}

export interface CategoryTotals {
  current: number;
  expected: number;
}

export interface BudgetCalculations {
  currentMonthlySavings: number;
  expectedMonthlySavings: number;
  delta: number;
  categoryTotals: {
    income: CategoryTotals;
    debt: CategoryTotals;
    transportation: CategoryTotals;
    housing: CategoryTotals;
    health: CategoryTotals;
  };
}

export interface BudgetPlannerData {
  budget: BudgetCategory;
  calculations: BudgetCalculations;
  updatedAt: string;
}

export interface DownPaymentGoal {
  targetPrice: number;
  downPaymentPercentage: number;
  targetDownPayment: number;
  minimumDownPayment: number;
  targetDate: string;
  monthsRemaining: number;
}

export interface SavingsAccount {
  id: string;
  name: string;
  type: 'fhsa' | 'rrsp-hbp' | 'tfsa' | 'savings' | 'investments' | 'custom';
  currentBalance: number;
  allocationPercentage: number;
  monthlyContribution: number;
  yearlyLimit?: number;
  withdrawalLimit?: number;
  notes?: string;
}

export interface Contribution {
  id: string;
  accountId: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface DownPaymentCalculations {
  totalSaved: number;
  progressPercentage: number;
  remainingAmount: number;
  monthlyTargetSavings: number;
  onTrack: boolean;
  estimatedCompletionDate: string;
}

export interface DownPaymentTrackerData {
  goal: DownPaymentGoal;
  accounts: SavingsAccount[];
  contributions: Contribution[];
  calculations: DownPaymentCalculations;
  milestones: {
    reached25: boolean;
    reached50: boolean;
    reached75: boolean;
    reached100: boolean;
  };
  updatedAt: string;
}

export interface Home {
  id: string;
  userId: string;
  workspaceId: string;
  address: string;
  neighborhood: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt?: number;
  propertyTaxes?: number;
  squareFootage?: number;
  favorite: boolean;
  compareSelected: boolean;
  evaluationStatus: 'not_started' | 'in_progress' | 'completed';
  offerIntent?: 'yes' | 'maybe' | 'no';
  overallRating: number;
  primaryPhoto?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddHomeFormData {
  address: string;
  neighborhood: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt?: number;
  propertyTaxes?: number;
  squareFootage?: number;
}

export type EvaluateTabType = 'browse' | 'compare' | 'inspection';

export type InspectionRating = 'good' | 'fix' | 'replace' | null;

export interface InspectionItem {
  id: string;
  categoryId: string;
  itemNumber: number;
  description: string;
  evaluation: InspectionRating;
  notes: string;
  evaluatedAt?: string;
}

export interface InspectionCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: InspectionItem[];
  photos: string[];
  sectionNotes: string;
  completedCount: number;
  goodCount: number;
  fixCount: number;
  replaceCount: number;
}

export interface HomeInspection {
  id: string;
  homeId: string;
  userId: string;
  categories: Record<string, InspectionCategory>;
  overallProgress: {
    completed: number;
    total: number;
    percentage: number;
    goodCount: number;
    fixCount: number;
    replaceCount: number;
  };
  createdAt: string;
  updatedAt: string;
}

export type InspectionFilterType = 'all' | 'good' | 'fix' | 'replace' | 'not_rated';

export interface AboutYouData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  hasReferral: boolean;
  referralCode?: string;
}

export interface BuyerQuestionsData {
  preferredCities: string[];
  priceRange: {
    min: number;
    max: number;
  };
  propertyTypes: string[];
  timeline: string;
  preApprovalStatus: 'yes' | 'no' | 'in_progress' | '';
  hasCurrentAgent: boolean;
  additionalComments?: string;
}

export interface SellerQuestionsData {
  propertyType: string;
  propertyLocation: string;
  estimatedValue: number;
  sellingTimeline: string;
  sellingReason: string;
  propertyCondition: string;
  propertyNotes?: string;
}

export interface ConsentData {
  contactConsent: boolean;
  sharingConsent: boolean;
}

export interface SelectFormData {
  aboutYou: AboutYouData;
  propertyIntent: 'buying' | 'selling' | '';
  buyerQuestions?: BuyerQuestionsData;
  sellerQuestions?: SellerQuestionsData;
  consent: ConsentData;
  currentStep: number;
  status: 'draft' | 'submitted';
  submittedAt?: string;
}

export interface AgentRequest {
  id: string;
  userId: string;
  workspaceId: string;
  formData: SelectFormData;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  number: number;
  title: string;
  description: string;
  videoUrl?: string;
  duration?: string;
}

export interface Module {
  id: string;
  number: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface GuideProgress {
  id: string;
  userId: string;
  lessonId: string;
  moduleId: string;
  completed: boolean;
  notes: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  homeStage: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  agentMatches: boolean;
  coBuyerActivity: boolean;
  progressMilestones: boolean;
  weeklyTips: boolean;
  productUpdates: boolean;
}

export interface DisplayPreferences {
  currencyFormat: 'CAD' | 'USD';
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  numberFormat: 'comma' | 'space' | 'period';
  showTutorialHints: boolean;
  showAutoSaveReminders: boolean;
}

export interface UserPreferences {
  id: string;
  userId: string;
  notifications: NotificationPreferences;
  display: DisplayPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface CoBuyerInvitation {
  id: string;
  workspaceId: string;
  inviterUserId: string;
  inviteeEmail: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoBuyer {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'primary' | 'co_buyer';
  joinedAt: string;
  lastActiveAt?: string;
}

export type RatingValue = 'good' | 'fair' | 'poor';

export interface EvaluationItem {
  id: string;
  label: string;
  type: 'rating' | 'currency' | 'textarea' | 'dropdown';
  options?: string[];
  helperText?: string;
}

export interface EvaluationCategory {
  id: string;
  title: string;
  icon: string;
  items: EvaluationItem[];
}

export interface HomeEvaluation {
  id: string;
  homeId: string;
  userId: string;

  ratings: {
    [categoryId: string]: {
      [itemId: string]: RatingValue | number | string;
    };
  };

  itemNotes: {
    [itemId: string]: string;
  };

  sectionNotes: {
    [sectionId: string]: string;
  };

  overallRating: number;
  completionPercentage: number;
  evaluationStatus: 'not_started' | 'in_progress' | 'completed';

  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EvaluationPhoto {
  id: string;
  evaluationId: string;
  sectionId: string;
  storagePath: string;
  thumbnailPath: string;
  caption?: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface EvaluationVoiceNote {
  id: string;
  evaluationId: string;
  sectionId: string;
  storagePath: string;
  duration: number;
  fileSize: number;
  transcript?: string;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'owner' | 'member';
  joinedAt: string;
  createdAt: string;
}

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  invitationToken: string;
  createdBy: string;
  expiresAt: string;
  usedAt?: string;
  usedBy?: string;
  createdAt: string;
}
