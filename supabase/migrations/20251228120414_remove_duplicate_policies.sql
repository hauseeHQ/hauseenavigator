/*
  # Remove Duplicate RLS Policies

  1. Security Improvements
    - Remove old duplicate RLS policies that check user_id directly
    - Keep only workspace-based policies for consistency
  
  2. Tables Affected
    - agent_requests
    - budget_planner
    - down_payment_tracker
    - evaluation_photos
    - evaluation_voice_notes
    - guide_progress
    - home_evaluations
    - home_inspections
    - homes
    - mortgage_checklist_items
    - moving_todo_items
    - self_assessment_responses
    - dream_home_preferences (has old anonymous policy)
*/

-- Drop old user_id-based policies from agent_requests
DROP POLICY IF EXISTS "Allow all users to insert agent requests" ON agent_requests;
DROP POLICY IF EXISTS "Allow all users to view agent requests" ON agent_requests;
DROP POLICY IF EXISTS "Allow all users to update agent requests" ON agent_requests;

-- Drop old user_id-based policies from budget_planner
DROP POLICY IF EXISTS "Allow all users to insert own budget" ON budget_planner;
DROP POLICY IF EXISTS "Allow all users to view own budget" ON budget_planner;
DROP POLICY IF EXISTS "Allow all users to update own budget" ON budget_planner;

-- Drop old user_id-based policies from down_payment_tracker
DROP POLICY IF EXISTS "Allow all users to insert own down payment tracker" ON down_payment_tracker;
DROP POLICY IF EXISTS "Allow all users to view own down payment tracker" ON down_payment_tracker;
DROP POLICY IF EXISTS "Allow all users to update own down payment tracker" ON down_payment_tracker;

-- Drop old user_id-based policies from evaluation_photos
DROP POLICY IF EXISTS "Allow all users to delete evaluation photos" ON evaluation_photos;
DROP POLICY IF EXISTS "Allow all users to insert evaluation photos" ON evaluation_photos;
DROP POLICY IF EXISTS "Allow all users to view evaluation photos" ON evaluation_photos;

-- Drop old user_id-based policies from evaluation_voice_notes
DROP POLICY IF EXISTS "Allow all users to delete evaluation voice notes" ON evaluation_voice_notes;
DROP POLICY IF EXISTS "Allow all users to insert evaluation voice notes" ON evaluation_voice_notes;
DROP POLICY IF EXISTS "Allow all users to view evaluation voice notes" ON evaluation_voice_notes;

-- Drop old user_id-based policies from guide_progress
DROP POLICY IF EXISTS "Allow all users to insert guide progress" ON guide_progress;
DROP POLICY IF EXISTS "Allow all users to view guide progress" ON guide_progress;
DROP POLICY IF EXISTS "Allow all users to update guide progress" ON guide_progress;

-- Drop old user_id-based policies from home_evaluations
DROP POLICY IF EXISTS "Allow all users to insert evaluations" ON home_evaluations;
DROP POLICY IF EXISTS "Allow all users to view evaluations" ON home_evaluations;
DROP POLICY IF EXISTS "Allow all users to update evaluations" ON home_evaluations;

-- Drop old user_id-based policies from home_inspections
DROP POLICY IF EXISTS "Allow all users to insert inspections" ON home_inspections;
DROP POLICY IF EXISTS "Allow all users to view inspections" ON home_inspections;
DROP POLICY IF EXISTS "Allow all users to update inspections" ON home_inspections;

-- Drop old user_id-based policies from homes
DROP POLICY IF EXISTS "Allow all users to delete homes" ON homes;
DROP POLICY IF EXISTS "Allow all users to insert homes" ON homes;
DROP POLICY IF EXISTS "Allow all users to view homes" ON homes;
DROP POLICY IF EXISTS "Allow all users to update homes" ON homes;

-- Drop old user_id-based policies from mortgage_checklist_items
DROP POLICY IF EXISTS "Allow all users to insert own checklist" ON mortgage_checklist_items;
DROP POLICY IF EXISTS "Allow all users to view own checklist" ON mortgage_checklist_items;
DROP POLICY IF EXISTS "Allow all users to update own checklist" ON mortgage_checklist_items;

-- Drop old user_id-based policies from moving_todo_items
DROP POLICY IF EXISTS "Allow all users to insert own moving list" ON moving_todo_items;
DROP POLICY IF EXISTS "Allow all users to view own moving list" ON moving_todo_items;
DROP POLICY IF EXISTS "Allow all users to update own moving list" ON moving_todo_items;

-- Drop old user_id-based policies from self_assessment_responses
DROP POLICY IF EXISTS "Allow all users to insert own assessment" ON self_assessment_responses;
DROP POLICY IF EXISTS "Allow all users to view own assessment" ON self_assessment_responses;
DROP POLICY IF EXISTS "Allow all users to update own assessment" ON self_assessment_responses;

-- Drop old anonymous access policy from dream_home_preferences
DROP POLICY IF EXISTS "Allow anonymous users to view their own dream home preferences" ON dream_home_preferences;
DROP POLICY IF EXISTS "Allow anonymous users to insert their own dream home preferences" ON dream_home_preferences;
DROP POLICY IF EXISTS "Allow anonymous users to update their own dream home preferences" ON dream_home_preferences;