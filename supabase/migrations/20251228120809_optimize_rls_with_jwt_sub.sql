/*
  # Optimize RLS Policies for Performance

  1. Security Improvements
    - Optimize all RLS policies by wrapping auth.jwt() ->> 'sub' in SELECT
    - This prevents re-evaluation of auth functions for each row
    - Improves query performance at scale
  
  2. Tables Affected
    - workspaces
    - workspace_members
    - workspace_invitations
    - All workspace-related data tables
*/

-- Workspaces policies
DROP POLICY IF EXISTS "Users can create workspaces" ON workspaces;
CREATE POLICY "Users can create workspaces"
  ON workspaces FOR INSERT
  TO authenticated
  WITH CHECK (created_by::text = (SELECT auth.jwt() ->> 'sub'));

DROP POLICY IF EXISTS "Users can view workspaces" ON workspaces;
CREATE POLICY "Users can view workspaces"
  ON workspaces FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspaces.id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can update workspaces" ON workspaces;
CREATE POLICY "Users can update workspaces"
  ON workspaces FOR UPDATE
  TO authenticated
  USING (created_by::text = (SELECT auth.jwt() ->> 'sub'))
  WITH CHECK (created_by::text = (SELECT auth.jwt() ->> 'sub'));

DROP POLICY IF EXISTS "Users can delete workspaces" ON workspaces;
CREATE POLICY "Users can delete workspaces"
  ON workspaces FOR DELETE
  TO authenticated
  USING (created_by::text = (SELECT auth.jwt() ->> 'sub'));

-- Workspace members policies
DROP POLICY IF EXISTS "Users can view their workspace memberships" ON workspace_members;
CREATE POLICY "Users can view their workspace memberships"
  ON workspace_members FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.jwt() ->> 'sub'));

DROP POLICY IF EXISTS "Users can remove themselves from workspaces" ON workspace_members;
CREATE POLICY "Users can remove themselves from workspaces"
  ON workspace_members FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.jwt() ->> 'sub'));

DROP POLICY IF EXISTS "Workspace owners can remove members" ON workspace_members;
CREATE POLICY "Workspace owners can remove members"
  ON workspace_members FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = workspace_members.workspace_id
      AND workspaces.created_by::text = (SELECT auth.jwt() ->> 'sub')
    )
  );

-- Workspace invitations policies
DROP POLICY IF EXISTS "Workspace owners can create invitations" ON workspace_invitations;
CREATE POLICY "Workspace owners can create invitations"
  ON workspace_invitations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_invitations.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
      AND workspace_members.role = 'owner'
    )
  );

DROP POLICY IF EXISTS "Workspace owners can view their workspace invitations" ON workspace_invitations;
CREATE POLICY "Workspace owners can view their workspace invitations"
  ON workspace_invitations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_invitations.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
      AND workspace_members.role = 'owner'
    )
  );

DROP POLICY IF EXISTS "Users can mark invitation as used when they accept" ON workspace_invitations;
CREATE POLICY "Users can mark invitation as used when they accept"
  ON workspace_invitations FOR UPDATE
  TO authenticated
  USING (used_at IS NULL AND expires_at > now())
  WITH CHECK (used_by = (SELECT auth.jwt() ->> 'sub'));

-- Dream home preferences policies
DROP POLICY IF EXISTS "Users can view dream home in their workspaces" ON dream_home_preferences;
CREATE POLICY "Users can view dream home in their workspaces"
  ON dream_home_preferences FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = dream_home_preferences.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can insert dream home in their workspaces" ON dream_home_preferences;
CREATE POLICY "Users can insert dream home in their workspaces"
  ON dream_home_preferences FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = dream_home_preferences.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can update dream home in their workspaces" ON dream_home_preferences;
CREATE POLICY "Users can update dream home in their workspaces"
  ON dream_home_preferences FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = dream_home_preferences.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = dream_home_preferences.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

-- Self assessment policies
DROP POLICY IF EXISTS "Users can view assessments in their workspaces" ON self_assessment_responses;
CREATE POLICY "Users can view assessments in their workspaces"
  ON self_assessment_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = self_assessment_responses.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can insert assessments in their workspaces" ON self_assessment_responses;
