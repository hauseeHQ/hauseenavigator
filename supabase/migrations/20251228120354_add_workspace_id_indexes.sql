/*
  # Add Workspace Foreign Key Indexes

  1. Performance Improvements
    - Add indexes on workspace_id foreign keys for optimal query performance
    - Covers all tables that reference workspaces table
  
  2. Tables Affected
    - budget_planner
    - down_payment_tracker
    - dream_home_preferences
    - guide_progress
    - home_evaluations
    - home_inspections
    - mortgage_checklist_items
    - moving_todo_items
    - self_assessment_responses
*/

-- Add workspace_id indexes for all tables
CREATE INDEX IF NOT EXISTS idx_budget_planner_workspace_id 
  ON budget_planner(workspace_id);

CREATE INDEX IF NOT EXISTS idx_down_payment_tracker_workspace_id 
  ON down_payment_tracker(workspace_id);

CREATE INDEX IF NOT EXISTS idx_dream_home_preferences_workspace_id 
  ON dream_home_preferences(workspace_id);

CREATE INDEX IF NOT EXISTS idx_guide_progress_workspace_id 
  ON guide_progress(workspace_id);

CREATE INDEX IF NOT EXISTS idx_home_evaluations_workspace_id 
  ON home_evaluations(workspace_id);

CREATE INDEX IF NOT EXISTS idx_home_inspections_workspace_id 
  ON home_inspections(workspace_id);

CREATE INDEX IF NOT EXISTS idx_mortgage_checklist_workspace_id 
  ON mortgage_checklist_items(workspace_id);

CREATE INDEX IF NOT EXISTS idx_moving_todo_workspace_id 
  ON moving_todo_items(workspace_id);

CREATE INDEX IF NOT EXISTS idx_self_assessment_workspace_id 
  ON self_assessment_responses(workspace_id);