CREATE POLICY "Users can insert assessments in their workspaces"
  ON self_assessment_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = self_assessment_responses.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can update assessments in their workspaces" ON self_assessment_responses;
CREATE POLICY "Users can update assessments in their workspaces"
  ON self_assessment_responses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = self_assessment_responses.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = self_assessment_responses.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

-- Mortgage checklist policies
DROP POLICY IF EXISTS "Users can view mortgage checklist in their workspaces" ON mortgage_checklist_items;
CREATE POLICY "Users can view mortgage checklist in their workspaces"
  ON mortgage_checklist_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = mortgage_checklist_items.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can insert mortgage checklist in their workspaces" ON mortgage_checklist_items;
CREATE POLICY "Users can insert mortgage checklist in their workspaces"
  ON mortgage_checklist_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = mortgage_checklist_items.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can update mortgage checklist in their workspaces" ON mortgage_checklist_items;
CREATE POLICY "Users can update mortgage checklist in their workspaces"
  ON mortgage_checklist_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = mortgage_checklist_items.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = mortgage_checklist_items.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

-- Moving todo policies
DROP POLICY IF EXISTS "Users can view moving todos in their workspaces" ON moving_todo_items;
CREATE POLICY "Users can view moving todos in their workspaces"
  ON moving_todo_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = moving_todo_items.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can insert moving todos in their workspaces" ON moving_todo_items;
CREATE POLICY "Users can insert moving todos in their workspaces"
  ON moving_todo_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = moving_todo_items.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can update moving todos in their workspaces" ON moving_todo_items;
CREATE POLICY "Users can update moving todos in their workspaces"
  ON moving_todo_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = moving_todo_items.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = moving_todo_items.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

-- Budget planner policies
DROP POLICY IF EXISTS "Users can view budget in their workspaces" ON budget_planner;
CREATE POLICY "Users can view budget in their workspaces"
  ON budget_planner FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = budget_planner.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can insert budget in their workspaces" ON budget_planner;
CREATE POLICY "Users can insert budget in their workspaces"
  ON budget_planner FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = budget_planner.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can update budget in their workspaces" ON budget_planner;
CREATE POLICY "Users can update budget in their workspaces"
  ON budget_planner FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = budget_planner.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = budget_planner.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

-- Down payment tracker policies
DROP POLICY IF EXISTS "Users can view down payment tracker in their workspaces" ON down_payment_tracker;
CREATE POLICY "Users can view down payment tracker in their workspaces"
  ON down_payment_tracker FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = down_payment_tracker.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can insert down payment tracker in their workspaces" ON down_payment_tracker;
CREATE POLICY "Users can insert down payment tracker in their workspaces"
  ON down_payment_tracker FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = down_payment_tracker.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can update down payment tracker in their workspaces" ON down_payment_tracker;
CREATE POLICY "Users can update down payment tracker in their workspaces"
  ON down_payment_tracker FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = down_payment_tracker.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = down_payment_tracker.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

-- Homes policies
DROP POLICY IF EXISTS "Users can view homes in their workspaces" ON homes;
CREATE POLICY "Users can view homes in their workspaces"
  ON homes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = homes.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can insert homes in their workspaces" ON homes;
CREATE POLICY "Users can insert homes in their workspaces"
  ON homes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = homes.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can update homes in their workspaces" ON homes;
CREATE POLICY "Users can update homes in their workspaces"
  ON homes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = homes.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = homes.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can delete homes in their workspaces" ON homes;
CREATE POLICY "Users can delete homes in their workspaces"
  ON homes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = homes.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

-- Home evaluations policies
DROP POLICY IF EXISTS "Users can view evaluations in their workspaces" ON home_evaluations;
CREATE POLICY "Users can view evaluations in their workspaces"
  ON home_evaluations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = home_evaluations.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can insert evaluations in their workspaces" ON home_evaluations;
CREATE POLICY "Users can insert evaluations in their workspaces"
  ON home_evaluations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = home_evaluations.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can update evaluations in their workspaces" ON home_evaluations;
CREATE POLICY "Users can update evaluations in their workspaces"
  ON home_evaluations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = home_evaluations.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = home_evaluations.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

-- Home inspections policies
DROP POLICY IF EXISTS "Users can view inspections in their workspaces" ON home_inspections;
CREATE POLICY "Users can view inspections in their workspaces"
  ON home_inspections FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = home_inspections.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can insert inspections in their workspaces" ON home_inspections;
CREATE POLICY "Users can insert inspections in their workspaces"
  ON home_inspections FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = home_inspections.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can update inspections in their workspaces" ON home_inspections;
CREATE POLICY "Users can update inspections in their workspaces"
  ON home_inspections FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = home_inspections.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = home_inspections.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

-- Guide progress policies
DROP POLICY IF EXISTS "Users can view guide progress in their workspaces" ON guide_progress;
CREATE POLICY "Users can view guide progress in their workspaces"
  ON guide_progress FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = guide_progress.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can insert guide progress in their workspaces" ON guide_progress;
CREATE POLICY "Users can insert guide progress in their workspaces"
  ON guide_progress FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = guide_progress.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can update guide progress in their workspaces" ON guide_progress;
CREATE POLICY "Users can update guide progress in their workspaces"
  ON guide_progress FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = guide_progress.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = guide_progress.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

-- Agent requests policies
DROP POLICY IF EXISTS "Users can view agent requests in their workspaces" ON agent_requests;
CREATE POLICY "Users can view agent requests in their workspaces"
  ON agent_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = agent_requests.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can insert agent requests in their workspaces" ON agent_requests;
CREATE POLICY "Users can insert agent requests in their workspaces"
  ON agent_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = agent_requests.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can update agent requests in their workspaces" ON agent_requests;
CREATE POLICY "Users can update agent requests in their workspaces"
  ON agent_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = agent_requests.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = agent_requests.workspace_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

-- Evaluation photos policies
DROP POLICY IF EXISTS "Users can view evaluation photos in their workspaces" ON evaluation_photos;
CREATE POLICY "Users can view evaluation photos in their workspaces"
  ON evaluation_photos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM home_evaluations
      JOIN workspace_members ON workspace_members.workspace_id = home_evaluations.workspace_id
      WHERE home_evaluations.id = evaluation_photos.evaluation_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can insert evaluation photos in their workspaces" ON evaluation_photos;
CREATE POLICY "Users can insert evaluation photos in their workspaces"
  ON evaluation_photos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM home_evaluations
      JOIN workspace_members ON workspace_members.workspace_id = home_evaluations.workspace_id
      WHERE home_evaluations.id = evaluation_photos.evaluation_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can delete evaluation photos in their workspaces" ON evaluation_photos;
CREATE POLICY "Users can delete evaluation photos in their workspaces"
  ON evaluation_photos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM home_evaluations
      JOIN workspace_members ON workspace_members.workspace_id = home_evaluations.workspace_id
      WHERE home_evaluations.id = evaluation_photos.evaluation_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

-- Evaluation voice notes policies
DROP POLICY IF EXISTS "Users can view evaluation voice notes in their workspaces" ON evaluation_voice_notes;
CREATE POLICY "Users can view evaluation voice notes in their workspaces"
  ON evaluation_voice_notes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM home_evaluations
      JOIN workspace_members ON workspace_members.workspace_id = home_evaluations.workspace_id
      WHERE home_evaluations.id = evaluation_voice_notes.evaluation_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can insert evaluation voice notes in their workspaces" ON evaluation_voice_notes;
CREATE POLICY "Users can insert evaluation voice notes in their workspaces"
  ON evaluation_voice_notes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM home_evaluations
      JOIN workspace_members ON workspace_members.workspace_id = home_evaluations.workspace_id
      WHERE home_evaluations.id = evaluation_voice_notes.evaluation_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "Users can delete evaluation voice notes in their workspaces" ON evaluation_voice_notes;
CREATE POLICY "Users can delete evaluation voice notes in their workspaces"
  ON evaluation_voice_notes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM home_evaluations
      JOIN workspace_members ON workspace_members.workspace_id = home_evaluations.workspace_id
      WHERE home_evaluations.id = evaluation_voice_notes.evaluation_id
      AND workspace_members.user_id = (SELECT auth.jwt() ->> 'sub')
    )
  );